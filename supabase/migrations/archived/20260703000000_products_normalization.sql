-- Migration: Chuẩn hóa bảng products Phase 2
-- Thêm product_description, đổi tên company_pn → customer_product_name

-- 1. Thêm product_description (mô tả SP cho chỉ thị SX)
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_description TEXT;

-- 2. Đổi tên company_pn → customer_product_name
-- company_pn dễ nhầm với tên công ty, thực tế là tên/mã SP từ khách hàng
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'company_pn'
  ) THEN
    ALTER TABLE products RENAME COLUMN company_pn TO customer_product_name;
  END IF;
END $$;

-- 3. Di chuyển TrayInfo từ notes → product_description (cho records có data)
-- Chỉ di chuyển nếu product_description trống (tránh ghi đè nếu chạy lại)
UPDATE products
SET product_description = notes,
    notes = NULL
WHERE notes IS NOT NULL
  AND notes != ''
  AND product_description IS NULL;

-- 4. Comment giải thích cột
COMMENT ON COLUMN products.product_description IS 'Mô tả sản phẩm cho chỉ thị sản xuất (TrayInfoForMoldDesign)';
COMMENT ON COLUMN products.customer_product_name IS 'Tên/mã sản phẩm do khách hàng đặt (CustomerTrayName)';
COMMENT ON COLUMN products.product_code IS 'Mã nội bộ YSD compact (bỏ gạch ngang, VD: ADY071)';
COMMENT ON COLUMN products.product_name_internal IS 'Tên nội bộ YSD hiển thị (giữ gạch ngang, VD: ADY-071)';
COMMENT ON COLUMN products.product_name IS 'Tên sản phẩm chính thức từ khách hàng (dùng cho hóa đơn, chứng từ)';
