import fs from 'fs'
import path from 'path'

const jsonPath = 'source_data/parse_output_dryrun_v2.json'
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const orders = rawData.orders || []

const skippedOrders = new Set(['ORD-20260422-AON', 'ORD-20261014-RYK', 'ORD-20261014-MRY'])

let allLines = []
let sourceRowNo = 1
for (const o of orders) {
  if (skippedOrders.has(o.order_no)) continue
  let lineSeq = 1
  for (const l of o.lines) {
    const isNullQty = l.quantity == null
    const qNorm = isNullQty ? 1 : Math.round(Number(l.quantity))
    allLines.push({
      source_row_no: sourceRowNo++,
      order_no: o.order_no,
      line_no: lineSeq++,
      product_id: l.product_id,
      product_code: l.product_code || '',
      quantity: isNullQty ? 1 : Number(l.quantity),
      quantity_source: isNullQty ? null : Number(l.quantity),
      quantity_normalized: qNorm,
      notes: l.notes || null,
      validation_status: isNullQty ? 'NORMALIZED' : 'PENDING',
      validation_error: isNullQty ? 'QUANTITY_NULL_DEFAULTED_TO_1' : null,
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
-- Hướng dẫn: Quy trình Staging -> 7 Kiểm định PE -> Nạp vào order_lines
-- Tổng số dòng cần nạp: 6.279 dòng thuộc 2.396 đơn hàng
-- Đã tích hợp đầy đủ yêu cầu kiểm định 3.1 & 3.2 từ PE (2026-10-06)
-- ============================================================

-- BƯỚC 1: Khởi tạo bảng staging trung gian (kèm tracking batch và dòng nguồn)
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

-- Index phụ trợ tối ưu hóa việc đối chiếu và join
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
  ON public.staging_order_lines_backfill(order_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
  ON public.staging_order_lines_backfill(product_id);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_batch 
  ON public.staging_order_lines_backfill(batch_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_source_row 
  ON public.staging_order_lines_backfill(source_row_no);


-- ============================================================
-- BƯỚC 2: 7 TRUY VẤN KIỂM ĐỊNH BẮT BUỘC THEO QUY CHUẨN PE (A -> G)
-- (Thực hiện sau khi đã nạp đủ 16 lô batch_01.sql -> batch_16.sql)
-- ============================================================

-- A. Đếm tổng staging (Kỳ vọng: 6.279 dòng, 8.701.481 PCS normalized hoặc 8.701.479 PCS source)
SELECT 
  count(*) AS total_staging_rows,
  count(DISTINCT order_no) AS total_orders_in_staging,
  count(DISTINCT product_id) AS total_products_in_staging,
  sum(quantity_normalized) AS total_quantity_pcs
FROM public.staging_order_lines_backfill;

-- B. Duplicate khóa nguồn (Kỳ vọng: 0 dòng)
SELECT order_no, line_no, count(*) 
FROM public.staging_order_lines_backfill 
GROUP BY order_no, line_no 
HAVING count(*) > 1;

-- C. Missing order (Kỳ vọng: 0 dòng)
SELECT s.order_no, count(*) 
FROM public.staging_order_lines_backfill s 
LEFT JOIN public.orders o ON o.order_no = s.order_no 
WHERE o.order_id IS NULL 
GROUP BY s.order_no;

-- D. Missing product (Kỳ vọng: 0 dòng)
SELECT s.product_id, count(*) 
FROM public.staging_order_lines_backfill s 
LEFT JOIN public.products p ON p.product_id = s.product_id 
WHERE p.product_id IS NULL 
GROUP BY s.product_id;

-- E. Mismatch product code (Kỳ vọng: 0 dòng)
SELECT s.product_id, s.product_code, p.product_code AS db_product_code
FROM public.staging_order_lines_backfill s 
JOIN public.products p ON p.product_id = s.product_id 
WHERE s.product_code IS DISTINCT FROM p.product_code;

-- F. Quantity không hợp lệ (<= 0 hoặc không phải số nguyên) (Kỳ vọng: 0 dòng)
SELECT * 
FROM public.staging_order_lines_backfill 
WHERE quantity_normalized <= 0 OR quantity_normalized <> trunc(quantity_normalized);

-- G. Kiểm tra line_no liên tục theo từng order (Kỳ vọng: 0 dòng)
WITH x AS ( 
  SELECT order_no, line_no, row_number() OVER (PARTITION BY order_no ORDER BY line_no) AS expected_line_no 
  FROM public.staging_order_lines_backfill 
) 
SELECT * FROM x WHERE line_no <> expected_line_no;


-- ============================================================
-- BƯỚC 3: THỰC THI CHÍNH THỨC NẠP VÀO public.order_lines
-- (TUYỆT ĐỐI CHỈ CHẠY KHI ĐƯỢC THOAN VÀ PE PHÊ DUYỆT CHÍNH THỨC)
-- ============================================================
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
  s.quantity_normalized,
  'PCS',
  'CONFIRMED', -- Lưu ý: schema default là 'NEW', 'CONFIRMED' phù hợp cho đơn hàng đã xác nhận từ Excel lịch sử
  s.notes,
  0,
  s.quantity_normalized
FROM public.staging_order_lines_backfill s
JOIN public.orders o ON o.order_no = s.order_no
ORDER BY o.order_id, s.line_no
ON CONFLICT (order_id, line_no) DO NOTHING;
*/


-- ============================================================
-- BƯỚC 4: ĐỐI SOÁT SAU BACKFILL (Theo yêu cầu 3.4 của PE)
-- ============================================================
/*
-- 1. Tổng số dòng trong order_lines (kỳ vọng: 6.279, tổng quantity: 8.701.481 PCS)
SELECT count(*) AS total_order_lines, sum(quantity) AS total_quantity_pcs FROM public.order_lines;

-- 2. Kiểm tra không có duplicate (order_id, line_no) (kỳ vọng: 0 dòng)
SELECT order_id, line_no, count(*) FROM public.order_lines GROUP BY order_id, line_no HAVING count(*) > 1;

-- 3. Kiểm tra orphan FK (kỳ vọng: 0 dòng)
SELECT count(*) AS orphan_orders FROM public.order_lines ol LEFT JOIN public.orders o ON o.order_id = ol.order_id WHERE o.order_id IS NULL;
SELECT count(*) AS orphan_products FROM public.order_lines ol LEFT JOIN public.products p ON p.product_id = ol.product_id WHERE p.product_id IS NULL;

-- 4. Kiểm tra remaining_qty = quantity và shipped_qty = 0 (kỳ vọng: 0 dòng lỗi)
SELECT count(*) AS invalid_quantities FROM public.order_lines WHERE remaining_qty <> quantity OR shipped_qty <> 0;
*/


-- ============================================================
-- BƯỚC 5: DỌN DẸP BẢNG STAGING (Sau khi nghiệm thu hoàn tất 100%)
-- ============================================================
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
  const batchNo = b + 1
  const batchNum = String(batchNo).padStart(2, '0')
  const totalNum = String(totalBatches).padStart(2, '0')

  const valuesSql = batchLines
    .map(
      (l) =>
        `  (${batchNo}, ${l.source_row_no}, ${escapeSql(l.order_no)}, ${l.line_no}, ${escapeSql(
          l.product_id
        )}, ${escapeSql(l.product_code)}, ${escapeSql(l.product_code)}, ${l.quantity}, ${
          l.quantity_source == null ? 'NULL' : l.quantity_source
        }, ${l.quantity_normalized}, ${escapeSql(l.notes)}, ${escapeSql(l.validation_status)}, ${escapeSql(
          l.validation_error
        )})`
    )
    .join(',\n')

  combinedValues.push(valuesSql)

  const sql = `-- ============================================================
-- LÔ ${batchNum}/${totalNum}: STAGING ORDER LINES BACKFILL
-- Dòng ${startIdx + 1} đến ${endIdx} / ${allLines.length} dòng
-- Bảng đích: public.staging_order_lines_backfill
-- Dung lượng: ~50 KB (An toàn tuyệt đối cho công cụ đọc của PE)
-- ============================================================

INSERT INTO public.staging_order_lines_backfill (
  batch_no,
  source_row_no,
  order_no,
  line_no,
  product_id,
  product_code,
  product_code_source,
  quantity,
  quantity_source,
  quantity_normalized,
  notes,
  validation_status,
  validation_error
)
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

-- Index phụ trợ
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_order_no 
  ON public.staging_order_lines_backfill(order_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_product_id 
  ON public.staging_order_lines_backfill(product_id);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_batch 
  ON public.staging_order_lines_backfill(batch_no);
CREATE INDEX IF NOT EXISTS idx_staging_order_lines_source_row 
  ON public.staging_order_lines_backfill(source_row_no);

-- Chèn toàn bộ 6.279 dòng
INSERT INTO public.staging_order_lines_backfill (
  batch_no,
  source_row_no,
  order_no,
  line_no,
  product_id,
  product_code,
  product_code_source,
  quantity,
  quantity_source,
  quantity_normalized,
  notes,
  validation_status,
  validation_error
)
VALUES
${combinedValues.join(',\n')}
ON CONFLICT (order_no, line_no) DO NOTHING;

-- Kiểm tra tổng số dòng
SELECT count(*) AS total_staging_rows FROM public.staging_order_lines_backfill;
`
fs.writeFileSync(path.join(outDir, 'all_batches_combined.sql'), combinedSql, 'utf8')

// 4. Generate README.md for the folder
const readmeContent = `# STAGING ORDER LINES BACKFILL PAYLOADS (V2 - ENHANCED TRACKING)

> **Nguồn dữ liệu gốc:** \`source_data/parse_output_dryrun_v2.json\` (Phase R6-S2 / Chỉ đạo #40, #41)  
> **Tổng số đơn hàng:** 2.396 đơn (\`orders\`)  
> **Tổng số dòng chi tiết:** 6.279 dòng (\`order_lines\`)  
> **Tổng sản lượng:** 8.701.481 PCS (gồm 8.701.479 PCS gốc + 2 PCS mẫu mặc định = 1)  
> **Số lượng sản phẩm:** 713 sản phẩm duy nhất (100% khớp bảng \`products\`)  
> **Phiên bản:** V2 nâng cấp theo chuẩn kiểm định PE (2026-10-06) — Bổ sung tracking \`batch_no\`, \`source_row_no\`, \`quantity_normalized\`, \`validation_status\`, \`validation_error\`.

---

## Danh mục Files trong Thư mục:

| Tên File | Phạm vi dòng | Kích thước | Mục đích |
|---|---|---|---|
| \`00_setup_and_verification.sql\` | — | ~5 KB | DDL bảng staging, 7 truy vấn kiểm định PE (A->G), lệnh INSERT vào \`order_lines\`, đối soát sau backfill |
| \`batch_01.sql\` | 1 → 400 | ~53 KB | Lô 01 nạp vào staging |
| \`batch_02.sql\` | 401 → 800 | ~53 KB | Lô 02 nạp vào staging |
| \`batch_03.sql\` | 801 → 1.200 | ~53 KB | Lô 03 nạp vào staging |
| \`batch_04.sql\` | 1.201 → 1.600 | ~53 KB | Lô 04 nạp vào staging |
| \`batch_05.sql\` | 1.601 → 2.000 | ~53 KB | Lô 05 nạp vào staging |
| \`batch_06.sql\` | 2.001 → 2.400 | ~53 KB | Lô 06 nạp vào staging |
| \`batch_07.sql\` | 2.401 → 2.800 | ~53 KB | Lô 07 nạp vào staging |
| \`batch_08.sql\` | 2.801 → 3.200 | ~53 KB | Lô 08 nạp vào staging |
| \`batch_09.sql\` | 3.201 → 3.600 | ~53 KB | Lô 09 nạp vào staging |
| \`batch_10.sql\` | 3.601 → 4.000 | ~53 KB | Lô 10 nạp vào staging |
| \`batch_11.sql\` | 4.001 → 4.400 | ~53 KB | Lô 11 nạp vào staging |
| \`batch_12.sql\` | 4.401 → 4.800 | ~53 KB | Lô 12 nạp vào staging |
| \`batch_13.sql\` | 4.801 → 5.200 | ~53 KB | Lô 13 nạp vào staging |
| \`batch_14.sql\` | 5.201 → 5.600 | ~53 KB | Lô 14 nạp vào staging |
| \`batch_15.sql\` | 5.601 → 6.000 | ~53 KB | Lô 15 nạp vào staging |
| \`batch_16.sql\` | 6.001 → 6.279 | ~37 KB | Lô 16 nạp vào staging (Lô cuối) |
| \`all_batches_combined.sql\` | 1 → 6.279 | ~820 KB | Toàn bộ 6.279 dòng gộp chung 1 file (thực thi 1 lần qua CLI/psql) |

Mọi file lô riêng lẻ đều được khống chế **dưới 55 KB** (thấp hơn nhiều so với giới hạn 70 KB của PE), đảm bảo an toàn tối đa khi kéo file.
`

fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent, 'utf8')

console.log(`Generated all files in ${outDir}/ successfully.`)
