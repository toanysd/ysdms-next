import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

function normalizeCode(code) {
  if (!code) return ''
  return String(code).replace(/[\s\-_]/g, '').toUpperCase()
}

async function fixKsp218AndAllRevisions() {
  console.log('=== 1. Fix KSP-218 R2 specifically ===')
  const { data: r2Rev } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code')
    .eq('design_code', 'KSP218R2')
    .single()

  if (r2Rev) {
    const { data: updateRes, error: e1 } = await supabase
      .from('equipment')
      .update({ design_revision_id: r2Rev.revision_id })
      .eq('equipment_id', 'e731c010-876e-4860-b4ae-3ae15f2fc300')

    console.log('Updated KSP-218 R2 mold to point to R2 revision ID:', r2Rev.revision_id, 'Error:', e1)
  }

  console.log('\n=== 2. Scan DB for unlinked equipment that match design_revisions by normalized code ===')
  const { data: unlinkedEquip } = await supabase
    .from('equipment')
    .select('equipment_id, equipment_code, display_name')
    .is('design_revision_id', null)

  console.log(`Found ${unlinkedEquip?.length || 0} unlinked equipment records.`)

  const { data: allRevs } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code')

  const revMap = new Map()
  allRevs?.forEach(r => {
    const norm = normalizeCode(r.design_code)
    if (norm) revMap.set(norm, r.revision_id)
  })

  let fixedCount = 0
  for (const eq of unlinkedEquip || []) {
    const normCode = normalizeCode(eq.equipment_code)
    const normName = normalizeCode(eq.display_name)
    const matchRevId = revMap.get(normCode) || revMap.get(normName)

    if (matchRevId) {
      await supabase
        .from('equipment')
        .update({ design_revision_id: matchRevId })
        .eq('equipment_id', eq.equipment_id)
      fixedCount++
    }
  }

  console.log(`Successfully fixed and linked ${fixedCount} unlinked equipment records!`)
}

fixKsp218AndAllRevisions()
