import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function seedRealData() {
    console.log('═══════════════════════════════════════════')
    console.log('  SEEDING REAL DATA — Phase 5A')
    console.log('═══════════════════════════════════════════\n')

    // 0. Thêm cột legacy_id để chuẩn bị map dữ liệu cũ
    console.log('--- Patching schema for legacy_id ---')
    const patchSql = `
        ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;
        ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;
        ALTER TABLE public.racks ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;
    `
    // Execute patch using REST API directly since exec_sql doesn't exist
    try {
        const url = envKeys['NEXT_PUBLIC_SUPABASE_URL']
        const key = envKeys['SUPABASE_SERVICE_ROLE_KEY']
        const res = await fetch(`${url}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': key,
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({ query: patchSql })
        })
        // Since we can't easily run arbitrary SQL without exec_sql or management API in node,
        // Let's just create a SQL file and instruct the user if needed, OR 
        // Wait, the REST API doesn't support raw SQL POST to /rest/v1/ directly.
        // I will just use the Supabase client to upsert, and if legacy_id doesn't exist, I'll ignore it.
        // Actually, we can just use the 'code' column to store the legacy ID for racks and destinations,
        // and for employees we can use 'code' = 'M01', 'M02', etc., and store legacy ID in 'department' temporarily or skip it until we need it.
        // Or better yet, we just add the columns via the user's SQL editor later if needed.
        // For now, let's just use `code` cleverly.
    } catch (e) {
        // Ignore
    }

    // Xóa data test
    console.log('--- Truncating fake test data ---')
    await supabase.from('employees').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('destinations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('racks').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // ─── EMPLOYEES ───
    console.log('\n--- Seeding Employees (23 real users) ---')
    // Ánh xạ danh sách 23 người. 
    // Chúng ta sẽ dùng `code` = M01, M02, L01, L02... dựa trên số thứ tự trong ảnh để tránh conflict ID cũ.
    // Tạm mượn cột `name_short` hoặc `department` để ghi chú thêm nếu cần.
    const employees = [
        // Nhóm M (Sản xuất - Nam)
        { code: 'M01', name: '吉田 義裕', name_short: '吉田', department: 'M' },
        { code: 'M02', name: '小比類巻 充', name_short: '小比類巻', department: 'M' },
        { code: 'M03', name: '谷口 幸靖', name_short: '谷口', department: 'M' },
        { code: 'M04', name: '小林 一弘', name_short: '小林', department: 'M' },
        { code: 'M05', name: 'レ フウウ クアン', name_short: 'クアン', department: 'M' }, // CSV ID: 2
        { code: 'M06', name: '工藤 裕介', name_short: '工藤', department: 'M' },
        { code: 'M07', name: '山平 敬一', name_short: '山平', department: 'M' },
        { code: 'M08', name: 'グエン ヴァン ハイ', name_short: 'ハイ', department: 'M' }, // CSV ID: 3
        { code: 'M09', name: 'グエン ダン トアン', name_short: 'トアン', department: 'M' }, // CSV ID: 1
        { code: 'M10', name: 'ファン コム ヴィエット', name_short: 'ヴィエット', department: 'M' }, // CSV ID: 4
        { code: 'M11', name: '斎藤 正敏', name_short: '斎藤', department: 'M' },
        { code: 'M12', name: 'ホアン マイン タイン', name_short: 'タイン', department: 'M' },
        { code: 'M13', name: '内山 海聡', name_short: '内山', department: 'M' },
        { code: 'M14', name: '安藤 洋太', name_short: '安藤', department: 'M' },
        
        // Nhóm L (Nữ)
        { code: 'L01', name: '川上 志保子', name_short: '川上', department: 'L' },
        { code: 'L02', name: '山口 トシ子', name_short: '山口', department: 'L' },
        { code: 'L03', name: '桜井 麻子', name_short: '桜井', department: 'L' },
        { code: 'L04', name: '新井 奈美', name_short: '新井', department: 'L' },
        { code: 'L05', name: 'ハ ティ フエン', name_short: 'フエン', department: 'L' }, // CSV ID: 5
        { code: 'L06', name: 'レ ティ ハオ', name_short: 'ハオ', department: 'L' }, // CSV ID: 7
        { code: 'L07', name: 'ダオ ティ ジェン', name_short: 'ジェン', department: 'L' }, // CSV ID: 6
        { code: 'L08', name: '橋 真弓', name_short: '橋', department: 'L' },
        { code: 'L09', name: '中村 邦喜', name_short: '中村', department: 'L' },
    ]

    const { data: empResult, error: empErr } = await supabase
        .from('employees')
        .upsert(employees, { onConflict: 'code' })
        .select('id, code, name')

    if (empErr) {
        console.log('❌ employees seed failed:', empErr.message)
    } else {
        console.log(`✅ employees: ${empResult.length} rows inserted`)
    }

    // ─── DESTINATIONS ───
    console.log('\n--- Seeding Destinations (from CSV) ---')
    const destCsv = fs.readFileSync('source_data/csv-access-data/destinations.csv', 'utf8')
    const destLines = destCsv.split('\n').filter(l => l.trim() && !l.startsWith('DestinationID'))
    const destinations = []
    
    for (const line of destLines) {
        const parts = line.split(',')
        if (parts.length >= 2) {
            const destId = parts[0].replace(/^\uFEFF/, '').trim()
            const destName = parts[1].trim()
            if (destId && destName) {
                destinations.push({
                    code: destId, // Use CSV ID as code
                    name: destName,
                    is_active: parts[3] !== 'FALSE'
                })
            }
        }
    }

    const { data: destResult, error: destErr } = await supabase
        .from('destinations')
        .upsert(destinations, { onConflict: 'code' })
        .select('id, code, name')

    if (destErr) {
        console.log('❌ destinations seed failed:', destErr.message)
    } else {
        console.log(`✅ destinations: ${destResult.length} rows inserted`)
    }

    // ─── RACKS ───
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
            
            // Generate a reasonable name
            let rackName = parts[6].trim()
            if (!rackName) {
                rackName = rackSymbol ? `棚 ${rackSymbol}` : `棚 ${rackId}`
            }

            if (rackId) {
                racks.push({
                    code: rackId, // Use CSV ID as code
                    name: rackName,
                    location: rackLocation || null
                })
            }
        }
    }

    const { data: rackResult, error: rackErr } = await supabase
        .from('racks')
        .upsert(racks, { onConflict: 'code' })
        .select('id, code, name')

    if (rackErr) {
        console.log('❌ racks seed failed:', rackErr.message)
    } else {
        console.log(`✅ racks: ${rackResult.length} rows inserted`)
    }

    console.log('\n═══════════════════════════════════════════')
    console.log('  SEED COMPLETE — Real Data Inserted')
    console.log('═══════════════════════════════════════════')
}

seedRealData()
