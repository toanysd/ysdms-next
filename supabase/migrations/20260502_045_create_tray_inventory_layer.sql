-- Migration 045: Create Tray Inventory Layer
-- Purpose: Track physical stock of Trays (Products)

-- 1. Create the Transaction Table
CREATE TABLE IF NOT EXISTS public.tray_inventory_txn (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_type VARCHAR(20) NOT NULL CHECK (txn_type IN ('IN', 'OUT', 'ADJUST')),
    product_id UUID NOT NULL REFERENCES public.product_master(id) ON DELETE RESTRICT,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
    production_log_id UUID REFERENCES public.production_log(id) ON DELETE SET NULL,
    
    quantity INTEGER NOT NULL, 
    CONSTRAINT chk_quantity_nonzero CHECK (quantity != 0),
    CONSTRAINT chk_in_out_positive CHECK (
        txn_type = 'ADJUST' OR quantity > 0
    ),
    
    lot_no TEXT,
    txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
    operator_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_tray_inventory_txn_product ON public.tray_inventory_txn(product_id);
CREATE INDEX IF NOT EXISTS idx_tray_inventory_txn_order_item ON public.tray_inventory_txn(order_item_id);
CREATE INDEX IF NOT EXISTS idx_tray_inventory_txn_date ON public.tray_inventory_txn(txn_date);

-- 2. Create the Stock Summary View
-- Computes the current stock level per product
CREATE OR REPLACE VIEW public.tray_stock_summary AS
SELECT 
    t.product_id,
    p.code AS product_code,
    p.name AS product_name,
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
    t.product_id, p.code, p.name;

-- 3. Row Level Security (RLS)
ALTER TABLE public.tray_inventory_txn ENABLE ROW LEVEL SECURITY;

-- Write access for backend services
CREATE POLICY "Allow all operations for service_role on tray_inventory_txn"
ON public.tray_inventory_txn
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Read-only access for authenticated UI users
CREATE POLICY "Allow SELECT for authenticated on tray_inventory_txn"
ON public.tray_inventory_txn
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- 4. Create RPC for safe concurrent OUT transactions (Atomic Check & Insert)
CREATE OR REPLACE FUNCTION public.record_tray_out_safe(
    p_product_id UUID,
    p_order_item_id UUID,
    p_quantity INTEGER,
    p_lot_no TEXT DEFAULT NULL,
    p_operator_name TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INTEGER;
    v_inserted_id UUID;
BEGIN
    -- Validate quantity
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be positive';
    END IF;

    -- Lock the rows for this product_id to prevent race conditions
    -- Note: Since the view is an aggregate, we cannot lock the view directly.
    -- Instead, we compute stock with FOR UPDATE or just lock a specific dummy row.
    -- To ensure atomic constraint without a dedicated stock table, we can lock the product_master row.
    PERFORM id FROM public.product_master WHERE id = p_product_id FOR UPDATE;

    -- Calculate current stock
    SELECT COALESCE(
        SUM(
            CASE 
                WHEN txn_type = 'IN' THEN quantity 
                WHEN txn_type = 'OUT' THEN -quantity 
                WHEN txn_type = 'ADJUST' THEN quantity 
                ELSE 0 
            END
        ), 0
    ) INTO v_current_stock
    FROM public.tray_inventory_txn
    WHERE product_id = p_product_id;

    -- Check if stock is sufficient
    IF v_current_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock. Required: %, Available: %', p_quantity, v_current_stock;
    END IF;

    -- Insert the OUT transaction
    INSERT INTO public.tray_inventory_txn (
        txn_type,
        product_id,
        order_item_id,
        quantity,
        lot_no,
        operator_name,
        notes
    ) VALUES (
        'OUT',
        p_product_id,
        p_order_item_id,
        p_quantity,
        p_lot_no,
        p_operator_name,
        COALESCE(p_notes, 'Xuất kho giao hàng')
    ) RETURNING id INTO v_inserted_id;

    RETURN jsonb_build_object('success', true, 'txn_id', v_inserted_id);
END;
$$;
