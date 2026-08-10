-- Add first_shipment_date to products table
-- Source: jobs.ship_date (DeliveryDeadline from old system)
-- This denormalized column avoids expensive joins through design_revisions → jobs

ALTER TABLE products ADD COLUMN IF NOT EXISTS first_shipment_date DATE;

COMMENT ON COLUMN products.first_shipment_date IS '初回出荷日 — First shipment date (denormalized from jobs.ship_date via design_revisions)';
