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

sql = """
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
"""
resp = run_sql(sql)
print(json.dumps(resp.json(), indent=2))
