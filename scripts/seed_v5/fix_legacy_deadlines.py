import sys
import os
import pandas as pd
from pathlib import Path
import calendar

# Add parent dir to path
sys.path.append('d:/AntiGravity_Workspace/apps/ysdms-nextgen/scripts/seed_v5')
from config import get_supabase_client, CSV_DIR

supabase = get_supabase_client()

def main():
    print("Starting legacy job deadlines update...")
    
    csv_path = CSV_DIR / 'jobs.csv'
    if not csv_path.exists():
        print(f"Error: jobs.csv not found at {csv_path}")
        return
        
    df_jobs = pd.read_csv(csv_path, encoding='utf-8-sig')
    jobs_csv_map = {}
    for _, row in df_jobs.iterrows():
        if pd.notna(row['JobCode']):
            code = str(row['JobCode']).strip()
            jobs_csv_map[code] = {
                'JobStartDate': str(row['JobStartDate']) if pd.notna(row['JobStartDate']) else None,
                'DateEntry': str(row['DateEntry']) if pd.notna(row['DateEntry']) else None,
                'YearPeriod': str(row['YearPeriod']) if pd.notna(row['YearPeriod']) else None,
                'MonthPeriod': str(row['MonthPeriod']) if pd.notna(row['MonthPeriod']) else None,
            }

    res = supabase.table('jobs').select('job_id, job_code, job_name, deadline, mold_deadline').is_('deadline', 'null').execute()
    jobs_to_fix = res.data
    print(f"Found {len(jobs_to_fix)} jobs with null original deadline in DB.")

    updated_count = 0
    
    for j in jobs_to_fix:
        job_id = j['job_id']
        code = j['job_code']
        current_mdl = j['mold_deadline']
        
        csv_info = jobs_csv_map.get(code, {})
        
        res_logs = supabase.table('work_logs').select('work_date').eq('job_id', job_id).execute()
        log_dates = [l['work_date'] for l in res_logs.data if l.get('work_date')]
        max_log = max(log_dates) if log_dates else None
        
        proposed = None
        method = ""
        
        if csv_info.get('JobStartDate'):
            try:
                d_parts = csv_info['JobStartDate'].split('/')
                proposed = f"{d_parts[2]}-{d_parts[0].zfill(2)}-{d_parts[1].zfill(2)}"
                method = "CSV JobStartDate"
            except:
                pass
                
        if not proposed and max_log:
            proposed = max_log
            method = "Max Worklog Date"
            
        if not proposed and csv_info.get('DateEntry'):
            try:
                d_parts = csv_info['DateEntry'].split('/')
                proposed = f"{d_parts[2]}-{d_parts[0].zfill(2)}-{d_parts[1].zfill(2)}"
                method = "CSV DateEntry"
            except:
                pass
                
        if not proposed and csv_info.get('YearPeriod'):
            try:
                year = int(float(csv_info['YearPeriod']))
                if year > 2000:
                    month = csv_info.get('MonthPeriod')
                    if month and pd.notna(month) and float(month) > 0:
                        month_int = int(float(month))
                        last_day = calendar.monthrange(year, month_int)[1]
                        proposed = f"{year}-{str(month_int).zfill(2)}-{last_day}"
                        method = "CSV Year-Month Period"
                    else:
                        proposed = f"{year}-12-31"
                        method = "CSV Year Period"
            except:
                pass
                
        if not proposed:
            proposed = None
            method = "No Date Found -> Nullify"
            
        if proposed != current_mdl:
            print(f"Updating [{code}]: {current_mdl} -> {proposed} (Source: {method})")
            supabase.table('jobs').update({'mold_deadline': proposed}).eq('job_id', job_id).execute()
            updated_count += 1
        else:
            print(f"Skipping [{code}]: Current {current_mdl} matches proposed {proposed}")

    print(f"\nSuccessfully updated {updated_count} jobs.")

if __name__ == '__main__':
    main()
