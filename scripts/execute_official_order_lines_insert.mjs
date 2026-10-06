import pg from 'pg'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const isExecute = process.argv.includes('--execute')
if (!isExecute) {
  console.log('SAFETY GUARD: --execute flag not passed. Aborting without modifying Supabase.')
  console.log('Usage: node scripts/execute_official_order_lines_insert.mjs --execute')
  process.exit(0)
}

const client = new pg.Client({
  connectionString: envMap.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function runOfficialInsert() {
  const startTime = new Date().toISOString()
  console.log(`============================================================`)
  console.log(`THỰC THI NẠP CHÍNH THỨC TỪ STAGING SANG public.order_lines`)
  console.log(`Thời gian bắt đầu: ${startTime}`)
  console.log(`Môi trường: Supabase PostgreSQL (${envMap.NEXT_PUBLIC_SUPABASE_URL})`)
  console.log(`Phê duyệt: Minh Chủ Thoan & PE (Chỉ thị 2026-10-06 14:40 JST)`)
  console.log(`============================================================\n`)

  await client.connect()

  try {
    await client.query('BEGIN;')

    // 1. PREFLIGHT AUDIT BẮT BUỘC THEO QUY CHUẨN PE
    console.log('[1] PREFLIGHT AUDIT TRƯỚC KHI INSERT...')
    const preflightRes = await client.query(`
      SELECT json_build_object(
        'staging_rows', (SELECT count(*) FROM public.staging_order_lines_backfill),
        'order_lines_rows', (SELECT count(*) FROM public.order_lines),
        'missing_orders', (SELECT count(*) FROM public.staging_order_lines_backfill s LEFT JOIN public.orders o ON o.order_no = s.order_no WHERE o.order_id IS NULL),
        'missing_products', (SELECT count(*) FROM public.staging_order_lines_backfill s LEFT JOIN public.products p ON p.product_id = s.product_id WHERE p.product_id IS NULL),
        'duplicate_keys', (SELECT count(*) FROM (
          SELECT order_no, line_no FROM public.staging_order_lines_backfill GROUP BY order_no, line_no HAVING count(*) > 1
        ) dup),
        'invalid_quantities', (SELECT count(*) FROM public.staging_order_lines_backfill WHERE quantity_normalized <= 0 OR quantity_normalized <> trunc(quantity_normalized)),
        'line_gaps', (SELECT count(*) FROM (
          SELECT order_no, line_no, row_number() OVER (PARTITION BY order_no ORDER BY line_no) AS expected_line_no FROM public.staging_order_lines_backfill
        ) x WHERE line_no <> expected_line_no)
      ) AS preflight;
    `)
    const pre = preflightRes.rows[0].preflight
    console.log('Preflight results:', JSON.stringify(pre, null, 2))

    if (pre.staging_rows !== 6279) throw new Error(`PREFLIGHT FAILED: staging_rows = ${pre.staging_rows} (kỳ vọng 6279)`)
    if (pre.order_lines_rows !== 0) throw new Error(`PREFLIGHT FAILED: order_lines_rows = ${pre.order_lines_rows} (kỳ vọng 0)`)
    if (pre.missing_orders !== 0) throw new Error(`PREFLIGHT FAILED: missing_orders = ${pre.missing_orders} (kỳ vọng 0)`)
    if (pre.missing_products !== 0) throw new Error(`PREFLIGHT FAILED: missing_products = ${pre.missing_products} (kỳ vọng 0)`)
    if (pre.duplicate_keys !== 0) throw new Error(`PREFLIGHT FAILED: duplicate_keys = ${pre.duplicate_keys} (kỳ vọng 0)`)
    if (pre.invalid_quantities !== 0) throw new Error(`PREFLIGHT FAILED: invalid_quantities = ${pre.invalid_quantities} (kỳ vọng 0)`)
    if (pre.line_gaps !== 0) throw new Error(`PREFLIGHT FAILED: line_gaps = ${pre.line_gaps} (kỳ vọng 0)`)

    console.log(`✅ Toàn bộ điều kiện Preflight ĐẠT 100%.\n`)

    // 2. THỰC THI INSERT DUY NHẤT (FAIL-CLOSED: KHÔNG DÙNG ON CONFLICT DO UPDATE)
    console.log('[2] THỰC THI INSERT TỪ STAGING VÀO public.order_lines...')
    const insertSql = `
      INSERT INTO public.order_lines (
        order_id,
        line_no,
        product_id,
        quantity,
        unit,
        line_status,
        notes,
        shipped_qty,
        remaining_qty
      )
      SELECT 
        o.order_id,
        s.line_no,
        s.product_id,
        s.quantity_normalized::integer,
        'PCS',
        'CONFIRMED',
        s.notes,
        0,
        s.quantity_normalized::integer
      FROM public.staging_order_lines_backfill s
      JOIN public.orders o ON o.order_no = s.order_no
      ORDER BY o.order_id, s.line_no;
    `
    const insertRes = await client.query(insertSql)
    const insertedRows = insertRes.rowCount
    console.log(`✅ Lệnh INSERT đã chạy thành công. Số dòng inserted: ${insertedRows}\n`)

    if (insertedRows !== 6279) {
      throw new Error(`INSERT FAILED: Số dòng insert = ${insertedRows} (kỳ vọng 6279)`)
    }

    // 3. POSTFLIGHT AUDIT BẮT BUỘC THEO QUY CHUẨN PE
    console.log('[3] POSTFLIGHT AUDIT SAU INSERT...')
    const postflightRes = await client.query(`
      SELECT json_build_object(
        'inserted_rows', ${insertedRows},
        'order_lines_total', (SELECT count(*) FROM public.order_lines),
        'quantity_total', (SELECT sum(quantity) FROM public.order_lines),
        'duplicate_order_line_keys', (SELECT count(*) FROM (
          SELECT order_id, line_no FROM public.order_lines GROUP BY order_id, line_no HAVING count(*) > 1
        ) d),
        'missing_order_fks', (SELECT count(*) FROM public.order_lines ol LEFT JOIN public.orders o ON o.order_id = ol.order_id WHERE o.order_id IS NULL),
        'missing_product_fks', (SELECT count(*) FROM public.order_lines ol LEFT JOIN public.products p ON p.product_id = ol.product_id WHERE p.product_id IS NULL),
        'invalid_remaining_qty', (SELECT count(*) FROM public.order_lines WHERE remaining_qty <> quantity),
        'invalid_shipped_qty', (SELECT count(*) FROM public.order_lines WHERE shipped_qty <> 0),
        'invalid_unit_or_status', (SELECT count(*) FROM public.order_lines WHERE unit <> 'PCS' OR line_status <> 'CONFIRMED')
      ) AS postflight;
    `)
    const post = postflightRes.rows[0].postflight
    console.log('Postflight results (Verbatim Output):')
    console.log(JSON.stringify(post, null, 2))

    // Kiểm tra từng điều kiện postflight
    if (post.inserted_rows !== 6279) throw new Error(`POSTFLIGHT FAILED: inserted_rows = ${post.inserted_rows}`)
    if (post.order_lines_total !== 6279) throw new Error(`POSTFLIGHT FAILED: order_lines_total = ${post.order_lines_total}`)
    if (post.quantity_total !== 8701481) throw new Error(`POSTFLIGHT FAILED: quantity_total = ${post.quantity_total}`)
    if (post.duplicate_order_line_keys !== 0) throw new Error(`POSTFLIGHT FAILED: duplicate_order_line_keys = ${post.duplicate_order_line_keys}`)
    if (post.missing_order_fks !== 0) throw new Error(`POSTFLIGHT FAILED: missing_order_fks = ${post.missing_order_fks}`)
    if (post.missing_product_fks !== 0) throw new Error(`POSTFLIGHT FAILED: missing_product_fks = ${post.missing_product_fks}`)
    if (post.invalid_remaining_qty !== 0) throw new Error(`POSTFLIGHT FAILED: invalid_remaining_qty = ${post.invalid_remaining_qty}`)
    if (post.invalid_shipped_qty !== 0) throw new Error(`POSTFLIGHT FAILED: invalid_shipped_qty = ${post.invalid_shipped_qty}`)
    if (post.invalid_unit_or_status !== 0) throw new Error(`POSTFLIGHT FAILED: invalid_unit_or_status = ${post.invalid_unit_or_status}`)

    console.log(`\n✅ TOÀN BỘ 9 TIÊU CHÍ POSTFLIGHT ĐẠT 100% KỲ VỌNG!`)
    await client.query('COMMIT;')
    console.log(`🎉 TRANSACTION ĐÃ COMMIT THÀNH CÔNG LÊN SUPABASE PRODUCTION!`)
    console.log(`Thời gian hoàn tất: ${new Date().toISOString()}`)
  } catch (err) {
    await client.query('ROLLBACK;')
    console.error(`\n🚨 GẶP LỖI — ĐÃ ROLLBACK TOÀN BỘ TRANSACTION:`, err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runOfficialInsert()
