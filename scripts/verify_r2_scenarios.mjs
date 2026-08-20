import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load environment variables
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim()
})

const supabaseUrl = envKeys['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envKeys['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('=== KHỞI ĐỘNG KIỂM THỬ THỰC TẾ (SAU KHI NÂNG CẤP ATOMIC RPC & SESSION GUARD) ===\n')

  // Setup: Tìm một công ty và tạo bản ghi sản phẩm + bản vẽ kiểm thử thực tế
  const { data: comp } = await supabase.from('companies').select('company_id, company_name').limit(1).single()
  if (!comp) throw new Error('Không tìm thấy công ty nào trong DB')
  const companyId = comp.company_id

  console.log(`[SETUP] Sử dụng company_id: ${companyId} (${comp.company_name})`)

  // Dọn dẹp bản ghi test cũ nếu có
  await supabase.from('products').delete().eq('product_code', 'TEST-R2-VERIFY-V2')

  // Tạo sản phẩm test
  const { data: prod, error: errProd } = await supabase.from('products').insert({
    product_code: 'TEST-R2-VERIFY-V2',
    product_name_internal: 'TEST-R2-VERIFY-V2',
    product_description: 'Sản phẩm kiểm thử Atomic RPC & Session Guard cho PE',
    company_id: companyId,
    product_status: 'ACTIVE',
    product_lifecycle_status: 'DESIGN',
    requires_prototype_mold: true
  }).select('product_id, product_code, product_lifecycle_status, requires_prototype_mold').single()

  if (errProd || !prod) {
    console.error('Lỗi tạo test product:', errProd)
    process.exit(1)
  }
  console.log('[SETUP] Đã tạo Test Product thành công:', prod)

  // Tạo design revision test
  const { data: rev, error: errRev } = await supabase.from('design_revisions').insert({
    product_id: prod.product_id,
    company_id: companyId,
    design_code: 'TEST-R2-VERIFY-V2-REV1',
    status: 'DRAFT'
  }).select('revision_id, design_code, status').single()

  if (errRev || !rev) {
    console.error('Lỗi tạo test revision:', errRev)
    process.exit(1)
  }
  console.log('[SETUP] Đã tạo Test Revision thành công:', rev)

  // =========================================================================
  // KỊCH BẢN 1: TEST ATOMIC RPC & SESSION GUARD DEDUP (submit approval status=APPROVED)
  // =========================================================================
  console.log('\n' + '='.repeat(80))
  console.log('KỊCH BẢN 1: KIỂM TRA ATOMIC RPC & SESSION GUARD (DEDUP TEST)')
  console.log('Mô tả: Gọi fn_transition_product_lifecycle qua RPC -> kiểm tra product_lifecycle_logs chỉ có đúng 1 dòng')
  console.log('='.repeat(80))

  // 1. Tạo bản ghi log duyệt trong design_approval_logs
  const { data: appLog, error: errAppLog } = await supabase.from('design_approval_logs').insert({
    design_revision_id: rev.revision_id,
    approval_round: 1,
    approval_stage: 'LAYOUT',
    status: 'APPROVED',
    customer_feedback: 'Khách hàng gửi email xác nhận Layout đạt yêu cầu ngày 20/08 (V2)',
    notes: 'Kịch bản Test 1: Duyệt Layout CAD qua Atomic RPC'
  }).select().single()

  if (errAppLog) throw errAppLog

  // 2. Thực thi RPC fn_transition_product_lifecycle (Tự động set flag và update products)
  const { data: rpcLogId1, error: errRpc1 } = await supabase.rpc('fn_transition_product_lifecycle', {
    p_product_id: prod.product_id,
    p_to_status: 'PROTOTYPE',
    p_trigger_event: 'DESIGN_APPROVED',
    p_reference_table: 'design_approval_logs',
    p_reference_id: appLog.log_id,
    p_reason: `Bản vẽ ${rev.design_code} được phê duyệt (LAYOUT)`,
    p_changed_by: null
  })

  if (errRpc1) throw errRpc1
  console.log(`[RPC OUTPUT] fn_transition_product_lifecycle trả về log_id: ${rpcLogId1}`)

  // Query kiểm tra product_lifecycle_logs
  const { data: logs1, error: errQueryLogs1 } = await supabase
    .from('product_lifecycle_logs')
    .select('log_id, product_id, from_status, to_status, trigger_event, reference_table, reference_id, changed_by, reason, created_at')
    .eq('product_id', prod.product_id)
    .order('created_at', { ascending: true })

  if (errQueryLogs1) throw errQueryLogs1

  console.log(`\n[KẾT QUẢ KỊCH BẢN 1] Số lượng dòng log ghi nhận trong DB: ${logs1.length} (Kỳ vọng: Đúng 1 dòng)`)
  console.log(JSON.stringify(logs1, null, 2))

  const test1Pass = logs1.length === 1 && logs1[0].trigger_event === 'DESIGN_APPROVED' && logs1[0].to_status === 'PROTOTYPE'
  console.log(`\n=> KẾT LUẬN KỊCH BẢN 1: ${test1Pass ? '✅ PASS - Atomic RPC + Session Guard hoạt động chính xác 100%, không bị double log!' : '❌ FAIL'}`)

  // =========================================================================
  // KỊCH BẢN 2: TEST VÒNG LẶP NG QUA ATOMIC RPC (NG-LOOP TEST)
  // =========================================================================
  console.log('\n' + '='.repeat(80))
  console.log('KỊCH BẢN 2: KIỂM TRA VÒNG LẶP MẪU THỬ KHÔNG ĐẠT QUA ATOMIC RPC (NG-LOOP TEST)')
  console.log('Mô tả: Tạo sample_request -> update CUSTOMER_NG qua RPC -> kiểm tra product quay về DESIGN')
  console.log('='.repeat(80))

  // 1. Tạo sample_request
  const { data: sReq, error: errSReq } = await supabase.from('sample_requests').insert({
    product_id: prod.product_id,
    design_revision_id: rev.revision_id,
    sample_type: 'POCKET_TEST',
    requested_qty: 3,
    target_date: '2026-08-25',
    result_status: 'REQUESTED',
    notes: 'Làm mẫu thử 3 pocket kiểm tra cấn chi tiết'
  }).select().single()
  if (errSReq) throw errSReq

  // 2. Cập nhật sample_requests result_status = CUSTOMER_NG
  const ngReasonText = 'Pocket depth -0.3mm NG, linh kiện bị cấn khi ráp thử tại nhà máy khách hàng (V2 RPC)'
  await supabase.from('sample_requests').update({
    result_status: 'CUSTOMER_NG',
    ng_reason: ngReasonText
  }).eq('request_id', sReq.request_id)

  // 3. Gọi Atomic RPC chuyển trạng thái về DESIGN với lý do NG
  const { data: rpcLogId2, error: errRpc2 } = await supabase.rpc('fn_transition_product_lifecycle', {
    p_product_id: prod.product_id,
    p_to_status: 'DESIGN',
    p_trigger_event: 'SAMPLE_REJECTED',
    p_reference_table: 'sample_requests',
    p_reference_id: sReq.request_id,
    p_reason: `Mẫu thử không đạt (CUSTOMER_NG): ${ngReasonText}`,
    p_changed_by: null
  })
  if (errRpc2) throw errRpc2

  // Query kiểm tra trạng thái sản phẩm hiện tại
  const { data: prodAfterNG } = await supabase.from('products')
    .select('product_id, product_code, product_lifecycle_status')
    .eq('product_id', prod.product_id)
    .single()

  // Query tất cả logs của sản phẩm
  const { data: logs2 } = await supabase
    .from('product_lifecycle_logs')
    .select('log_id, from_status, to_status, trigger_event, reference_table, reference_id, reason, created_at')
    .eq('product_id', prod.product_id)
    .order('created_at', { ascending: true })

  console.log(`\n[KẾT QUẢ KỊCH BẢN 2]`)
  console.log(`- Trạng thái sản phẩm hiện tại: ${prodAfterNG.product_lifecycle_status} (Kỳ vọng: DESIGN)`)
  console.log(`- Danh sách Audit Logs:`)
  console.log(JSON.stringify(logs2, null, 2))

  const latestLog2 = logs2[logs2.length - 1]
  const test2Pass = prodAfterNG.product_lifecycle_status === 'DESIGN' &&
                    latestLog2.trigger_event === 'SAMPLE_REJECTED' &&
                    latestLog2.reason.includes(ngReasonText)

  console.log(`\n=> KẾT LUẬN KỊCH BẢN 2: ${test2Pass ? '✅ PASS - Sản phẩm đã tự động quay về DESIGN, event là SAMPLE_REJECTED, lý do NG được bảo toàn trọn vẹn!' : '❌ FAIL'}`)

  // =========================================================================
  // KỊCH BẢN 3: TEST UPDATE TRỰC TIẾP KHÔNG CÓ SESSION FLAG (SESSIONLESS DB GUARD TRIGGER)
  // =========================================================================
  console.log('\n' + '='.repeat(80))
  console.log('KỊCH BẢN 3: KIỂM TRA LƯỚI AN TOÀN TRIGGER KHI UPDATE TRỰC TIẾP (SESSION GUARD TRIGGER)')
  console.log('Mô tả: Chạy UPDATE trực tiếp products qua SQL/Client (không qua RPC/Action) -> trigger tự động bắt ngay')
  console.log('='.repeat(80))

  // Chạy lệnh UPDATE trực tiếp bảng products (không có cờ app.bypass_lifecycle_trigger)
  const { error: errDirectUpdate } = await supabase.from('products')
    .update({ product_lifecycle_status: 'MASS_PRODUCTION' })
    .eq('product_id', prod.product_id)

  if (errDirectUpdate) throw errDirectUpdate

  // Query kiểm tra log mới nhất được sinh ra từ Trigger Guard
  const { data: logs3 } = await supabase
    .from('product_lifecycle_logs')
    .select('log_id, product_id, from_status, to_status, trigger_event, reference_table, changed_by, reason, created_at')
    .eq('product_id', prod.product_id)
    .order('created_at', { ascending: true })

  console.log(`\n[KẾT QUẢ KỊCH BẢN 3] Toàn bộ lịch sử product_lifecycle_logs sau lệnh UPDATE trực tiếp:`)
  console.log(JSON.stringify(logs3, null, 2))

  const latestLog3 = logs3[logs3.length - 1]
  const test3Pass = latestLog3.to_status === 'MASS_PRODUCTION' &&
                    latestLog3.from_status === 'DESIGN' &&
                    latestLog3.trigger_event === 'SYSTEM_UPDATE' &&
                    latestLog3.changed_by === null &&
                    latestLog3.reason.includes('SYSTEM')

  console.log(`\n=> KẾT LUẬN KỊCH BẢN 3: ${test3Pass ? '✅ PASS - Trigger Guard tự động bắt được thay đổi direct, ghi log với changed_by=NULL và reason SYSTEM!' : '❌ FAIL'}`)

  // Dọn dẹp bản ghi test
  console.log('\n--- Dọn dẹp dữ liệu kiểm thử ---')
  await supabase.from('products').delete().eq('product_id', prod.product_id)
  console.log('Dọn dẹp thành công.')

  console.log('\n' + '='.repeat(80))
  console.log(`TỔNG KẾT: KỊCH BẢN 1: ${test1Pass ? 'PASS' : 'FAIL'} | KỊCH BẢN 2: ${test2Pass ? 'PASS' : 'FAIL'} | KỊCH BẢN 3: ${test3Pass ? 'PASS' : 'FAIL'}`)
  console.log('='.repeat(80))
}

main().catch(err => {
  console.error('Lỗi kiểm thử:', err)
  process.exit(1)
})
