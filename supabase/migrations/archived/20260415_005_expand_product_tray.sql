-- Migration 005: Expand product_master for Tray technical specifications
-- Data Source Reference: tray_instruction_data.xlsx

ALTER TABLE product_master
ADD COLUMN IF NOT EXISTS material VARCHAR(100), -- 材質 (e.g., PP(N), PS(CL))
ADD COLUMN IF NOT EXISTS thickness NUMERIC(10, 2), -- 厚み
ADD COLUMN IF NOT EXISTS sheet_width NUMERIC(10, 2), -- ｼｰﾄ巾
ADD COLUMN IF NOT EXISTS p_length NUMERIC(10, 2), -- 長手
ADD COLUMN IF NOT EXISTS p_width NUMERIC(10, 2), -- 短手
ADD COLUMN IF NOT EXISTS length_tol_upper NUMERIC(10, 2), -- 長手（交差上限）
ADD COLUMN IF NOT EXISTS length_tol_lower NUMERIC(10, 2), -- 長手（交差下限）
ADD COLUMN IF NOT EXISTS width_tol_upper NUMERIC(10, 2), -- 短手（交差上限）
ADD COLUMN IF NOT EXISTS width_tol_lower NUMERIC(10, 2), -- 短手（交差下限）
ADD COLUMN IF NOT EXISTS antistatic BOOLEAN DEFAULT false, -- 帯電
ADD COLUMN IF NOT EXISTS silicone BOOLEAN DEFAULT false, -- ｼﾘｺﾝ
ADD COLUMN IF NOT EXISTS coating BOOLEAN DEFAULT false, -- 塗布
ADD COLUMN IF NOT EXISTS quantity_per_box INTEGER, -- 入数
ADD COLUMN IF NOT EXISTS remarks TEXT; -- 備考

-- Create index for material as it might be used frequently for filtering
CREATE INDEX IF NOT EXISTS idx_product_master_material ON product_master(material);
