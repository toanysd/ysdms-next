import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
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
