import sys
import psycopg2
import os
import re
import json
import datetime
import subprocess
from psycopg2.extras import RealDictCursor

sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_ROOT, '.env.local')
PAYLOAD_SQL_FILE = os.path.join(SCRIPT_DIR, 'official_insert_payload_b1.sql')
OUTPUT_JSON = os.path.join(SCRIPT_DIR, 'production_insert_b1_execution_result.json')

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

conn = psycopg2.connect(db_url)
# autocommit=True allows the BEGIN ... COMMIT inside the SQL script to manage transaction boundaries
conn.autocommit = True
cur = conn.cursor(cursor_factory=RealDictCursor)

print("===========================================================================")
print("  OFFICIAL PRODUCTION INSERT EXECUTION: ACCESS DELTA B1")
print("  Target: public.job_steps (6 rows) & public.work_logs (5 rows)")
print("  Authorization: Minh Chủ Thoan [Stamp: 2026-10-07 11:30 JST]")
print("  Audit Validation: PE [Stamp: 2026-10-07 11:29 JST]")
print("===========================================================================\n")

# 1. PRE-EXECUTION BASELINE AUDIT
cur.execute("SELECT count(*) as c FROM public.jobs")
pre_jobs = cur.fetchone()['c']
cur.execute("SELECT count(*) as c FROM public.job_steps")
pre_steps = cur.fetchone()['c']
cur.execute("SELECT count(*) as c FROM public.work_logs")
pre_logs = cur.fetchone()['c']
cur.execute("SELECT count(*) as c FROM public.staging_access_delta_b1")
pre_staging = cur.fetchone()['c']

print(f"[1. Pre-Execution Baseline]: jobs={pre_jobs}, steps={pre_steps}, logs={pre_logs}, staging={pre_staging}")
assert pre_jobs == 1205, f"FAIL-CLOSED: Expected 1205 jobs, got {pre_jobs}"
assert pre_steps == 2451, f"FAIL-CLOSED: Expected 2451 steps, got {pre_steps}"
assert pre_logs == 7106, f"FAIL-CLOSED: Expected 7106 logs, got {pre_logs}"
assert pre_staging == 11, f"FAIL-CLOSED: Expected 11 staging rows, got {pre_staging}"

# 2. VERIFY SQL PAYLOAD TERMINATION
with open(PAYLOAD_SQL_FILE, 'r', encoding='utf-8') as f:
    payload_sql = f.read()

assert 'COMMIT;' in payload_sql, "FAIL-CLOSED: SQL payload does not contain COMMIT;"
print("[2. SQL Payload Verified]: Official payload loaded and verified with COMMIT instruction.")

# 3. GET CURRENT GIT SHA
res_sha = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True, cwd=PROJECT_ROOT)
current_commit_sha = res_sha.stdout.strip()
print(f"[3. Local Git SHA]: {current_commit_sha}")

# 4. EXECUTE OFFICIAL INSERT TRANSACTION
exec_start_time = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
print(f"\n[4. Executing Official Transaction at {exec_start_time.strftime('%Y-%m-%d %H:%M:%S JST')}]...")

notices = []
try:
    cur.execute(payload_sql)
    for n in conn.notices:
        notices.append(n.strip())
        print(f"  NOTICE: {n.strip()}")
    transaction_result = "COMMITTED"
    print("  [SUCCESS]: Transaction committed successfully!")
except Exception as e:
    transaction_result = f"FAILED: {e}"
    print(f"  [ERROR]: {e}")
    raise e

# 5. POST-EXECUTION INDEPENDENT AUDIT (POSTFLIGHT)
print("\n[5. Post-Execution Independent Verification]...")
cur.execute("SELECT count(*) as c FROM public.jobs")
post_jobs = cur.fetchone()['c']
cur.execute("SELECT count(*) as c FROM public.job_steps")
post_steps = cur.fetchone()['c']
cur.execute("SELECT count(*) as c FROM public.work_logs")
post_logs = cur.fetchone()['c']

print(f"  - postflight_jobs: {post_jobs} (expected 1205)")
print(f"  - postflight_job_steps: {post_steps} (expected 2457)")
print(f"  - postflight_work_logs: {post_logs} (expected 7111)")

assert post_jobs == 1205, f"Postflight Mismatch: jobs={post_jobs}"
assert post_steps == 2457, f"Postflight Mismatch: steps={post_steps}"
assert post_logs == 7111, f"Postflight Mismatch: logs={post_logs}"

# Verify exactly 6 inserted steps
target_step_legacies = [
    'LEGACY-STEP-4226', 'LEGACY-STEP-4238', 'LEGACY-STEP-4241',
    'LEGACY-STEP-4251', 'LEGACY-STEP-4275', 'LEGACY-STEP-4276'
]
cur.execute("""
    SELECT step_id, job_id, step_no, step_name, step_status, processing_status_id, legacy_id
    FROM public.job_steps
    WHERE legacy_id = ANY(%s)
    ORDER BY legacy_id;
""", (target_step_legacies,))
inserted_step_rows = [dict(r) for r in cur.fetchall()]
assert len(inserted_step_rows) == 6, f"Expected 6 inserted steps, found {len(inserted_step_rows)}"
print(f"  [PASS]: All 6 target step legacy_ids verified in public.job_steps.")

# Verify exactly 5 inserted work logs
target_log_legacies = [
    'LEGACY-LOG-8882', 'LEGACY-LOG-8895', 'LEGACY-LOG-8901',
    'LEGACY-LOG-8920', 'LEGACY-LOG-9052'
]
cur.execute("""
    SELECT log_id, job_id, job_step_id, employee_id, hours_spent, processing_code_id, is_finished, legacy_id
    FROM public.work_logs
    WHERE legacy_id = ANY(%s)
    ORDER BY legacy_id;
""", (target_log_legacies,))
inserted_log_rows = [dict(r) for r in cur.fetchall()]
assert len(inserted_log_rows) == 5, f"Expected 5 inserted logs, found {len(inserted_log_rows)}"
print(f"  [PASS]: All 5 target work log legacy_ids verified in public.work_logs.")

# Verify target legacy conflict count on staging vs production is now exactly 11
cur.execute("""
    SELECT count(*) as c 
    FROM public.job_steps 
    WHERE legacy_id IN (SELECT legacy_id FROM public.staging_access_delta_b1 WHERE entity_type = 'STEP')
""")
step_conflicts_now = cur.fetchone()['c']
cur.execute("""
    SELECT count(*) as c 
    FROM public.work_logs 
    WHERE legacy_id IN (SELECT legacy_id FROM public.staging_access_delta_b1 WHERE entity_type = 'WORK_LOG')
""")
log_conflicts_now = cur.fetchone()['c']
target_legacy_conflicts_after = step_conflicts_now + log_conflicts_now
print(f"  - target_legacy_conflicts_after: {target_legacy_conflicts_after} (expected 11, indicating all 11 rows now exist)")
assert target_legacy_conflicts_after == 11, f"Expected 11 legacy matches, got {target_legacy_conflicts_after}"

# Verify no duplicate legacy_ids in production
cur.execute("SELECT count(*) - count(DISTINCT legacy_id) as dup FROM public.job_steps WHERE legacy_id IS NOT NULL")
dup_steps = cur.fetchone()['dup']
cur.execute("SELECT count(*) - count(DISTINCT legacy_id) as dup FROM public.work_logs WHERE legacy_id IS NOT NULL")
dup_logs = cur.fetchone()['dup']
assert dup_steps == 0, f"Duplicate legacy_ids in job_steps: {dup_steps}"
assert dup_logs == 0, f"Duplicate legacy_ids in work_logs: {dup_logs}"
print(f"  [PASS]: Zero duplicate legacy_ids in public.job_steps and public.work_logs.")

# Verify trigger side effects on 6 parent jobs
parent_job_codes = ['ASH021R2', 'JAE380', 'MMT021R2', 'KSP227', 'ZA水冷ベース', 'JAE381']
cur.execute("""
    SELECT job_id, job_code, job_status, overall_progress
    FROM public.jobs
    WHERE job_code = ANY(%s)
    ORDER BY job_code;
""", (parent_job_codes,))
parent_jobs_after = [dict(r) for r in cur.fetchall()]
for pj in parent_jobs_after:
    pj['overall_progress'] = float(pj['overall_progress']) if pj['overall_progress'] is not None else None
    print(f"  - Parent Job '{pj['job_code']}': status='{pj['job_status']}', progress={pj['overall_progress']}%")

# Convert UUIDs and decimals for JSON serialization
for s in inserted_step_rows:
    s['step_id'] = str(s['step_id'])
    s['job_id'] = str(s['job_id'])
for l in inserted_log_rows:
    l['log_id'] = str(l['log_id'])
    l['job_id'] = str(l['job_id'])
    l['job_step_id'] = str(l['job_step_id'])
    l['employee_id'] = str(l['employee_id'])
    l['hours_spent'] = float(l['hours_spent']) if l['hours_spent'] is not None else None
for pj in parent_jobs_after:
    pj['job_id'] = str(pj['job_id'])

# 6. SAVE EXECUTION RESULT ARTIFACT
execution_result = {
    "execution_timestamp_jst": exec_start_time.strftime('%Y-%m-%d %H:%M:%S JST'),
    "full_commit_sha": current_commit_sha,
    "transaction_result": transaction_result,
    "inserted_steps_row_count": len(inserted_step_rows),
    "inserted_work_logs_row_count": len(inserted_log_rows),
    "postflight_jobs": post_jobs,
    "postflight_job_steps": post_steps,
    "postflight_work_logs": post_logs,
    "inserted_step_legacy_ids": target_step_legacies,
    "inserted_work_log_legacy_ids": target_log_legacies,
    "inserted_step_details": inserted_step_rows,
    "inserted_work_log_details": inserted_log_rows,
    "target_legacy_conflicts_after": target_legacy_conflicts_after,
    "duplicate_legacy_ids_in_target": dup_steps + dup_logs,
    "parent_job_side_effects": parent_jobs_after,
    "notices": notices,
    "rollback_or_commit_evidence": "PostgreSQL TRANSACTION COMMITTED SUCCESSFULLY, postflight counts verified"
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(execution_result, f, ensure_ascii=False, indent=2)

print(f"\n[Execution Result JSON saved to {OUTPUT_JSON}]")
print(">>> OFFICIAL PRODUCTION INSERT COMPLETED & VERIFIED 100%! <<<\n")

conn.close()
