import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim()
})

const supabaseUrl = envKeys['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envKeys['SUPABASE_SERVICE_ROLE_KEY']

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectSchema() {
  console.log('=== XÁC MINH SCHEMA BẢNG equipment_assignments TRÊN SUPABASE LIVE DB ===\n')

  // Query 1: Query an actual row or inspect column keys directly from Supabase
  const { data: rows, error } = await supabase
    .from('equipment_assignments')
    .select('*')
    .limit(5)

  if (error) {
    console.error('Lỗi truy vấn equipment_assignments:', error)
    process.exit(1)
  }

  console.log('Số lượng bản ghi mẫu trả về:', rows.length)
  if (rows.length > 0) {
    console.log('Các cột thực tế trong bảng equipment_assignments:')
    const sampleRow = rows[0]
    Object.keys(sampleRow).forEach((col, idx) => {
      const val = sampleRow[col]
      const type = val === null ? 'NULLABLE' : typeof val
      console.log(`  ${idx + 1}. ${col.padEnd(25)} (Type: ${type}, Sample: ${JSON.stringify(val)})`)
    })
  } else {
    console.log('Bảng equipment_assignments hiện đang trống (0 rows). Đang lấy metadata qua insert test/rollback...')
  }

  // Also query a sample product and compute 4 KPI values to verify local runtime calculations
  const { data: testProduct } = await supabase
    .from('products')
    .select('product_id, product_code, product_name_internal, product_lifecycle_status')
    .limit(1)
    .single()

  if (testProduct) {
    console.log('\n=== CHẠY THỬ KPI BAR TRÊN 1 SẢN PHẨM THỰC TẾ TRÊN LIVE DB ===')
    console.log(`Product: ${testProduct.product_code} (${testProduct.product_id})`)

    // 1. Set completeness
    const { data: revs } = await supabase
      .from('design_revisions')
      .select('revision_id')
      .eq('product_id', testProduct.product_id)

    const revIds = (revs || []).map(r => r.revision_id)
    const { data: directEquip } = revIds.length > 0 ? await supabase
      .from('equipment')
      .select('equipment_type, equipment_id')
      .in('design_revision_id', revIds) : { data: [] }

    const types = new Set()
    const moldIds = []
    ;(directEquip || []).forEach(eq => {
      if (eq.equipment_type) types.add(eq.equipment_type)
      if (eq.equipment_type === 'MOLD') moldIds.push(eq.equipment_id)
    })

    if (moldIds.length > 0) {
      const { data: assigns } = await supabase
        .from('equipment_assignments')
        .select('assigned_equipment_id, equipment:equipment!equipment_assignments_assigned_equipment_id_fkey(equipment_type)')
        .in('primary_equipment_id', moldIds)
      ;(assigns || []).forEach(a => {
        if (a.equipment?.equipment_type) types.add(a.equipment.equipment_type)
      })
    }

    // 2. Sample Status
    const { data: sampleReq } = await supabase
      .from('sample_requests')
      .select('result_status, sample_type')
      .eq('product_id', testProduct.product_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 3. Orders
    const { data: orderLines } = await supabase
      .from('order_lines')
      .select('quantity')
      .eq('product_id', testProduct.product_id)
    const totalOrdered = (orderLines || []).reduce((s, r) => s + (Number(r.quantity) || 0), 0)

    // 4. Hours
    const { data: jobs } = await supabase
      .from('jobs')
      .select('job_id')
      .eq('product_id', testProduct.product_id)
    const jobIds = (jobs || []).map(j => j.job_id)
    const { data: workLogs } = jobIds.length > 0 ? await supabase
      .from('work_logs')
      .select('hours_spent')
      .in('job_id', jobIds) : { data: [] }
    const totalHours = (workLogs || []).reduce((s, l) => s + (Number(l.hours_spent) || 0), 0)

    console.log(`1. ⚙️ SET 設備:       ${types.size}/8 (${Array.from(types).join(', ') || 'Chưa có'})`)
    console.log(`2. 🧪 試作判定:       ${sampleReq?.result_status || '—'}`)
    console.log(`3. 📦 総受注数量:     ${totalOrdered.toLocaleString()} pcs`)
    console.log(`4. ⏱️ 実績工数:       ${totalHours.toFixed(1)} h`)
  }
}

inspectSchema().catch(console.error)
