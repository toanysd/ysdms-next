import os
import sys
import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get('SUPABASE_SERVICE_ROLE_KEY')"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

def main():
    sql = sys.argv[1] if len(sys.argv) > 1 else "SELECT 1"
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    if resp.status_code == 200:
        try:
            print(json.dumps(resp.json(), indent=2))
        except:
            print(resp.text)
    else:
        print(f"Error {resp.status_code}: {resp.text}")

if __name__ == "__main__":
    main()
