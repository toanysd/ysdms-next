-- Migration 070: Add CHECK constraint to orders.order_status and set default to 'DRAFT'

-- 1. Change default value for new orders
ALTER TABLE orders ALTER COLUMN order_status SET DEFAULT 'DRAFT';

-- 2. Add CHECK constraint (includes all valid statuses moving forward, plus CONFIRMED to not break existing data)
ALTER TABLE orders ADD CONSTRAINT check_order_status 
CHECK (order_status IN ('DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED', 'CANCELLED'));

-- 3. We also check if RLS is enabled on orders, it should be, but let's make sure
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
