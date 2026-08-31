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

def patch_job(args):
    url, headers, payload = args
    r = requests.patch(url, headers=headers, json=payload)
    if r.status_code not in (200, 204):
        return f"Error: {r.text}"
    return "OK"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true', help='Execute DB updates via REST')
    args = parser.parse_args()

    jobs_data = read_csv('jobs.csv')
    
    print("Fetching existing jobs from Supabase...")
    url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/jobs?select=job_id,legacy_id'
    headers = get_rest_headers()
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Error fetching jobs: {r.text}")
        return
        
    db_jobs = {row['legacy_id']: row['job_id'] for row in r.json()}

    updates = []
    
    for row in jobs_data:
        j_id = row.get('JobID')
        if not j_id: continue
        
        legacy_id = f"LEGACY-JOB-{j_id}"
        if legacy_id not in db_jobs:
            continue
            
        start_date = parse_date(row.get('JobStartDate'))
        deadline = parse_date(row.get('DeliveryDeadline'))
        mold_deadline = parse_date(row.get('MoldShippingDate'))
        
        if not start_date and not deadline and not mold_deadline:
            continue
            
        updates.append({
            'job_id': db_jobs[legacy_id],
            'payload': {
                'start_date': start_date,
                'deadline': deadline,
                'mold_deadline': mold_deadline
            }
        })

    if args.execute:
        print("\n--- EXECUTE MODE: UPDATING DATES WITH THREADS ---")
        base_url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/jobs'
        tasks = []
        for u in updates:
            patch_url = f"{base_url}?job_id=eq.{u['job_id']}"
            tasks.append((patch_url, headers, u['payload']))
            
        successes = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            for result in executor.map(patch_job, tasks):
                if result == "OK":
                    successes += 1
                else:
                    print(result)
        print(f"Successfully updated {successes}/{len(updates)} jobs.")

if __name__ == "__main__":
    main()
