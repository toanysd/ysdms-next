import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

function extractBaseMassCode(code) {
  if (!code) return ''
  const trimmed = code.trim().toUpperCase().replace(/[\s\-_]/g, '')
  let base = trimmed.replace(/(?<=\d)D(?=R\d+)/, '')
  base = base.replace(/(?<=R\d+)D$/, '')
  base = base.replace(/(?<=\d)D$/, '')
  return base
}

async function fixAllDatabaseLinkages() {
  console.log('=== 1. Fixing prototype parent_design_id linkages ===')
  const { data: revs } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code, design_category, parent_design_id, product_id')

  const revsByProduct = {}
  revs.forEach(r => {
    if (!revsByProduct[r.product_id]) revsByProduct[r.product_id] = []
    revsByProduct[r.product_id].push(r)
  })

  let fixedProtos = 0
  for (const prodId of Object.keys(revsByProduct)) {
    const list = revsByProduct[prodId]
    const protos = list.filter(r => r.design_category === 'PROTOTYPE_POCKET' || /D/i.test((r.design_code || '').replace(/^[A-Z]+\d+/, '')))
    const masses = list.filter(r => !(r.design_category === 'PROTOTYPE_POCKET' || /D/i.test((r.design_code || '').replace(/^[A-Z]+\d+/, ''))))

    for (const p of protos) {
      const pBase = extractBaseMassCode(p.design_code)
      const matchedMass = masses.find(m => extractBaseMassCode(m.design_code) === pBase)
      if (matchedMass && p.parent_design_id !== matchedMass.revision_id) {
        const { error } = await supabase
          .from('design_revisions')
          .update({ parent_design_id: matchedMass.revision_id })
          .eq('revision_id', p.revision_id)
        if (!error) {
          fixedProtos++
          console.log(`Updated proto ${p.design_code} -> parent mass ${matchedMass.design_code}`)
        } else {
          console.error(`Error updating proto ${p.design_code}:`, error)
        }
      }
    }
  }
  console.log(`Successfully fixed ${fixedProtos} prototype parent linkages in DB!`)

  console.log('\n=== 2. Fixing unlinked equipment design_revision_id ===')
  const { data: equips } = await supabase
    .from('equipment')
    .select('equipment_id, equipment_code, display_name, design_revision_id')
    .is('design_revision_id', null)

  let fixedEquips = 0
  for (const eq of equips) {
    const eqCode = (eq.equipment_code || eq.display_name || '').replace(/[\s\-_]/g, '').toUpperCase()
    if (!eqCode) continue
    const matchedRev = revs.find(r => {
      const rCode = (r.design_code || '').replace(/[\s\-_]/g, '').toUpperCase()
      return rCode && (eqCode.includes(rCode) || rCode.includes(eqCode))
    })
    if (matchedRev) {
      const { error } = await supabase
        .from('equipment')
        .update({ design_revision_id: matchedRev.revision_id })
        .eq('equipment_id', eq.equipment_id)
      if (!error) {
        fixedEquips++
      }
    }
  }
  console.log(`Successfully fixed ${fixedEquips} unlinked equipment records in DB!`)
}

fixAllDatabaseLinkages()
