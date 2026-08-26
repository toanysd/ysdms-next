import os
import sys, json, urllib.request

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

sql = sys.argv[1]
url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
req = urllib.request.Request(url, headers=HEADERS, data=json.dumps({"query": sql}).encode('utf-8'))
try:
    res = urllib.request.urlopen(req)
    print("Success:", res.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
