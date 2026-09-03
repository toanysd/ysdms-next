-- Migration 089: Relax production_lot_id NOT NULL and add work_order_id & roll_id to material_consumption_logs
ALTER TABLE material_consumption_logs 
  ADD COLUMN IF NOT EXISTS work_order_id uuid REFERENCES work_orders(wo_id),
  ADD COLUMN IF NOT EXISTS roll_id uuid REFERENCES plastic_receipt_roll(id),
  ALTER COLUMN production_lot_id DROP NOT NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mat_consumption_roll_id ON material_consumption_logs(roll_id);
CREATE INDEX IF NOT EXISTS idx_mat_consumption_wo_id ON material_consumption_logs(work_order_id);
