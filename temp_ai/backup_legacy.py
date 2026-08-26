import os
import csv
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase: Client = create_client(url, key)

backup_dir = "temp_ai/backup_legacy"
os.makedirs(backup_dir, exist_ok=True)

def backup_table(table_name):
    print(f"Backing up {table_name}...")
    res = supabase.table(table_name).select("*").execute()
    data = res.data
    if data:
        keys = data[0].keys()
        with open(f"{backup_dir}/{table_name}_backup.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
        print(f"Backed up {len(data)} rows to {backup_dir}/{table_name}_backup.csv")
    else:
        print(f"No data in {table_name}")

backup_table("physical_molds")
backup_table("cutters")
