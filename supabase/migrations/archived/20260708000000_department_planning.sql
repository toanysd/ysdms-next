-- Create departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed departments
INSERT INTO departments (code, name) VALUES
('MOLDING', 'Định hình'),
('CUTTING', 'Cắt bế'),
('RECYCLING', 'Xay rác'),
('OFFICE', 'Văn phòng'),
('WAREHOUSE', 'Kho / Xuất hàng'),
('QC', 'Kiểm tra chất lượng');

-- Add department_id to jobs and job_steps
ALTER TABLE jobs ADD COLUMN department_id UUID REFERENCES departments(id);
ALTER TABLE job_steps ADD COLUMN department_id UUID REFERENCES departments(id);
