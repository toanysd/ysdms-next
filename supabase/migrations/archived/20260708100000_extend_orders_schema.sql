-- Migration: Extend orders & order_lines for full production instruction support
-- Based on real Excel form analysis (IRI-001 K-16135T-01-01)
-- Date: 2026-07-08

-- 1. Add lot_no to orders (伝票 / LOT No.)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS lot_no TEXT;

-- 2. Add ship_date to order_lines (出荷日 - Ngày xuất, khác due_date = Ngày nhận)
ALTER TABLE order_lines ADD COLUMN IF NOT EXISTS ship_date DATE;

-- 3. Add packing_style to order_lines (荷姿 - Quy cách đóng gói)
ALTER TABLE order_lines ADD COLUMN IF NOT EXISTS packing_style TEXT;

-- 4. Add shipping_notes to order_lines (Ghi chú đặc biệt đóng gói/giao hàng)
ALTER TABLE order_lines ADD COLUMN IF NOT EXISTS shipping_notes TEXT;

-- Comments for documentation
COMMENT ON COLUMN orders.lot_no IS '伝票/LOT No. - Mã phiếu xuất hàng';
COMMENT ON COLUMN order_lines.ship_date IS '出荷日 - Ngày xuất hàng (dòng 1 trong ô 納期 của form Excel)';
COMMENT ON COLUMN order_lines.packing_style IS '荷姿 - Quy cách đóng gói';
COMMENT ON COLUMN order_lines.shipping_notes IS 'Ghi chú đặc biệt về đóng gói/giao hàng (VD: chia túi 10+5 riêng)';
