import os
import csv
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

def parse_date(date_str):
    if not date_str:
        return "NULL"
    try:
        d = datetime.strptime(date_str.strip(), "%m/%d/%Y")
        return f"'{d.strftime('%Y-%m-%d')}'"
    except Exception:
        return "NULL"

def main():
    print("Fetching mappings...")
    rack_layers = get_data("rack_layers", "id,legacy_id")
    rl_map = {r['legacy_id']: r['id'] for r in rack_layers if r.get('legacy_id')}
    
    companies = get_data("companies", "company_id,company_name")
    company_map = {r['company_name']: r['company_id'] for r in companies if r.get('company_name')}

    updates = []

    # Process molds
    print("Processing physical molds...")
    with open('source_data/csv-access-data/molds.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            lid = r.get('MoldID')
            if not lid: continue
            rl_id = r.get('RackLayerID')
            keeper = r.get('KeeperCompany', '').strip()
            
            rl_uuid = rl_map.get(rl_id)
            keeper_uuid = company_map.get(keeper)
            
            set_clauses = []
            if rl_uuid:
                set_clauses.append(f"current_rack_layer_id = '{rl_uuid}'")
            if keeper_uuid:
                set_clauses.append(f"keeper_company_id = '{keeper_uuid}'")
                
            if set_clauses:
                sql = f"UPDATE physical_molds SET {', '.join(set_clauses)} WHERE legacy_id = '{lid}';"
                updates.append(sql)
            else:
                if len(updates) == 0: print(f"No update for Mold {lid}: rl={rl_id} keeper={keeper}")

    # Process cutters
    print("Processing cutters...")
    with open('source_data/csv-access-data/cutters.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            lid = r.get('CutterID')
            if not lid: continue
            rl_id = r.get('RackLayerID')
            keeper = r.get('KeeperCompany', '').strip()
            mfg_date = r.get('CutterManufactureDate')
            
            rl_uuid = rl_map.get(rl_id)
            keeper_uuid = company_map.get(keeper)
            mfg_date_sql = parse_date(mfg_date)
            
            set_clauses = []
            if rl_uuid:
                set_clauses.append(f"current_rack_layer_id = '{rl_uuid}'")
            if keeper_uuid:
                set_clauses.append(f"keeper_company_id = '{keeper_uuid}'")
            if mfg_date_sql != "NULL":
                set_clauses.append(f"manufacture_date = {mfg_date_sql}")
                
            if set_clauses:
                sql = f"UPDATE cutters SET {', '.join(set_clauses)} WHERE legacy_id = '{lid}';"
                updates.append(sql)
            else:
                if len(updates) == 0: print(f"No update for Cutter {lid}: rl={rl_id} keeper={keeper} date={mfg_date}")

    print(f"Total update statements: {len(updates)}")
    
    # Run in batches
    batch_size = 200
    ok = 0
    for i in range(0, len(updates), batch_size):
        batch = updates[i:i+batch_size]
        sql_batch = "\n".join(batch)
        if run_sql(sql_batch):
            ok += len(batch)
            print(f"Updated {ok}/{len(updates)}")
        else:
            print("Batch failed!")
            
if __name__ == "__main__":
    main()
