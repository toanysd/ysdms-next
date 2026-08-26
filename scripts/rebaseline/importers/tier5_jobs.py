import sys
from pathlib import Path
import uuid

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, safe_int, safe_float, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

# Assuming there's a job_type_parser in utils or we mock it
try:
    from utils.job_type_parser import parse_job_type
except ImportError:
    def parse_job_type(val):
        return (val, None)

# Fallback map for item_type_code → Japanese name (when CSV encoding is broken)
ITEM_TYPE_FALLBACK = {
    'ALUMI': 'アルミ',
    'MOLD':  '金型',
    'PLUG':  'プラグ',
    'CUTTER': '抜型',
    'CNC':   'CNC',
    'PLUG1': 'プラグ1',
    'PLUG2': 'プラグ2',
}

def load_item_type_map() -> dict:
    """Load ItemTypeID → (code, name_ja) mapping from itemtype.csv."""
    item_map = {}
    it_path = CSV_DIR / 'itemtype.csv'
    if not it_path.exists():
        print(f"Warning: itemtype.csv not found, using fallback item type names.")
        return item_map
    try:
        df = read_csv(it_path)
        for _, row in df.iterrows():
            type_id = safe_int(row.get('ItemTypeID'))
            if type_id is None:
                continue
            code = clean_value(row.get('ItemType')) or ''
            # ItemTypeName may be garbled due to encoding; prefer fallback by code
            name_ja = clean_value(row.get('ItemTypeName')) or ITEM_TYPE_FALLBACK.get(code, code)
            item_map[str(type_id)] = {'code': code, 'name_ja': name_ja}
    except Exception as e:
        print(f"Warning: Could not load itemtype.csv: {e}")
    return item_map


def import_tier5(supabase, registry: IdRegistry, stats: ImportStats, dry_run: bool = False):
    print("--- Importing Tier 5: Jobs & Logs ---")

    # Pre-load item type map for step_name generation
    item_type_map = load_item_type_map()
    print(f"  Loaded {len(item_type_map)} item types for step name mapping.")

    # step_to_job: step_legacy_id → job_id UUID (populated in 5B, used in 5C)
    step_to_job: dict = {}

    # 5A. Jobs
    jobs_path = CSV_DIR / 'jobs.csv'
    if jobs_path.exists():
        df_jobs = read_csv(jobs_path)
        records = []
        seen_job_codes: Dict[str, int] = {}
        for _, row in df_jobs.iterrows():
            orig_id = clean_id(row.get('JobID'))
            legacy_id = f"JOB-{orig_id}"
            job_id = str(uuid.uuid4())
            
            design_revision_id = registry.lookup('design_revisions', clean_id(row.get('MoldDesignID')))
            physical_mold_id = registry.lookup('equipment', clean_id(row.get('MoldID')))
            company_id = registry.lookup('customers', clean_id(row.get('CustomerID')))
            if not company_id:
                company_id = registry.lookup('companies', clean_id(row.get('CustomerID')))
                
            job_type_name, job_type_id = parse_job_type(clean_value(row.get('ReleasePeriod')))
            
            completed = parse_date(row.get('CompletedDate'))
            start = parse_date(row.get('JobStartDate'))
            deadline_val = parse_date(row.get('DeliveryDeadline'))
            ship_val = parse_date(row.get('MoldShippingDate'))

            if completed:
                job_status = 'COMPLETED'
            elif start:
                job_status = 'IN_PROGRESS'
            else:
                job_status = 'PENDING'
                
            appr_val = clean_value(row.get('Approved'))
            approved = str(appr_val).lower() in ['true', '1', '-1']

            base_code = clean_value(row.get('JobCode')) or f"JOB-{orig_id}"
            if base_code in seen_job_codes:
                seen_job_codes[base_code] += 1
                j_code = f"{base_code}-{seen_job_codes[base_code]}"
            else:
                seen_job_codes[base_code] = 1
                j_code = base_code

            j_name = clean_value(row.get('JobName')) or j_code

            record = {
                'job_id': job_id,
                'legacy_id': legacy_id,
                'job_code': j_code,
                'job_name': j_name,
                'design_revision_id': design_revision_id,
                'physical_mold_id': physical_mold_id,
                'company_id': company_id,
                'job_type_id': job_type_id,
                'start_date': start,
                'ship_date': ship_val,
                'mold_deadline': deadline_val,
                'deadline': deadline_val,
                'completed_date': completed,
                'estimated_hours': safe_float(row.get('EstimatedHours')),
                'approved': approved,
                'priority': safe_int(row.get('Priority')),
                'year_period': safe_int(row.get('YearPeriod')),
                'month_period': safe_int(row.get('MonthPeriod')),
                'notes': clean_value(row.get('JobNotes')),
                'job_status': job_status
            }
            records.append(record)
            registry.register('jobs', orig_id, job_id)
            
        stats.log_table('jobs', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('jobs').upsert(chunk).execute()
    else:
        print(f"Warning: {jobs_path.name} not found.")

    # 5B. Job Steps (processingdeadline.csv)
    # CSV columns: ProcessingDeadlineID, JobID, IDJobNo, ItemTypeID, ProcessingStatusID,
    #              MachiningCustomerID, ProcessingDeadline, EstimatedHours, Set, Tehai,
    #              DrawingReceiptDate, ProcessingNotes, IDCapDC, UpdatedAt, UpdatedBy
    steps_path = CSV_DIR / 'processingdeadline.csv'
    if steps_path.exists():
        df_steps = read_csv(steps_path)
        records = []
        step_counter_by_job: dict = {}  # job_id → step counter for step_no
        for _, row in df_steps.iterrows():
            orig_id = clean_id(row.get('ProcessingDeadlineID'))
            legacy_id = orig_id
            step_id = str(uuid.uuid4())
            
            job_legacy = clean_id(row.get('JobID'))
            job_id = registry.lookup('jobs', job_legacy)
            if not job_id:
                stats.log_error('job_steps', legacy_id, f"Missing JobID: {row.get('JobID')}")
                continue

            # Map ItemTypeID → step_name and track
            item_type_id_raw = safe_int(row.get('ItemTypeID'))
            item_type_id = str(item_type_id_raw) if item_type_id_raw is not None else None
            item_info = item_type_map.get(item_type_id, {}) if item_type_id else {}
            step_name = item_info.get('name_ja') or item_info.get('code') or f'Step {orig_id}'
            track = item_info.get('code') or None

            # Auto step_no: increment per job
            step_counter_by_job[job_id] = step_counter_by_job.get(job_id, 0) + 1
            step_no = step_counter_by_job[job_id]

            record = {
                'step_id': step_id,
                'job_id': job_id,
                'step_no': step_no,
                'step_name': step_name,
                'track': track,
                'item_type_id': item_type_id_raw,
                'processing_status_id': safe_int(row.get('ProcessingStatusID')),
                'deadline': parse_date(row.get('ProcessingDeadline')),      # correct column name
                'drawing_receipt_date': parse_date(row.get('DrawingReceiptDate')),
                'estimated_hours': safe_float(row.get('EstimatedHours')),
                'set_info': clean_value(row.get('Set')),
                'tehai_info': clean_value(row.get('Tehai')),
                'notes': clean_value(row.get('ProcessingNotes')),            # correct column name
            }
            records.append(record)
            registry.register('job_steps', orig_id, step_id)
            step_to_job[orig_id] = job_id  # track step → job mapping

        stats.log_table('job_steps', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('job_steps').upsert(chunk).execute()
    else:
        print(f"Warning: {steps_path.name} not found.")

    # Build reverse map: step_legacy_id → job_id (used by work_logs)
    # This is populated above during job_steps processing
    # 5C. Work Logs (worklog.csv)
    # CSV columns: WorkLogID, ProcessingDeadlineID, EmployeeID, ProcessingCodeID,
    #              ProcessingTime, ProcessingDate, ProcessingNotes, ProcessingNumbers,
    #              FinishDate, Finished, Noidunglienlac, CompanyID, UpdatedAt, UpdatedBy
    logs_path = CSV_DIR / 'worklog.csv'
    if logs_path.exists():
        df_logs = read_csv(logs_path)
        records = []
        skipped_no_employee = 0
        skipped_no_date = 0
        for _, row in df_logs.iterrows():
            legacy_id = clean_value(row.get('WorkLogID'))
            log_id = str(uuid.uuid4())
            
            step_legacy = clean_id(row.get('ProcessingDeadlineID'))
            job_step_id = registry.lookup('job_steps', step_legacy)
            # Resolve job_id from step mapping
            job_id_for_log = step_to_job.get(step_legacy)
            if not job_id_for_log:
                stats.log_error('work_logs', legacy_id, f"Cannot resolve job_id for ProcessingDeadlineID={step_legacy}")
                continue

            employee_id = registry.lookup('employees', clean_id(row.get('EmployeeID')))
            if not employee_id:
                skipped_no_employee += 1
                stats.log_error('work_logs', legacy_id, f"Missing EmployeeID: {row.get('EmployeeID')}")
                continue
            
            # Correct column: ProcessingDate (NOT WorkDate)
            work_date = parse_date(row.get('ProcessingDate'))
            if not work_date:
                # Try FinishDate as fallback
                work_date = parse_date(row.get('FinishDate'))
            if not work_date:
                skipped_no_date += 1
                stats.log_error('work_logs', legacy_id, f"Missing work date for WorkLogID={legacy_id}")
                continue

            # Correct column: Finished (NOT IsFinished)
            is_finished_val = clean_value(row.get('Finished'))
            is_finished = str(is_finished_val).upper() in ['TRUE', '1', '-1', 'YES']
            
            machine_id = registry.lookup('machines', clean_id(row.get('MachineID')))

            record = {
                'log_id': log_id,
                'job_id': job_id_for_log,
                'job_step_id': job_step_id,
                'employee_id': employee_id,
                'processing_code_id': safe_int(row.get('ProcessingCodeID')),
                'machine_id': machine_id,
                'hours_spent': safe_float(row.get('ProcessingTime')),
                'work_date': work_date,
                'is_finished': is_finished,
                'description': clean_value(row.get('ProcessingNotes')),
                'notes': clean_value(row.get('Noidunglienlac')),
                'contact_content': clean_value(row.get('Noidunglienlac')),
            }
            records.append(record)

        if skipped_no_employee > 0:
            print(f"  WARNING: Skipped {skipped_no_employee} work_logs with unresolved EmployeeID")
        if skipped_no_date > 0:
            print(f"  WARNING: Skipped {skipped_no_date} work_logs with no valid work date")

        stats.log_table('work_logs', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('work_logs').upsert(chunk).execute()
    else:
        print(f"Warning: {logs_path.name} not found.")
