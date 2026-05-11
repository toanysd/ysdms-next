import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function preflight() {
    console.log('═══════════════════════════════════════════')
    console.log('  PREFLIGHT CHECK — Migration 051')
    console.log('═══════════════════════════════════════════')

    // 1. Check racks table
    const { data: racksData, error: racksErr } = await supabase.from('racks').select('*').limit(1)
    if (racksErr) {
        console.log('❌ racks: TABLE NOT FOUND — ', racksErr.message)
    } else {
        const { count: racksCount } = await supabase.from('racks').select('*', { count: 'exact', head: true })
        console.log(`✅ racks: EXISTS (${racksCount} rows)`)
        if (racksData && racksData.length > 0) {
            console.log('   Columns:', Object.keys(racksData[0]).join(', '))
        }
    }

    // 2. Check customers table
    const { data: custData, error: custErr } = await supabase.from('customers').select('*').limit(1)
    if (custErr) {
        console.log('❌ customers: TABLE NOT FOUND — ', custErr.message)
    } else {
        const { count: custCount } = await supabase.from('customers').select('*', { count: 'exact', head: true })
        console.log(`✅ customers: EXISTS (${custCount} rows)`)
        if (custData && custData.length > 0) {
            console.log('   Columns:', Object.keys(custData[0]).join(', '))
        }
    }

    // 3. Check rack_layers columns (to confirm missing rack_id)
    const { data: rlData } = await supabase.from('rack_layers').select('*').limit(1)
    if (rlData && rlData.length > 0) {
        const cols = Object.keys(rlData[0])
        console.log(`✅ rack_layers: Columns = [${cols.join(', ')}]`)
        console.log(`   Has rack_id? ${cols.includes('rack_id') ? '✅ YES' : '❌ NO — NEEDS PATCH'}`)
    }

    // 4. Verify 7 new tables DON'T exist yet
    const newTables = ['employees', 'destinations', 'mold_status_logs', 'mold_teflon_logs', 'mold_location_logs', 'mold_ship_logs', 'mold_comments']
    for (const t of newTables) {
        const { error } = await supabase.from(t).select('*', { count: 'exact', head: true })
        if (error) {
            console.log(`✅ ${t}: Does NOT exist (safe to create)`)
        } else {
            console.log(`⚠️ ${t}: ALREADY EXISTS — potential conflict!`)
        }
    }

    // 5. Check mold_physical for columns we want to ADD
    const { data: mpData } = await supabase.from('mold_physical').select('*').limit(1)
    if (mpData && mpData.length > 0) {
        const cols = Object.keys(mpData[0])
        const needed = ['serial_no', 'material', 'weight_kg', 'maker_company_id', 'customer_id', 'teflon_count', 'last_teflon_date', 'checkin_status', 'notes']
        console.log('\n--- mold_physical column gap ---')
        for (const c of needed) {
            console.log(`   ${c}: ${cols.includes(c) ? '✅ Already exists' : '❌ NEEDS ADD'}`)
        }
    }

    // 6. Check mold_design_revision for drawing_no
    const { data: mdrData } = await supabase.from('mold_design_revision').select('*').limit(1)
    if (mdrData && mdrData.length > 0) {
        const cols = Object.keys(mdrData[0])
        console.log(`\n--- mold_design_revision gap ---`)
        console.log(`   drawing_no: ${cols.includes('drawing_no') ? '✅ Already exists' : '❌ NEEDS ADD'}`)
    }

    console.log('\n═══════════════════════════════════════════')
    console.log('  PREFLIGHT COMPLETE')
    console.log('═══════════════════════════════════════════')
}

preflight()
