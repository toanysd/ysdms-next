import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

tables = [
    "companies",
    "products",
    "materials",
    "racks",
    "rack_layers",
    "mold_masters",
    "physical_molds",
    "cutters",
    "jobs",
    "job_steps"
]

print("Row counts in Supabase tables:")
for t in tables:
    url = f"{SUPABASE_URL}/rest/v1/{t}?select=count"
    headers_count = HEADERS.copy()
    headers_count["Prefer"] = "count=exact"
    headers_count["Range"] = "0-0"
    try:
        resp = requests.get(url, headers=headers_count)
        # Content-Range: 0-0/123
        cr = resp.headers.get("Content-Range")
        count = cr.split("/")[1] if cr else resp.text
        print(f"  {t}: {count}")
    except Exception as e:
        print(f"  {t}: Error {e}")
