# -*- coding: utf-8 -*-
"""
Backfill all records from equipment_status_logs into equipment_history
so that equipment_history is the single source of truth for check-in/out history logs.
"""
import sys
import json
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"

headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}

def sync_logs():
    print("=== BACKFILLING EQUIPMENT_STATUS_LOGS TO EQUIPMENT_HISTORY ===")

    # 1. Fetch all records from equipment_status_logs
    url = f"{SUPABASE_URL}/rest/v1/equipment_status_logs?select=*"
    req = urllib.request.Request(url, headers={**headers, 'Range': '0-5000'})
    with urllib.request.urlopen(req) as resp:
        status_logs = json.loads(resp.read().decode('utf-8'))

    print(f"Fetched {len(status_logs)} records from equipment_status_logs.")

    history_inserts = []
    for log in status_logs:
        eq_id = log.get('equipment_id')
        if not eq_id:
            continue
        
        status_val = log.get('status') or 'IN'
        act_date = log.get('action_date') or log.get('created_at')
        if act_date and len(act_date) >= 10:
            act_date_str = act_date[:10]
        else:
            act_date_str = "2024-01-01"

        history_inserts.append({
            "equipment_id": eq_id,
            "action_type": status_val,
            "action_date": act_date_str,
            "performed_by": log.get('employee_id'),
            "description": log.get('notes') or f"Lịch sử {status_val} từ Access statuslogs",
            "created_at": log.get('created_at') or log.get('action_date')
        })

    print(f"Prepared {len(history_inserts)} history records to insert...")

    # Insert in batches
    inserted_cnt = 0
    batch_size = 50
    for i in range(0, len(history_inserts), batch_size):
        batch = history_inserts[i:i+batch_size]
        post_url = f"{SUPABASE_URL}/rest/v1/equipment_history"
        post_req = urllib.request.Request(post_url, data=json.dumps(batch).encode('utf-8'), headers={**headers, 'Prefer': 'return=representation'}, method="POST")
        try:
            with urllib.request.urlopen(post_req) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                inserted_cnt += len(res)
        except Exception as e:
            print(f"Batch insert note: {e}")

    print(f"Successfully inserted {inserted_cnt} history records into equipment_history!")

if __name__ == '__main__':
    sync_logs()
