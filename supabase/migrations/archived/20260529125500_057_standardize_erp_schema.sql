-- =================================================================================
-- Migration 057: Standardize ERP Schema
-- 1. Standardize Customers (product_master, mold_base)
-- 2. Update dependent Views & Functions (tray_stock_summary, get_inventory_dashboard_kpis)
-- 3. Standardize Cutter Master PK to UUID
-- =================================================================================

BEGIN;

-- 1. Customers Standardization (product_master, mold_base)
ALTER TABLE public.product_master ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);
ALTER TABLE public.mold_base ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- Drop dependents of customer_code first
DROP VIEW IF EXISTS public.tray_stock_summary CASCADE;
DROP FUNCTION IF EXISTS public.get_inventory_dashboard_kpis() CASCADE;

-- Backfill product_master.customer_id directly from customers using customer_code
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_master' AND column_name = 'customer_code') THEN
    UPDATE public.product_master pm
    SET customer_id = c.id
    FROM public.customers c
    WHERE pm.customer_code = c.customer_code;
  END IF;
END $$;

-- Backfill product_master.customer_id from historical orders
UPDATE public.product_master pm 
SET customer_id = o.customer_id 
FROM public.order_items oi 
JOIN public.orders o ON o.id = oi.order_id 
WHERE oi.product_id = pm.id 
AND pm.customer_id IS NULL 
AND o.customer_id IS NOT NULL;

-- Backfill mold_base.customer_id from customers table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mold_base' AND column_name = 'customer_code') THEN
    UPDATE public.mold_base 
    SET customer_id = customers.id 
    FROM public.customers 
    WHERE public.mold_base.customer_code = customers.customer_code;
    
    ALTER TABLE public.mold_base DROP COLUMN customer_code;
  END IF;
END $$;

-- Backfill product_master.customer_id via product_mold_map and mold_base
UPDATE public.product_master pm
SET customer_id = mb.customer_id
FROM public.product_mold_map pmm
JOIN public.mold_base mb ON mb.id = pmm.mold_id
WHERE pmm.product_id = pm.id
AND pm.customer_id IS NULL
AND mb.customer_id IS NOT NULL;

-- Drop customer_code completely after data mappings
ALTER TABLE public.product_master DROP COLUMN IF EXISTS customer_code;

-- Recreate dependents with new customer_id linkage
CREATE OR REPLACE VIEW public.tray_stock_summary AS
SELECT 
    t.product_id,
    p.code AS product_code,
    p.name AS product_name,
    c.customer_code,
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
LEFT JOIN
    public.customers c ON p.customer_id = c.id
GROUP BY 
    t.product_id, p.code, p.name, c.customer_code;

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
            c.customer_code,
            COUNT(*) AS txn_count,
            SUM(t.quantity) AS total_qty
        FROM public.tray_inventory_txn t
        JOIN public.product_master p ON t.product_id = p.id
        JOIN public.customers c ON p.customer_id = c.id
        WHERE t.txn_type = 'IN' AND t.txn_date = CURRENT_DATE
        AND c.customer_code IS NOT NULL AND c.customer_code != ''
        GROUP BY c.customer_code
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

GRANT EXECUTE ON FUNCTION public.get_inventory_dashboard_kpis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_inventory_dashboard_kpis() TO service_role;

-- 2. Cutter Master Standardization (cutter_master)
-- Identify and drop dependent foreign keys
ALTER TABLE public.mold_cutter_config DROP CONSTRAINT IF EXISTS mold_cutter_config_cutter_id_fkey;
ALTER TABLE public.production_log DROP CONSTRAINT IF EXISTS production_log_cutter_id_fkey;

-- Drop primary key on cutter_master
ALTER TABLE public.cutter_master DROP CONSTRAINT IF EXISTS cutter_master_pkey CASCADE;

-- Convert cutter_master.id to UUID
ALTER TABLE public.cutter_master ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.cutter_master ALTER COLUMN id TYPE UUID USING (id::text::uuid);

-- Re-add PRIMARY KEY
ALTER TABLE public.cutter_master ADD PRIMARY KEY (id);

-- Convert referencing columns to UUID
ALTER TABLE public.mold_cutter_config ALTER COLUMN cutter_id TYPE UUID USING (cutter_id::text::uuid);
ALTER TABLE public.production_log ALTER COLUMN cutter_id TYPE UUID USING (cutter_id::text::uuid);

-- Re-add foreign keys
ALTER TABLE public.mold_cutter_config ADD CONSTRAINT mold_cutter_config_cutter_id_fkey FOREIGN KEY (cutter_id) REFERENCES public.cutter_master(id);
ALTER TABLE public.production_log ADD CONSTRAINT production_log_cutter_id_fkey FOREIGN KEY (cutter_id) REFERENCES public.cutter_master(id);

COMMIT;
