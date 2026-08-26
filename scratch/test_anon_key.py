import os
import requests

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
ANON_KEY = "os.environ.get('SUPABASE_SERVICE_ROLE_KEY')"
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json"
}

tables = [
    "companies",
    "products",
    "racks",
    "rack_layers",
    "mold_masters",
    "physical_molds",
    "cutters"
]

print("Row counts in Supabase tables using ANON_KEY:")
for t in tables:
    url = f"{SUPABASE_URL}/rest/v1/{t}?select=count"
    headers_count = HEADERS.copy()
    headers_count["Prefer"] = "count=exact"
    headers_count["Range"] = "0-0"
    try:
        resp = requests.get(url, headers=headers_count)
        cr = resp.headers.get("Content-Range")
        count = cr.split("/")[1] if cr else f"Status {resp.status_code}: {resp.text}"
        print(f"  {t}: {count}")
    except Exception as e:
        print(f"  {t}: Error {e}")
