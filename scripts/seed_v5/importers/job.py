import uuid
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_jobs(supabase, registry: IdRegistry):
    print("--- Importing Jobs & Work Logs ---")
    
    # 1. jobs
    df_jobs = clean_dataframe(read_csv_safe(CSV_DIR / 'jobs.csv'))
    job_records = []
    job_codes_seen = set()
    for _, row in df_jobs.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['JobID'])
        registry.register('jobs', legacy_id, new_uuid)
        
        dr_uuid = registry.resolve('design_revisions', row['MoldDesignID'])
        product_uuid = registry.resolve('mold_design_to_product', row['MoldDesignID'])
        emp_uuid = registry.resolve('employees', row['ResponsiblePersonID'])
        mc_uuid = registry.resolve('machining_customers', row['MachiningCustomerID'])
        
        base_code = str(row['JobCode']) if 'JobCode' in row and row['JobCode'] else legacy_id
        job_code = base_code
        counter = 1
        while job_code in job_codes_seen:
            job_code = f"{base_code}-{counter}"
            counter += 1
        job_codes_seen.add(job_code)

        job_records.append({
            'job_id': new_uuid,
            'legacy_id': legacy_id,
            'job_code': job_code,
            'job_name': str(row['JobName']) if row['JobName'] else None,
            'design_revision_id': dr_uuid,
            'product_id': product_uuid,
            'responsible_id': emp_uuid,
            'outsource_company': mc_uuid,
            'job_status': 'PENDING',
            'notes': str(row['JobNote']) if row['JobNote'] else None,
            'physical_mold_id': registry.resolve('physical_molds', row['MoldID']) if 'MoldID' in row else None,
            'ship_date': str(row['DeliveryDeadline']) if 'DeliveryDeadline' in row and row['DeliveryDeadline'] else None,
            'start_date': str(row['JobStartDate']) if 'JobStartDate' in row and row['JobStartDate'] else None,
            'year_period': int(row['YearPeriod']) if 'YearPeriod' in row and str(row['YearPeriod']).replace('.','',1).isdigit() else None,
            'month_period': int(row['MonthPeriod']) if 'MonthPeriod' in row and str(row['MonthPeriod']).replace('.','',1).isdigit() else None,
            'approved': True if 'Approved' in row and str(row['Approved']).upper() == 'TRUE' else False,
            'job_type_id': '1'
        })
    if job_records:
        chunk_size = 500
        for i in range(0, len(job_records), chunk_size):
            supabase.table('jobs').insert(job_records[i:i+chunk_size]).execute()
        print(f"Imported {len(job_records)} jobs")

    # 2. job_steps
    df_steps = clean_dataframe(read_csv_safe(CSV_DIR / 'processingdeadline.csv'))
    step_records = []
    job_step_seen = set()
    for _, row in df_steps.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['ProcessingDeadlineID'])
        registry.register('job_steps', legacy_id, new_uuid)
        
        job_uuid = registry.resolve('jobs', row['JobID'])
        if not job_uuid:
            continue
        
        step_no = int(row['IDJobNo']) if 'IDJobNo' in row and str(row['IDJobNo']).isdigit() else 1
        while (job_uuid, step_no) in job_step_seen:
            step_no += 1
        job_step_seen.add((job_uuid, step_no))
        
        registry.register('step_to_job', legacy_id, job_uuid)
        
        # Fix: CSV floats (2.0) need int(float()) conversion, not str().isdigit()
        import pandas as _pd
        item_type_id = None
        if 'ItemTypeID' in row and not _pd.isna(row['ItemTypeID']):
            try:
                item_type_id = int(float(row['ItemTypeID']))
            except (ValueError, TypeError):
                pass
        
        # Map item_type_id to Japanese name (from item_types table = tblItemType)
        ITEM_TYPE_NAMES_JA = {
            1: 'アルミ材', 2: '金型', 3: 'プラグ', 4: '抜型',
            5: '水冷盤', 6: '圧空ベース', 7: 'スタッキング',
            8: 'フレーム', 9: '機械など', 10: '成形・プレス・出荷など', 11: '試作金型',
        }
        ITEM_TYPE_CODES = {
            1: 'ALUMI', 2: 'MOLD', 3: 'PLUG', 4: 'CUTTER',
            5: 'WATER COOLING BASE', 6: 'PRESSIER BASE', 7: 'STAKING',
            8: 'FRAME', 9: 'MACHINE', 10: 'OTHER', 11: 'TEST MOLD',
        }
        step_name = ITEM_TYPE_NAMES_JA.get(item_type_id, f"Track {step_no}")
        track = ITEM_TYPE_CODES.get(item_type_id, 'MOLD')
        
        # Fix: processing_status_id also float in CSV
        proc_status_id = None
        if 'ProcessingStatusID' in row and not _pd.isna(row['ProcessingStatusID']):
            try:
                proc_status_id = int(float(row['ProcessingStatusID']))
            except (ValueError, TypeError):
                pass

        # Determine step_status based on proc_status_id
        status_mapping = {
            1: 'PENDING',        # 0.未確認
            2: 'IN_PROGRESS',    # 1.予定
            3: 'IN_PROGRESS',    # 2.図面・プログラム
            4: 'IN_PROGRESS',    # 3.材料
            5: 'IN_PROGRESS',    # 4.加工中
            6: 'IN_PROGRESS',    # 5.仕上げ
            7: 'IN_PROGRESS',    # 6.検査
            8: 'COMPLETED',      # F.完了
            9: 'IN_PROGRESS',    # N.進行中
            10: 'IN_PROGRESS',   # R.REQUEST
            11: 'COMPLETED',     # ZF.材料完了
            12: 'IN_PROGRESS',   # ZN.材料手配中
            13: 'IN_PROGRESS'    # ZR.材料 Request
        }
        step_status = status_mapping.get(proc_status_id, 'PENDING') if proc_status_id is not None else 'PENDING'
        
        step_records.append({
            'step_id': new_uuid,
            'job_id': job_uuid,
            'step_no': step_no,
            'step_name': step_name,
            'track': track,
            'item_type_id': item_type_id,
            'processing_status_id': proc_status_id,
            'step_status': step_status,
            'outsource_company': registry.resolve('machining_customers', row['MachiningCustomerID']) if 'MachiningCustomerID' in row else None,
            'estimated_hours': float(row['EstimatedHours']) if 'EstimatedHours' in row and str(row['EstimatedHours']).replace('.','',1).isdigit() else 0,
            'set_info': str(row['Set']) if 'Set' in row and row['Set'] else None,
            'tehai_info': str(row['Tehai']) if 'Tehai' in row and row['Tehai'] else None,
            'notes': str(row['ProcessingNotes']) if 'ProcessingNotes' in row and row['ProcessingNotes'] else None,
            'deadline': str(row['ProcessingDeadline']) if 'ProcessingDeadline' in row and row['ProcessingDeadline'] else None,
            'drawing_receipt_date': str(row['DrawingReceiptDate']) if 'DrawingReceiptDate' in row and row['DrawingReceiptDate'] else None
        })
    if step_records:
        chunk_size = 500
        for i in range(0, len(step_records), chunk_size):
            supabase.table('job_steps').insert(step_records[i:i+chunk_size]).execute()
        print(f"Imported {len(step_records)} job_steps")

    # 3. work_logs
    df_logs = clean_dataframe(read_csv_safe(CSV_DIR / 'worklog.csv'))
    
    # Build a set of completed step legacy IDs to mark their work logs as finished
    completed_step_ids = set()
    for _, row in df_steps.iterrows():
        try:
            proc_status_id = int(float(row['ProcessingStatusID'])) if 'ProcessingStatusID' in row and not _pd.isna(row['ProcessingStatusID']) else None
            if proc_status_id in [8, 11]:
                sid = str(row['ProcessingDeadlineID'])
                if sid.endswith('.0'): sid = sid[:-2]
                completed_step_ids.add(sid)
        except:
            pass

    log_records = []
    for _, row in df_logs.iterrows():
        new_uuid = str(uuid.uuid4())
        legacy_id = str(row['WorkLogID'])
        registry.register('work_logs', legacy_id, new_uuid)
        
        # worklog doesn't have JobID directly in legacy sometimes, but it has ProcessingDeadlineID which links to job
        step_legacy_id = str(row['ProcessingDeadlineID']) if 'ProcessingDeadlineID' in row else ''
        if step_legacy_id.endswith('.0'): step_legacy_id = step_legacy_id[:-2]
        
        step_uuid = registry.resolve('job_steps', step_legacy_id) if step_legacy_id else None
        comp_uuid = registry.resolve('customers', row['CompanyID']) if 'CompanyID' in row else None
        emp_uuid = registry.resolve('employees', row['EmployeeID']) if 'EmployeeID' in row else None
        job_uuid = registry.resolve('step_to_job', step_legacy_id) if step_legacy_id else None
        
        if not job_uuid:
            continue
            
        # If the parent step is completed, force all its work logs to finished = True
        is_finished = False
        if step_legacy_id in completed_step_ids:
            is_finished = True
        elif 'Finished' in row and str(row['Finished']).lower() in ['true', '1', 'yes']:
            is_finished = True

        log_records.append({
            'log_id': new_uuid,
            'job_step_id': step_uuid,
            'job_id': job_uuid,
            'employee_id': emp_uuid,
            'company_id': comp_uuid,
            'work_date': str(row['ProcessingDate']) if 'ProcessingDate' in row and row['ProcessingDate'] else '2000-01-01',
            'processing_code_id': int(float(row['ProcessingCodeID'])) if 'ProcessingCodeID' in row and _pd.notna(row['ProcessingCodeID']) and str(row['ProcessingCodeID']).replace('.','',1).isdigit() else None,
            'hours_spent': float(row['ProcessingTime']) if 'ProcessingTime' in row and _pd.notna(row['ProcessingTime']) and str(row['ProcessingTime']).replace('.','',1).isdigit() else 0,
            'quantity_done': int(row['ProcessingNumbers']) if 'ProcessingNumbers' in row and str(row['ProcessingNumbers']).isdigit() else 0,
            'is_finished': is_finished,
            'notes': str(row['ProcessingNotes']) if 'ProcessingNotes' in row and row['ProcessingNotes'] else None,
            'contact_content': str(row['Noidunglienlac']) if 'Noidunglienlac' in row and row['Noidunglienlac'] else None
        })
    if log_records:
        chunk_size = 500
        for i in range(0, len(log_records), chunk_size):
            supabase.table('work_logs').insert(log_records[i:i+chunk_size]).execute()
        print(f"Imported {len(log_records)} work_logs")

    print("--- Updating jobs.deadline ---")
    try:
        import pandas as pd
        df_steps_dates = df_steps.copy()
        df_steps_dates['ProcessingDeadlineDate'] = pd.to_datetime(df_steps_dates['ProcessingDeadline'], errors='coerce')
        max_dates = df_steps_dates.groupby('JobID')['ProcessingDeadlineDate'].max()
        update_records = []
        for legacy_job_id, max_date in max_dates.dropna().items():
            job_uuid = registry.resolve('jobs', legacy_job_id)
            if job_uuid:
                update_records.append({'job_id': job_uuid, 'deadline': max_date.strftime('%Y-%m-%d')})
        if update_records:
            for rec in update_records:
                supabase.table('jobs').update({'deadline': rec['deadline']}).eq('job_id', rec['job_id']).execute()
            print(f"Updated deadline for {len(update_records)} jobs")
    except Exception as e:
        print(f"Error updating jobs.deadline: {e}")


