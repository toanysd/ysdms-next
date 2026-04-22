-- Thêm cột office_qty (Số lượng gửi VP) vào bảng order_items
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS office_qty integer;

COMMENT ON COLUMN public.order_items.office_qty IS 'Số lượng gửi về văn phòng mẫu (Vd: YSD VP 2 pcs) cùng với đơn hàng chính';
