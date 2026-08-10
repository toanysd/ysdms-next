-- ==============================================================================
-- YSDMS NextGen - Complete Schema (70 tables)
-- Generated: 2026-06-04
-- Build Order: D7 Master -> D1 Order -> D3 Tooling -> D4 Material
--              -> D6 Planning -> D2 Production -> D5 Quality
--              -> D7b Job/Work -> Sys Support
-- ==============================================================================

-- ==============================================================================
-- CLEANUP: Move old non-omni tables to legacy_archive schema
-- Preserves all omni_* tables (OmniLinguist project)
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS legacy_archive;

DO $$
DECLARE
    row record;
BEGIN
    FOR row IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'omni_%'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(row.tablename) || ' CASCADE';
    END LOOP;
END;
$$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type') THEN
        CREATE TYPE asset_type AS ENUM ('MOLD', 'CUTTER', 'EQUIPMENT', 'TRAY_SAMPLE', 'PLUG');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_status') THEN
        CREATE TYPE equipment_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'BROKEN', 'DISPOSED');
    END IF;
END
$$;


-- ==========================================================================
-- D7: Master Data (13 tables)
-- ==========================================================================

-- 1. companies
CREATE TABLE companies (
    company_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_code      TEXT UNIQUE NOT NULL,
    company_name      TEXT NOT NULL,
    company_name_romaji TEXT,
    company_type      TEXT[],                   -- {CUSTOMER,SUPPLIER,OUTSOURCE,SUBCONTRACTOR}
    order_folder_path TEXT,
    cad_folder_path   TEXT,
    address           TEXT,
    tel               TEXT,
    fax               TEXT,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 2. mold_owners
CREATE TABLE mold_owners (
    owner_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    owner_code        TEXT UNIQUE NOT NULL,
    owner_name_ja     TEXT NOT NULL,
    owner_name_romaji TEXT,
    owner_name_kana   TEXT,




    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 3. company_contacts
CREATE TABLE company_contacts (
    contact_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    contact_name      TEXT NOT NULL,
    contact_role      TEXT,
    contact_email     TEXT,
    contact_tel       TEXT,
    is_primary        BOOLEAN DEFAULT false,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 4. delivery_sites
CREATE TABLE delivery_sites (
    site_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id       UUID NOT NULL REFERENCES companies(company_id),
    site_code         TEXT NOT NULL,
    site_name         TEXT NOT NULL,
    site_address      TEXT,
    site_tel          TEXT,
    site_fax          TEXT,
    delivery_notes    TEXT,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 5. employees
CREATE TABLE employees (
    employee_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code     TEXT UNIQUE NOT NULL,
    employee_name     TEXT NOT NULL,
    employee_name_short TEXT,
    company_id        UUID REFERENCES companies(company_id),
    department        TEXT,
    role              TEXT,
    order_code        TEXT,
    joining_date      DATE,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 6. destinations
CREATE TABLE destinations (
    destination_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_name  TEXT UNIQUE NOT NULL,
    destination_type  TEXT,
    is_active         BOOLEAN DEFAULT true
);

-- 7. machines
CREATE TABLE machines (
    machine_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_code      TEXT UNIQUE NOT NULL,
    machine_name      TEXT NOT NULL,
    machine_type      TEXT NOT NULL,
    manufacturer      TEXT,
    model             TEXT,
    max_mold_length   INTEGER,
    max_mold_width    INTEGER,
    max_sheet_width   INTEGER,
    location          TEXT,
    machine_group     TEXT,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 8. item_types (11 types: mold, cutter, plug, cooling base, etc.)
CREATE TABLE item_types (
    item_type_id      SERIAL PRIMARY KEY,
    item_type_code    TEXT UNIQUE NOT NULL,
    item_type_name_ja TEXT NOT NULL,
    item_type_name_vi TEXT
);

-- 9. cav_types (57 cavity specs)
CREATE TABLE cav_types (
    cav_type_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cav_code          TEXT UNIQUE NOT NULL,
    cav_series        TEXT,
    cav_length_mm     INTEGER NOT NULL,
    cav_width_mm      INTEGER NOT NULL,
    machine_group     TEXT NOT NULL,
    alias_cav_code    TEXT,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 10. machine_cav_compatibility
CREATE TABLE machine_cav_compatibility (
    compat_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id        UUID NOT NULL REFERENCES machines(machine_id),
    cav_type_id       UUID NOT NULL REFERENCES cav_types(cav_type_id),
    is_preferred      BOOLEAN DEFAULT false,
    notes             TEXT,
    UNIQUE(machine_id, cav_type_id)
);

-- 11. racks
CREATE TABLE racks (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rack_code         TEXT NOT NULL UNIQUE,
    rack_name         TEXT,
    location_in_factory TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 12. rack_layers
CREATE TABLE rack_layers (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rack_id           UUID REFERENCES racks(id) ON DELETE CASCADE,
    layer_number      INTEGER NOT NULL,
    layer_code        TEXT UNIQUE NOT NULL,
    notes             TEXT,
    UNIQUE (rack_id, layer_number)
);

-- 13. inventory_schedules (customer-specific annual inventory schedules)
CREATE TABLE inventory_schedules (
    schedule_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    schedule_type     TEXT,
    month_of_year     INTEGER,
    reminder_days     INTEGER DEFAULT 30,
    last_completed    TIMESTAMPTZ,
    next_due          DATE,
    assigned_to       UUID REFERENCES employees(employee_id),
    notes             TEXT,
    is_active         BOOLEAN DEFAULT true
);


-- ==========================================================================
-- D1: Order Management (7 tables)
-- ==========================================================================

-- 14. products (CENTER of system)
CREATE TABLE products (
    product_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code      TEXT UNIQUE NOT NULL,
    company_id       UUID NOT NULL REFERENCES companies(company_id),
    company_pn        TEXT,
    product_name_ja   TEXT,
    product_name_en   TEXT,
    pocket_count      INTEGER,
    pieces_per_box    INTEGER,
    box_spec          TEXT,
    mold_master_id    UUID,                    -- FK deferred (mold_masters created later)
    product_status    TEXT DEFAULT 'ACTIVE',
    date_entry        TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 15. product_material_specs
CREATE TABLE product_material_specs (
    spec_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id        UUID NOT NULL REFERENCES products(product_id),
    material_type     TEXT NOT NULL,
    material_grade    TEXT,
    thickness_mm      NUMERIC(4,2),
    sheet_width_mm    INTEGER,
    static_charge     TEXT,
    silicone          TEXT,
    coating           TEXT,
    component_name    TEXT DEFAULT 'MAIN',
    is_default        BOOLEAN DEFAULT true,
    handling_notes    TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, component_name)
);

-- 16. quotations
CREATE TABLE quotations (
    quotation_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_no      TEXT UNIQUE NOT NULL,
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    quote_date        DATE NOT NULL,
    valid_until       DATE,
    total_amount      NUMERIC(12,2),
    status            TEXT DEFAULT 'DRAFT',
    file_path         TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 17. orders
CREATE TABLE orders (
    order_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no          TEXT UNIQUE NOT NULL,
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    order_date        DATE NOT NULL,
    requested_delivery DATE,
    order_status      TEXT DEFAULT 'NEW',
    order_type        TEXT,
    company_po       TEXT,

    order_source      TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 18. order_lines
CREATE TABLE order_lines (
    line_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    line_no           INTEGER NOT NULL,
    product_id        UUID NOT NULL REFERENCES products(product_id),
    quantity          INTEGER NOT NULL,
    unit              TEXT DEFAULT 'PCS',
    due_date          DATE,
    delivery_site_id  UUID REFERENCES delivery_sites(site_id),
    material_spec_id  UUID REFERENCES product_material_specs(spec_id),
    line_status       TEXT DEFAULT 'NEW',
    priority          INTEGER DEFAULT 1,
    is_free_sample    BOOLEAN DEFAULT false,
    charge_type       TEXT,
    notes             TEXT,
    UNIQUE(order_id, line_no),
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 19. shipments
CREATE TABLE shipments (
    shipment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID REFERENCES orders(order_id),
    ship_date         DATE NOT NULL,
    delivery_site_id  UUID REFERENCES delivery_sites(site_id),
    shipped_by        UUID REFERENCES employees(employee_id),
    delivery_method   TEXT,
    tracking_no       TEXT,
    delivery_note_no  TEXT,
    invoice_no        TEXT,
    status            TEXT DEFAULT 'SHIPPED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 20. delivery_notes
CREATE TABLE delivery_notes (
    note_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id       UUID REFERENCES shipments(shipment_id),
    certificate_type  TEXT,
    issued_by         UUID REFERENCES employees(employee_id),
    issued_date       DATE,
    file_path         TEXT,
    company_confirmed BOOLEAN,
    confirmed_date    TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- D3: Tooling Management (25 tables)
-- ==========================================================================

-- --- Design (4 tables) ---

-- 21. design_masters
CREATE TABLE design_masters (
    design_master_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_master_code TEXT UNIQUE NOT NULL,
    design_master_name TEXT NOT NULL,
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    product_id        UUID REFERENCES products(product_id),
    active_revision_id UUID,                    -- FK deferred
    status            TEXT DEFAULT 'ACTIVE',
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 22. mold_designs
CREATE TABLE mold_designs (
    design_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_code       TEXT UNIQUE NOT NULL,
    design_master_id  UUID REFERENCES design_masters(design_master_id),
    company_id        UUID REFERENCES companies(company_id),
    cav_type_id       UUID REFERENCES cav_types(cav_type_id),
    design_length_mm  NUMERIC(6,1),
    design_width_mm   NUMERIC(6,1),
    design_height_mm  NUMERIC(6,1),
    design_depth_mm   NUMERIC(6,1),
    design_weight     TEXT,
    pocket_numbers    INTEGER,
    piece_count       INTEGER,
    pitch_mm          NUMERIC(6,1),
    cutline_x_mm      NUMERIC(6,1),
    cutline_y_mm      NUMERIC(6,1),
    corner_r          TEXT,
    chamfer_c         TEXT,
    mold_orientation  TEXT,
    mold_setup_type   TEXT,
    under_angle       TEXT,
    under_depth       TEXT,
    draft_angle       TEXT,
    has_plug          BOOLEAN DEFAULT false,
    has_separate_cutter BOOLEAN DEFAULT false,
    design_for_plastic_type TEXT,
    designer          TEXT,
    design_date       TIMESTAMPTZ,
    cad_folder_path   TEXT,
    company_drawing_no TEXT,
    company_equipment_no TEXT,
    company_tray_name TEXT,
    text_content      TEXT,
    version_note      TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 23. design_projects
CREATE TABLE design_projects (
    project_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code      TEXT UNIQUE NOT NULL,
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    designer_id       UUID REFERENCES employees(employee_id),
    design_id         UUID REFERENCES mold_designs(design_id),
    company_approval TEXT DEFAULT 'PENDING',
    approval_date     TIMESTAMPTZ,
    approval_contact  TEXT,
    cad_folder_path   TEXT,
    drawing_pdf_path  TEXT,
    step_3d_path      TEXT,
    project_status    TEXT DEFAULT 'IN_PROGRESS',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- --- Mold Physical (7 tables) ---

-- 24. mold_masters
CREATE TABLE mold_masters (
    mold_master_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_master_code  TEXT UNIQUE NOT NULL,
    mold_master_name  TEXT NOT NULL,
    design_master_id  UUID NOT NULL REFERENCES design_masters(design_master_id),
    company_id        UUID NOT NULL REFERENCES companies(company_id),
    product_id        UUID REFERENCES products(product_id),
    mold_class        TEXT DEFAULT 'STD',
    mold_source       TEXT DEFAULT 'INTERNAL',
    status            TEXT DEFAULT 'ACTIVE',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 25. mold_revisions
CREATE TABLE mold_revisions (
    revision_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_master_id    UUID NOT NULL REFERENCES mold_masters(mold_master_id),
    design_id         UUID REFERENCES mold_designs(design_id),
    revision_code     TEXT,
    revision_name     TEXT NOT NULL,
    revision_reason   TEXT,
    effective_date    TIMESTAMPTZ,
    is_active         BOOLEAN DEFAULT true,
    UNIQUE(mold_master_id, revision_code),
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 26. physical_molds
CREATE TABLE physical_molds (
    physical_mold_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_code       TEXT UNIQUE NOT NULL,
    display_name      TEXT NOT NULL,
    physical_stamp    TEXT,
    mold_revision_id  UUID NOT NULL REFERENCES mold_revisions(revision_id),
    cav_type_id       UUID REFERENCES cav_types(cav_type_id),
    actual_length_mm  TEXT,
    actual_width_mm   TEXT,
    actual_height_mm  TEXT,
    actual_weight     TEXT,
    current_rack_layer_id UUID REFERENCES rack_layers(id),
    keeper_company_id UUID REFERENCES companies(company_id),
    device_status     TEXT DEFAULT 'ACTIVE',
    usage_status      TEXT DEFAULT 'IN_STOCK',
    mold_entry_date   TIMESTAMPTZ,
    disposed_date     TIMESTAMPTZ,
    returned_date     TIMESTAMPTZ,
    copy_number       INTEGER DEFAULT 0,
    piece_count       INTEGER DEFAULT 1,
    mold_type         TEXT DEFAULT 'M',
    qr_uuid           UUID DEFAULT gen_random_uuid(),
    on_checklist      BOOLEAN DEFAULT false,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 27. mold_name_history
CREATE TABLE mold_name_history (
    history_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID NOT NULL REFERENCES physical_molds(physical_mold_id),
    old_system_code   TEXT,
    new_system_code   TEXT NOT NULL,
    old_physical_stamp TEXT,
    new_physical_stamp TEXT,
    change_reason     TEXT,
    changed_by        TEXT,
    changed_at        TIMESTAMPTZ DEFAULT now()
);

-- 28. mold_location_history
CREATE TABLE mold_location_history (
    location_log_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID NOT NULL REFERENCES physical_molds(physical_mold_id),
    old_rack_layer_id UUID REFERENCES rack_layers(id),
    new_rack_layer_id UUID REFERENCES rack_layers(id),
    moved_by          UUID REFERENCES employees(employee_id),
    moved_at          TIMESTAMPTZ DEFAULT now(),
    notes             TEXT
);

-- 29. mold_maintenance
CREATE TABLE mold_maintenance (
    maintenance_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID NOT NULL REFERENCES physical_molds(physical_mold_id),
    maintenance_type  TEXT NOT NULL,
    request_date      TIMESTAMPTZ,
    completed_date    TIMESTAMPTZ,
    vendor_id         UUID REFERENCES companies(company_id),
    employee_id       UUID REFERENCES employees(employee_id),
    reason            TEXT,
    result            TEXT,
    cost              NUMERIC(10,2),
    status            TEXT DEFAULT 'REQUESTED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 30. mold_measurements
CREATE TABLE mold_measurements (
    measurement_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_length_mm    NUMERIC(8,2),
    mold_width_mm     NUMERIC(8,2),
    mold_height_mm    NUMERIC(8,2),
    mold_weight_kg    NUMERIC(8,2),
    requested_by      TEXT,
    purpose           TEXT,
    measured_by       UUID REFERENCES employees(employee_id),
    measured_date     DATE,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- --- Mold Lifecycle (7 tables) ---

-- 31. mold_inventory_checks
CREATE TABLE mold_inventory_checks (
    check_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_code        TEXT UNIQUE NOT NULL,
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    check_type        TEXT,
    requested_by      TEXT,
    requested_date    DATE,
    deadline          DATE,
    total_molds       INTEGER,
    confirmed_count   INTEGER DEFAULT 0,
    missing_count     INTEGER DEFAULT 0,
    status            TEXT DEFAULT 'REQUESTED',
    completed_by      UUID REFERENCES employees(employee_id),
    completed_date    TIMESTAMPTZ,
    reported_date     TIMESTAMPTZ,
    report_file       TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 32. mold_inventory_items
CREATE TABLE mold_inventory_items (
    item_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id          UUID NOT NULL REFERENCES mold_inventory_checks(check_id) ON DELETE CASCADE,
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_code         TEXT,
    storage_location  TEXT,
    keeper_company_id UUID REFERENCES companies(company_id),
    is_confirmed      BOOLEAN DEFAULT false,
    confirmed_by      TEXT,
    confirmed_date    DATE,
    photo_path        TEXT,
    notes             TEXT
);

-- 33. mold_disposal_logs
CREATE TABLE mold_disposal_logs (
    disposal_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_code         TEXT,
    requested_by_company UUID REFERENCES companies(company_id),
    requested_date    DATE,
    disposal_no       TEXT,
    disposal_type     TEXT,
    permission_date   TIMESTAMPTZ,
    permission_by     TEXT,
    disposed_date     TIMESTAMPTZ,
    disposed_by       UUID REFERENCES employees(employee_id),
    disposal_fee      NUMERIC(10,2),
    photo_before      TEXT,
    photo_after       TEXT,
    certificate_no    TEXT,
    certificate_file  TEXT,
    certificate_sent  BOOLEAN DEFAULT false,
    registered_by     UUID REFERENCES employees(employee_id),
    registered_date   TIMESTAMPTZ,
    status            TEXT DEFAULT 'REQUESTED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 34. mold_return_logs
CREATE TABLE mold_return_logs (
    return_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_code         TEXT,
    requested_by_company UUID REFERENCES companies(company_id),
    requested_date    DATE,
    deadline          DATE,
    disposal_request_no TEXT,
    drawing_no        TEXT,
    prepared_by       UUID REFERENCES employees(employee_id),
    shipped_date      DATE,
    shipping_slip_no  TEXT,
    shipping_cost     NUMERIC(10,2),
    includes_parts    BOOLEAN DEFAULT false,
    includes_drawing  BOOLEAN DEFAULT false,
    includes_receipt  BOOLEAN DEFAULT false,
    status            TEXT DEFAULT 'REQUESTED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 35. mold_loan_certificates
CREATE TABLE mold_loan_certificates (
    certificate_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_no    TEXT UNIQUE,
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    requested_date    DATE,
    issued_date       DATE,
    issued_by         UUID REFERENCES employees(employee_id),
    prepared_by       UUID REFERENCES employees(employee_id),
    certificate_file  TEXT,
    status            TEXT DEFAULT 'DRAFT',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 36. asset_custody_certificates
CREATE TABLE asset_custody_certificates (
    certificate_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    requested_date    DATE,
    deadline          DATE,
    fiscal_year       INTEGER,
    issued_date       DATE,
    issued_by         UUID REFERENCES employees(employee_id),
    certificate_file  TEXT,
    status            TEXT DEFAULT 'REQUESTED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 37. certificate_items (polymorphic for loan + custody)
CREATE TABLE certificate_items (
    item_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id    UUID NOT NULL,
    certificate_type  TEXT NOT NULL,
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    asset_code        TEXT,
    asset_name        TEXT,
    storage_location  TEXT,
    keeper_company_id UUID REFERENCES companies(company_id),
    is_confirmed      BOOLEAN DEFAULT false,
    confirmed_date    DATE,
    photo_path        TEXT,
    notes             TEXT
);

-- --- Cutter, Plug, Auxiliary (5 tables) ---

-- 38. cutter_masters
CREATE TABLE cutter_masters (
    cutter_master_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cutter_master_code TEXT UNIQUE NOT NULL,
    cutter_master_name TEXT NOT NULL,
    design_master_id  UUID REFERENCES design_masters(design_master_id),
    company_id        UUID REFERENCES companies(company_id),
    status            TEXT DEFAULT 'ACTIVE',
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 39. cutters
CREATE TABLE cutters (
    cutter_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cutter_no         TEXT UNIQUE NOT NULL,
    cutter_name       TEXT NOT NULL,
    cutter_master_id  UUID REFERENCES cutter_masters(cutter_master_id),
    cutter_design_code TEXT,
    company_id        UUID REFERENCES companies(company_id),
    mold_design_id    UUID REFERENCES mold_designs(design_id),
    item_type_id      INTEGER REFERENCES item_types(item_type_id),
    blade_count       TEXT,
    pitch_mm          NUMERIC(6,1),
    cutter_length_mm  NUMERIC(6,1),
    cutter_width_mm   NUMERIC(6,1),
    cutter_height_mm  NUMERIC(6,1),
    cutter_type       TEXT,
    post_cut_length   NUMERIC(6,1),
    post_cut_width    NUMERIC(6,1),
    cutline_length    NUMERIC(6,1),
    cutline_width     NUMERIC(6,1),
    corner_r          TEXT,
    chamfer_c         TEXT,
    plastic_cut_type  TEXT,
    current_rack_layer_id UUID REFERENCES rack_layers(id),
    keeper_company_id UUID REFERENCES companies(company_id),
    storage_company_id UUID REFERENCES companies(company_id),
    usage_status      TEXT DEFAULT 'ACTIVE',
    cutter_presence   BOOLEAN DEFAULT true,
    date_entry        TIMESTAMPTZ,
    qr_uuid           UUID DEFAULT gen_random_uuid(),
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 40. mold_design_cutters (M:N junction)
CREATE TABLE mold_design_cutters (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cutter_id         UUID NOT NULL REFERENCES cutters(cutter_id),
    mold_design_id    UUID NOT NULL REFERENCES mold_designs(design_id),
    date_entry        TIMESTAMPTZ,
    notes             TEXT,
    UNIQUE(cutter_id, mold_design_id)
);

-- 41. plugs
CREATE TABLE plugs (
    plug_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plug_code         TEXT UNIQUE NOT NULL,
    plug_name         TEXT NOT NULL,
    mold_master_id    UUID REFERENCES mold_masters(mold_master_id),
    material          TEXT DEFAULT 'WOOD',
    current_rack_layer_id UUID REFERENCES rack_layers(id),
    status            TEXT DEFAULT 'ACTIVE',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 42. auxiliary_equipments
CREATE TABLE auxiliary_equipments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_code    TEXT UNIQUE NOT NULL,
    name              TEXT NOT NULL,
    item_type_id      INTEGER REFERENCES item_types(item_type_id),
    current_rack_layer_id UUID REFERENCES rack_layers(id),
    status            equipment_status DEFAULT 'ACTIVE',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- --- Cutter Orders ---

-- 43. cutter_orders
CREATE TABLE cutter_orders (
    order_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cutter_id         UUID REFERENCES cutters(cutter_id),
    product_code      TEXT,
    order_type        TEXT,
    design_file       TEXT,
    designed_by       UUID REFERENCES employees(employee_id),
    aluminum_base     BOOLEAN DEFAULT false,
    base_qty          INTEGER,
    base_completed    TIMESTAMPTZ,
    is_movable        BOOLEAN DEFAULT false,
    reuse_cutter_id   UUID REFERENCES cutters(cutter_id),
    supplier_id       UUID REFERENCES companies(company_id),
    ordered_by        UUID REFERENCES employees(employee_id),
    ordered_date      DATE,
    delivery_destination TEXT,
    estimated_delivery DATE,
    actual_delivery   DATE,
    status            TEXT DEFAULT 'DESIGNING',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- --- Location & Status Logs (3 tables) ---

-- 44. asset_location_logs (polymorphic for all asset types)
CREATE TABLE asset_location_logs (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type        asset_type NOT NULL,
    asset_id          UUID NOT NULL,
    old_rack_layer_id UUID REFERENCES rack_layers(id),
    new_rack_layer_id UUID REFERENCES rack_layers(id),
    moved_by          UUID REFERENCES employees(employee_id),
    notes             TEXT,
    moved_at          TIMESTAMPTZ DEFAULT now()
);

-- 45. equipment_status_logs
CREATE TABLE equipment_status_logs (
    log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    cutter_id         UUID REFERENCES cutters(cutter_id),
    item_type_id      INTEGER REFERENCES item_types(item_type_id),
    status            TEXT,
    destination_id    UUID REFERENCES destinations(destination_id),
    employee_id       UUID REFERENCES employees(employee_id),
    session_id        TEXT,
    session_name      TEXT,
    notes             TEXT,
    logged_at         TIMESTAMPTZ DEFAULT now()
);

-- 46. equipment_ship_logs
CREATE TABLE equipment_ship_logs (
    ship_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id        UUID REFERENCES companies(company_id),
    item_type_id      INTEGER REFERENCES item_types(item_type_id),
    ship_item_name    TEXT,
    ship_date         TIMESTAMPTZ,
    from_company_id   UUID REFERENCES companies(company_id),
    to_company_id     UUID REFERENCES companies(company_id),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    cutter_id         UUID REFERENCES cutters(cutter_id),
    ship_status       TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- D4: Material Management (5 tables)
-- ==========================================================================

-- 47. materials
CREATE TABLE materials (
    material_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_code     TEXT UNIQUE NOT NULL,
    material_type     TEXT NOT NULL,
    material_grade    TEXT,
    color             TEXT,
    thickness_mm      NUMERIC(4,2),
    width_mm          INTEGER,
    is_conductive     BOOLEAN DEFAULT false,
    is_antistatic     BOOLEAN DEFAULT false,
    conductivity_type TEXT,
    has_silicone      BOOLEAN DEFAULT false,
    manufacturer      TEXT,
    supplier_id       UUID REFERENCES companies(company_id),
    unit_price        NUMERIC(10,2),
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 48. material_inventory
CREATE TABLE material_inventory (
    inventory_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id       UUID NOT NULL REFERENCES materials(material_id),
    location          TEXT,
    quantity_rolls    INTEGER DEFAULT 0,
    quantity_meters   NUMERIC(10,2) DEFAULT 0,
    quantity_kg       NUMERIC(10,2) DEFAULT 0,
    last_counted      TIMESTAMPTZ,
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 49. material_transactions
CREATE TABLE material_transactions (
    transaction_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id       UUID NOT NULL REFERENCES materials(material_id),
    transaction_type  TEXT NOT NULL,
    quantity          NUMERIC(10,2),
    unit              TEXT,
    reference_id      UUID,
    reference_type    TEXT,
    employee_id       UUID REFERENCES employees(employee_id),
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 50. material_change_logs
CREATE TABLE material_change_logs (
    change_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id        UUID REFERENCES products(product_id),
    old_material_id   UUID REFERENCES materials(material_id),
    new_material_id   UUID REFERENCES materials(material_id),
    reason            TEXT,
    requires_mold_mod BOOLEAN DEFAULT false,
    requires_new_cutter BOOLEAN DEFAULT false,
    trial_job_id      UUID,
    status            TEXT DEFAULT 'PROPOSED',
    approved_by       TEXT,
    approved_date     TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 51. mold_material_bom
CREATE TABLE mold_material_bom (
    bom_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mold_master_id    UUID REFERENCES mold_masters(mold_master_id),
    material_id       UUID REFERENCES materials(material_id),
    quantity_per_shot NUMERIC(8,2),
    component_name    TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- D6: Planning (1 table)
-- ==========================================================================

-- 52. production_schedules (Day x Machine matrix)
CREATE TABLE production_schedules (
    schedule_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id        UUID NOT NULL REFERENCES machines(machine_id),
    schedule_date     DATE NOT NULL,
    product_id        UUID REFERENCES products(product_id),
    mold_id           UUID REFERENCES physical_molds(physical_mold_id),
    shift             TEXT DEFAULT 'DAY',
    planned_quantity  INTEGER,
    status            TEXT DEFAULT 'PLANNED',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE(machine_id, schedule_date, shift)
);


-- ==========================================================================
-- D2: Production (4 tables)
-- ==========================================================================

-- 53. production_orders
CREATE TABLE production_orders (
    po_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_code           TEXT UNIQUE NOT NULL,
    order_line_id     UUID REFERENCES order_lines(line_id),
    machine_id        UUID REFERENCES machines(machine_id),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    cutter_id         UUID REFERENCES cutters(cutter_id),
    planned_quantity  INTEGER,
    planned_start     TIMESTAMPTZ,
    planned_end       TIMESTAMPTZ,
    priority          INTEGER DEFAULT 1,
    material_type     TEXT,
    material_thickness NUMERIC(4,2),
    material_width    INTEGER,
    forming_location  TEXT,
    po_status         TEXT DEFAULT 'PLANNED',
    actual_quantity   INTEGER,
    actual_start      TIMESTAMPTZ,
    actual_end        TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 54. production_lots
CREATE TABLE production_lots (
    lot_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id             UUID NOT NULL REFERENCES production_orders(po_id),
    lot_no            TEXT NOT NULL,
    machine_id        UUID REFERENCES machines(machine_id),
    operator_id       UUID REFERENCES employees(employee_id),
    start_time        TIMESTAMPTZ,
    end_time          TIMESTAMPTZ,
    input_quantity    INTEGER,
    good_quantity     INTEGER,
    ng_quantity       INTEGER,
    scrap_quantity    INTEGER,
    lot_status        TEXT DEFAULT 'IN_PROGRESS',
    ship_date         DATE,
    package_spec      TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 55. forming_conditions (per machine x product)
CREATE TABLE forming_conditions (
    condition_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id        UUID NOT NULL REFERENCES machines(machine_id),
    product_id        UUID NOT NULL REFERENCES products(product_id),
    cav_type_id       UUID REFERENCES cav_types(cav_type_id),
    plug_used         BOOLEAN DEFAULT false,
    cooling_base_type TEXT,
    frame_type        TEXT,
    cutter_code       TEXT,
    stacking_upper    TEXT,
    stacking_lower    TEXT,
    heater_position   INTEGER,
    f2_heater_zones   JSONB,
    f3_timing         JSONB,
    f4_process        JSONB,
    f5_extra          JSONB,
    is_verified       BOOLEAN DEFAULT false,
    last_used_date    TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE(machine_id, product_id)
);

-- 56. production_logs
CREATE TABLE production_logs (
    log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id             UUID REFERENCES production_orders(po_id),
    lot_id            UUID REFERENCES production_lots(lot_id),
    machine_id        UUID REFERENCES machines(machine_id),
    operator_id       UUID REFERENCES employees(employee_id),
    log_date          DATE NOT NULL,
    start_time        TIMESTAMPTZ,
    end_time          TIMESTAMPTZ,
    output_quantity   INTEGER,
    defect_quantity   INTEGER,
    forming_params_json JSONB,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- D5: Quality (5 tables)
-- ==========================================================================

-- 57. tray_inspections
CREATE TABLE tray_inspections (
    inspection_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id            UUID,
    product_id        UUID REFERENCES products(product_id),
    inspection_type   TEXT NOT NULL,
    inspection_stage  TEXT,
    measurement_data  JSONB,
    tolerance_data    JSONB,
    pass_fail         TEXT,
    inspected_by      UUID REFERENCES employees(employee_id),
    inspected_date    DATE,
    certificate_type  TEXT,
    certificate_no    TEXT,
    certificate_file  TEXT,
    issued_by         UUID REFERENCES employees(employee_id),
    issued_date       DATE,
    company_approved BOOLEAN,
    company_approved_date TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 58. tray_samples
CREATE TABLE tray_samples (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id        UUID REFERENCES products(product_id),
    job_id            UUID,
    current_rack_layer_id UUID REFERENCES rack_layers(id),
    measured_weight_g NUMERIC,
    measurement_data  JSONB,
    is_approved       BOOLEAN DEFAULT false,
    taken_by          UUID REFERENCES employees(employee_id),
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 59. sample_submissions
CREATE TABLE sample_submissions (
    submission_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id            UUID,
    product_id        UUID REFERENCES products(product_id),
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    sample_type       TEXT,
    sample_quantity   INTEGER,
    office_quantity   INTEGER,
    free_quantity     INTEGER,
    materials_json    JSONB,
    shipped_date      DATE,
    delivery_company  TEXT,
    tracking_no       TEXT,
    company_result   TEXT DEFAULT 'PENDING',
    feedback_date     TIMESTAMPTZ,
    feedback_notes    TEXT,
    mass_production_hold BOOLEAN DEFAULT true,
    mass_production_released TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 60. defect_reports
CREATE TABLE defect_reports (
    report_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_code       TEXT UNIQUE NOT NULL,
    report_type       TEXT NOT NULL,
    severity          TEXT,
    product_id        UUID REFERENCES products(product_id),
    mold_code         TEXT,
    defect_type       TEXT,
    defect_description TEXT,
    root_cause        TEXT,
    root_cause_analysis TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    translated_language TEXT,
    translation_confirmed BOOLEAN DEFAULT false,
    translation_confirmed_by TEXT,
    reported_by       UUID REFERENCES employees(employee_id),
    reported_date     DATE,
    approved_by       UUID REFERENCES employees(employee_id),
    approved_date     TIMESTAMPTZ,
    company_notified BOOLEAN DEFAULT false,
    company_response TEXT,
    report_file       TEXT,
    status            TEXT DEFAULT 'DRAFT',
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 61. inspections (general QC for production lots)
CREATE TABLE inspections (
    inspection_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id             UUID REFERENCES production_orders(po_id),
    lot_id            UUID REFERENCES production_lots(lot_id),
    inspector_id      UUID REFERENCES employees(employee_id),
    inspection_date   DATE NOT NULL,
    result            TEXT,
    notes             TEXT,
    file_path         TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- D7b: Job & Work Management (6 tables)
-- ==========================================================================

-- 62. job_types
CREATE TABLE job_types (
    job_type_id       TEXT PRIMARY KEY,
    job_type_name_ja  TEXT NOT NULL,
    job_type_name_vi  TEXT NOT NULL,
    description       TEXT
);

-- 63. processing_items (21 machining process types)
CREATE TABLE processing_items (
    processing_item_id SERIAL PRIMARY KEY,
    item_name         TEXT UNIQUE NOT NULL,
    description       TEXT,
    notes             TEXT
);

-- 64. processing_statuses (13 statuses)
CREATE TABLE processing_statuses (
    status_id         SERIAL PRIMARY KEY,
    status_code       TEXT UNIQUE NOT NULL,
    status_name_vi    TEXT
);

-- 65. jobs
CREATE TABLE jobs (
    job_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_code          TEXT UNIQUE NOT NULL,
    job_name          TEXT NOT NULL,
    job_type_id       TEXT NOT NULL REFERENCES job_types(job_type_id),
    mold_master_id    UUID REFERENCES mold_masters(mold_master_id),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_design_id    UUID REFERENCES mold_designs(design_id),
    production_order_id UUID REFERENCES production_orders(po_id),
    company_id        UUID REFERENCES companies(company_id),
    responsible_id    UUID REFERENCES employees(employee_id),
    outsource_company UUID REFERENCES companies(company_id),
    start_date        TIMESTAMPTZ,
    deadline          TIMESTAMPTZ,
    completed_date    TIMESTAMPTZ,
    estimated_hours   NUMERIC(6,1),
    job_status        TEXT DEFAULT 'NEW',
    approved          BOOLEAN DEFAULT false,
    priority          INTEGER DEFAULT 5,
    year_period       INTEGER,
    month_period      INTEGER,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    updated_by        TEXT
);

-- 66. job_steps
CREATE TABLE job_steps (
    step_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id            UUID NOT NULL REFERENCES jobs(job_id),
    step_no           INTEGER NOT NULL,
    processing_item_id INTEGER REFERENCES processing_items(processing_item_id),
    processing_status_id INTEGER REFERENCES processing_statuses(status_id),
    step_name         TEXT NOT NULL,
    step_status       TEXT DEFAULT 'PENDING',
    deadline          TIMESTAMPTZ,
    estimated_hours   NUMERIC(6,1),
    outsource_company UUID REFERENCES companies(company_id),
    machining_location TEXT,
    set_info          TEXT,
    tehai_info        TEXT,
    drawing_receipt_date TIMESTAMPTZ,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE(job_id, step_no)
);

-- 67. work_logs
CREATE TABLE work_logs (
    log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_step_id       UUID REFERENCES job_steps(step_id),
    job_id            UUID NOT NULL REFERENCES jobs(job_id),
    employee_id       UUID NOT NULL REFERENCES employees(employee_id),
    company_id        UUID REFERENCES companies(company_id),
    work_date         DATE NOT NULL,
    hours_spent       NUMERIC(5,2),
    quantity_done     INTEGER,
    is_finished       BOOLEAN DEFAULT false,
    contact_content   TEXT,
    description       TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- Sys: System Support (3 tables)
-- ==========================================================================

-- 68. mold_photos
CREATE TABLE mold_photos (
    photo_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    photo_type        TEXT,
    file_path         TEXT NOT NULL,
    taken_by          UUID REFERENCES employees(employee_id),
    taken_date        DATE,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 69. mold_owner_qr_labels
CREATE TABLE mold_owner_qr_labels (
    label_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id),
    mold_owner_id     UUID REFERENCES mold_owners(owner_id),
    qr_code           TEXT,
    label_type        TEXT,
    applied_date      DATE,
    applied_by        UUID REFERENCES employees(employee_id),
    photo_path        TEXT,
    is_active         BOOLEAN DEFAULT true,
    notes             TEXT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- 70. audit_logs
CREATE TABLE audit_logs (
    log_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name        TEXT NOT NULL,
    record_id         UUID,
    action            TEXT NOT NULL,
    old_data          JSONB,
    new_data          JSONB,
    changed_by        UUID REFERENCES employees(employee_id),
    changed_at        TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================================
-- DEFERRED FOREIGN KEYS (circular references)
-- ==========================================================================

ALTER TABLE products
    ADD CONSTRAINT fk_products_mold_master
    FOREIGN KEY (mold_master_id) REFERENCES mold_masters(mold_master_id);

ALTER TABLE design_masters
    ADD CONSTRAINT fk_design_masters_active_revision
    FOREIGN KEY (active_revision_id) REFERENCES mold_revisions(revision_id);

ALTER TABLE material_change_logs
    ADD CONSTRAINT fk_material_change_trial_job
    FOREIGN KEY (trial_job_id) REFERENCES jobs(job_id);

ALTER TABLE tray_inspections
    ADD CONSTRAINT fk_tray_inspections_job
    FOREIGN KEY (job_id) REFERENCES jobs(job_id);

ALTER TABLE tray_samples
    ADD CONSTRAINT fk_tray_samples_job
    FOREIGN KEY (job_id) REFERENCES jobs(job_id);

ALTER TABLE sample_submissions
    ADD CONSTRAINT fk_sample_submissions_job
    FOREIGN KEY (job_id) REFERENCES jobs(job_id);


-- ==========================================================================
-- TRIGGERS & FUNCTIONS
-- ==========================================================================

CREATE OR REPLACE FUNCTION set_layer_code()
RETURNS TRIGGER AS $$
DECLARE
    r_code TEXT;
BEGIN
    IF NEW.layer_code IS NULL OR NEW.layer_code = '' THEN
        SELECT rack_code INTO r_code FROM racks WHERE id = NEW.rack_id;
        NEW.layer_code := r_code || '-L' || NEW.layer_number::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_layer_code
BEFORE INSERT OR UPDATE ON rack_layers
FOR EACH ROW
EXECUTE FUNCTION set_layer_code();


-- ==========================================================================
-- VERIFICATION
-- ==========================================================================
-- Expected: 70 tables (excluding omni_* tables)
-- Run: SELECT count(*) FROM information_schema.tables
--      WHERE table_schema = 'public' AND table_name NOT LIKE 'omni%';
