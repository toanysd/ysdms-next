import json
import urllib.request
import urllib.parse

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    req = urllib.request.Request(url, headers=HEADERS, data=json.dumps({"query": sql}).encode('utf-8'))
    try:
        res = urllib.request.urlopen(req)
        return True
    except Exception as e:
        print("Error executing SQL:", e)
        return False

sql = """
UPDATE jobs j
SET 
  physical_mold_id = COALESCE(j.physical_mold_id, (SELECT p.physical_mold_id FROM physical_molds p WHERE p.system_code = j.job_code LIMIT 1)),
  design_revision_id = COALESCE(j.design_revision_id, (SELECT d.revision_id FROM design_revisions d WHERE d.design_code = j.job_name LIMIT 1))
WHERE j.physical_mold_id IS NULL OR j.design_revision_id IS NULL;
"""
print("Running SQL...", run_sql(sql))
