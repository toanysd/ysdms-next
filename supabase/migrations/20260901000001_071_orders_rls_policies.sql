-- Migration 071: Add RLS Policies for orders

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_authenticated" ON orders
FOR SELECT TO authenticated USING (true);

CREATE POLICY "orders_modify_authenticated" ON orders
FOR ALL TO authenticated USING (true) WITH CHECK (true);
