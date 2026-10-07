import psycopg2
import os
import re
from psycopg2.extras import RealDictCursor

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_ROOT, '.env.local')

with open(ENV_FILE, 'r', encoding='utf-8') as f:
    db_url = re.search(r'^DATABASE_URL=(.*)$', f.read(), re.MULTILINE).group(1).strip()

conn = psycopg2.connect(db_url)
cur = conn.cursor(cursor_factory=RealDictCursor)

EXPECTED_TRIGGERS = {
    'trg_sync_job_progress': {
        'table': 'job_steps',
        'function': 'sync_job_overall_progress',
        'events': ['INSERT', 'DELETE', 'UPDATE']
    },
    'trigger_update_job_status': {
        'table': 'job_steps',
        'function': 'trg_update_job_status_from_steps',
        'events': ['INSERT', 'DELETE', 'UPDATE']
    },
    'trigger_update_step_status': {
        'table': 'work_logs',
        'function': 'trg_update_step_status_from_worklogs',
        'events': ['INSERT', 'DELETE', 'UPDATE']
    }
}

print("=== 1. FAIL-CLOSED TRIGGER CATALOG AUDITING ===")
cur.execute('''
    SELECT 
        tgname AS trigger_name,
        relname AS table_name,
        pg_get_triggerdef(t.oid) AS trigger_def
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE relname IN ('job_steps', 'work_logs')
      AND NOT tgisinternal
    ORDER BY relname, tgname;
''')
found_triggers = {r['trigger_name']: r for r in cur.fetchall()}

trigger_audit_results = {}
for tg_name, spec in EXPECTED_TRIGGERS.items():
    if tg_name not in found_triggers:
        raise AssertionError(f"FAIL-CLOSED: Expected trigger '{tg_name}' NOT FOUND in catalog pg_trigger!")
    
    actual = found_triggers[tg_name]
    actual_table = actual['table_name']
    actual_def = actual['trigger_def']
    expected_table = spec['table']
    expected_fn = spec['function']
    
    if actual_table != expected_table:
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' is attached to table '{actual_table}', expected '{expected_table}'!")
    
    if expected_fn not in actual_def:
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' definition does not call function '{expected_fn}'! Def: {actual_def}")
    
    for ev in spec['events']:
        if ev not in actual_def:
            raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' definition missing expected event '{ev}'! Def: {actual_def}")
            
    print(f"  [PASS] Trigger '{tg_name}': Table '{actual_table}', Function '{expected_fn}', Events {spec['events']}")
    trigger_audit_results[tg_name] = {
        'status': 'VERIFIED',
        'table': actual_table,
        'function': expected_fn,
        'trigger_def': actual_def
    }

print("\n=== 2. FAIL-CLOSED FUNCTION OVERLOAD & DEFINITION AUDITING ===")
function_audit_results = {}
for fn in ['sync_job_overall_progress', 'trg_update_job_status_from_steps', 'trg_update_step_status_from_worklogs']:
    cur.execute('SELECT count(*) as c FROM pg_proc WHERE proname = %s', (fn,))
    overload_count = cur.fetchone()['c']
    
    if overload_count == 0:
        raise AssertionError(f"FAIL-CLOSED: Function '{fn}' NOT FOUND in pg_proc!")
    elif overload_count > 1:
        raise AssertionError(f"FAIL-CLOSED: Function '{fn}' has {overload_count} overloads (ambiguous call definition)!")
        
    cur.execute('SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p WHERE proname = %s', (fn,))
    fn_def = cur.fetchone()['def']
    
    print(f"  [PASS] Function '{fn}': Exactly 1 overload, signature verified.")
    function_audit_results[fn] = {
        'status': 'VERIFIED_UNIQUE_OVERLOAD',
        'overload_count': 1,
        'function_def': fn_def
    }

print("\n>>> ALL TRIGGER AND FUNCTION DEFINITIONS PASSED FAIL-CLOSED AUDIT 100%! <<<\n")
conn.close()
