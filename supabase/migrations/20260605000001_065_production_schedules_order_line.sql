-- Migration 065: Add order_line_id to production_schedules to link plans to orders

ALTER TABLE production_schedules
ADD COLUMN order_line_id UUID REFERENCES order_lines(line_id);

-- Optional: Create an index for faster lookups when querying schedules by order
CREATE INDEX IF NOT EXISTS idx_production_schedules_order_line ON production_schedules(order_line_id);
