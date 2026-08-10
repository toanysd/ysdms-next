-- 1. plastic_master
CREATE TABLE plastic_master (
    plastic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plastic_code TEXT UNIQUE NOT NULL, -- e.g. PS-1.0-640-BLK-C
    plastic_family TEXT NOT NULL, -- PS, PP, PET, PVC, OTHER
    plastic_subtype TEXT, -- A-PET, PST
    thickness_mm NUMERIC(5,2) NOT NULL,
    width_mm INTEGER NOT NULL,
    standard_length_m NUMERIC(6,1),
    color_code_raw TEXT, -- N, CL, G, B, W, 導電, etc
    color_name_normalized TEXT, -- natural, clear, gray, black, white, green, blue, brown, unknown
    electrical_property TEXT, -- normal, conductive, antistatic, unknown
    silicone_status_normalized TEXT, -- silicone_free, with_silicone, unknown
    additive_flags TEXT,
    additive_text_raw TEXT,
    appearance_text_raw TEXT,
    status_review TEXT DEFAULT 'draft',
    remarks_raw TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. suppliers
CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code TEXT UNIQUE NOT NULL,
    supplier_name TEXT NOT NULL,
    short_name TEXT,
    contact_info TEXT,
    is_active BOOLEAN DEFAULT true,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. plastic_manufacturer_map
CREATE TABLE plastic_manufacturer_map (
    map_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    commercial_grade_code TEXT NOT NULL,
    plastic_id UUID REFERENCES plastic_master(plastic_id) ON DELETE SET NULL,
    mapping_status TEXT DEFAULT 'needs_confirmation',
    specific_gravity_kg_m3 NUMERIC(6,2),
    price_jpy_per_kg NUMERIC(10,2),
    note TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(supplier_id, commercial_grade_code)
);

-- 4. Add plastic_id to design_revisions
ALTER TABLE design_revisions ADD COLUMN plastic_id UUID REFERENCES plastic_master(plastic_id) ON DELETE SET NULL;
