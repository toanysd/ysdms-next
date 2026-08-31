-- Thêm generated column normalize
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_code_normalized TEXT
  GENERATED ALWAYS AS (
    upper(regexp_replace(product_code, '[\s\-_]', '', 'g'))
  ) STORED;

-- Index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_products_code_normalized
  ON products (product_code_normalized);

-- Tương tự cho product_name_internal
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_name_normalized TEXT
  GENERATED ALWAYS AS (
    upper(regexp_replace(product_name_internal, '[\s\-_]', '', 'g'))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_products_name_normalized
  ON products (product_name_normalized);
