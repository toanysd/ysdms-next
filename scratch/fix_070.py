import re

file_path = "supabase/migrations/20260616000001_070_delivery_site_audit.sql"
with open(file_path, "r", encoding="utf-8") as f:
    data = f.read()

data = re.sub(r"ALTER TABLE public\.companies\s*ADD COLUMN parent_company_id UUID REFERENCES public\.companies\(company_id\);", "", data)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(data)

print("Fixed 070")
