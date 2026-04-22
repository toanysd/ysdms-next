-- ============================================================
-- MIGRATION 032: SEED MOLD MAINTENANCE SCHEDULES
-- Mục đích: Đổ dữ liệu định mức (Schedule) mặc định cho tất cả các khuôn
-- chưa có định mức bảo dưỡng định kỳ để View v_mold_health hoạt động đầy đủ.
-- ============================================================

BEGIN;

DO $$ 
DECLARE
  v_rev record;
BEGIN
  FOR v_rev IN 
    SELECT mdr.id
    FROM public.mold_design_revision mdr
    LEFT JOIN public.mold_maintenance_schedule ms ON ms.revision_id = mdr.id AND ms.is_active = true
    WHERE ms.id IS NULL
  LOOP
    INSERT INTO public.mold_maintenance_schedule (
      revision_id, 
      maintenance_type, 
      interval_shots, 
      alert_threshold_shots, 
      is_active
    ) VALUES (
      v_rev.id,
      'routine',
      1000000, -- Chu kỳ bảo dưỡng mặc định 1 triệu shots
      900000,  -- Báo động Vàng ở 900k shots (90%)
      true
    );
  END LOOP;
END $$;

COMMIT;
