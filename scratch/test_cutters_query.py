import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

# Test query for cutters with companies and design_revisions
url = f"{SUPABASE_URL}/rest/v1/cutters?select=*,companies!cutters_company_id_fkey(company_id,company_name,company_code),design_revisions(revision_id,design_code)"
resp = requests.get(url, headers=HEADERS)
print("Cutters Query status:", resp.status_code)
if resp.status_code == 200:
    print(json.dumps(resp.json()[:2], indent=2))
else:
    print(resp.text)
