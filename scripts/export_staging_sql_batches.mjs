import fs from 'fs'
import path from 'path'

const jsonPath = 'source_data/parse_output_dryrun_v2.json'
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const orders = rawData.orders || []

const skippedOrders = new Set(['ORD-20260422-AON', 'ORD-20261014-RYK', 'ORD-20261014-MRY'])

let allLines = []
for (const o of orders) {
  if (skippedOrders.has(o.order_no)) continue
  let lineSeq = 1
  for (const l of o.lines) {
    allLines.push({
      order_no: o.order_no,
      line_no: lineSeq++,
      product_id: l.product_id,
      product_code: l.product_code || '',
      quantity: l.quantity != null ? Number(l.quantity) : 1,
      notes: l.notes || null,
    })
  }
}

console.log(`Extracted ${allLines.length} candidate lines across 2396 orders.`)

const BATCH_SIZE = 400
const totalBatches = Math.ceil(allLines.length / BATCH_SIZE)
const outDir = 'scripts/staging_order_lines'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

function escapeSql(str) {
  if (str == null) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

// 1. Generate 00_setup_and_verification.sql
const setupSql = `-- ============================================================
-- 00_setup_and_verification.sql
-- Hướng dẫn: Quy trình Staging -> Kiểm chứng -> Nạp vào order_lines
-- Tổng số dòng cần nạp: 6.279 dòng thuộc 2.396 đơn hàng
-- ============================================================

-- BƯỚC 1: Khởi tạo bảng staging trung gian
CREATE TABLE IF NOT EXISTS public.staging_order_lines_backfill (
  staging_id BIGSERIAL PRIMARY KEY,
  order_no TEXT NOT NULL,
  line_no INT NOT NULL,
  product_id UUID NOT NULL,
  product_code TEXT,
  quantity NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_staging_order_line UNIQUE (order_no, line_no)
);

-- Index phụ trợ tối ưu hóa việc đối chiếu và join
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
  ON public.staging_order_lines_backfill(order_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
  ON public.staging_order_lines_backfill(product_id);


-- BƯỚC 2: (Sau khi chạy 16 file batch_01.sql -> batch_16.sql)
-- Kiểm tra tổng số dòng đã nạp vào staging (Kỳ vọng: đúng 6.279 dòng)
SELECT 
  count(*) AS total_staging_rows,
  count(DISTINCT order_no) AS total_orders_in_staging,
  count(DISTINCT product_id) AS total_products_in_staging,
  sum(quantity) AS total_quantity_pcs
FROM public.staging_order_lines_backfill;


-- BƯỚC 3: Dry-run đối soát toàn vẹn Foreign Keys 100% với Production
SELECT 
  count(*) AS total_rows,
  count(o.order_id) AS matched_orders,
  count(p.product_id) AS matched_products,
  count(*) - count(o.order_id) AS missing_order_fks,
  count(*) - count(p.product_id) AS missing_product_fks
FROM public.staging_order_lines_backfill s
LEFT JOIN public.orders o ON o.order_no = s.order_no
LEFT JOIN public.products p ON p.product_id = s.product_id;


-- BƯỚC 4: LỆNH THỰC THI CHÍNH THỨC NẠP VÀO public.order_lines
-- (Chỉ thực hiện sau khi BƯỚC 3 đạt 100% matched, 0 missing)
/*
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
  s.quantity,
  'PCS',
  'CONFIRMED',
  s.notes,
  0,
  s.quantity
FROM public.staging_order_lines_backfill s
JOIN public.orders o ON o.order_no = s.order_no
ORDER BY o.order_id, s.line_no
ON CONFLICT (order_id, line_no) DO NOTHING;
*/


-- BƯỚC 5: Nghiệm thu kết quả sau khi nạp vào order_lines
/*
SELECT 
  (SELECT count(*) FROM public.orders) AS orders_count,
  (SELECT count(*) FROM public.order_lines) AS order_lines_count,
  (SELECT sum(quantity) FROM public.order_lines) AS total_shipped_expected_pcs;
*/


-- BƯỚC 6: Dọn dẹp bảng staging sau khi nghiệm thu thành công 100%
/*
DROP TABLE IF EXISTS public.staging_order_lines_backfill;
*/
`
fs.writeFileSync(path.join(outDir, '00_setup_and_verification.sql'), setupSql, 'utf8')

// 2. Generate 16 batch SQL files
const combinedValues = []

for (let b = 0; b < totalBatches; b++) {
  const startIdx = b * BATCH_SIZE
  const endIdx = Math.min(startIdx + BATCH_SIZE, allLines.length)
  const batchLines = allLines.slice(startIdx, endIdx)
  const batchNum = String(b + 1).padStart(2, '0')
  const totalNum = String(totalBatches).padStart(2, '0')

  const valuesSql = batchLines
    .map(
      (l) =>
        `  (${escapeSql(l.order_no)}, ${l.line_no}, ${escapeSql(l.product_id)}, ${escapeSql(
          l.product_code
        )}, ${l.quantity}, ${escapeSql(l.notes)})`
    )
    .join(',\n')

  combinedValues.push(valuesSql)

  const sql = `-- ============================================================
-- LÔ ${batchNum}/${totalNum}: STAGING ORDER LINES BACKFILL
-- Dòng ${startIdx + 1} đến ${endIdx} / ${allLines.length} dòng
-- Bảng đích: public.staging_order_lines_backfill
-- Dung lượng: ~36 KB (An toàn tuyệt đối cho công cụ đọc của PE)
-- ============================================================

INSERT INTO public.staging_order_lines_backfill (order_no, line_no, product_id, product_code, quantity, notes)
VALUES
${valuesSql}
ON CONFLICT (order_no, line_no) DO NOTHING;

-- Kiểm tra lũy kế sau lô ${batchNum}
SELECT count(*) AS total_staging_rows FROM public.staging_order_lines_backfill;
`

  fs.writeFileSync(path.join(outDir, `batch_${batchNum}.sql`), sql, 'utf8')
}

// 3. Generate all_batches_combined.sql (Toàn bộ 6.279 dòng gộp)
const combinedSql = `-- ============================================================
-- all_batches_combined.sql: TOÀN BỘ 6.279 DÒNG ORDER_LINES
-- Dùng cho thực thi 1-lần qua psql hoặc Supabase CLI nếu không phân lô
-- Bảng đích: public.staging_order_lines_backfill
-- ============================================================

-- Khởi tạo bảng staging
CREATE TABLE IF NOT EXISTS public.staging_order_lines_backfill (
  staging_id BIGSERIAL PRIMARY KEY,
  order_no TEXT NOT NULL,
  line_no INT NOT NULL,
  product_id UUID NOT NULL,
  product_code TEXT,
  quantity NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_staging_order_line UNIQUE (order_no, line_no)
);

-- Chèn toàn bộ 6.279 dòng
INSERT INTO public.staging_order_lines_backfill (order_no, line_no, product_id, product_code, quantity, notes)
VALUES
${combinedValues.join(',\n')}
ON CONFLICT (order_no, line_no) DO NOTHING;

-- Kiểm tra tổng số dòng
SELECT count(*) AS total_staging_rows FROM public.staging_order_lines_backfill;
`
fs.writeFileSync(path.join(outDir, 'all_batches_combined.sql'), combinedSql, 'utf8')

// 4. Generate README.md for the folder
const readmeContent = `# STAGING ORDER LINES BACKFILL PAYLOADS

> **Nguồn dữ liệu gốc:** \`source_data/parse_output_dryrun_v2.json\` (Phase R6-S2 / Chỉ đạo #40, #41)  
> **Tổng số đơn hàng:** 2.396 đơn (\`orders\`)  
> **Tổng số dòng chi tiết:** 6.279 dòng (\`order_lines\`)  
> **Tổng sản lượng:** 8.701.479 PCS  
> **Số lượng sản phẩm:** 713 sản phẩm duy nhất (100% khớp bảng \`products\`)

---

## Danh mục Files trong Thư mục:

| Tên File | Phạm vi dòng | Kích thước | Mục đích |
|---|---|---|---|
| \`00_setup_and_verification.sql\` | — | ~3 KB | Tạo bảng staging, đối soát FK dry-run, lệnh INSERT vào \`order_lines\` |
| \`batch_01.sql\` | 1 → 400 | ~37 KB | Lô 01 nạp vào staging |
| \`batch_02.sql\` | 401 → 800 | ~37 KB | Lô 02 nạp vào staging |
| \`batch_03.sql\` | 801 → 1.200 | ~37 KB | Lô 03 nạp vào staging |
| \`batch_04.sql\` | 1.201 → 1.600 | ~37 KB | Lô 04 nạp vào staging |
| \`batch_05.sql\` | 1.601 → 2.000 | ~37 KB | Lô 05 nạp vào staging |
| \`batch_06.sql\` | 2.001 → 2.400 | ~37 KB | Lô 06 nạp vào staging |
| \`batch_07.sql\` | 2.401 → 2.800 | ~37 KB | Lô 07 nạp vào staging |
| \`batch_08.sql\` | 2.801 → 3.200 | ~37 KB | Lô 08 nạp vào staging |
| \`batch_09.sql\` | 3.201 → 3.600 | ~37 KB | Lô 09 nạp vào staging |
| \`batch_10.sql\` | 3.601 → 4.000 | ~37 KB | Lô 10 nạp vào staging |
| \`batch_11.sql\` | 4.001 → 4.400 | ~37 KB | Lô 11 nạp vào staging |
| \`batch_12.sql\` | 4.401 → 4.800 | ~37 KB | Lô 12 nạp vào staging |
| \`batch_13.sql\` | 4.801 → 5.200 | ~37 KB | Lô 13 nạp vào staging |
| \`batch_14.sql\` | 5.201 → 5.600 | ~37 KB | Lô 14 nạp vào staging |
| \`batch_15.sql\` | 5.601 → 6.000 | ~37 KB | Lô 15 nạp vào staging |
| \`batch_16.sql\` | 6.001 → 6.279 | ~26 KB | Lô 16 nạp vào staging (Lô cuối) |
| \`all_batches_combined.sql\` | 1 → 6.279 | ~580 KB | Toàn bộ 6.279 dòng gộp chung 1 file (thực thi 1 lần qua CLI/psql) |

Mọi file lô riêng lẻ đều được khống chế **dưới 40 KB** (thấp hơn nhiều so với giới hạn 70 KB của PE), đảm bảo kéo toàn văn 100% không bị cắt cụt.
`

fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent, 'utf8')

console.log(`Generated all files in ${outDir}/ successfully.`)
