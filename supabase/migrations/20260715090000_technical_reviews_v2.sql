-- Update technical_reviews with versioning and approval tracking
ALTER TABLE technical_reviews
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1 NOT NULL,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'DRAFT' NOT NULL,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES employees(employee_id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS mold_option TEXT,
ADD COLUMN IF NOT EXISTS mold_id UUID REFERENCES physical_molds(mold_id),
ADD COLUMN IF NOT EXISTS design_revision_id UUID REFERENCES design_revisions(revision_id),
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(product_id),
ADD COLUMN IF NOT EXISTS machine_id UUID REFERENCES machines(machine_id),
ADD COLUMN IF NOT EXISTS cutting_die_option TEXT,
ADD COLUMN IF NOT EXISTS cutting_die_id UUID REFERENCES cutters(cutter_id);

-- Create index for quick lookups by business case
CREATE INDEX IF NOT EXISTS idx_tech_reviews_case_id ON technical_reviews(case_id);

-- Enable RLS if not already enabled
ALTER TABLE technical_reviews ENABLE ROW LEVEL SECURITY;

-- Base Policies (Complex validation will be handled via Server Actions)
-- 1. Everyone can read
CREATE POLICY "Allow read access for all authenticated users" 
ON technical_reviews FOR SELECT 
TO authenticated 
USING (true);

-- 2. Authenticated users can insert
CREATE POLICY "Allow insert for authenticated users" 
ON technical_reviews FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Authenticated users can update
CREATE POLICY "Allow update for authenticated users" 
ON technical_reviews FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Managers can delete (or nobody)
CREATE POLICY "Allow delete for managers" 
ON technical_reviews FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE employees.auth_user_id = auth.uid() 
    AND employees.department = 'MANAGEMENT'
  )
);
