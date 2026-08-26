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

# Test query for cutters with companies and design_revisions
url = f"{SUPABASE_URL}/rest/v1/cutters?select=*,companies!cutters_company_id_fkey(company_id,company_name,company_code),design_revisions(revision_id,design_code)"
resp = requests.get(url, headers=HEADERS)
print("Cutters Query status:", resp.status_code)
if resp.status_code == 200:
    print(json.dumps(resp.json()[:2], indent=2))
else:
    print(resp.text)
