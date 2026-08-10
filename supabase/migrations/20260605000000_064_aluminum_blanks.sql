-- ==============================================================================
-- Aluminum Blanks Management
-- Added based on Kobayashi's process for A5052 and other materials
-- ==============================================================================

CREATE TABLE aluminum_blanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mold_id UUID REFERENCES physical_molds(physical_mold_id),
    blank_type TEXT DEFAULT '切板', -- '切板', '4F'
    material_grade TEXT DEFAULT 'A5052', -- 'A5052', 'A5056', etc.
    length_mm NUMERIC NOT NULL,
    width_mm NUMERIC NOT NULL,
    thickness_mm NUMERIC NOT NULL,
    status TEXT DEFAULT 'ORDERED', -- ORDERED, IN_STOCK, USED, SCRAPPED
    ordered_date DATE,
    received_date DATE,
    supplier_id UUID REFERENCES companies(company_id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE aluminum_blanks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for aluminum_blanks" ON aluminum_blanks FOR ALL USING (true) WITH CHECK (true);
