import pg from 'pg'
import fs from 'fs'
import path from 'path'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const isExecute = process.argv.includes('--execute')
if (!isExecute) {
  console.log('SAFETY GUARD: --execute flag not passed. Aborting without modifying Supabase.')
  console.log('Usage: node scripts/execute_staging_load_to_supabase.mjs --execute')
  process.exit(0)
}

const client = new pg.Client({
  connectionString: envMap.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function runStagingLoad() {
  const startTime = new Date().toISOString()
  console.log(`============================================================`)
  console.log(`THỰC THI NẠP 16 LÔ VÀO BẢNG STAGING TRÊN SUPABASE PRODUCTION`)
  console.log(`Thời gian bắt đầu: ${startTime}`)
  console.log(`Môi trường: Supabase PostgreSQL (${envMap.NEXT_PUBLIC_SUPABASE_URL})`)
  console.log(`Phê duyệt: Minh Chủ Thoan & PE (Chỉ nạp Staging, KHÔNG đụng order_lines)`)
  console.log(`============================================================\n`)

  await client.connect()

  // 1. Kiểm tra an toàn trước khi chạy
  const beforeCheck = await client.query('SELECT count(*) AS count FROM public.order_lines;')
  const initialLineCount = parseInt(beforeCheck.rows[0].count, 10)
  console.log(`[AN TOÀN] Số dòng hiện tại của public.order_lines: ${initialLineCount}`)
  if (initialLineCount !== 0) {
    console.warn(`[CẢNH BÁO] order_lines có ${initialLineCount} dòng (khác 0). Hãy đảm bảo đây là mong muốn.`)
  }

  // 2. Khởi tạo bảng staging và index
  console.log(`\n[BƯỚC 1] Khởi tạo cấu trúc bảng staging V2 và Index...`)
  const ddlSql = `
    CREATE TABLE IF NOT EXISTS public.staging_order_lines_backfill (
      staging_id BIGSERIAL PRIMARY KEY,
      batch_no INT NOT NULL,
      source_row_no INT NOT NULL,
      order_no TEXT NOT NULL,
      line_no INT NOT NULL,
      product_id UUID NOT NULL,
      product_code TEXT,
      product_code_source TEXT,
      quantity NUMERIC NOT NULL,
      quantity_source NUMERIC,
      quantity_normalized INT NOT NULL,
      notes TEXT,
      validation_status TEXT DEFAULT 'PENDING',
      validation_error TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_staging_order_line UNIQUE (order_no, line_no)
    );

    CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
      ON public.staging_order_lines_backfill(order_no);
    CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
      ON public.staging_order_lines_backfill(product_id);
    CREATE INDEX IF NOT EXISTS idx_staging_order_lines_batch 
      ON public.staging_order_lines_backfill(batch_no);
    CREATE INDEX IF NOT EXISTS idx_staging_order_lines_source_row 
      ON public.staging_order_lines_backfill(source_row_no);
  `
  await client.query(ddlSql)
  console.log(`✅ Đã khởi tạo thành công public.staging_order_lines_backfill kèm 4 index phụ trợ.`)

  // Kiểm tra số dòng staging trước khi nạp
  const preCountRes = await client.query('SELECT count(*) AS count FROM public.staging_order_lines_backfill;')
  const preCount = parseInt(preCountRes.rows[0].count, 10)
  if (preCount > 0) {
    console.log(`[LƯU Ý] Bảng staging đã có sẵn ${preCount} dòng. Xóa làm mới (TRUNCATE) để đảm bảo sạch sẽ...`)
    await client.query('TRUNCATE TABLE public.staging_order_lines_backfill RESTART IDENTITY;')
    console.log(`✅ Đã TRUNCATE bảng staging về 0 dòng.`)
  }

  // 3. Nạp lần lượt 16 lô batch_01.sql -> batch_16.sql
  console.log(`\n[BƯỚC 2] Bắt đầu nạp 16 lô SQL staging...`)
  const stagingDir = 'scripts/staging_order_lines'
  let totalInsertedCumulative = 0

  for (let b = 1; b <= 16; b++) {
    const batchNum = String(b).padStart(2, '0')
    const filePath = path.join(stagingDir, `batch_${batchNum}.sql`)
    const rawSql = fs.readFileSync(filePath, 'utf8')

    // Tách phần INSERT statement (bỏ qua câu SELECT count ở cuối file để chạy riêng)
    const insertSqlMatch = rawSql.match(/(INSERT INTO public\.staging_order_lines_backfill[\s\S]+?ON CONFLICT \(order_no, line_no\) DO NOTHING;)/)
    if (!insertSqlMatch) {
      throw new Error(`Không thể trích xuất lệnh INSERT từ file ${filePath}`)
    }

    const insertSql = insertSqlMatch[1]
    const res = await client.query(insertSql)
    const insertedInBatch = res.rowCount

    // Kiểm tra lũy kế thực tế trên database
    const countCheck = await client.query('SELECT count(*) AS count FROM public.staging_order_lines_backfill;')
    totalInsertedCumulative = parseInt(countCheck.rows[0].count, 10)

    console.log(`  • Lô ${batchNum}/16: +${insertedInBatch} dòng mới. Lũy kế staging: ${totalInsertedCumulative} dòng.`)
  }

  console.log(`\n✅ HOÀN TẤT NẠP 16 LÔ VÀO STAGING. Tổng cộng: ${totalInsertedCumulative} dòng (Kỳ vọng: 6.279).`)

  // 4. Thực thi 7 truy vấn kiểm định bắt buộc (A -> G) trực tiếp trên PostgreSQL Production
  console.log(`\n[BƯỚC 3] THỰC THI 7 TRUY VẤN KIỂM ĐỊNH BẮT BUỘC (A -> G) TRÊN PRODUCTION:\n`)

  // Query A: Đếm staging
  const resA = await client.query(`
    SELECT 
      count(*) AS total_staging_rows,
      count(DISTINCT order_no) AS total_orders_in_staging,
      count(DISTINCT product_id) AS total_products_in_staging,
      sum(quantity_normalized) AS total_quantity_normalized_pcs,
      sum(quantity_source) AS total_quantity_source_pcs
    FROM public.staging_order_lines_backfill;
  `)
  const rowA = resA.rows[0]
  console.log(`------------------------------------------------------------`)
  console.log(`QUERY A — ĐẾM DÒNG VÀ TỔNG SẢN LƯỢNG TRÊN PRODUCTION:`)
  console.log(`- total_staging_rows: ${rowA.total_staging_rows} (Kỳ vọng: 6279) -> ${rowA.total_staging_rows == '6279' ? '✅ ĐẠT' : '❌ LỖI'}`)
  console.log(`- total_orders_in_staging: ${rowA.total_orders_in_staging} (Kỳ vọng: 2396) -> ${rowA.total_orders_in_staging == '2396' ? '✅ ĐẠT' : '❌ LỖI'}`)
  console.log(`- total_products_in_staging: ${rowA.total_products_in_staging} (Kỳ vọng: 713) -> ${rowA.total_products_in_staging == '713' ? '✅ ĐẠT' : '❌ LỖI'}`)
  console.log(`- total_quantity_normalized_pcs: ${Number(rowA.total_quantity_normalized_pcs).toLocaleString()} PCS`)
  console.log(`- total_quantity_source_pcs (gốc): ${Number(rowA.total_quantity_source_pcs).toLocaleString()} PCS (2 dòng mẫu đặc biệt có quantity_source = NULL, gán normalized = 1)`)

  // Query B: Duplicate khóa nguồn (order_no, line_no)
  const resB = await client.query(`
    SELECT order_no, line_no, count(*) 
    FROM public.staging_order_lines_backfill 
    GROUP BY order_no, line_no 
    HAVING count(*) > 1;
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY B — KIỂM TRA TRÙNG LẶP KHÓA NGUỒN (order_no, line_no):`)
  console.log(`- Số dòng duplicate: ${resB.rowCount} (Kỳ vọng: 0) -> ${resB.rowCount === 0 ? '✅ ĐẠT (0 duplicate)' : '❌ LỖI'}`)

  // Query C: Missing order FK
  const resC = await client.query(`
    SELECT s.order_no, count(*) 
    FROM public.staging_order_lines_backfill s 
    LEFT JOIN public.orders o ON o.order_no = s.order_no 
    WHERE o.order_id IS NULL 
    GROUP BY s.order_no;
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY C — KIỂM TRA TOÀN VẸN ĐƠN HÀNG (Missing orders):`)
  console.log(`- Số đơn hàng thiếu trên Production: ${resC.rowCount} (Kỳ vọng: 0) -> ${resC.rowCount === 0 ? '✅ ĐẠT (0 missing)' : '❌ LỖI'}`)

  // Query D: Missing product FK
  const resD = await client.query(`
    SELECT s.product_id, count(*) 
    FROM public.staging_order_lines_backfill s 
    LEFT JOIN public.products p ON p.product_id = s.product_id 
    WHERE p.product_id IS NULL 
    GROUP BY s.product_id;
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY D — KIỂM TRA TOÀN VẸN SẢN PHẨM (Missing products):`)
  console.log(`- Số sản phẩm thiếu trên Production: ${resD.rowCount} (Kỳ vọng: 0) -> ${resD.rowCount === 0 ? '✅ ĐẠT (0 missing)' : '❌ LỖI'}`)

  // Query E: Mismatch product code
  const resE = await client.query(`
    SELECT s.product_id, s.product_code, p.product_code AS db_product_code
    FROM public.staging_order_lines_backfill s 
    JOIN public.products p ON p.product_id = s.product_id 
    WHERE s.product_code IS DISTINCT FROM p.product_code;
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY E — ĐỐI SOÁT MÃ SẢN PHẨM (Product code mismatch):`)
  console.log(`- Số dòng có mã sản phẩm lệch với DB products: ${resE.rowCount} (Kỳ vọng: 0) -> ${resE.rowCount === 0 ? '✅ ĐẠT (0 mismatch - Khớp 100%)' : '❌ LỖI'}`)

  // Query F: Quantity không hợp lệ (<= 0 hoặc không phải số nguyên)
  const resF = await client.query(`
    SELECT staging_id, order_no, line_no, quantity_normalized 
    FROM public.staging_order_lines_backfill 
    WHERE quantity_normalized <= 0 OR quantity_normalized <> trunc(quantity_normalized);
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY F — KIỂM TRA TÍNH HỢP LỆ CỦA SỐ LƯỢNG (Quantity invalid):`)
  console.log(`- Số dòng có quantity <= 0 hoặc không nguyên: ${resF.rowCount} (Kỳ vọng: 0) -> ${resF.rowCount === 0 ? '✅ ĐẠT (100% số nguyên dương)' : '❌ LỖI'}`)

  // Query G: Line numbering liên tục 1..N
  const resG = await client.query(`
    WITH x AS ( 
      SELECT order_no, line_no, row_number() OVER (PARTITION BY order_no ORDER BY line_no) AS expected_line_no 
      FROM public.staging_order_lines_backfill 
    ) 
    SELECT * FROM x WHERE line_no <> expected_line_no;
  `)
  console.log(`\n------------------------------------------------------------`)
  console.log(`QUERY G — KIỂM TRA ĐỘ LIÊN TỤC CỦA line_no (1..N) THEO TỪNG ĐƠN:`)
  console.log(`- Số dòng bị ngắt quãng hoặc không bắt đầu từ 1: ${resG.rowCount} (Kỳ vọng: 0) -> ${resG.rowCount === 0 ? '✅ ĐẠT (100% liên tục 1..N)' : '❌ LỖI'}`)

  // 5. Kiểm tra an toàn sau cùng: order_lines BẮT BUỘC giữ nguyên 0 dòng
  const afterCheck = await client.query('SELECT count(*) AS count FROM public.order_lines;')
  const finalLineCount = parseInt(afterCheck.rows[0].count, 10)
  console.log(`\n============================================================`)
  console.log(`[AN TOÀN SAU CÙNG] Số dòng của public.order_lines sau khi nạp staging: ${finalLineCount}`)
  if (finalLineCount === initialLineCount) {
    console.log(`🔒 BẢO TOÀN DỮ LIỆU: Bảng public.order_lines KHÔNG HỀ BỊ CHẠM ĐẾN (Đúng cam kết READ-ONLY 100%).`)
  } else {
    console.error(`🚨 BÁO ĐỘNG ĐỎ: order_lines bị thay đổi từ ${initialLineCount} -> ${finalLineCount}!`)
  }
  console.log(`============================================================\n`)

  await client.end()
}

runStagingLoad().catch((err) => {
  console.error('Lỗi thực thi:', err)
  process.exit(1)
})
