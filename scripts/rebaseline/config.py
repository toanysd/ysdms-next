import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / '.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
CSV_DIR = ROOT_DIR / 'source_data' / 'csv-access-data'
OUTPUT_DIR = Path(__file__).resolve().parent / 'output'

BATCH_SIZE = 500

def get_supabase_client() -> Client:
    """Initialize and return Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not found in environment variables.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Determine DRY_RUN from env or CLI
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"
if __name__ != "__main__":
    import sys
    if "--dry-run" in sys.argv:
        DRY_RUN = True
