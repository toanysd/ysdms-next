-- Add recipient_name to allow dynamic contact person per order
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS recipient_name text;

-- Provide a comment
COMMENT ON COLUMN public.orders.recipient_name IS 'Tên người nhận hàng cụ thể cho đơn hàng này (tự động lấy Default từ customer.contact_person nhưng cho phép User sửa tự do)';
