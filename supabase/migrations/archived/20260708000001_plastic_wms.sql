-- Create plastic_receipt
CREATE TABLE plastic_receipt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_no TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(supplier_id),
    receipt_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create plastic_receipt_roll
CREATE TABLE plastic_receipt_roll (
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

-- Create plastic_adjustment_log
CREATE TABLE plastic_adjustment_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_id UUID REFERENCES plastic_receipt_roll(id) NOT NULL,
    change_length_m NUMERIC(6,1) NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('PRODUCTION', 'ADJUSTMENT', 'RETURN')),
    work_log_id UUID REFERENCES work_logs(id),
    operator_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
