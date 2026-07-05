import os
import sys
import pandas as pd
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Set up paths and load env
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
env_path = ROOT_DIR / '.env.local'
load_dotenv(env_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
CSV_DIR = ROOT_DIR / 'source_data' / 'csv-access-data'

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fix_all_statuses():
    print("--- 1. Fixing processing_statuses table names (Resolving Mojibake) ---")
    
    clean_statuses = {
        1: {'status_code': '0.未確認', 'status_name_vi': '0.Chưa xác nhận'},
        2: {'status_code': '1.プログラム', 'status_name_vi': '1.Lập trình'},
        3: {'status_code': '2.機械加工', 'status_name_vi': '2.Gia công cơ khí'},
        4: {'status_code': '3.穴あけ', 'status_name_vi': '3.Khoan lỗ'},
        5: {'status_code': '4.みがき', 'status_name_vi': '4.Đánh bóng'},
        6: {'status_code': '5.プラグ作成', 'status_name_vi': '5.Tạo plug'},
        7: {'status_code': '6.ネル貼り', 'status_name_vi': '6.Dán nỉ'},
        8: {'status_code': 'F.完了', 'status_name_vi': 'F.Hoàn thành'},
        9: {'status_code': 'N.進行中', 'status_name_vi': 'N.Đang chạy'},
        10: {'status_code': 'R.REQUEST', 'status_name_vi': 'R.Yêu cầu'},
        11: {'status_code': 'ZF.材料有', 'status_name_vi': 'ZF.Có nguyên liệu'},
        12: {'status_code': 'ZN.材料待ち', 'status_name_vi': 'ZN.Chờ nguyên liệu'},
        13: {'status_code': 'ZR.材料 Request', 'status_name_vi': 'ZR.Yêu cầu nguyên liệu'}
    }

    for status_id, data in clean_statuses.items():
        supabase.table('processing_statuses').update({
            'status_code': data['status_code'],
            'status_name_vi': data['status_name_vi']
        }).eq('status_id', status_id).execute()
        print(f"Updated status_id {status_id} -> {data['status_code']}")

    print("\n--- 2. Reconstructing ID registry from CSV files ---")
    # 2.1 Map legacy JobID -> Supabase job_uuid via jobs.csv
    df_jobs = pd.read_csv(CSV_DIR / 'jobs.csv')
    legacy_job_to_code = {}
    for _, row in df_jobs.iterrows():
        if pd.notna(row['JobID']) and pd.notna(row['JobCode']):
            job_id = str(row['JobID'])
            if job_id.endswith(".0"): job_id = job_id[:-2]
            legacy_job_to_code[job_id] = str(row['JobCode']).strip()

    # Fetch all jobs from Supabase (with pagination)
    db_jobs_data = []
    limit = 1000
    offset = 0
    while True:
        res = supabase.table('jobs').select('job_id, job_code').range(offset, offset + limit - 1).execute()
        data = res.data
        if not data:
            break
        db_jobs_data.extend(data)
        offset += limit
    code_to_uuid = {j['job_code']: j['job_id'] for j in db_jobs_data}

    job_registry = {}
    for l_id, code in legacy_job_to_code.items():
        # Match either exact code or compact/hyphen variants
        compact_code = code.replace('-', '')
        if code in code_to_uuid:
            job_registry[l_id] = code_to_uuid[code]
        elif compact_code in code_to_uuid:
            job_registry[l_id] = code_to_uuid[compact_code]
            
    print(f"Mapped {len(job_registry)} jobs from jobs.csv to Supabase.")

    # 2.2 Read processingdeadline.csv for true statuses
    df_steps = pd.read_csv(CSV_DIR / 'processingdeadline.csv')
    csv_step_map_by_item_type = {} # (job_uuid, item_type_id) -> (proc_status_id, ProcessingDeadlineID)
    csv_step_map_by_no = {}        # (job_uuid, step_no) -> (proc_status_id, ProcessingDeadlineID)
    
    # We must sort to resolve duplicates in the same way importers/job.py did
    df_steps_sorted = df_steps.sort_values('ProcessingDeadlineID')
    job_step_seen = set()
    
    for _, row in df_steps_sorted.iterrows():
        l_job_id = str(row['JobID'])
        if l_job_id.endswith(".0"): l_job_id = l_job_id[:-2]
        
        job_uuid = job_registry.get(l_job_id)
        if not job_uuid:
            continue
            
        step_no = int(row['IDJobNo']) if 'IDJobNo' in row and str(row['IDJobNo']).replace('.0','').isdigit() else 1
        while (job_uuid, step_no) in job_step_seen:
            step_no += 1
        job_step_seen.add((job_uuid, step_no))
        
        proc_status_id = None
        if 'ProcessingStatusID' in row and pd.notna(row['ProcessingStatusID']):
            try:
                proc_status_id = int(float(row['ProcessingStatusID']))
            except:
                pass
                
        item_type_id = None
        if 'ItemTypeID' in row and pd.notna(row['ItemTypeID']):
            try:
                item_type_id = int(float(row['ItemTypeID']))
            except:
                pass
                
        legacy_step_id = str(row['ProcessingDeadlineID'])
        if legacy_step_id.endswith(".0"): legacy_step_id = legacy_step_id[:-2]
        
        csv_step_map_by_no[(job_uuid, step_no)] = (proc_status_id, legacy_step_id)
        if item_type_id is not None:
            csv_step_map_by_item_type[(job_uuid, item_type_id)] = (proc_status_id, legacy_step_id)

    print(f"Mapped {len(csv_step_map_by_no)} steps from processingdeadline.csv.")

    print("\n--- 3. Restoring true statuses in job_steps ---")
    
    # Fetch all job steps from Supabase
    all_steps = []
    limit = 1000
    offset = 0
    while True:
        res = supabase.table('job_steps').select('step_id, job_id, step_no, item_type_id, processing_status_id, step_status').range(offset, offset + limit - 1).execute()
        data = res.data
        if not data:
            break
        all_steps.extend(data)
        offset += limit
        
    print(f"Fetched {len(all_steps)} job steps from Supabase.")

    status_mapping = {
        1: 'PENDING',        # 0.未確認
        2: 'IN_PROGRESS',    # 1.プログラム
        3: 'IN_PROGRESS',    # 2.機械加工
        4: 'IN_PROGRESS',    # 3.穴あけ
        5: 'IN_PROGRESS',    # 4.みがき
        6: 'IN_PROGRESS',    # 5.プラグ作成
        7: 'IN_PROGRESS',    # 6.ネル貼り
        8: 'COMPLETED',      # F.完了
        9: 'IN_PROGRESS',    # N.進行中
        10: 'IN_PROGRESS',   # R.REQUEST
        11: 'COMPLETED',     # ZF.材料有
        12: 'IN_PROGRESS',   # ZN.材料待ち
        13: 'IN_PROGRESS'    # ZR.材料 Request
    }

    step_updates = 0
    completed_step_ids = []
    
    for step in all_steps:
        # Match by (job_id, item_type_id) first, fallback to (job_id, step_no)
        key_item = (step['job_id'], step['item_type_id']) if step['item_type_id'] is not None else None
        key_no = (step['job_id'], step['step_no'])
        
        csv_info = None
        if key_item and key_item in csv_step_map_by_item_type:
            csv_info = csv_step_map_by_item_type[key_item]
        elif key_no in csv_step_map_by_no:
            csv_info = csv_step_map_by_no[key_no]
            
        if csv_info:
            csv_status_id, legacy_step_id = csv_info
            target_status = status_mapping.get(csv_status_id, 'PENDING') if csv_status_id is not None else 'PENDING'
            
            # Check if database values differ from CSV truth
            if step['processing_status_id'] != csv_status_id or step['step_status'] != target_status:
                supabase.table('job_steps').update({
                    'processing_status_id': csv_status_id,
                    'step_status': target_status,
                    'updated_at': datetime.now().isoformat() if 'datetime' in sys.modules else None
                }).eq('step_id', step['step_id']).execute()
                step_updates += 1
                
            if target_status == 'COMPLETED':
                completed_step_ids.append(step['step_id'])

    print(f"Updated {step_updates} job steps to match original CSV status.")

    print("\n--- 4. Updating work_logs.is_finished to True for completed steps ---")
    print(f"Completed steps count: {len(completed_step_ids)}")
    
    batch_size = 100
    updated_logs_count = 0
    for i in range(0, len(completed_step_ids), batch_size):
        batch = completed_step_ids[i:i+batch_size]
        res_logs = supabase.table('work_logs').select('log_id').in_('job_step_id', batch).eq('is_finished', False).execute()
        logs_to_update = res_logs.data
        if logs_to_update:
            log_ids = [l['log_id'] for l in logs_to_update]
            # Update each log
            for lid in log_ids:
                supabase.table('work_logs').update({'is_finished': True}).eq('log_id', lid).execute()
                updated_logs_count += 1
            print(f"Updated {updated_logs_count} work logs...")
    print(f"Finished updating {updated_logs_count} work logs to is_finished = True.")

    print("\n--- 5. Recalculating jobs.overall_progress & jobs.job_status ---")
    
    all_jobs = []
    offset = 0
    while True:
        res = supabase.table('jobs').select('job_id').range(offset, offset + limit - 1).execute()
        data = res.data
        if not data:
            break
        all_jobs.extend(data)
        offset += limit
        
    print(f"Total jobs to check: {len(all_jobs)}")
    
    for job in all_jobs:
        job_id = job['job_id']
        
        # Get all steps for this job
        res_steps = supabase.table('job_steps').select('step_status').eq('job_id', job_id).execute()
        steps = res_steps.data
        
        if not steps:
            supabase.table('jobs').update({
                'overall_progress': 0,
                'job_status': 'PENDING'
            }).eq('job_id', job_id).execute()
            continue
            
        total = len(steps)
        completed = len([s for s in steps if s['step_status'] == 'COMPLETED'])
        progress = int(round((completed / total) * 100)) if total > 0 else 0
        
        if progress >= 100:
            job_status = 'COMPLETED'
        elif progress > 0:
            job_status = 'IN_PROGRESS'
        else:
            job_status = 'NEW'
            
        supabase.table('jobs').update({
            'overall_progress': progress,
            'job_status': job_status
        }).eq('job_id', job_id).execute()

    print("\nOverall progress and job status recalculation completed successfully!")

if __name__ == '__main__':
    fix_all_statuses()
