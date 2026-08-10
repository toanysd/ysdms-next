-- Migration: 20260422_033_atomic_maintenance_log.sql
-- Mục tiêu: Nguyên tử hóa thao tác ghi log + reset shot counter

CREATE OR REPLACE FUNCTION record_maintenance_and_reset(
  p_physical_id       UUID,
  p_performed_by      VARCHAR,
  p_maintenance_type  VARCHAR,
  p_action_taken      TEXT,
  p_cost              NUMERIC
) RETURNS void AS $$
DECLARE
  v_current_shots INT;
BEGIN
  -- Lock dòng để tránh race condition (an toàn trong context 1-dòng)
  SELECT total_shots INTO v_current_shots
  FROM mold_shot_counter
  WHERE mold_physical_id = p_physical_id
  FOR UPDATE;

  -- Guard: khuôn phải tồn tại trong bảng counter
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Khuôn % chưa có shot counter. Kiểm tra master data.', p_physical_id;
  END IF;

  -- Ghi log bảo trì với số shots tại thời điểm bảo trì
  INSERT INTO mold_maintenance_log (
    mold_physical_id, maintenance_date, performed_by,
    shots_at_maintenance, maintenance_type, action_taken, cost
  ) VALUES (
    p_physical_id, NOW(), p_performed_by,
    v_current_shots, p_maintenance_type, p_action_taken, p_cost
  );

  -- Reset bộ đếm về 0
  UPDATE mold_shot_counter
  SET total_shots = 0, last_updated = NOW()
  WHERE mold_physical_id = p_physical_id;

END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Cấp quyền cho user đăng nhập qua Supabase Auth
GRANT EXECUTE ON FUNCTION record_maintenance_and_reset(
  UUID, VARCHAR, VARCHAR, TEXT, NUMERIC
) TO authenticated;

REVOKE EXECUTE ON FUNCTION record_maintenance_and_reset(
  UUID, VARCHAR, VARCHAR, TEXT, NUMERIC
) FROM anon;
