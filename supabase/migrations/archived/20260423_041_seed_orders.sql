-- ============================================================
-- FILE : 20260423_041_seed_orders.sql
-- Phase 4B | Seed orders + order_items from Excel source
-- Generated : 2026-04-23 11:05 JST
-- Source    : source_data/YSDトレー受注一覧（改2）4-22.xlsx
-- Stats     : 0 orders | 0 items
--             no_product=0
--             no_mold   =0
--             no_customer=0
-- Idempotent: ON CONFLICT (slip_no) DO NOTHING (orders)
--             Line items use sub-SELECT on slip_no (safe re-run)
-- ============================================================

BEGIN;

-- ── SECTION 1: ORDER HEADERS ──────────────────────────────────

-- ── SECTION 2: ORDER ITEMS ──────────────────────────────────


-- ── END ───────────────────────────────────────────────────────
COMMIT;

-- POST-VERIFICATION:
-- SELECT COUNT(*) FROM orders;
-- SELECT COUNT(*) FROM order_items;
-- SELECT COUNT(*) FROM order_items WHERE product_id IS NULL;  -- unmapped
-- SELECT COUNT(*) FROM order_items WHERE mold_id    IS NULL;  -- no mold
--
-- END-TO-END CHECK:
-- SELECT o.slip_no, oi.product_pn_raw, pm.code, mb.code AS mold_code
-- FROM orders o
-- JOIN order_items oi ON oi.order_id = o.id
-- LEFT JOIN product_master pm ON pm.id = oi.product_id
-- LEFT JOIN mold_base mb      ON mb.id = oi.mold_id
-- LIMIT 10;
