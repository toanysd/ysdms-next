-- ==============================================================================
-- YSDMS NextGen - Schema V2 → V3 Migration (FIXED)
-- All RENAME operations use actual V2 column names and IF EXISTS guards
-- ==============================================================================

BEGIN;

-- ==========================================================================
-- [1] PRODUCTS: Rename + add columns
-- ==========================================================================
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='product_name_ja') THEN
        ALTER TABLE products RENAME COLUMN product_name_ja TO product_name;
    END IF;
END $$;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_name_internal TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS legacy_specs JSONB;

-- ==========================================================================
-- [2] COMPANIES + EMPLOYEES: Add legacy columns
-- ==========================================================================
ALTER TABLE companies ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS legacy_specs JSONB;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS legacy_id TEXT;

-- ==========================================================================
-- [3] MOLD_MASTERS: Absorb design_masters columns
-- ==========================================================================
ALTER TABLE mold_masters ADD COLUMN IF NOT EXISTS designer_id UUID REFERENCES employees(employee_id);
ALTER TABLE mold_masters ADD COLUMN IF NOT EXISTS cad_folder_path TEXT;
ALTER TABLE mold_masters ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE mold_masters ADD COLUMN IF NOT EXISTS legacy_specs JSONB;

-- ==========================================================================
-- [4] RENAME mold_designs → design_revisions
-- ==========================================================================

-- 4a. Drop FK constraints referencing mold_designs (use actual auto-generated names)
DO $$ 
DECLARE cname TEXT;
BEGIN
    -- Find and drop all FK constraints referencing mold_designs
    FOR cname IN 
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'mold_designs'
    LOOP
        EXECUTE 'ALTER TABLE ' || (
            SELECT tc2.table_name FROM information_schema.table_constraints tc2 
            WHERE tc2.constraint_name = cname AND tc2.constraint_type = 'FOREIGN KEY' LIMIT 1
        ) || ' DROP CONSTRAINT IF EXISTS ' || cname;
    END LOOP;
END $$;

-- 4b. Rename table
ALTER TABLE IF EXISTS mold_designs RENAME TO design_revisions;

-- 4c. Rename PK column: design_id → revision_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_id') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_id TO revision_id;
    END IF;
END $$;

-- 4d. Rename design_master_id → mold_master_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_master_id') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_master_id TO mold_master_id;
    END IF;
END $$;
-- Re-create FK to mold_masters
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='design_revisions_mold_master_id_fkey') THEN
        ALTER TABLE design_revisions ADD CONSTRAINT design_revisions_mold_master_id_fkey
            FOREIGN KEY (mold_master_id) REFERENCES mold_masters(mold_master_id);
    END IF;
END $$;

-- 4e. Rename technical columns (actual V2 names → V3 names)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='cutline_x_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN cutline_x_mm TO cutline_length;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='cutline_y_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN cutline_y_mm TO cutline_width;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='under_angle') THEN
        ALTER TABLE design_revisions RENAME COLUMN under_angle TO undercut_spec;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='piece_count') THEN
        ALTER TABLE design_revisions RENAME COLUMN piece_count TO cavity_count;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_length_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_length_mm TO design_length;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_width_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_width_mm TO design_width;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_height_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_height_mm TO design_height;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_depth_mm') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_depth_mm TO design_depth;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='mold_orientation') THEN
        ALTER TABLE design_revisions RENAME COLUMN mold_orientation TO orientation;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='mold_setup_type') THEN
        ALTER TABLE design_revisions RENAME COLUMN mold_setup_type TO setup_type;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='design_for_plastic_type') THEN
        ALTER TABLE design_revisions RENAME COLUMN design_for_plastic_type TO plastic_type_designed;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='company_tray_name') THEN
        ALTER TABLE design_revisions RENAME COLUMN company_tray_name TO customer_tray_name;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='company_drawing_no') THEN
        ALTER TABLE design_revisions RENAME COLUMN company_drawing_no TO customer_drawing_no;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='company_equipment_no') THEN
        ALTER TABLE design_revisions RENAME COLUMN company_equipment_no TO customer_equipment_no;
    END IF;
    -- Drop project_id column (design_projects being merged)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_revisions' AND column_name='project_id') THEN
        ALTER TABLE design_revisions DROP COLUMN project_id;
    END IF;
END $$;

-- 4f. Add new columns to design_revisions
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS revision_number INTEGER DEFAULT 0;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'APPROVED';
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS designer_id UUID REFERENCES employees(employee_id);
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS approved_date DATE;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS drawing_pdf_path TEXT;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS step_3d_path TEXT;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS tray_info TEXT;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS data_input_date TEXT;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS legacy_specs JSONB;

-- 4g. Re-create FK from mold_revisions.design_id → design_revisions.revision_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mold_revisions' AND column_name='design_id') THEN
        ALTER TABLE mold_revisions RENAME COLUMN design_id TO design_revision_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='mold_revisions_design_revision_id_fkey') THEN
        ALTER TABLE mold_revisions ADD CONSTRAINT mold_revisions_design_revision_id_fkey
            FOREIGN KEY (design_revision_id) REFERENCES design_revisions(revision_id);
    END IF;
END $$;

-- 4h. Re-create FK from cutters.mold_design_id → design_revisions.revision_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cutters' AND column_name='mold_design_id') THEN
        ALTER TABLE cutters RENAME COLUMN mold_design_id TO design_revision_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='cutters_design_revision_id_fkey') THEN
        ALTER TABLE cutters ADD CONSTRAINT cutters_design_revision_id_fkey
            FOREIGN KEY (design_revision_id) REFERENCES design_revisions(revision_id);
    END IF;
END $$;

-- 4i. Re-create FK from jobs.mold_design_id → design_revisions.revision_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='mold_design_id') THEN
        ALTER TABLE jobs RENAME COLUMN mold_design_id TO design_revision_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='jobs_design_revision_id_fkey') THEN
        ALTER TABLE jobs ADD CONSTRAINT jobs_design_revision_id_fkey
            FOREIGN KEY (design_revision_id) REFERENCES design_revisions(revision_id);
    END IF;
END $$;

-- 4j. mold_design_cutters junction table
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mold_design_cutters' AND column_name='design_id') THEN
        ALTER TABLE mold_design_cutters RENAME COLUMN design_id TO design_revision_id;
    END IF;
END $$;

-- ==========================================================================
-- [5] DROP design_masters + design_projects
-- ==========================================================================

-- Drop FK constraints referencing design_masters dynamically
DO $$ 
DECLARE cname TEXT; tname TEXT;
BEGIN
    FOR cname, tname IN 
        SELECT tc.constraint_name, tc.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'design_masters'
    LOOP
        EXECUTE 'ALTER TABLE ' || tname || ' DROP CONSTRAINT IF EXISTS ' || cname;
    END LOOP;
END $$;

-- cutter_masters: rename design_master_id → mold_master_id
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cutter_masters' AND column_name='design_master_id') THEN
        ALTER TABLE cutter_masters RENAME COLUMN design_master_id TO mold_master_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='cutter_masters_mold_master_id_fkey') THEN
        ALTER TABLE cutter_masters ADD CONSTRAINT cutter_masters_mold_master_id_fkey
            FOREIGN KEY (mold_master_id) REFERENCES mold_masters(mold_master_id);
    END IF;
END $$;

-- mold_masters: drop design_master_id (was FK to design_masters, now self-identity)
ALTER TABLE mold_masters DROP COLUMN IF EXISTS design_master_id;

-- Drop tables
DROP TABLE IF EXISTS design_projects CASCADE;
DROP TABLE IF EXISTS design_masters CASCADE;

-- ==========================================================================
-- [6] MOLD_REVISIONS + PHYSICAL_MOLDS: Legacy columns
-- ==========================================================================
ALTER TABLE mold_revisions ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE mold_revisions ADD COLUMN IF NOT EXISTS legacy_specs JSONB;
ALTER TABLE physical_molds ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE physical_molds ADD COLUMN IF NOT EXISTS legacy_specs JSONB;

-- ==========================================================================
-- [7] CUTTERS: Rename + legacy
-- ==========================================================================
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cutters' AND column_name='blade_count') THEN
        ALTER TABLE cutters RENAME COLUMN blade_count TO cavity_count;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cutters' AND column_name='manufacture_date') THEN
        ALTER TABLE cutters RENAME COLUMN manufacture_date TO made_date;
    END IF;
END $$;
ALTER TABLE cutters ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE cutters ADD COLUMN IF NOT EXISTS legacy_specs JSONB;
ALTER TABLE cutter_masters ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE cutter_masters ADD COLUMN IF NOT EXISTS legacy_specs JSONB;

-- ==========================================================================
-- [8] ORDERS: Business fields
-- ==========================================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_order_no TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_product_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mold_code_ref TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS legacy_id TEXT;

-- ==========================================================================
-- [9] RACKS + RACK_LAYERS: Legacy
-- ==========================================================================
ALTER TABLE racks ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE rack_layers ADD COLUMN IF NOT EXISTS legacy_id TEXT;

-- ==========================================================================
-- [10] JOBS: Planning columns
-- ==========================================================================
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ship_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS mold_deadline DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS has_plug BOOLEAN DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS mold_track_status TEXT DEFAULT 'NOT_STARTED';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS plug_track_status TEXT DEFAULT 'NOT_STARTED';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS overall_progress NUMERIC DEFAULT 0;

-- ==========================================================================
-- [11] JOB_STEPS: Planning columns
-- ==========================================================================
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS track TEXT;
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS machine_id UUID REFERENCES machines(machine_id);
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES employees(employee_id);
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS planned_start TIMESTAMPTZ;
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS planned_end TIMESTAMPTZ;
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS planned_hours NUMERIC(6,1);
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(6,1);
ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS is_overtime BOOLEAN DEFAULT false;

-- ==========================================================================
-- [12] NEW: standard_process_times
-- ==========================================================================
CREATE TABLE IF NOT EXISTS standard_process_times (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_code      TEXT UNIQUE NOT NULL,
    process_name_ja   TEXT NOT NULL,
    process_name_vi   TEXT,
    default_hours     NUMERIC(6,1) NOT NULL,
    default_hours_trial NUMERIC(6,1),
    machine_type_required TEXT,
    track             TEXT NOT NULL DEFAULT 'MOLD',
    sort_order        INTEGER NOT NULL DEFAULT 0,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT
);

INSERT INTO standard_process_times (process_code, process_name_ja, process_name_vi, default_hours, default_hours_trial, machine_type_required, track, sort_order) VALUES
    ('BACK_CAM',     '裏面演算',     'CAM mat sau',       2.0, 1.0, 'CAM_SOFTWARE', 'MOLD', 1),
    ('BACK_CNC',     '裏面加工',     'CNC mat sau',       4.0, 2.0, 'CNC_MOLD',     'MOLD', 2),
    ('FRONT_CAM',    '表面演算',     'CAM mat truoc',     2.0, 1.0, 'CAM_SOFTWARE', 'MOLD', 3),
    ('FRONT_CNC',    '表面加工',     'CNC mat truoc',     6.0, 3.0, 'CNC_MOLD',     'MOLD', 4),
    ('VACUUM_DRILL', '穴あけ',       'Khoan chan khong',  3.0, 0.5, 'MANUAL',       'MOLD', 5),
    ('POLISH',       'ミガキ',       'Danh bong',         2.5, 0.5, 'MANUAL',       'MOLD', 6),
    ('ULTRASONIC',   '超音波洗浄',   'Rua sieu am',       0.5, 0.5, 'ULTRASONIC',   'MOLD', 7),
    ('FINISH',       '仕上げ確認',   'Kiem tra hoan thien', 0.5, 0.3, 'MANUAL',     'FINISH', 8),
    ('PLUG_CNC',     'プラグ加工',   'CNC plug',          2.0, 1.0, 'CNC_PLUG',     'PLUG', 1),
    ('PLUG_BASE',    '台座製作',     'Che tao de plug',   1.0, 0.5, 'MANUAL',       'PLUG', 2),
    ('PLUG_FELT',    'ネル貼り',     'Dan felt',          4.0, 2.0, 'MANUAL',       'PLUG', 3)
ON CONFLICT (process_code) DO NOTHING;

-- ==========================================================================
-- [13] NEW: machine_schedules
-- ==========================================================================
CREATE TABLE IF NOT EXISTS machine_schedules (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id        UUID NOT NULL REFERENCES machines(machine_id),
    job_step_id       UUID REFERENCES job_steps(step_id),
    planned_start     TIMESTAMPTZ NOT NULL,
    planned_end       TIMESTAMPTZ NOT NULL,
    actual_start      TIMESTAMPTZ,
    actual_end        TIMESTAMPTZ,
    status            TEXT DEFAULT 'PLANNED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_machine_schedules_machine ON machine_schedules(machine_id);
CREATE INDEX IF NOT EXISTS idx_machine_schedules_dates ON machine_schedules(planned_start, planned_end);

COMMIT;
ALTER TABLE physical_molds ALTER COLUMN mold_revision_id DROP NOT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS legacy_id TEXT;
ALTER TABLE jobs ALTER COLUMN job_type_id DROP NOT NULL;
