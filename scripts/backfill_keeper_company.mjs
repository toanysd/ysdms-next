import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf8')
let url, key
env.split('\n').forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim()
  if (l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = l.split('=')[1].trim()
})
const supabase = createClient(url, key)

async function backfillKeeperCompany() {
  console.log('🚀 Starting KeeperCompany backfill from molds.csv & cutters.csv...')

  // 1. Load companies map by legacy_id (COMP-1, COMP-2...)
  const { data: companies } = await supabase.from('companies').select('company_id, company_code, legacy_id')
  const compMap = new Map()
  companies?.forEach(c => {
    if (c.legacy_id) compMap.set(c.legacy_id, c.company_id)
    if (c.company_code) compMap.set(c.company_code, c.company_id)
  })

  const ysdId = compMap.get('COMP-2') || compMap.get('YSD')
  console.log('YSD Company ID:', ysdId)
  console.log('Total companies mapped:', compMap.size)

  // 2. Read molds.csv
  const dir = path.resolve('source_data', 'csv-access-data')
  const moldsCsv = parse(fs.readFileSync(path.join(dir, 'molds.csv'), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

  // Map molds by legacy_id (MOLD-1, MOLD-2...) or system_code
  const { data: physicalMolds } = await supabase.from('physical_molds').select('physical_mold_id, system_code, legacy_id')
  const moldMapByLegacy = new Map()
  const moldMapByCode = new Map()
  physicalMolds?.forEach(m => {
    if (m.legacy_id) moldMapByLegacy.set(m.legacy_id, m.physical_mold_id)
    if (m.system_code) moldMapByCode.set(m.system_code, m.physical_mold_id)
  })

  let batchUpdates: Array<{ physical_mold_id: string; keeper_company_id: string }> = []

  for (const r of moldsCsv) {
    const rawKeeper = r.KeeperCompany?.trim()
    let keeperId = null
    if (rawKeeper && compMap.has('COMP-' + rawKeeper)) {
      keeperId = compMap.get('COMP-' + rawKeeper)
    } else {
      keeperId = ysdId // default to YSD
    }

    const moldId = r.MoldID ? moldMapByLegacy.get('MOLD-' + r.MoldID) || moldMapByCode.get(r.MoldCode?.trim()) : null
    if (moldId && keeperId) {
      batchUpdates.push({ physical_mold_id: moldId, keeper_company_id: keeperId })
    }
  }

  console.log('Prepared batch updates for physical_molds:', batchUpdates.length)

  // Execute updates in chunks of 500
  for (let i = 0; i < batchUpdates.length; i += 500) {
    const chunk = batchUpdates.slice(i, i + 500)
    for (const item of chunk) {
      await supabase.from('physical_molds').update({ keeper_company_id: item.keeper_company_id }).eq('physical_mold_id', item.physical_mold_id)
    }
    console.log('Updated physical_molds batch:', i + chunk.length)
  }

  // Also update cutters to default to YSD if null
  const { data: cuttersToUpdate } = await supabase.from('cutters').select('cutter_id').is('keeper_company_id', null)
  if (cuttersToUpdate && cuttersToUpdate.length > 0) {
    console.log('Updating null cutters keeper_company_id to YSD:', cuttersToUpdate.length)
    for (let i = 0; i < cuttersToUpdate.length; i += 500) {
      const chunk = cuttersToUpdate.slice(i, i + 500)
      const ids = chunk.map(c => c.cutter_id)
      await supabase.from('cutters').update({ keeper_company_id: ysdId }).in('cutter_id', ids)
    }
  }

  // Also update equipment to default to YSD if null
  const { data: equipToUpdate } = await supabase.from('equipment').select('equipment_id').is('keeper_company_id', null)
  if (equipToUpdate && equipToUpdate.length > 0) {
    console.log('Updating null equipment keeper_company_id to YSD:', equipToUpdate.length)
    for (let i = 0; i < equipToUpdate.length; i += 500) {
      const chunk = equipToUpdate.slice(i, i + 500)
      const ids = chunk.map(e => e.equipment_id)
      await supabase.from('equipment').update({ keeper_company_id: ysdId }).in('equipment_id', ids)
    }
  }

  console.log('✅ Backfill KeeperCompany completed successfully!')
}

backfillKeeperCompany()
