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

# PostgreSQL Trigger Type Bitmask constants (from pg_trigger.h)
# TRIGGER_TYPE_ROW       = (1 << 0) = 1
# TRIGGER_TYPE_BEFORE    = (1 << 1) = 2  (0 = AFTER)
# TRIGGER_TYPE_INSERT    = (1 << 2) = 4
# TRIGGER_TYPE_DELETE    = (1 << 3) = 8
# TRIGGER_TYPE_UPDATE    = (1 << 4) = 16
# Expected tgtype for AFTER INSERT OR DELETE OR UPDATE FOR EACH ROW = 1 + 4 + 8 + 16 = 29

EXPECTED_TRIGGERS = {
    'trg_sync_job_progress': {
        'table': 'job_steps',
        'function': 'sync_job_overall_progress',
        'expected_tgtype': 29,  # AFTER INSERT/DELETE/UPDATE FOR EACH ROW
        'is_row': True,
        'is_after': True,
        'fires_insert': True,
        'fires_delete': True,
        'fires_update': True
    },
    'trigger_update_job_status': {
        'table': 'job_steps',
        'function': 'trg_update_job_status_from_steps',
        'expected_tgtype': 29,
        'is_row': True,
        'is_after': True,
        'fires_insert': True,
        'fires_delete': True,
        'fires_update': True
    },
    'trigger_update_step_status': {
        'table': 'work_logs',
        'function': 'trg_update_step_status_from_worklogs',
        'expected_tgtype': 29,
        'is_row': True,
        'is_after': True,
        'fires_insert': True,
        'fires_delete': True,
        'fires_update': True
    }
}

print("=== 1. FAIL-CLOSED LOW-LEVEL CATALOG TRIGGER AUDITING (tgtype bitmask, tgrelid, tgfoid) ===")
cur.execute('''
    SELECT 
        t.tgname AS trigger_name,
        c.relname AS table_name,
        t.tgrelid,
        t.tgfoid,
        t.tgtype,
        p.proname AS function_name,
        c.oid AS expected_relid,
        p.oid AS expected_foid
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE c.relname IN ('job_steps', 'work_logs')
      AND NOT t.tgisinternal
    ORDER BY c.relname, t.tgname;
''')
found_triggers = {r['trigger_name']: r for r in cur.fetchall()}

trigger_audit_results = {}
for tg_name, spec in EXPECTED_TRIGGERS.items():
    if tg_name not in found_triggers:
        raise AssertionError(f"FAIL-CLOSED: Expected trigger '{tg_name}' NOT FOUND in catalog pg_trigger!")
    
    actual = found_triggers[tg_name]
    
    # 1.1 Assert table OID and name
    if actual['table_name'] != spec['table'] or actual['tgrelid'] != actual['expected_relid']:
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' tgrelid mismatch (actual table: {actual['table_name']}, expected: {spec['table']})")
    
    # 1.2 Assert function OID and name
    if actual['function_name'] != spec['function'] or actual['tgfoid'] != actual['expected_foid']:
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' tgfoid mismatch (actual function: {actual['function_name']}, expected: {spec['function']})")
        
    # 1.3 Assert bitmask tgtype
    tgtype = actual['tgtype']
    is_row = bool(tgtype & 1)
    is_after = not bool(tgtype & 2)
    fires_insert = bool(tgtype & 4)
    fires_delete = bool(tgtype & 8)
    fires_update = bool(tgtype & 16)
    
    if tgtype != spec['expected_tgtype']:
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' tgtype mismatch (actual: {tgtype}, expected: {spec['expected_tgtype']})")
    if not (is_row and is_after and fires_insert and fires_delete and fires_update):
        raise AssertionError(f"FAIL-CLOSED: Trigger '{tg_name}' bitmask failed row/after/insert/delete/update checks! tgtype={tgtype}")
        
    print(f"  [PASS] Trigger '{tg_name}': Table '{actual['table_name']}' (OID {actual['tgrelid']}), "
          f"Function '{actual['function_name']}' (OID {actual['tgfoid']}), tgtype bitmask={tgtype} (AFTER ROW INSERT/DELETE/UPDATE)")
    trigger_audit_results[tg_name] = {
        'status': 'VERIFIED_CATALOG_BITMASK',
        'table': actual['table_name'],
        'table_oid': actual['tgrelid'],
        'function': actual['function_name'],
        'function_oid': actual['tgfoid'],
        'tgtype_bitmask': tgtype,
        'timing': 'AFTER',
        'orientation': 'ROW',
        'events': ['INSERT', 'DELETE', 'UPDATE']
    }

print("\n=== 2. FAIL-CLOSED FUNCTION OVERLOAD & SIGNATURE AUDITING ===")
function_audit_results = {}
for fn in ['sync_job_overall_progress', 'trg_update_job_status_from_steps', 'trg_update_step_status_from_worklogs']:
    cur.execute('SELECT count(*) as c FROM pg_proc WHERE proname = %s', (fn,))
    overload_count = cur.fetchone()['c']
    
    if overload_count == 0:
        raise AssertionError(f"FAIL-CLOSED: Function '{fn}' NOT FOUND in pg_proc!")
    elif overload_count > 1:
        raise AssertionError(f"FAIL-CLOSED: Function '{fn}' has {overload_count} overloads (ambiguous definition)!")
        
    cur.execute('SELECT pg_get_functiondef(p.oid) AS def, pronargs, prorettype FROM pg_proc p WHERE proname = %s', (fn,))
    proc_info = cur.fetchone()
    
    print(f"  [PASS] Function '{fn}': Exactly 1 overload in pg_proc (nargs={proc_info['pronargs']}, rettype_oid={proc_info['prorettype']}).")
    function_audit_results[fn] = {
        'status': 'VERIFIED_UNIQUE_OVERLOAD',
        'overload_count': 1,
        'function_def': proc_info['def']
    }

print("\n>>> ALL TRIGGER CATALOG BITMASKS AND FUNCTION OVERLOADS PASSED FAIL-CLOSED AUDIT! <<<\n")
conn.close()
