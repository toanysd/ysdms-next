import os
import csv
import codecs
import argparse
import requests
from dotenv import load_dotenv
import concurrent.futures

load_dotenv('.env.local')
DATA_DIR = r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\csv-access-data"

def get_rest_headers():
    key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
    return {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }

def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    try:
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError:
        with codecs.open(path, 'r', encoding='shift_jis', errors='replace') as f:
            content = f.read()
    return list(csv.DictReader(content.splitlines()))

def parse_date(date_str):
    if not date_str or not date_str.strip():
        return None
    return date_str.strip()

def patch_step(args):
    url, headers, payload = args
    r = requests.patch(url, headers=headers, json=payload)
    if r.status_code not in (200, 204):
        return f"Error: {r.text}"
    return "OK"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    args = parser.parse_args()

    steps_data = read_csv('processingdeadline.csv')
    
    print("Fetching existing steps from Supabase...")
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/job_steps?select=step_id,legacy_id&limit=3000'
    headers = get_rest_headers()
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Error fetching steps: {r.text}")
        return
        
    db_steps = {row['legacy_id']: row['step_id'] for row in r.json()}

    updates = []
    
    for row in steps_data:
        s_id = row.get('ProcessingDeadlineID')
        if not s_id: continue
        
        legacy_id = f"LEGACY-STEP-{s_id}"
        if legacy_id not in db_steps:
            continue
            
        deadline = parse_date(row.get('ProcessingDeadline'))
        est_hours = row.get('EstimatedHours')
        
        payload = {}
        if deadline: payload['deadline'] = deadline
        if est_hours: 
            try:
                payload['estimated_hours'] = float(est_hours)
            except ValueError:
                pass
                
        if not payload:
            continue
            
        updates.append({
            'step_id': db_steps[legacy_id],
            'payload': payload
        })

    print(f"--- DRY RUN: Found {len(updates)} steps to update out of {len(db_steps)} ---")

    if args.execute:
        print("\n--- EXECUTE MODE: UPDATING DATES WITH THREADS ---")
        base_url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/job_steps'
        tasks = []
        for u in updates:
            patch_url = f"{base_url}?step_id=eq.{u['step_id']}"
            tasks.append((patch_url, headers, u['payload']))
            
        successes = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            for result in executor.map(patch_step, tasks):
                if result == "OK":
                    successes += 1
                else:
                    print(result)
        print(f"Successfully updated {successes}/{len(updates)} steps.")

if __name__ == "__main__":
    main()
