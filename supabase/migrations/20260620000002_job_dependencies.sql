-- 20260620000002_job_dependencies.sql

-- Bổ sung trường Tiến độ và Kế hoạch gốc (Baseline) vào job_steps
ALTER TABLE job_steps 
ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS baseline_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS baseline_end TIMESTAMP WITH TIME ZONE;

-- Tạo bảng quản lý Ràng buộc công việc (Dependencies)
CREATE TABLE IF NOT EXISTS job_step_dependencies (
    dependency_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    predecessor_step_id UUID NOT NULL REFERENCES job_steps(step_id) ON DELETE CASCADE,
    successor_step_id UUID NOT NULL REFERENCES job_steps(step_id) ON DELETE CASCADE,
    dependency_type VARCHAR(10) DEFAULT 'FS' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_dependency UNIQUE (predecessor_step_id, successor_step_id),
    CONSTRAINT check_not_self CHECK (predecessor_step_id != successor_step_id)
);

-- Enable RLS
ALTER TABLE job_step_dependencies ENABLE ROW LEVEL SECURITY;

-- Cấp quyền truy cập cho người dùng đã đăng nhập
CREATE POLICY "Allow authenticated full access on job_step_dependencies" 
ON job_step_dependencies FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
