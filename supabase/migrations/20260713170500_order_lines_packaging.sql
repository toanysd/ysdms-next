-- Thêm phân loại mẫu thử vào order_lines (SD-04)
ALTER TABLE order_lines
  ADD COLUMN sample_type TEXT
  CHECK (sample_type IN ('FREE', 'QC_INSPECT', 'MACHINE_ADJUST', 'OFFICE', NULL));

-- Thêm quy cách đóng gói vào order_lines (SD-05)
ALTER TABLE order_lines
  ADD COLUMN box_type TEXT
    CHECK (box_type IN ('PLAIN', 'PRINTED', NULL)),
  ADD COLUMN bagging_required BOOLEAN DEFAULT false;
