-- ==============================================================================
-- YSDMS NEXTGEN - COMPREHENSIVE CORE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS (Custom Types)
-- ==============================================================================
CREATE TYPE role_type AS ENUM (
    'CEO',                 -- Yoshida (代表取締役)
    'DIRECTOR',            -- Kobayashi (取締役)
    'DESIGN_LEAD',         -- Quan
    'ADMIN_ASSISTANT',     -- Sakurai, Arai
    'MOLD_MANAGER',        -- Toan, Yamaguchi
    'QC',                  -- Nakamura
    'PRODUCTION_MANAGER'   -- Taniguchi (Quản lý định hình, sản xuất)
);

CREATE TYPE mold_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'OUT_FOR_PLATING', 'DISPOSED', 'RETURNED');
CREATE TYPE mold_source AS ENUM ('INTERNAL', 'CUSTOMER_PROVIDED');
CREATE TYPE lifecycle_event_type AS ENUM ('PLATING', 'RETURN', 'DISPOSAL_IN_HOUSE', 'DISPOSAL_3RD_PARTY', 'REPAIR', 'SACT_QR_SCAN');
CREATE TYPE cutter_type AS ENUM ('A_ALUMINUM_BASE', 'B_NEW_ORDER', 'C_REUSE', 'D_PLUG_ONLY');
CREATE TYPE order_status AS ENUM ('DRAFT', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'SHIPPED', 'CANCELLED');
CREATE TYPE design_status AS ENUM ('PENDING', 'IN_PROGRESS', 'CUSTOMER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE job_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'QC_CHECK', 'COMPLETED', 'HALTED');

-- ==============================================================================
-- 2. MASTER DATA
-- ==============================================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    name_jp TEXT NOT NULL,
    name_romaji TEXT,
    email TEXT UNIQUE,
    role role_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_type TEXT NOT NULL, -- 'CUSTOMER', 'SUPPLIER', 'OUTSOURCE'
    code TEXT UNIQUE,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE company_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE factories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    location TEXT
);

CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES factories(id),
    machine_code TEXT NOT NULL UNIQUE,
    model TEXT,
    is_active BOOLEAN DEFAULT true
);

-- ==============================================================================
-- 3. PRODUCTS & MATERIALS
-- ==============================================================================

CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g., 'PP', 'PS'
    name TEXT NOT NULL,
    properties TEXT, -- e.g., 'Conductive', 'Anti-static'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE material_thicknesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id),
    thickness_mm NUMERIC NOT NULL,
    UNIQUE(material_id, thickness_mm)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES companies(id),
    product_code TEXT UNIQUE NOT NULL, -- Format: {client}-{seq}{variant}...
    name TEXT NOT NULL,
    material_id UUID REFERENCES materials(id),
    thickness_mm NUMERIC,
    sact_qr_code TEXT UNIQUE, -- Provided by customer
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. DESIGN & ENGINEERING
-- ==============================================================================

CREATE TABLE design_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    designer_id UUID REFERENCES employees(id), -- Quan
    tray_drawing_url TEXT,
    mold_drawing_url TEXT,
    plug_drawing_url TEXT,
    cutter_drawing_url TEXT,
    status design_status DEFAULT 'PENDING',
    approved_by UUID REFERENCES company_contacts(id), -- Customer approval
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cutter_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    category cutter_type NOT NULL,
    reference_cutter_id UUID, -- For type C_REUSE
    supplier_id UUID REFERENCES companies(id), -- For B_NEW_ORDER (Sato Nukigata)
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. PHYSICAL ASSETS (Molds & Cutters)
-- ==============================================================================

CREATE TABLE physical_molds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    mold_source mold_source DEFAULT 'INTERNAL',
    status mold_status DEFAULT 'ACTIVE',
    length_mm NUMERIC,
    width_mm NUMERIC,
    height_mm NUMERIC,
    weight_kg NUMERIC,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE physical_cutters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cutter_master_id UUID REFERENCES cutter_masters(id),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mold_lifecycle_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mold_id UUID REFERENCES physical_molds(id),
    event_type lifecycle_event_type NOT NULL,
    performed_by UUID REFERENCES employees(id), -- Toan, Yamaguchi, etc.
    target_company_id UUID REFERENCES companies(id), -- Plating company (Sunfloro) or Disposal 3rd party
    disposal_fee NUMERIC,
    certificate_url TEXT, -- For 3rd party disposal or return receipt
    notes TEXT,
    event_date TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. SALES & ORDERS
-- ==============================================================================

CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES companies(id),
    prepared_by UUID REFERENCES employees(id), -- Kobayashi
    total_amount NUMERIC,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES companies(id),
    quote_id UUID REFERENCES quotes(id),
    order_date DATE,
    requested_delivery_date DATE,
    status order_status DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sample_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    customer_feedback TEXT,
    is_approved BOOLEAN,
    submitted_date TIMESTAMPTZ DEFAULT now(),
    feedback_date TIMESTAMPTZ
);

-- ==============================================================================
-- 7. PRODUCTION
-- ==============================================================================

CREATE TABLE production_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_line_id UUID REFERENCES order_lines(id),
    machine_id UUID REFERENCES machines(id),
    planned_start_date TIMESTAMPTZ,
    planned_end_date TIMESTAMPTZ,
    assigned_by UUID REFERENCES employees(id), -- Sakurai/Arai
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE forming_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    machine_id UUID REFERENCES machines(id),
    heating_temp_c NUMERIC,
    cooling_time_s NUMERIC,
    vacuum_pressure NUMERIC,
    water_cooling_base_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_plan_id UUID REFERENCES production_plans(id),
    operator_id UUID REFERENCES employees(id),
    status job_status DEFAULT 'PLANNED',
    actual_quantity INTEGER,
    defect_quantity INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- ==============================================================================
-- 8. QUALITY CONTROL & ISO
-- ==============================================================================

CREATE TABLE tray_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    inspector_id UUID REFERENCES employees(id), -- Nakamura
    dic_162_data JSONB, -- Stores specific dimensional checks based on drawing
    is_passed BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE defect_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    reported_by UUID REFERENCES employees(id),
    defect_type TEXT, -- e.g., '嵌まり込み'
    root_cause TEXT,
    corrective_action TEXT,
    translated_vietnamese TEXT, -- Quan's translation for factory workers
    customer_informed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shipping_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_line_id UUID REFERENCES order_lines(id),
    shipped_by UUID REFERENCES employees(id), -- Yamaguchi
    certificate_file_url TEXT, -- 納品書兼検査票 (Sakurai)
    shipped_date TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_mold_status_on_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_type = 'PLATING' THEN
        UPDATE physical_molds SET status = 'OUT_FOR_PLATING' WHERE id = NEW.mold_id;
    ELSIF NEW.event_type = 'DISPOSAL_IN_HOUSE' OR NEW.event_type = 'DISPOSAL_3RD_PARTY' THEN
        UPDATE physical_molds SET status = 'DISPOSED' WHERE id = NEW.mold_id;
    ELSIF NEW.event_type = 'RETURN' THEN
        UPDATE physical_molds SET status = 'RETURNED' WHERE id = NEW.mold_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mold_lifecycle
AFTER INSERT ON mold_lifecycle_events
FOR EACH ROW
EXECUTE FUNCTION update_mold_status_on_lifecycle();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- End of schema
