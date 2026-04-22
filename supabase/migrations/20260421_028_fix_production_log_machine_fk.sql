-- ============================================================
-- MIGRATION 028: FIX PRODUCTION LOG MACHINE_ID
-- Bổ sung machine_instance_id vào production_log và nới lỏng machine_id cũ
-- ============================================================

-- 1. Bỏ Not Null cho machine_id (chỉ dùng cho dữ liệu cũ)
ALTER TABLE public.production_log
ALTER COLUMN machine_id DROP NOT NULL;

-- 2. Thêm cột mới để nối thẳng tới machine_instance (kiến trúc mới Phase 2)
ALTER TABLE public.production_log
ADD COLUMN IF NOT EXISTS machine_instance_id UUID
  REFERENCES public.machine_instance(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_production_log_machine_instance_id
  ON public.production_log(machine_instance_id);

-- ============================================================
-- 3. AUTO-SYNC TRIGGER (BACKWARD COMPATIBILITY)
-- Vì machine_instance không có khóa ngoại cứng sang machine_master,
-- ta map dựa trên TÊN MÃ (internal_code = code)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_sync_machine_master_from_instance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.machine_instance_id IS NOT NULL AND NEW.machine_id IS NULL THEN
    SELECT id INTO NEW.machine_id
    FROM public.machine_master
    WHERE code = (
      SELECT internal_code 
      FROM public.machine_instance 
      WHERE id = NEW.machine_instance_id 
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_machine_master ON public.production_log;
CREATE TRIGGER trg_sync_machine_master
  BEFORE INSERT ON public.production_log
  FOR EACH ROW
  EXECUTE FUNCTION fn_sync_machine_master_from_instance();

-- ============================================================
-- 4. DOCUMENTS / WARNINGS (SOFT LINK)
-- ============================================================
COMMENT ON COLUMN public.machine_instance.internal_code IS
  'PHẢI khớp với machine_master.code để trigger trg_sync_machine_master hoạt động. 
   Đây là soft link thay thế FK cứng. Ví dụ: M08, M12, M15.';

COMMENT ON COLUMN public.machine_master.code IS
  'Mã máy. PHẢI khớp với machine_instance.internal_code (convention bắt buộc).';

