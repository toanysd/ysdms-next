import sys
import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
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
