import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(r'd:\AntiGravity_Workspace\apps\ysdms-nextgen')
load_dotenv(ROOT_DIR / '.env.local')

supabase = create_client(os.environ.get('NEXT_PUBLIC_SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

try:
    res = supabase.table('companies').upsert({
        'company_id': 'ea09189f-1e25-4c4d-8c6a-0684a2b63804',
        'legacy_id': 'COMP-182',
        'company_code': 'TEST',
        'company_name': 'TEST'
    }, on_conflict='legacy_id').execute()
    print("Upsert successful on legacy_id!")
except Exception as e:
    print("Upsert failed:", e)

