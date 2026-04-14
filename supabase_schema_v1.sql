-- YSDMS Next-Gen: Data Blueprint V1
-- Vui lòng chạy toàn bộ Script này bên trong trình SQL Editor của màng hình Supabase.

-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- 1. MASTER DATA (DANH MỤC LÕI)
-- =========================================

-- Bảng vật liệu nhựa (Plastic Master)
CREATE TABLE public.plastic_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    family TEXT NOT NULL,
    thickness_mm NUMERIC NOT NULL,
    width_mm NUMERIC NOT NULL,
    color TEXT,
    grade TEXT,
    density_g_cm3 NUMERIC,
    reorder_point_kg NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Khóa gốc Khuôn kinh doanh (Mold Base)
CREATE TABLE public.mold_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- VD: JAE-001
    name TEXT,
    customer_code TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Thiết kế Khuôn (Mold Design Revision)
CREATE TABLE public.mold_design_revision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_base_id UUID NOT NULL REFERENCES public.mold_base(id) ON DELETE CASCADE,
    revision_code TEXT NOT NULL UNIQUE, -- VD: JAE-001-R02
    version_label TEXT NOT NULL, -- VD: R2
    approved_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Khuôn vật lý thực tế chạy máy (Physical Mold)
CREATE TABLE public.mold_physical (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID NOT NULL REFERENCES public.mold_design_revision(id),
    physical_code TEXT UNIQUE, -- VD: JAE-001-R02-A
    cavity INTEGER NOT NULL,
    storage_location TEXT, -- Giá Tầng kệ...
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, REPAIR, DISPOSED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Khay Sản phẩm (Product/Tray Master)
CREATE TABLE public.product_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    customer_code TEXT,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dao cắt (Cutter Master)
CREATE TABLE public.cutter_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    width_rule TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Máy đúc nhựa (Machine Master)
CREATE TABLE public.machine_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- VD: M08
    name TEXT NOT NULL, -- VD: 8号機
    process_type TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================
-- 2. BRIDGE & COMPATIBILITY LAYER
-- =========================================

-- Ánh xạ Sản phẩm (Khay) -> Bản Revision Thiết kế
CREATE TABLE public.product_mold_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.product_master(id) ON DELETE CASCADE,
    revision_id UUID NOT NULL REFERENCES public.mold_design_revision(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Định mức Khuôn-Nhựa BOM (Mold-Plastic BOM)
CREATE TABLE public.mold_plastic_bom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID NOT NULL REFERENCES public.mold_design_revision(id) ON DELETE CASCADE,
    plastic_id UUID NOT NULL REFERENCES public.plastic_master(id),
    actual_weight_grams NUMERIC NOT NULL,
    scrap_ratio NUMERIC DEFAULT 0,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Định mức Dao cắt (Mold-Cutter Config)
CREATE TABLE public.mold_cutter_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID NOT NULL REFERENCES public.mold_design_revision(id) ON DELETE CASCADE,
    cutter_id UUID NOT NULL REFERENCES public.cutter_master(id),
    setup_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================
-- 3. INVENTORY & WMS (KHO NHỰA)
-- =========================================

CREATE TABLE public.plastic_roll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plastic_id UUID NOT NULL REFERENCES public.plastic_master(id),
    qr_code TEXT UNIQUE NOT NULL,
    supplier_lot_no TEXT,
    gross_weight_kg NUMERIC NOT NULL,
    net_weight_kg NUMERIC NOT NULL,
    arrived_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'IN_STOCK' -- IN_STOCK, IN_USE, CONSUMED, SCRAP
);

CREATE TABLE public.inventory_txn (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_time TIMESTAMPTZ DEFAULT NOW(),
    txn_type TEXT NOT NULL, -- IN, OUT, ADJUST
    plastic_id UUID NOT NULL REFERENCES public.plastic_master(id),
    roll_id UUID REFERENCES public.plastic_roll(id),
    ref_vocher TEXT,
    qty_kg NUMERIC NOT NULL,
    remark TEXT
);


-- =========================================
-- 4. RLS & SECURITY (ROW-LEVEL SECURITY)
-- =========================================
-- Tạm thời cho phép Anonymous đọc ghi để quá trình Migration nội bộ diễn ra suôn sẻ
-- Sẽ thắt chặt lại bằng Authenticated RLS sau Giai đoạn Migration.

-- (Lệnh này yêu cầu bật RLS thủ công, có thể bỏ qua nếu muốn test cục bộ không cần policy).
