-- Migration: Add product_description column to products table
-- Purpose: Separate TrayInfoForMoldDesign (product description for KD/SX) from notes (free-form comments)
-- Date: 2026-08-03
-- Author: AI Agent (approved by user)

-- Step 1: Add new column
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS product_description TEXT;

-- Step 2: Copy TrayInfoForMoldDesign data from notes to product_description
-- Only for products that have notes content and no product_description yet
UPDATE products 
SET product_description = notes 
WHERE notes IS NOT NULL 
  AND TRIM(notes) != '' 
  AND (product_description IS NULL OR TRIM(product_description) = '');

-- Step 3: Clear TrayInfo from notes after copy
-- Set notes to NULL for products where notes was purely TrayInfo data (copied to product_description)
UPDATE products 
SET notes = NULL 
WHERE product_description IS NOT NULL 
  AND TRIM(product_description) != '' 
  AND notes = product_description;

-- Step 4: Add column comments for documentation
COMMENT ON COLUMN products.product_description IS 'Mô tả sản phẩm cho KD/SX (nguồn: TrayInfoForMoldDesign). Khác với notes (ghi chú tự do).';
COMMENT ON COLUMN products.notes IS 'Ghi chú tự do. KHÔNG dùng cho mô tả sản phẩm.';

-- Step 5: Enable RLS policy for new column (inherits existing table policies)
-- No additional RLS needed - column inherits table-level policies
