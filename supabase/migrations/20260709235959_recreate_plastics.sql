-- 1. plastic_master
CREATE TABLE IF NOT EXISTS plastic_master (
    plastic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plastic_code TEXT UNIQUE NOT NULL, 
    material TEXT, 
    thickness_mm NUMERIC(5,2),
    width_mm INTEGER,
    color TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. plastic_receipt
CREATE TABLE IF NOT EXISTS plastic_receipt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_no TEXT UNIQUE NOT NULL,
    supplier_id UUID,
    receipt_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. plastic_receipt_roll
CREATE TABLE IF NOT EXISTS plastic_receipt_roll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_barcode TEXT UNIQUE NOT NULL,
    receipt_id UUID REFERENCES plastic_receipt(id),
    plastic_id UUID REFERENCES plastic_master(plastic_id),
    nominal_length_m NUMERIC(6,1) NOT NULL,
    received_length_m NUMERIC(6,1) NOT NULL,
    current_length_m NUMERIC(6,1) NOT NULL,
    status TEXT DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'in_use', 'empty', 'returned')),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. plastic_adjustment_log
CREATE TABLE IF NOT EXISTS plastic_adjustment_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_id UUID REFERENCES plastic_receipt_roll(id) NOT NULL,
    change_length_m NUMERIC(6,1) NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('PRODUCTION', 'ADJUSTMENT', 'RETURN')),
    work_log_id UUID,
    operator_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
