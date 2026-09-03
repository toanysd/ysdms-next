-- Migration 087: Add partial delivery tracking columns to order_lines
-- Supports partial delivery lifecycle: tracking cumulative shipped quantity and remaining quantity

ALTER TABLE order_lines
  ADD COLUMN IF NOT EXISTS shipped_qty NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_qty NUMERIC;

-- For any existing rows, initialize remaining_qty to quantity - shipped_qty
UPDATE order_lines 
SET remaining_qty = quantity - COALESCE(shipped_qty, 0)
WHERE remaining_qty IS NULL;

-- Add index on order_id and line_status for fast lookup
CREATE INDEX IF NOT EXISTS idx_order_lines_order_status ON order_lines (order_id, line_status);
