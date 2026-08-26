import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(r'd:\AntiGravity_Workspace\apps\ysdms-nextgen')
load_dotenv(ROOT_DIR / '.env.local')

supabase = create_client(os.environ.get('NEXT_PUBLIC_SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

res = supabase.table('companies').select('company_id, legacy_id').limit(5).execute()
print(res.data)
