"""
Import seed SQL via Supabase exec_sql RPC - batch mode.
Sends large batches (200 statements per call) for speed.
"""
import os, sys, time, json
try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests -q")
    import requests

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get('SUPABASE_SERVICE_ROLE_KEY')"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}
SQL_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "supabase", "migrations", "20260612000002_068_seed_legacy_v3.sql")

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    return resp

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "seed"

    if mode == "cleanup":
        print("Cleanup...", flush=True)
        for s in [
            "DELETE FROM cutters WHERE legacy_id IS NOT NULL",
            "DELETE FROM cutter_masters WHERE legacy_id IS NOT NULL",
            "DELETE FROM physical_molds WHERE legacy_id IS NOT NULL",
            "DELETE FROM mold_revisions WHERE legacy_id IS NOT NULL",
            "DELETE FROM design_revisions WHERE legacy_id IS NOT NULL",
            "DELETE FROM mold_masters WHERE legacy_id IS NOT NULL",
            "DELETE FROM products WHERE legacy_id IS NOT NULL",
            "DELETE FROM rack_layers",
            "DELETE FROM racks",
            "DELETE FROM employees WHERE legacy_id IS NOT NULL",
            "DELETE FROM companies WHERE legacy_id IS NOT NULL",
        ]:
            r = run_sql(s)
            print(f"  {s[:50]}... -> {r.status_code}", flush=True)
        return

    # SEED mode
    print(f"Reading SQL...", flush=True)
    with open(SQL_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stmts = []
    for l in lines:
        s = l.strip()
        if s and s not in ('BEGIN;', 'COMMIT;') and not s.startswith('--'):
            stmts.append(s)

    total = len(stmts)
    print(f"Total: {total} statements", flush=True)

    batch_size = 200  # Send 200 statements per HTTP call
    ok = 0
    err = 0
    t0 = time.time()

    for i in range(0, total, batch_size):
        batch = stmts[i:i+batch_size]
        sql = '\n'.join(batch)

        try:
            resp = run_sql(sql)
            body = resp.json() if resp.status_code == 200 else {}

            if resp.status_code == 200 and (not isinstance(body, dict) or body.get('status') != 'error'):
                ok += len(batch)
            else:
                # Batch failed, try smaller chunks
                emsg = body.get('message', '') if isinstance(body, dict) else str(resp.status_code)
                print(f"  Batch {i//batch_size} failed: {emsg[:100]}", flush=True)
                # Retry in chunks of 10
                for j in range(0, len(batch), 10):
                    mini = batch[j:j+10]
                    r2 = run_sql('\n'.join(mini))
                    b2 = r2.json() if r2.status_code == 200 else {}
                    if r2.status_code == 200 and (not isinstance(b2, dict) or b2.get('status') != 'error'):
                        ok += len(mini)
                    else:
                        # Try one by one
                        for stmt in mini:
                            r3 = run_sql(stmt)
                            b3 = r3.json() if r3.status_code == 200 else {}
                            if r3.status_code == 200 and (not isinstance(b3, dict) or b3.get('status') != 'error'):
                                ok += 1
                            else:
                                err += 1
                                if err <= 10:
                                    em = b3.get('message','') if isinstance(b3, dict) else ''
                                    print(f"  ERR: {em[:100]}", flush=True)
                                    print(f"  SQL: {stmt[:80]}...", flush=True)
        except Exception as e:
            err += len(batch)
            print(f"  Exception: {str(e)[:100]}", flush=True)

        elapsed = time.time() - t0
        done = i + len(batch)
        pct = done * 100 // total
        rate = done / elapsed if elapsed > 0 else 0
        eta = (total - done) / rate if rate > 0 else 0
        print(f"  [{pct}%] {done}/{total} | OK:{ok} ERR:{err} | {elapsed:.0f}s elapsed, ~{eta:.0f}s left", flush=True)

    print(f"\n=== DONE in {time.time()-t0:.0f}s === OK:{ok} ERR:{err}", flush=True)

if __name__ == "__main__":
    main()
