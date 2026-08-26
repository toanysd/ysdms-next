import os
import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get('SUPABASE_SERVICE_ROLE_KEY')"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    return resp

tables = [
    "companies",
    "products",
    "materials",
    "racks",
    "rack_layers",
    "mold_masters",
    "mold_revisions",
    "physical_molds",
    "cutters",
    "cutter_masters",
    "jobs",
    "job_steps",
    "design_projects",
    "employees",
    "mold_designs",
    "design_masters",
    "job_types",
    "production_schedules",
    "order_lines",
    "orders"
]

print("Disabling RLS on all tables...")
for t in tables:
    sql = f"ALTER TABLE {t} DISABLE ROW LEVEL SECURITY;"
    try:
        resp = run_sql(sql)
        print(f"  {t}: {resp.status_code} -> {resp.text}")
    except Exception as e:
        print(f"  {t}: Error {e}")
