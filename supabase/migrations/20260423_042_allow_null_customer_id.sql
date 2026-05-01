-- Migration 042: Allow NULL on orders.customer_id
-- Lý do: Lệnh sản xuất nội bộ (lịch 2D) không gắn với 1 khách hàng cụ thể.
ALTER TABLE orders
  ALTER COLUMN customer_id DROP NOT NULL;
