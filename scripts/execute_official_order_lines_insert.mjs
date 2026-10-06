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
  console.log(`============================================================`)
  console.log(`THỰC THI NẠP CHÍNH THỨC TỪ STAGING SANG public.order_lines`)
  console.log(`Thời gian: ${new Date().toISOString()}`)
  console.log(`Môi trường: Supabase Production (${envMap.NEXT_PUBLIC_SUPABASE_URL})`)
  console.log(`============================================================\n`)

  await client.connect()

  try {
    await client.query('BEGIN;')

    // 1. Preflight Audit
    console.log('[1] Preflight Audit...')
    const stagingCheck = await client.query('SELECT count(*) AS count FROM public.staging_order_lines_backfill;')
    const orderLinesCheck = await client.query('SELECT count(*) AS count FROM public.order_lines;')
    const stagingCount = parseInt(stagingCheck.rows[0].count, 10)
    const linesCount = parseInt(orderLinesCheck.rows[0].count, 10)

    if (stagingCount !== 6279) {
      throw new Error(`PREFLIGHT THẤT BẠI: staging có ${stagingCount} dòng (kỳ vọng 6279)`)
    }
    if (linesCount !== 0) {
      throw new Error(`PREFLIGHT THẤT BẠI: order_lines đang có ${linesCount} dòng (kỳ vọng 0)`)
    }
    console.log(`✅ Preflight đạt: staging = 6279, order_lines = 0.\n`)

    // 2. Insert thực thi (Fail-Closed, không dùng DO UPDATE)
    console.log('[2] Thực thi INSERT từ staging sang order_lines...')
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
    console.log(`✅ Đã insert thành công ${insertRes.rowCount} dòng.\n`)

    // 3. Postflight Audit
    console.log('[3] Postflight Audit...')
    const postCount = await client.query(`
      SELECT 
        count(*) AS total_lines, 
        sum(quantity) AS total_qty,
        count(DISTINCT order_id) AS distinct_orders,
        count(DISTINCT product_id) AS distinct_prods
      FROM public.order_lines;
    `)
    const row = postCount.rows[0]
    console.log(`- total_lines: ${row.total_lines} (Kỳ vọng: 6279)`)
    console.log(`- total_qty: ${Number(row.total_qty).toLocaleString()} PCS (Kỳ vọng: 8,701,481)`)
    console.log(`- distinct_orders: ${row.distinct_orders} (Kỳ vọng: 2396)`)
    console.log(`- distinct_prods: ${row.distinct_prods} (Kỳ vọng: 713)`)

    // Check duplicate
    const dupCheck = await client.query(`
      SELECT order_id, line_no, count(*) FROM public.order_lines GROUP BY order_id, line_no HAVING count(*) > 1;
    `)
    if (dupCheck.rowCount > 0) throw new Error(`POSTFLIGHT LỖI: Phát hiện ${dupCheck.rowCount} dòng duplicate!`)

    // Check orphan FK
    const orphanOrders = await client.query(`
      SELECT count(*) AS c FROM public.order_lines ol LEFT JOIN public.orders o ON o.order_id = ol.order_id WHERE o.order_id IS NULL;
    `)
    const orphanProds = await client.query(`
      SELECT count(*) AS c FROM public.order_lines ol LEFT JOIN public.products p ON p.product_id = ol.product_id WHERE p.product_id IS NULL;
    `)
    if (parseInt(orphanOrders.rows[0].c, 10) > 0 || parseInt(orphanProds.rows[0].c, 10) > 0) {
      throw new Error(`POSTFLIGHT LỖI: Phát hiện orphan foreign keys!`)
    }

    // Check integrity
    const integrityCheck = await client.query(`
      SELECT count(*) AS c FROM public.order_lines 
      WHERE remaining_qty <> quantity OR shipped_qty <> 0 OR line_status <> 'CONFIRMED' OR unit <> 'PCS';
    `)
    if (parseInt(integrityCheck.rows[0].c, 10) > 0) {
      throw new Error(`POSTFLIGHT LỖI: Phát hiện dòng không đạt trạng thái toàn vẹn!`)
    }

    console.log(`✅ Toàn bộ bài kiểm tra Postflight đạt 100%!\n`)
    await client.query('COMMIT;')
    console.log(`🎉 TRANSACTION ĐÃ COMMIT THÀNH CÔNG!`)
  } catch (err) {
    await client.query('ROLLBACK;')
    console.error('🚨 ĐÃ ROLLBACK TRANSACTION DO LỖI:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runOfficialInsert()
