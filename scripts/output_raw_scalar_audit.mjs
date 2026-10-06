import pg from 'pg'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const client = new pg.Client({
  connectionString: envMap.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function runAudit() {
  await client.connect()
  const sql = `
    SELECT json_build_object(
      'checked_at', NOW(),
      'database_host', 'iirezrszalmecsslbruo.supabase.co',
      'staging_rows', (SELECT count(*) FROM public.staging_order_lines_backfill),
      'order_lines_rows', (SELECT count(*) FROM public.order_lines),
      'staging_orders', (SELECT count(DISTINCT order_no) FROM public.staging_order_lines_backfill),
      'staging_products', (SELECT count(DISTINCT product_id) FROM public.staging_order_lines_backfill),
      'normalized_qty', (SELECT sum(quantity_normalized) FROM public.staging_order_lines_backfill),
      'source_qty', (SELECT sum(quantity_source) FROM public.staging_order_lines_backfill),
      'normalized_rows', (SELECT count(*) FROM public.staging_order_lines_backfill WHERE validation_status = 'NORMALIZED'),
      'duplicate_keys', (SELECT count(*) FROM (
        SELECT order_no, line_no FROM public.staging_order_lines_backfill GROUP BY order_no, line_no HAVING count(*) > 1
      ) dup),
      'missing_orders', (SELECT count(*) FROM public.staging_order_lines_backfill s LEFT JOIN public.orders o ON o.order_no = s.order_no WHERE o.order_id IS NULL),
      'missing_products', (SELECT count(*) FROM public.staging_order_lines_backfill s LEFT JOIN public.products p ON p.product_id = s.product_id WHERE p.product_id IS NULL),
      'product_code_mismatches', (SELECT count(*) FROM public.staging_order_lines_backfill s JOIN public.products p ON p.product_id = s.product_id WHERE s.product_code IS DISTINCT FROM p.product_code),
      'invalid_quantities', (SELECT count(*) FROM public.staging_order_lines_backfill WHERE quantity_normalized <= 0 OR quantity_normalized <> trunc(quantity_normalized)),
      'line_number_gaps', (SELECT count(*) FROM (
        SELECT order_no, line_no, row_number() OVER (PARTITION BY order_no ORDER BY line_no) AS expected_line_no FROM public.staging_order_lines_backfill
      ) x WHERE line_no <> expected_line_no)
    ) AS pe_audit_scalar_summary;
  `
  const res = await client.query(sql)
  console.log(JSON.stringify(res.rows[0].pe_audit_scalar_summary, null, 2))
  await client.end()
}

runAudit().catch(err => {
  console.error(err)
  process.exit(1)
})
