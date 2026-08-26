import os
﻿import csv
import json
import urllib.request
import urllib.parse
from datetime import datetime

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def get_data(table, select="*", chunk=1000):
    res_data = []
    offset = 0
    while True:
        url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}&limit={chunk}&offset={offset}"
        req = urllib.request.Request(url, headers={**HEADERS, "Prefer": ""})
        try:
            res = urllib.request.urlopen(req)
            data = json.loads(res.read().decode('utf-8'))
            if not data:
                break
            res_data.extend(data)
            offset += chunk
        except Exception as e:
            print(f"Error fetching {table}: {e}")
            break
    return res_data

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    req = urllib.request.Request(url, headers=HEADERS, data=json.dumps({"query": sql}).encode('utf-8'))
    try:
        res = urllib.request.urlopen(req)
        return True
    except Exception as e:
        print("Error executing SQL:", e)
        return False

def main():
    designs = get_data("design_revisions", "revision_id,legacy_id")
    design_map = {str(r['legacy_id']): r['revision_id'] for r in designs if r.get('legacy_id')}
    
    molds = get_data("physical_molds", "physical_mold_id,legacy_id")
    mold_map = {str(r['legacy_id']): r['physical_mold_id'] for r in molds if r.get('legacy_id')}

    updates = []
    with open('source_data/csv-access-data/jobs.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            job_code = r.get('JobCode')
            if job_code == 'STD012R1':
                print("FOUND JOB:", r)
                design_legacy = r.get('MoldDesignID')
                mold_legacy = r.get('MoldID')
                print("MoldDesignID:", design_legacy, "In map?", design_legacy in design_map)
                print("MoldID:", mold_legacy, "In map?", mold_legacy in mold_map)
                
                design_uuid = design_map.get(str(design_legacy)) if design_legacy else None
                mold_uuid = mold_map.get(str(mold_legacy)) if mold_legacy else None
                
                set_clauses = []
                if design_uuid:
                    set_clauses.append(f"design_revision_id = '{design_uuid}'")
                if mold_uuid:
                    set_clauses.append(f"physical_mold_id = '{mold_uuid}'")
                    
                if set_clauses:
                    sql = f"UPDATE jobs SET {', '.join(set_clauses)} WHERE job_code = '{job_code}';"
                    print("SQL:", sql)
                    print("Result:", run_sql(sql))

if __name__ == "__main__":
    main()
