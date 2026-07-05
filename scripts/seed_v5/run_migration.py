"""Run migration SQL directly via Supabase REST API"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

from supabase import create_client

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

# 1. Thêm product_description
print("1. Adding product_description column...")
supabase.rpc('exec_sql', {'query': 'ALTER TABLE products ADD COLUMN IF NOT EXISTS product_description TEXT'}).execute()
print("   Done")

# 2. Đổi tên company_pn → customer_product_name
print("2. Renaming company_pn → customer_product_name...")
try:
    supabase.rpc('exec_sql', {'query': 'ALTER TABLE products RENAME COLUMN company_pn TO customer_product_name'}).execute()
    print("   Done")
except Exception as e:
    if 'does not exist' in str(e) or 'already exists' in str(e):
        print(f"   Skipped (already renamed or not exists): {e}")
    else:
        raise

# 3. Di chuyển TrayInfo từ notes → product_description 
print("3. Migrating notes → product_description...")
resp = supabase.table('products').select('product_id, notes').not_.is_('notes', 'null').neq('notes', '').execute()
count = 0
for p in resp.data:
    supabase.table('products').update({
        'product_description': p['notes'],
        'notes': None
    }).eq('product_id', p['product_id']).execute()
    count += 1
print(f"   Migrated {count} records")

print("\nMigration complete!")
