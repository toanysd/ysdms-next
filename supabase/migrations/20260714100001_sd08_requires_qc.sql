-- Add requires_qc boolean flag to production_orders to indicate if the order needs quality control
ALTER TABLE production_orders ADD COLUMN IF NOT EXISTS requires_qc BOOLEAN DEFAULT true;

-- Add a comment explaining the column
COMMENT ON COLUMN production_orders.requires_qc IS 'Flag indicating whether this production order requires QC inspection (initial, in_process, or final). Defaults to true.';
