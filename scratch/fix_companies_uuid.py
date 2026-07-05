import csv, uuid, json

def escape_sql_string(val):
    if val is None or val == '': return "NULL"
    s = str(val).replace("'", "''")
    return f"$${s}$$"

def generate():
    data = open("supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql", "r", encoding="utf-8").read()
    
    # We will find all company inserts and build a map of company_code -> UUID
    code_to_uuid = {}
    import re
    # Match: INSERT INTO companies (company_id, company_code, ... VALUES ('uuid', $$code$$
    matches = re.finditer(r"INSERT INTO companies \(company_id, company_code,.*?VALUES \('([^']+)', \$\$([^$]+)\$\$", data)
    for m in matches:
        uid = m.group(1)
        code = m.group(2)
        if code not in code_to_uuid:
            code_to_uuid[code] = uid
            
    print("Found codes:", len(code_to_uuid))
    
    # Now we replace the wrong UUIDs with the correct ones!
    # If a company was inserted multiple times, the FIRST UUID is the real one.
    # We will search the file for the conflicting UUIDs and replace them with the first one.
    # Wait, the script generated a NEW uuid for each row.
    # Let's just find ALL companies UUIDs.
    all_inserts = re.findall(r"INSERT INTO companies \(company_id, company_code,.*?VALUES \('([^']+)', \$\$([^$]+)\$\$", data)
    
    replace_map = {}
    for uid, code in all_inserts:
        if uid != code_to_uuid[code]:
            replace_map[uid] = code_to_uuid[code]
            
    print("Replacing", len(replace_map), "UUIDs")
    for old_uid, new_uid in replace_map.items():
        data = data.replace(old_uid, new_uid)
        
    open("supabase/migrations/20260612000002_068_seed_legacy_v4_master.sql", "w", encoding="utf-8").write(data)

generate()
