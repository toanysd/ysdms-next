-- ============================================================================
-- Migration: Add component-specific fields to job_steps
-- Purpose: Unify moldComponents + steps into a single concept.
--          job_steps = Job Components (thành phần của Job), NOT sequential steps.
--          For mold jobs: MOLD, PLUG, CUTTER, WATER_BASE, FRAME, PRESSURE_BASE
--          For other jobs: generic components that can be worked in parallel.
-- ============================================================================

-- 1. type_code: Component type identifier (MOLD, PLUG, CUTTER, WATER_BASE, FRAME, PRESSURE_BASE)
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS type_code TEXT;

-- 2. material_spec: Material specification (A5052, SKD11, ベニヤ木板...)
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS material_spec TEXT;

-- 3. quantity: Number of units (default 1)
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- 4. arrangement: 手配 — REQUIRED or NOT_REQUIRED
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS arrangement TEXT;

-- 5. condition: 新規 or 既存 — NEW or EXISTING
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS condition TEXT;

-- 6. manufacture_location: 内製 or 外注 — IN_HOUSE or OUTSOURCED
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS manufacture_location TEXT;

-- Add comments for documentation
COMMENT ON COLUMN job_steps.type_code IS 'Component type: MOLD, PLUG, CUTTER, WATER_BASE, FRAME, PRESSURE_BASE';
COMMENT ON COLUMN job_steps.material_spec IS 'Material specification: A5052, SKD11, ベニヤ木板';
COMMENT ON COLUMN job_steps.quantity IS 'Number of units for this component';
COMMENT ON COLUMN job_steps.arrangement IS 'Arrangement status: REQUIRED or NOT_REQUIRED (手配)';
COMMENT ON COLUMN job_steps.condition IS 'Condition: NEW or EXISTING (新規/既存)';
COMMENT ON COLUMN job_steps.manufacture_location IS 'Manufacturing location: IN_HOUSE or OUTSOURCED (内製/外注)';

-- Backfill existing job_steps with type_code from track field where available
UPDATE job_steps SET type_code = track WHERE track IS NOT NULL AND type_code IS NULL;
