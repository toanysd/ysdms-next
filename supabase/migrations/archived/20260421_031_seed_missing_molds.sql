-- ============================================================
-- MIGRATION 031: SEED MISSING MOLDS
-- Tự động tạo khuôn (base -> rev -> phys -> map) cho các sản phẩm chưa có khuôn
-- ============================================================

BEGIN;

DO $$ 
DECLARE
  v_prod record;
  v_base_id uuid;
  v_rev_id uuid;
  v_phys_id uuid;
  v_fallback_customer_id uuid;
BEGIN
  -- Lấy một customer_id bất kỳ làm fallback nếu product không có customer
  SELECT id INTO v_fallback_customer_id FROM public.customers LIMIT 1;

  FOR v_prod IN 
    SELECT pm.id, pm.code, c.id AS mapped_customer_id 
    FROM public.product_master pm
    LEFT JOIN public.customers c ON c.customer_code = pm.customer_code
    LEFT JOIN public.product_mold_map pmm ON pmm.product_id = pm.id
    WHERE pmm.id IS NULL
  LOOP
    v_base_id := gen_random_uuid();
    v_rev_id := gen_random_uuid();
    v_phys_id := gen_random_uuid();

    -- Insert Base
    INSERT INTO public.mold_base (id, code, name, customer_id, is_active)
    VALUES (
      v_base_id, 
      'BASE-' || v_prod.code, 
      'Khuôn gốc ' || v_prod.code, 
      COALESCE(v_prod.mapped_customer_id, v_fallback_customer_id), 
      true
    );

    -- Insert Revision
    INSERT INTO public.mold_design_revision (id, mold_base_id, revision_code, version_label)
    VALUES (
      v_rev_id, 
      v_base_id, 
      'REV-' || v_prod.code || '-R1', 
      'R1 (Auto-seeded)'
    );

    -- Insert Physical
    -- LƯU Ý 031-A: cavity = 4 là giá trị placeholder mặc định (Cần điền đúng thực tế theo từng khuôn sau này để tính tuổi thọ Shots chính xác)
    -- LƯU Ý 031-B: storage_location = 'Kệ Tự Động' là placeholder (Đảm bảo schema mold_physical không có constraint cứng nào ngăm cản gán string tự do này)
    INSERT INTO public.mold_physical (id, physical_code, revision_id, cavity, storage_location, status)
    VALUES (
      v_phys_id, 
      'PHYS-' || v_prod.code, 
      v_rev_id, 
      4, 
      'Kệ Tự Động', 
      'ACTIVE'
    );

    -- Insert Map
    INSERT INTO public.product_mold_map (id, product_id, revision_id, priority)
    VALUES (
      gen_random_uuid(), 
      v_prod.id, 
      v_rev_id, 
      1
    );

  END LOOP;
END $$;

COMMIT;
