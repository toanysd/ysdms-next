-- ====================================================================
-- Migration 094: Lock Shift to Day Only
-- Reference: Directive #M14-001 Addendum (PO Decision 2026-09-07)
-- Target: Set default shift = 'day', backfill all existing schedules
-- ====================================================================

ALTER TABLE public.production_schedules 
  ALTER COLUMN shift SET DEFAULT 'day';

UPDATE public.production_schedules 
  SET shift = 'day' 
WHERE shift = 'night' OR shift = 'NIGHT' OR shift IS NULL;
