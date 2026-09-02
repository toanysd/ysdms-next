-- Migration 078: fix_public_rls_to_authenticated
-- Fix CRITICAL: jobs, job_steps, work_logs, employees, machines, companies, mold_work_orders, production_log, aluminum_blanks

-- 1. JOBS
DROP POLICY IF EXISTS "Allow all for jobs" ON jobs;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_jobs" ON jobs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. JOB_STEPS
DROP POLICY IF EXISTS "Allow all for job_steps" ON job_steps;
ALTER TABLE job_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_job_steps" ON job_steps
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. WORK_LOGS
DROP POLICY IF EXISTS "Allow all for work_logs" ON work_logs;
-- Policy "Enable ALL for authenticated" đã tốt, không cần tạo lại
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;

-- 4. EMPLOYEES
DROP POLICY IF EXISTS "Allow all for employees" ON employees;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_employees" ON employees
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. MACHINES
DROP POLICY IF EXISTS "Allow all for machines" ON machines;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_machines" ON machines
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. COMPANIES
DROP POLICY IF EXISTS "Allow all for companies" ON companies;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_companies" ON companies
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. MOLD_WORK_ORDERS
DROP POLICY IF EXISTS "authenticated_read_mwo"  ON mold_work_orders;
DROP POLICY IF EXISTS "authenticated_write_mwo" ON mold_work_orders;
ALTER TABLE mold_work_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_mold_work_orders" ON mold_work_orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. PRODUCTION_LOG
DROP POLICY IF EXISTS "production_log_all" ON production_log;
ALTER TABLE production_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_production_log" ON production_log
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. ALUMINUM_BLANKS
DROP POLICY IF EXISTS "Allow all operations for aluminum_blanks" ON aluminum_blanks;
ALTER TABLE aluminum_blanks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all_aluminum_blanks" ON aluminum_blanks
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
