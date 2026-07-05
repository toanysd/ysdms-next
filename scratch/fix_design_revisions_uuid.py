import re
import sys

file_path = "supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql"
with open(file_path, "r", encoding="utf-8") as f:
    data = f.read()

# Pattern for design_revisions
# INSERT INTO design_revisions (revision_id, design_code, ... VALUES ('...', $$...$$,
pattern = r"INSERT INTO design_revisions \([^)]+\) VALUES \('([^']+)', \$\$([^\$]+)\$\$"

matches = re.findall(pattern, data)

code_to_uuid = {}
replacements = {}

for uid, code in matches:
    if code not in code_to_uuid:
        code_to_uuid[code] = uid
    else:
        # We have a duplicate!
        first_uid = code_to_uuid[code]
        if uid != first_uid:
            replacements[uid] = first_uid

print(f"Found {len(replacements)} duplicate design_revisions UUIDs to replace.")

# Perform replacements
for old_uid, new_uid in replacements.items():
    data = data.replace(old_uid, new_uid)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(data)

print("Done fixing design_revisions UUIDs!")
