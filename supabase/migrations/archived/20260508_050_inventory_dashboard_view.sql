-- =================================================================================
-- Migration 050: Enhanced Inventory Dashboard View
-- Purpose: Provide rich data for KPI dashboard with customer_name and item_type
-- =================================================================================

-- 1. Enhanced stock summary view with customer info
CREATE OR REPLACE VIEW public.tray_stock_summary AS
SELECT 
    t.product_id,
    p.code AS product_code,
    p.name AS product_name,
    p.customer_code,
    SUM(CASE WHEN t.txn_type = 'IN' THEN t.quantity ELSE 0 END) AS total_in,
    SUM(CASE WHEN t.txn_type = 'OUT' THEN t.quantity ELSE 0 END) AS total_out,
    SUM(CASE WHEN t.txn_type = 'ADJUST' THEN t.quantity ELSE 0 END) AS total_adjust,
    SUM(
        CASE 
            WHEN t.txn_type = 'IN' THEN t.quantity 
            WHEN t.txn_type = 'OUT' THEN -t.quantity 
            WHEN t.txn_type = 'ADJUST' THEN t.quantity 
            ELSE 0 
        END
    ) AS current_stock
FROM 
    public.tray_inventory_txn t
JOIN 
    public.product_master p ON t.product_id = p.id
GROUP BY 
    t.product_id, p.code, p.name, p.customer_code;

-- 2. Dashboard KPI function - returns all stats in one call
CREATE OR REPLACE FUNCTION public.get_inventory_dashboard_kpis()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_products INTEGER;
    v_total_stock BIGINT;
    v_today_in_count INTEGER;
    v_today_in_qty BIGINT;
    v_today_out_count INTEGER;
    v_today_out_qty BIGINT;
    v_top_customers JSONB;
BEGIN
    -- Total unique products in stock
    SELECT COUNT(DISTINCT product_id) INTO v_total_products
    FROM public.tray_inventory_txn;

    -- Total current stock (all products)
    SELECT COALESCE(SUM(
        CASE 
            WHEN txn_type = 'IN' THEN quantity 
            WHEN txn_type = 'OUT' THEN -quantity 
            WHEN txn_type = 'ADJUST' THEN quantity 
            ELSE 0 
        END
    ), 0) INTO v_total_stock
    FROM public.tray_inventory_txn;

    -- Today's IN transactions
    SELECT COUNT(*), COALESCE(SUM(quantity), 0) 
    INTO v_today_in_count, v_today_in_qty
    FROM public.tray_inventory_txn
    WHERE txn_type = 'IN' AND txn_date = CURRENT_DATE;

    -- Today's OUT transactions
    SELECT COUNT(*), COALESCE(SUM(quantity), 0) 
    INTO v_today_out_count, v_today_out_qty
    FROM public.tray_inventory_txn
    WHERE txn_type = 'OUT' AND txn_date = CURRENT_DATE;

    -- Top 5 customers by today's inbound quantity
    SELECT COALESCE(jsonb_agg(row_to_json(sub)), '[]'::jsonb)
    INTO v_top_customers
    FROM (
        SELECT 
            p.customer_code,
            COUNT(*) AS txn_count,
            SUM(t.quantity) AS total_qty
        FROM public.tray_inventory_txn t
        JOIN public.product_master p ON t.product_id = p.id
        WHERE t.txn_type = 'IN' AND t.txn_date = CURRENT_DATE
        AND p.customer_code IS NOT NULL AND p.customer_code != ''
        GROUP BY p.customer_code
        ORDER BY total_qty DESC
        LIMIT 5
    ) sub;

    RETURN jsonb_build_object(
        'total_products', v_total_products,
        'total_stock', v_total_stock,
        'today_in_count', v_today_in_count,
        'today_in_qty', v_today_in_qty,
        'today_out_count', v_today_out_count,
        'today_out_qty', v_today_out_qty,
        'top_customers', v_top_customers
    );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_inventory_dashboard_kpis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_inventory_dashboard_kpis() TO service_role;
