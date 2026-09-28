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

console.log(`Extracted ${allLines.length} candidate lines.`)

const BATCH_SIZE = 400
const totalBatches = Math.ceil(allLines.length / BATCH_SIZE)
const outDir = 'source_data/staging_batches'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

function escapeSql(str) {
  if (str == null) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

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

  const sql = `-- ============================================================
-- LÔ ${batchNum}/${totalNum}: STAGING ORDER LINES BACKFILL
-- Dòng ${startIdx + 1} đến ${endIdx} / ${allLines.length}
-- Bảng đích: public.staging_order_lines_backfill
-- ============================================================

${
  b === 0
    ? `-- 1. Khởi tạo bảng staging (chỉ chạy 1 lần ở Lô 01)
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
`
    : ''
}
-- 2. Chèn dữ liệu Lô ${batchNum} (${batchLines.length} dòng)
INSERT INTO public.staging_order_lines_backfill (order_no, line_no, product_id, product_code, quantity, notes)
VALUES
${valuesSql}
ON CONFLICT (order_no, line_no) DO NOTHING;

-- 3. Kiểm tra tiến độ tích lũy
SELECT count(*) AS total_staging_rows FROM public.staging_order_lines_backfill;
`

  fs.writeFileSync(path.join(outDir, `batch_${batchNum}.sql`), sql, 'utf8')
}

console.log(`Generated ${totalBatches} batch files in ${outDir}/`)
