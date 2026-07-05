import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function seed() {
    console.log('═══════════════════════════════════════════')
    console.log('  SEEDING — Phase 5A Foundation Data')
    console.log('═══════════════════════════════════════════\n')

    // ─── EMPLOYEES ───
    // Based on MCS employees.csv common entries + factory standard roles
    const employees = [
        { code: 'EMP001', name: 'Nguyễn Văn Toàn',   name_short: 'Toàn',   department: '金型課' },
        { code: 'EMP002', name: 'Trần Minh Nguyên',   name_short: 'Nguyên', department: '金型課' },
        { code: 'EMP003', name: 'Lê Hoàng Phúc',      name_short: 'Phúc',   department: '金型課' },
        { code: 'EMP004', name: 'Phạm Đức Huy',       name_short: 'Huy',    department: '成形課' },
        { code: 'EMP005', name: 'Võ Minh Tuấn',       name_short: 'Tuấn',   department: '成形課' },
        { code: 'EMP006', name: 'Đặng Quốc Bảo',      name_short: 'Bảo',    department: '品管課' },
        { code: 'EMP007', name: 'Hoàng Thị Lan',      name_short: 'Lan',    department: '事務課' },
        { code: 'EMP008', name: 'Bùi Văn Đức',        name_short: 'Đức',    department: '金型課' },
        { code: 'EMP009', name: 'Ngô Thanh Sơn',      name_short: 'Sơn',    department: '金型課' },
        { code: 'EMP010', name: 'Lý Minh Khoa',       name_short: 'Khoa',   department: '成形課' },
        { code: 'SYS001', name: 'システム管理者',       name_short: 'System', department: 'IT' },
    ]

    const { data: empResult, error: empErr } = await supabase
        .from('employees')
        .upsert(employees, { onConflict: 'code' })
        .select('id, code, name')

    if (empErr) {
        console.log('❌ employees seed failed:', empErr.message)
    } else {
        console.log(`✅ employees: ${empResult.length} rows inserted/updated`)
        empResult.forEach(e => console.log(`   ${e.code} → ${e.name} (${e.id.substring(0, 8)}...)`))
    }

    // ─── DESTINATIONS ───
    // Based on MCS destinations.csv standard locations
    const destinations = [
        { code: 'AREA-MOLDROOM',    name: '金型室 / Phòng Khuôn',       description: 'Khu vực lưu trữ khuôn chính' },
        { code: 'AREA-FORMING',     name: '成形エリア / Khu Dập',        description: 'Khu vực máy dập đang sử dụng' },
        { code: 'AREA-MAINTENANCE', name: '整備場 / Xưởng Bảo Trì',     description: 'Khu vực sửa chữa/bảo trì khuôn' },
        { code: 'AREA-QC',          name: '品管室 / Phòng QC',          description: 'Kiểm tra chất lượng' },
        { code: 'AREA-SHIPPING',    name: '出荷場 / Khu Xuất Hàng',     description: 'Khu vực đóng gói xuất đi' },
        { code: 'EXT-TEFLON',       name: 'テフロン加工 / Nhà Mạ Teflon', description: 'Gửi đi mạ Teflon (ngoài xưởng)' },
        { code: 'EXT-CUSTOMER',     name: '顧客 / Khách Hàng',         description: 'Gửi trả khách hàng' },
        { code: 'EXT-REPAIR',       name: '外注修理 / Sửa Ngoài',       description: 'Gửi sửa chữa bên ngoài' },
        { code: 'AREA-WAREHOUSE',   name: '倉庫 / Kho Tổng',           description: 'Kho lưu trữ chung' },
        { code: 'AREA-CUTTER',      name: '抜型置場 / Kệ Dao',          description: 'Khu vực dao cắt' },
    ]

    const { data: destResult, error: destErr } = await supabase
        .from('destinations')
        .upsert(destinations, { onConflict: 'code' })
        .select('id, code, name')

    if (destErr) {
        console.log('❌ destinations seed failed:', destErr.message)
    } else {
        console.log(`\n✅ destinations: ${destResult.length} rows inserted/updated`)
        destResult.forEach(d => console.log(`   ${d.code} → ${d.name}`))
    }

    // ─── RACKS (Sample) ───
    const racks = [
        { code: 'R01', name: '棚1号 / Giá 01', location: '金型室 A列' },
        { code: 'R02', name: '棚2号 / Giá 02', location: '金型室 A列' },
        { code: 'R03', name: '棚3号 / Giá 03', location: '金型室 B列' },
        { code: 'R04', name: '棚4号 / Giá 04', location: '金型室 B列' },
        { code: 'R05', name: '棚5号 / Giá 05', location: '金型室 C列' },
    ]

    const { data: rackResult, error: rackErr } = await supabase
        .from('racks')
        .upsert(racks, { onConflict: 'code' })
        .select('id, code, name')

    if (rackErr) {
        console.log('❌ racks seed failed:', rackErr.message)
    } else {
        console.log(`\n✅ racks: ${rackResult.length} rows inserted/updated`)
        rackResult.forEach(r => console.log(`   ${r.code} → ${r.name} (${r.id.substring(0, 8)}...)`))
    }

    // ─── FINAL COUNT ───
    console.log('\n--- FINAL COUNTS ---')
    for (const t of ['employees', 'destinations', 'racks']) {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
        console.log(`  ${t}: ${count} rows`)
    }

    console.log('\n═══════════════════════════════════════════')
    console.log('  SEED COMPLETE — Phase 5A Foundation Ready')
    console.log('═══════════════════════════════════════════')
}

seed()
