import psycopg2
import json
import re
import sys
import hashlib
from datetime import datetime, date
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

ENV_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local'
PAYLOAD_FILE = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\preflight_b1_verification.json'

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

with open(PAYLOAD_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

step_items = data['step_mapping_table']
log_items = data['work_log_mapping_table']
file_sha256 = data['preflight_metadata']['source_file_sha256']

print(f"Loaded {len(step_items)} steps and {len(log_items)} work logs for Staging B1.")
print(f"Source file SHA-256: {file_sha256}")

pg_conn = psycopg2.connect(db_url)
pg_cur = pg_conn.cursor(cursor_factory=RealDictCursor)

# 1. Check baseline before
pg_cur.execute("SELECT count(*) as c FROM jobs")
jobs_before = pg_cur.fetchone()['c']

pg_cur.execute("SELECT count(*) as c FROM job_steps")
steps_before = pg_cur.fetchone()['c']

pg_cur.execute("SELECT count(*) as c FROM work_logs")
logs_before = pg_cur.fetchone()['c']

print(f"\n[Baseline Before]: jobs={jobs_before}, job_steps={steps_before}, work_logs={logs_before}")
assert jobs_before == 1205, f"Unexpected jobs count {jobs_before}"
assert steps_before == 2451, f"Unexpected job_steps count {steps_before}"
assert logs_before == 7106, f"Unexpected work_logs count {logs_before}"

# 2. Create staging table
print("\n[Creating Staging Table public.staging_access_delta_b1]...")
create_table_sql = """
CREATE TABLE IF NOT EXISTS public.staging_access_delta_b1 (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table TEXT NOT NULL,
    source_primary_key BIGINT NOT NULL,
    source_file_sha256 TEXT NOT NULL,
    source_row_hash TEXT NOT NULL,
    legacy_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    target_candidate_id UUID,
    target_job_id UUID,
    parent_job_code TEXT,
    step_no INT,
    step_name TEXT,
    processing_status_id INT,
    step_status TEXT,
    deadline TIMESTAMPTZ,
    employee_id UUID,
    employee_name TEXT,
    processing_code_id INT,
    work_date TIMESTAMPTZ,
    hours_spent NUMERIC(8,2),
    is_finished BOOLEAN DEFAULT false,
    notes TEXT,
    payload JSONB NOT NULL,
    validation_status TEXT NOT NULL DEFAULT 'NEW_SAFE_TO_STAGE',
    validation_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_staging_b1_legacy_id UNIQUE (legacy_id),
    CONSTRAINT uq_staging_b1_source_key UNIQUE (source_table, source_primary_key)
);
"""
pg_cur.execute(create_table_sql)

# Clear existing staging if any (for clean idempotency)
pg_cur.execute("TRUNCATE TABLE public.staging_access_delta_b1")

# 3. Insert 6 Steps
insert_sql = """
INSERT INTO public.staging_access_delta_b1 (
    source_table, source_primary_key, source_file_sha256, source_row_hash,
    legacy_id, entity_type, target_candidate_id, target_job_id, parent_job_code,
    step_no, step_name, processing_status_id, step_status, deadline,
    employee_id, employee_name, processing_code_id, work_date, hours_spent,
    is_finished, notes, payload, validation_status, validation_error
) VALUES (
    %(source_table)s, %(source_primary_key)s, %(source_file_sha256)s, %(source_row_hash)s,
    %(legacy_id)s, %(entity_type)s, %(target_candidate_id)s, %(target_job_id)s, %(parent_job_code)s,
    %(step_no)s, %(step_name)s, %(processing_status_id)s, %(step_status)s, %(deadline)s,
    %(employee_id)s, %(employee_name)s, %(processing_code_id)s, %(work_date)s, %(hours_spent)s,
    %(is_finished)s, %(notes)s, %(payload)s, %(validation_status)s, %(validation_error)s
)
"""

print("\n[Inserting 6 Steps into staging_access_delta_b1]...")
for s in step_items:
    params = {
        'source_table': 'tblProcessingDeadline',
        'source_primary_key': s['access_processing_deadline_id'],
        'source_file_sha256': file_sha256,
        'source_row_hash': s['source_row_hash'],
        'legacy_id': f"LEGACY-STEP-{s['access_processing_deadline_id']}",
        'entity_type': 'STEP',
        'target_candidate_id': None,
        'target_job_id': s['target_job_id'],
        'parent_job_code': s['target_job_code'],
        'step_no': s['target_step_no'],
        'step_name': s['target_step_name'],
        'processing_status_id': s['target_processing_status_id'],
        'step_status': s['target_step_status'],
        'deadline': s['access_processing_deadline'],
        'employee_id': None,
        'employee_name': None,
        'processing_code_id': None,
        'work_date': None,
        'hours_spent': None,
        'is_finished': False,
        'notes': s['access_processing_notes'],
        'payload': json.dumps(s),
        'validation_status': 'NEW_SAFE_TO_STAGE',
        'validation_error': None
    }
    pg_cur.execute(insert_sql, params)
    print(f"  + Inserted Step: {params['legacy_id']} (Job: {params['parent_job_code']}, StepNo: {params['step_no']})")

print("\n[Inserting 5 Work Logs into staging_access_delta_b1]...")
for l in log_items:
    params = {
        'source_table': 'tblWorkLog',
        'source_primary_key': l['access_work_log_id'],
        'source_file_sha256': file_sha256,
        'source_row_hash': l['source_row_hash'],
        'legacy_id': f"LEGACY-LOG-{l['access_work_log_id']}",
        'entity_type': 'WORK_LOG',
        'target_candidate_id': None,
        'target_job_id': l['target_job_id'],
        'parent_job_code': l['target_job_code'],
        'step_no': None,
        'step_name': None,
        'processing_status_id': None,
        'step_status': None,
        'deadline': None,
        'employee_id': l['target_employee_id'],
        'employee_name': l['employee_name'],
        'processing_code_id': l['target_processing_code_id'],
        'work_date': l['work_date'],
        'hours_spent': l['hours_spent'],
        'is_finished': l['is_finished'],
        'notes': l['notes'],
        'payload': json.dumps(l),
        'validation_status': 'NEW_SAFE_TO_STAGE',
        'validation_error': None
    }
    pg_cur.execute(insert_sql, params)
    print(f"  + Inserted WorkLog: {params['legacy_id']} (Target Step: {l['target_step_legacy_id']}, Hours: {params['hours_spent']})")

pg_conn.commit()

# 4. Postflight Verification
print("\n=== POSTFLIGHT AUDIT ===")
pg_cur.execute("SELECT count(*) as c FROM staging_access_delta_b1 WHERE entity_type = 'STEP'")
staging_step_rows = pg_cur.fetchone()['c']

pg_cur.execute("SELECT count(*) as c FROM staging_access_delta_b1 WHERE entity_type = 'WORK_LOG'")
staging_work_log_rows = pg_cur.fetchone()['c']

# Duplicate source keys
pg_cur.execute("""
    SELECT source_table, source_primary_key, count(*) 
    FROM staging_access_delta_b1 
    GROUP BY source_table, source_primary_key 
    HAVING count(*) > 1
""")
dup_source_keys = len(pg_cur.fetchall())

# Duplicate legacy IDs
pg_cur.execute("""
    SELECT legacy_id, count(*) 
    FROM staging_access_delta_b1 
    GROUP BY legacy_id 
    HAVING count(*) > 1
""")
dup_legacy_ids = len(pg_cur.fetchall())

# Missing parent jobs
pg_cur.execute("""
    SELECT s.staging_id 
    FROM staging_access_delta_b1 s 
    LEFT JOIN jobs j ON s.target_job_id = j.job_id 
    WHERE j.job_id IS NULL
""")
missing_parent_jobs = len(pg_cur.fetchall())

# Missing employees (for work logs)
pg_cur.execute("""
    SELECT s.staging_id 
    FROM staging_access_delta_b1 s 
    LEFT JOIN employees e ON s.employee_id = e.employee_id 
    WHERE s.entity_type = 'WORK_LOG' AND e.employee_id IS NULL
""")
missing_employees = len(pg_cur.fetchall())

# Missing processing codes (for work logs)
pg_cur.execute("""
    SELECT s.staging_id 
    FROM staging_access_delta_b1 s 
    LEFT JOIN processing_codes p ON s.processing_code_id = p.processing_code_id 
    WHERE s.entity_type = 'WORK_LOG' AND p.processing_code_id IS NULL
""")
missing_processing_codes = len(pg_cur.fetchall())

# Invalid hashes
pg_cur.execute("""
    SELECT count(*) as c 
    FROM staging_access_delta_b1 
    WHERE source_row_hash IS NULL OR length(source_row_hash) != 64
       OR source_file_sha256 != %s
""", (file_sha256,))
invalid_hashes = pg_cur.fetchone()['c']

# Production baseline after
pg_cur.execute("SELECT count(*) as c FROM jobs")
jobs_after = pg_cur.fetchone()['c']

pg_cur.execute("SELECT count(*) as c FROM job_steps")
steps_after = pg_cur.fetchone()['c']

pg_cur.execute("SELECT count(*) as c FROM work_logs")
logs_after = pg_cur.fetchone()['c']

pg_conn.close()

audit_result = {
    "staging_table_name": "staging_access_delta_b1",
    "staging_step_rows": staging_step_rows,
    "staging_work_log_rows": staging_work_log_rows,
    "duplicate_source_keys": dup_source_keys,
    "duplicate_legacy_ids": dup_legacy_ids,
    "missing_parent_jobs": missing_parent_jobs,
    "missing_employees": missing_employees,
    "missing_processing_codes": missing_processing_codes,
    "invalid_hashes": invalid_hashes,
    "production_jobs_after": jobs_after,
    "production_job_steps_after": steps_after,
    "production_work_logs_after": logs_after
}

print(json.dumps(audit_result, indent=2))

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\staging_b1_postflight_audit.json', 'w', encoding='utf-8') as f:
    json.dump(audit_result, f, ensure_ascii=False, indent=2)

print("\nHoàn tất nạp staging B1 và kiểm toán postflight!")
