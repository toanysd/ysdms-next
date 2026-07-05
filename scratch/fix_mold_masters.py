import re

file_path = "supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql"
with open(file_path, "r", encoding="utf-8") as f:
    data = f.read()

# Pattern matches: INSERT INTO mold_masters (....) VALUES ('uid', $$code$$, $$name$$, NULL, ...
# The 4th value is the company_id. If it's NULL, we replace it with 'dde9e4ae-20eb-4a04-8d02-ca4cca0b94c7'
new_data = re.sub(
    r"(INSERT INTO mold_masters \([^)]+\) VALUES \([^,]+, [^,]+, [^,]+, )NULL",
    r"\g<1>'dde9e4ae-20eb-4a04-8d02-ca4cca0b94c7'",
    data
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_data)
    
print("Fixed mold_masters NULL company_id!")
