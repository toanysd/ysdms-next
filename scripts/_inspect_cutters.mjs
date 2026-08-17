import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectCutterData() {
  // Fetch sample cutter equipment
  const { data: cutters } = await supabase
    .from('equipment')
    .select('*')
    .in('equipment_type', ['CUTTER', 'CUTTER_INLINE', 'CUTTER_SEPARATE'])
    .limit(5)

  console.log('--- Sample Cutters from equipment table ---')
  console.log(JSON.stringify(cutters, null, 2))

  // Fetch linked design_revisions & related molds via equipment_assignments or design_revision_id
  if (cutters && cutters.length > 0) {
    const c = cutters[0]
    console.log('\nTesting equipment_assignments for cutter:', c.equipment_id)
    const { data: assign } = await supabase
      .from('equipment_assignments')
      .select('*, parent:equipment!equipment_assignments_parent_equipment_id_fkey(equipment_id, equipment_code, display_name, equipment_type), child:equipment!equipment_assignments_child_equipment_id_fkey(equipment_id, equipment_code, display_name, equipment_type)')
      .or(`parent_equipment_id.eq.${c.equipment_id},child_equipment_id.eq.${c.equipment_id}`)
    
    console.log('Assignments:', JSON.stringify(assign, null, 2))
  }
}

inspectCutterData().catch(console.error)
