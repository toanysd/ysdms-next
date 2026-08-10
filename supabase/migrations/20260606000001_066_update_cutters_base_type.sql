-- Migration 066: Update cutters table for thermoforming dies
-- Adds base_type to support WOOD or ALUMINUM bases as requested by the client.

ALTER TABLE cutters
ADD COLUMN base_type TEXT;
