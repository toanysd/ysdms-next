import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(r'd:\AntiGravity_Workspace\apps\ysdms-nextgen')
load_dotenv(ROOT_DIR / '.env.local')

supabase = create_client(os.environ.get('NEXT_PUBLIC_SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

res = supabase.table('companies').select('legacy_id', count='exact').execute()
print(f"Total rows: {res.count}")

# Find duplicates
from collections import Counter
ids = [r['legacy_id'] for r in res.data if r['legacy_id']]
dups = [k for k, v in Counter(ids).items() if v > 1]
print("Duplicates:", dups)
