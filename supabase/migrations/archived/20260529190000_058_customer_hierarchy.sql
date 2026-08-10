-- Migration: Add customer_type for hierarchy
-- Description: Supports HQ, Branch, Delivery Site classification

ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS customer_type text DEFAULT 'hq' CHECK (customer_type IN ('hq', 'branch', 'delivery_site'));

-- Index to optimize parent-child lookups
CREATE INDEX IF NOT EXISTS idx_customers_parent_code ON public.customers(parent_code);
