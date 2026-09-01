-- Migration 071: Add RLS Policies for orders

-- Enable RLS (Should already be enabled by 070, but ensuring idempotency)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 1. Policy đọc (SELECT) cho authenticated users
CREATE POLICY "orders_select_authenticated" ON orders
FOR SELECT TO authenticated USING (true);

-- 2. Policy thay đổi (INSERT/UPDATE/DELETE) cho authenticated users
CREATE POLICY "orders_modify_authenticated" ON orders
FOR ALL TO authenticated USING (true) WITH CHECK (true);
