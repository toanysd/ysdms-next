#!/usr/bin/env python3
import csv
import os
from datetime import datetime

SOURCE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = os.path.join(os.path.dirname(SOURCE_DIR), "source_data", "csv-access-data")
OUTPUT_FILE = os.path.join(os.path.dirname(SOURCE_DIR), "supabase", "migrations", "20260716000002_seed_v5_legacy.sql")

def hex_12(num):
    try:
        if not str(num).strip() or str(num).lower() in ("nan", "none", "null"): return "000000000000"
        return hex(int(float(num)))[2:].zfill(12)
    except (ValueError, TypeError):
        return "000000000000"

def job_uuid(num): return f"'00000000-5555-0000-0000-{hex_12(num)}'::uuid"
def phys_uuid(num): return f"'00000000-3333-0000-0000-{hex_12(num)}'::uuid"
def cutter_uuid(num): return f"'00000000-4444-0000-0000-{hex_12(num)}'::uuid"
def step_uuid(num): return f"'00000000-6666-0000-0000-{hex_12(num)}'::uuid"
def worklog_uuid(num): return f"'00000000-7777-0000-0000-{hex_12(num)}'::uuid"
def design_uuid(num): return f"'00000000-2222-0000-0000-{hex_12(num)}'::uuid"

def sql_str(val):
    if val is None or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    return "$$" + str(val).replace("$$", r"\$\$") + "$$"

def sql_num(val):
    if val is None or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    try:
        return str(float(val))
    except ValueError:
        return "NULL"

def sql_bool(val):
    if val is None or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    v = str(val).strip().upper()
    if v in ("TRUE", "1", "YES", "2. 有", "2. 要", "1. 有"): return "true"
    if v in ("FALSE", "0", "NO", "無", "1. 無", "1. 不要", "2. 不要"): return "false"
    return "NULL"

def sql_int(val):
    if val is None or str(val).strip() in ("", "nan", "None", "—"): return "NULL"
    try:
        return str(int(float(val)))
    except ValueError:
        return "NULL"

def sql_date(val):
    if val is None or str(val).strip() in ("", "nan", "None"): return "NULL"
    parts = val.split()[0]
    return f"{sql_str(parts)}::date"

def sql_timestamp(val):
    if val is None or str(val).strip() in ("", "nan", "None"): return "NULL"
    return f"{sql_str(val)}::timestamptz"

def read_csv(filename):
    path = os.path.join(CSV_DIR, filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def main():
    jobs = read_csv("jobs.csv")
    cutters = read_csv("cutters.csv")
    moldcutter = read_csv("moldcutter.csv")
    job_steps = read_csv("processingdeadline.csv")
    worklogs = read_csv("worklog.csv")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- V5 Legacy Seed Script\n")
        f.write("BEGIN;\n\n")

        # 1. CUTTERS
        f.write("-- [1] Cutters\n")
        valid_cutters = set()
        cid_to_code = {}
        for r in cutters:
            cid = r.get("CutterID")
            if not cid: continue
            valid_cutters.add(str(cid).strip())
            code = sql_str(r.get("CutterCode") or r.get("CutterName") or f"CUT-{cid}")
            cid_to_code[str(cid).strip()] = code
            cname = sql_str(r.get('CutterName'))
            f.write(f"INSERT INTO public.cutters (cutter_id, cutter_no, cutter_name, pitch_mm, date_entry) VALUES ")
            pitch = sql_num(r.get('Pitch'))
            date = sql_date(r.get('CutterManufactureDate'))
            f.write(f"({cutter_uuid(cid)}, {code}, {cname}, {pitch}, {date}) ")
            f.write("ON CONFLICT (cutter_no) DO UPDATE SET pitch_mm = EXCLUDED.pitch_mm, date_entry = EXCLUDED.date_entry;\n")

        # 2. MOLD DESIGN CUTTERS
        f.write("\n-- [2] Mold Design Cutters\n")
        seen_mdc_pairs = set()
        for r in moldcutter:
            mid = r.get("MoldCutterID")
            cid = r.get("CutterID")
            did = r.get("MoldDesignID")
            if not mid or not cid or not did: continue
            if str(cid).strip() not in valid_cutters: continue
            
            code = cid_to_code[str(cid).strip()]
            pair = (str(did).strip(), code)
            if pair in seen_mdc_pairs: continue
            seen_mdc_pairs.add(pair)
            
            uid = f"'00000000-44dd-0000-0000-{hex_12(mid)}'::uuid"
            f.write(f"INSERT INTO public.mold_design_cutters (id, mold_design_id, cutter_id, notes, date_entry) VALUES ")
            f.write(f"({uid}, {design_uuid(did)}, (SELECT cutter_id FROM public.cutters WHERE cutter_no = {code}), {sql_str(r.get('MoldCutterNotes'))}, {sql_timestamp(r.get('DateEntry'))}) ")
            f.write("ON CONFLICT ON CONSTRAINT mold_design_cutters_cutter_id_mold_design_id_key DO NOTHING;\n")

        # 3. JOBS
        f.write("\n-- [3] Jobs (Merge missing columns)\n")
        valid_jobs = set()
        job_to_code = {}
        for r in jobs:
            jid = r.get("JobID")
            if not jid: continue
            valid_jobs.add(str(jid).strip())
            
            jcode_val = r.get("JobCode") or f"JOB-{jid}"
            jcode = sql_str(jcode_val)
            job_to_code[str(jid).strip()] = jcode
            
            f.write(f"INSERT INTO public.jobs (job_id, job_code, job_name, job_type_id, physical_mold_id, design_revision_id, start_date, deadline, year_period, month_period, notes, approved) VALUES ")
            
            jtype = "(SELECT job_type_id FROM job_types LIMIT 1)"
            
            phys_id = phys_uuid(r.get('MoldID')) if r.get('MoldID') else "NULL"
            safe_phys = f"(SELECT physical_mold_id FROM public.physical_molds WHERE physical_mold_id = {phys_id})" if phys_id != "NULL" else "NULL"
            
            design_id = design_uuid(r.get('MoldDesignID')) if r.get('MoldDesignID') else "NULL"
            safe_design = f"(SELECT revision_id FROM public.design_revisions WHERE revision_id = {design_id})" if design_id != "NULL" else "NULL"
            
            f.write(f"({job_uuid(jid)}, {jcode}, {sql_str(r.get('JobName'))}, {jtype}, {safe_phys}, {safe_design}, {sql_date(r.get('JobStartDate'))}, {sql_date(r.get('DeliveryDeadline'))}, {sql_int(r.get('YearPeriod'))}, {sql_int(r.get('MonthPeriod'))}, {sql_str(r.get('JobNote'))}, {sql_bool(r.get('Approved'))}) ")
            f.write("ON CONFLICT (job_code) DO UPDATE SET start_date = COALESCE(EXCLUDED.start_date, jobs.start_date), deadline = COALESCE(EXCLUDED.deadline, jobs.deadline), physical_mold_id = COALESCE(EXCLUDED.physical_mold_id, jobs.physical_mold_id);\n")

        # 4. Job Steps
        f.write("\n-- [4] Job Steps\n")
        for r in job_steps:
            sid = r.get("ProcessingDeadlineID")
            jid = r.get("JobID")
            if not sid or not jid: continue
            if str(jid).strip() not in valid_jobs: continue
            
            jcode = job_to_code[str(jid).strip()]
            real_job_id = f"(SELECT job_id FROM public.jobs WHERE job_code = {jcode})"
            
            item_id = sql_int(r.get('ProcessingItem', 1))
            status_id = sql_int(r.get('ProcessingStatus', 1))
            
            step_no_sql = f"(SELECT COALESCE(MAX(step_no), 0) + 1 FROM public.job_steps WHERE job_id = {real_job_id})"
            
            f.write(f"INSERT INTO public.job_steps (step_id, job_id, step_no, processing_item_id, processing_status_id, step_name, deadline, estimated_hours, set_info, machining_location) VALUES ")
            f.write(f"({step_uuid(sid)}, {real_job_id}, {step_no_sql}, {item_id}, {status_id}, {sql_str(r.get('IDJobNo') or ('Step '+sid))}, {sql_date(r.get('ProcessingDeadline'))}, {sql_num(r.get('EstimatedHours'))}, {sql_str(r.get('Set'))}, {sql_str(r.get('IDCapDC'))}) ")
            f.write("ON CONFLICT (step_id) DO UPDATE SET deadline = EXCLUDED.deadline, estimated_hours = EXCLUDED.estimated_hours, processing_status_id = EXCLUDED.processing_status_id;\n")

        # 5. Work Logs
        f.write("\n-- [5] Work Logs\n")
        step_to_job = {r.get("ProcessingDeadlineID"): r.get("JobID") for r in job_steps if r.get("ProcessingDeadlineID")}
        for r in worklogs:
            wid = r.get("WorkLogID")
            sid = r.get("ProcessingDeadlineID")
            jid = step_to_job.get(sid)
            if not wid or not sid or not jid: continue
            if str(jid).strip() not in valid_jobs: continue
            
            jcode = job_to_code[str(jid).strip()]
            real_job_id = f"(SELECT job_id FROM public.jobs WHERE job_code = {jcode})"
            
            emp = f"COALESCE((SELECT employee_id FROM employees WHERE employee_code = 'EMP-' || {sql_str(r.get('EmployeeID', ''))} LIMIT 1), (SELECT employee_id FROM employees LIMIT 1))"
            f.write(f"INSERT INTO public.work_logs (log_id, job_id, job_step_id, employee_id, work_date, hours_spent, is_finished, notes) VALUES ")
            dur = sql_num(r.get('ProcessingTime'))
            date = sql_date(r.get('ProcessingDate'))
            notes = sql_str(r.get('ProcessingNotes'))
            f.write(f"({worklog_uuid(wid)}, {real_job_id}, {step_uuid(sid)}, {emp}, {date}, {dur}, true, {notes}) ")
            f.write("ON CONFLICT (log_id) DO NOTHING;\n")

        f.write("\nCOMMIT;\n")

    print(f"Generated {OUTPUT_FILE} successfully!")

if __name__ == "__main__":
    main()
