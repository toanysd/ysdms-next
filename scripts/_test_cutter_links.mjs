import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function testCutterLinks() {
  // Find a cutter with design_revision_id
  const { data: cutters } = await supabase
    .from('equipment')
    .select('equipment_id, equipment_code, display_name, design_revision_id')
    .in('equipment_type', ['CUTTER', 'CUTTER_INLINE', 'CUTTER_SEPARATE'])
    .not('design_revision_id', 'is', null)
    .limit(5)

  console.log('Cutters with design_revision_id:', cutters)

  if (cutters && cutters.length > 0) {
    const c = cutters[0]
    // 1. Find molds with SAME design_revision_id
    const { data: siblingMolds } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code, display_name, equipment_type')
      .eq('design_revision_id', c.design_revision_id)
      .neq('equipment_id', c.equipment_id)

    console.log(`\nMolds sharing design_revision_id (${c.design_revision_id}) with cutter ${c.equipment_code}:`)
    console.log(siblingMolds)

    // 2. Find equipment_assignments
    const { data: assign } = await supabase
      .from('equipment_assignments')
      .select('*')
    console.log('\nTotal equipment_assignments count in DB:', assign?.length || 0)
  }
}

testCutterLinks().catch(console.error)
