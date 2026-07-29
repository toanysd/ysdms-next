import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load environment variables from .env.local
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '').replace(/\r$/, '')
  }
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function seed() {
    console.log('═══════════════════════════════════════════')
    console.log('  SEEDING REAL DATA V3 — Phase 5A')
    console.log('═══════════════════════════════════════════\n')

    // 1. Seed Employees
    console.log('--- Seeding Employees (23 real users) ---')
    const employees = [
        { employee_code: 'M01', employee_name: '吉田 義裕', employee_name_short: '吉田', department: 'M', is_active: true },
        { employee_code: 'M02', employee_name: '小比類巻 充', employee_name_short: '小比類巻', department: 'M', is_active: true },
        { employee_code: 'M03', employee_name: '谷口 幸靖', employee_name_short: '谷口', department: 'M', is_active: true },
        { employee_code: 'M04', employee_name: '小林 一弘', employee_name_short: '小林', department: 'M', is_active: true },
        { employee_code: 'M05', employee_name: 'レ フウウ クアン', employee_name_short: 'クアン', department: 'M', is_active: true },
        { employee_code: 'M06', employee_name: '工藤 裕介', employee_name_short: '工藤', department: 'M', is_active: true },
        { employee_code: 'M07', employee_name: '山平 敬一', employee_name_short: '山平', department: 'M', is_active: true },
        { employee_code: 'M08', employee_name: 'グエン ヴァン ハイ', employee_name_short: 'ハイ', department: 'M', is_active: true },
        { employee_code: 'M09', employee_name: 'グエン ダン トアン', employee_name_short: 'トアン', department: 'M', is_active: true },
        { employee_code: 'M10', employee_name: 'ファン コム ヴィエット', employee_name_short: 'ヴィエット', department: 'M', is_active: true },
        { employee_code: 'M11', employee_name: '斎藤 正敏', employee_name_short: '斎藤', department: 'M', is_active: true },
        { employee_code: 'M12', employee_name: 'ホアン マイン タイン', employee_name_short: 'タイン', department: 'M', is_active: true },
        { employee_code: 'M13', employee_name: '内山 海聡', employee_name_short: '内山', department: 'M', is_active: true },
        { employee_code: 'M14', employee_name: '安藤 洋太', employee_name_short: '安藤', department: 'M', is_active: true },
        { employee_code: 'L01', employee_name: '川上 志保子', employee_name_short: '川上', department: 'L', is_active: true },
        { employee_code: 'L02', employee_name: '山口 トシ子', employee_name_short: '山口', department: 'L', is_active: true },
        { employee_code: 'L03', employee_name: '桜井 麻子', employee_name_short: '桜井', department: 'L', is_active: true },
        { employee_code: 'L04', employee_name: '新井 奈美', employee_name_short: '新井', department: 'L', is_active: true },
        { employee_code: 'L05', employee_name: 'ハ ティ フエン', employee_name_short: 'フエン', department: 'L', is_active: true },
        { employee_code: 'L06', employee_name: 'レ ティ ハオ', employee_name_short: 'ハオ', department: 'L', is_active: true },
        { employee_code: 'L07', employee_name: 'ダオ ティ ジェン', employee_name_short: 'ジェン', department: 'L', is_active: true },
        { employee_code: 'L08', employee_name: '橋 真弓', employee_name_short: '橋', department: 'L', is_active: true },
        { employee_code: 'L09', employee_name: '中村 邦喜', employee_name_short: '中村', department: 'L', is_active: true },
    ]

    const { data: empResult, error: empErr } = await supabase
        .from('employees')
        .upsert(employees, { onConflict: 'employee_code' })
        .select('employee_id, employee_code, employee_name')

    if (empErr) {
        console.error('❌ employees seed failed:', empErr.message)
    } else {
        console.log(`✅ employees: ${empResult.length} rows inserted/updated`)
    }

    // 2. Seed Destinations
    console.log('\n--- Seeding Destinations (from CSV) ---')
    const destCsv = fs.readFileSync('source_data/csv-access-data/destinations.csv', 'utf8')
    // Remove BOM character from start of string to parse headers correctly
    const cleanDestCsv = destCsv.replace(/^\uFEFF/, '')
    const destLines = cleanDestCsv.split('\n').filter(l => l.trim() && !l.startsWith('DestinationID'))
    const destinations = []

    function generateUuidFromId(idStr) {
        const num = parseInt(idStr, 10)
        if (isNaN(num)) return null
        const hex = num.toString(16).padStart(12, '0')
        return `00000000-0000-0000-0000-${hex}`
    }
    
    for (const line of destLines) {
        const parts = line.split(',')
        if (parts.length >= 2) {
            const destId = parts[0].trim()
            const destName = parts[1].trim()
            const destType = parts[2] ? parts[2].trim() : null
            const uuid = generateUuidFromId(destId)
            if (uuid && destName) {
                destinations.push({
                    destination_id: uuid,
                    destination_name: destName,
                    destination_type: destType || null,
                    is_active: parts[3] !== 'FALSE'
                })
            }
        }
    }

    const { data: destResult, error: destErr } = await supabase
        .from('destinations')
        .upsert(destinations, { onConflict: 'destination_name', ignoreDuplicates: true })
        .select('destination_id, destination_name')

    if (destErr) {
        console.error('❌ destinations seed failed:', destErr.message)
    } else {
        console.log(`✅ destinations: ${destResult.length} rows inserted/updated`)
    }

    // 3. Seed Racks
    console.log('\n--- Seeding Racks (from CSV) ---')
    const racksCsv = fs.readFileSync('source_data/csv-access-data/racks.csv', 'utf8')
    const racksLines = racksCsv.split('\n').filter(l => l.trim() && !l.startsWith('RackID'))
    const racks = []
    
    for (const line of racksLines) {
        const parts = line.split(',')
        if (parts.length >= 7) {
            const rackId = parts[0].replace(/^\uFEFF/, '').trim()
            const rackSymbol = parts[2].trim()
            const rackLocation = parts[3].trim()
            let rackName = parts[6].trim()
            if (!rackName) {
                rackName = rackSymbol ? `棚 ${rackSymbol}` : `棚 ${rackId}`
            }

            if (rackId) {
                racks.push({
                    rack_code: rackId,
                    rack_name: rackName,
                    location_in_factory: rackLocation || null,
                    legacy_id: rackId
                })
            }
        }
    }

    const { data: rackResult, error: rackErr } = await supabase
        .from('racks')
        .upsert(racks, { onConflict: 'rack_code' })
        .select('id, rack_code, rack_name')

    if (rackErr) {
        console.error('❌ racks seed failed:', rackErr.message)
    } else {
        console.log(`✅ racks: ${rackResult.length} rows inserted/updated`)
    }
}

seed().catch(console.error)
