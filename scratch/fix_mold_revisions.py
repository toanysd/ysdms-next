import re

file_path = "supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql"
with open(file_path, "r", encoding="utf-8") as f:
    data = f.read()

# Replace mold_revision_id with revision_id in mold_revisions INSERT
new_data = data.replace(
    "INSERT INTO mold_revisions (mold_revision_id, mold_master_id, design_revision_id",
    "INSERT INTO mold_revisions (revision_id, mold_master_id, design_revision_id"
)

# And fix the ON CONFLICT because mold_revisions uniqueness is (mold_master_id, revision_code)
# In the schema, line 461: UNIQUE(mold_master_id, revision_code)
# So ON CONFLICT (revision_code) is wrong.
new_data = re.sub(
    r"(INSERT INTO mold_revisions [^\n]+) ON CONFLICT \(revision_code\) DO NOTHING",
    r"\g<1> ON CONFLICT (mold_master_id, revision_code) DO NOTHING",
    new_data
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_data)
    
print("Fixed mold_revisions!")
