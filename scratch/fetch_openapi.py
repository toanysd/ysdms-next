import os
import requests
import json

ENV_FILE = ".env.local"

def load_env(env_path=ENV_FILE):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip()
    return env_vars

def main():
    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY")
    
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}"
    }
    
    url = f"{supabase_url}/rest/v1/"
    resp = requests.get(url, headers=headers, timeout=60)
    if resp.status_code == 200:
        spec = resp.json()
        print("Paths available in PostgREST:")
        for path in spec.get("paths", {}).keys():
            print(path)
    else:
        print(f"Error {resp.status_code}: {resp.text}")

if __name__ == "__main__":
    main()
