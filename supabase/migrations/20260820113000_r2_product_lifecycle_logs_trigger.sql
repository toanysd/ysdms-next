-- Migration: Phase R2-B Lifecycle Logs & Postgres Audit Trigger
-- Date: 2026-08-20
-- Author: Antigravity (AN) & Perplexity (PE)

-- 1. Bảng product_lifecycle_logs (Lưu vết 100% lịch sử vòng đời sản phẩm)
CREATE TABLE IF NOT EXISTS product_lifecycle_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  trigger_event TEXT NOT NULL, 
  -- 'PRODUCT_CREATED', 'DESIGN_SUBMITTED', 'DESIGN_APPROVED', 'SAMPLE_REQUESTED', 
  -- 'SAMPLE_APPROVED', 'MASS_PRODUCTION_RELEASED', 'MANUAL_OVERRIDE', 'DISCONTINUED', 'SYSTEM_UPDATE'
  reference_table TEXT,        -- 'design_approval_logs', 'sample_requests', 'orders', etc.
  reference_id UUID,           -- ID của bản ghi kích hoạt sự kiện
  changed_by UUID REFERENCES employees(employee_id),
  reason TEXT,                 -- Lý do chuyển trạng thái
  metadata JSONB,              -- Snapshot thông số kỹ thuật bổ sung
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Yêu cầu 1: reason bắt buộc NOT NULL khi trigger_event = 'MANUAL_OVERRIDE'
  CONSTRAINT chk_lifecycle_override_reason 
    CHECK (trigger_event <> 'MANUAL_OVERRIDE' OR (reason IS NOT NULL AND trim(reason) <> ''))
);

CREATE INDEX IF NOT EXISTS idx_product_lifecycle_logs_product ON product_lifecycle_logs(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_lifecycle_logs_event ON product_lifecycle_logs(trigger_event);

-- 2. Trigger Function ghi vết an toàn (Safety Net & Auto-Audit)
-- Yêu cầu 2: Lấy changed_by từ auth.uid() nếu có, fallback về NULL + ghi SYSTEM vào reason nếu không có session
CREATE OR REPLACE FUNCTION trg_product_lifecycle_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_emp_id UUID;
  v_recent_log_id UUID;
BEGIN
  IF OLD.product_lifecycle_status IS DISTINCT FROM NEW.product_lifecycle_status THEN
    -- Kiểm tra xem đã có log tương ứng được ghi từ Server Action trong vòng 2 giây vừa qua chưa (tránh trùng lặp log)
    SELECT log_id INTO v_recent_log_id
    FROM product_lifecycle_logs
    WHERE product_id = NEW.product_id
      AND to_status = NEW.product_lifecycle_status
      AND created_at >= (now() - interval '2 seconds')
    LIMIT 1;

    -- Nếu chưa có log rõ ràng từ Server Action (VD: do update trực tiếp bằng SQL/Script), Trigger sẽ tự động ghi log an toàn
    IF v_recent_log_id IS NULL THEN
      BEGIN
        v_user_id := auth.uid();
      EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
      END;

      IF v_user_id IS NOT NULL THEN
        SELECT employee_id INTO v_emp_id 
        FROM employees 
        WHERE employee_id = v_user_id 
        LIMIT 1;
      END IF;

      INSERT INTO product_lifecycle_logs (
        product_id,
        from_status,
        to_status,
        trigger_event,
        changed_by,
        reason
      ) VALUES (
        NEW.product_id,
        OLD.product_lifecycle_status,
        NEW.product_lifecycle_status,
        'SYSTEM_UPDATE',
        v_emp_id,
        'SYSTEM: Tự động cập nhật trạng thái sang ' || NEW.product_lifecycle_status
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_product_lifecycle_audit ON products;
CREATE TRIGGER trigger_product_lifecycle_audit
AFTER UPDATE OF product_lifecycle_status ON products
FOR EACH ROW
EXECUTE FUNCTION trg_product_lifecycle_audit();

-- 3. Enable RLS
ALTER TABLE product_lifecycle_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_read_pll ON product_lifecycle_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY p_ins_pll ON product_lifecycle_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_upd_pll ON product_lifecycle_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY p_del_pll ON product_lifecycle_logs FOR DELETE TO authenticated USING (true);
