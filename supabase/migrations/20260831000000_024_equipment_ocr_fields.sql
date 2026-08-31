ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS shared_with_code  text  NULL,
  ADD COLUMN IF NOT EXISTS shared_note       text  NULL,
  ADD COLUMN IF NOT EXISTS cost_note         text  NULL;

COMMENT ON COLUMN equipment.shared_with_code IS
  'Mã thiết bị (equipment_code) dùng chung dao cắt. VD: JAE-381';
COMMENT ON COLUMN equipment.shared_note IS
  'Ghi chú viết tay trên chỉ thị về dao cắt dùng chung. VD: JAE-381と同じ';
COMMENT ON COLUMN equipment.cost_note IS
  'Ghi chú đơn giá đặc biệt không phải số. VD: 金型のみ, 見積なし';
