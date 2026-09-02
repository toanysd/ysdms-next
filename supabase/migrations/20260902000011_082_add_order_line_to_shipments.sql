-- Migration 082: add_order_line_to_shipments
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS order_line_id UUID REFERENCES order_lines(line_id) ON DELETE SET NULL;
COMMENT ON COLUMN shipments.order_line_id IS 'FK tới order_lines — track shipment theo từng line item (nullable vì shipment cũ không có)';
