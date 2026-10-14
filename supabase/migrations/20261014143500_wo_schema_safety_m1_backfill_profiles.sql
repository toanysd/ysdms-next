-- ============================================================================
-- WO-SCHEMA-SAFETY-FIX — Migration 1: Backfill missing rows in public.profiles
-- Approved by PE [2026-10-14 14:38 JST] (Payload v3)
-- ============================================================================

BEGIN;

INSERT INTO public.profiles (id, role)
SELECT u.id, 'sales'::text
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
