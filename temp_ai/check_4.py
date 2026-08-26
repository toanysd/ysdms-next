import os, sys, json
from dotenv import load_dotenv
from supabase import create_client
load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

companies = supabase.table('companies').select('company_id, legacy_id, company_name').in_('legacy_id', ['COMP-50', 'COMP-547', 'COMP-96', 'COMP-410']).execute().data

result = {}
for c in companies:
    cid = c['company_id']
    fks = {}
    
    fk_columns = [
        ("mold_owners", "company_id"),
        ("company_contacts", "company_id"),
        ("products", "company_id"),
        ("orders", "company_id"),
        ("design_revisions", "company_id"),
        ("equipment", "company_id"),
        ("jobs", "company_id"),
        ("employees", "company_id"),
        ("quotations", "company_id")
    ]
    total = 0
    for table, col in fk_columns:
        try:
            count = len(supabase.table(table).select("*").eq(col, cid).execute().data)
            if count > 0:
                fks[table] = count
                total += count
        except Exception:
            pass
    
    result[c['legacy_id']] = {
        'name': c['company_name'],
        'total_fks': total,
        'breakdown': fks
    }

with open("temp_ai/check_4_companies.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
