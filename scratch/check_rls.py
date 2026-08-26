import os
import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    return resp

sql_check = """
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM 
    pg_tables 
WHERE 
    schemaname = 'public'
    AND tablename IN ('companies', 'products', 'physical_molds', 'racks', 'rack_layers', 'mold_masters');
"""

resp = run_sql(sql_check)
print("RLS status:")
print(json.dumps(resp.json(), indent=2))

sql_policies = """
SELECT * FROM pg_policies WHERE schemaname = 'public';
"""
resp_policies = run_sql(sql_policies)
print("\nPolicies:")
print(json.dumps(resp_policies.json(), indent=2))
