import sys, json, urllib.request

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
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
