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
    return "false"

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
        for r in cutters:
            cid = r.get("CutterID")
            if not cid: continue
            code = sql_str(r.get("CutterCode") or r.get("CutterName") or f"CUT-{cid}")
            f.write(f"INSERT INTO public.cutters (cutter_id, cutter_no, cutter_name, pitch_mm, manufacture_date) VALUES ")
            f.write(f"({cutter_uuid(cid)}, {code}, {sql_str(r.get('CutterName'))}, {sql_num(r.get('Pitch'))}, {sql_date(r.get('CutterManufactureDate'))}) ")
            f.write(f"ON CONFLICT (cutter_no) DO UPDATE SET pitch_mm = EXCLUDED.pitch_mm, manufacture_date = EXCLUDED.manufacture_date;\n")

        # 2. MOLD DESIGN CUTTERS
        f.write("\n-- [2] Mold Design Cutters\n")
        for r in moldcutter:
            mid = r.get("MoldCutterID")
            cid = r.get("CutterID")
            did = r.get("MoldDesignID")
            if not mid or not cid or not did: continue
            uid = f"'00000000-44dd-0000-0000-{hex_12(mid)}'::uuid"
            f.write(f"INSERT INTO public.mold_design_cutters (id, mold_design_id, cutter_id, notes, created_at) VALUES ")
            f.write(f"({uid}, {design_uuid(did)}, {cutter_uuid(cid)}, {sql_str(r.get('MoldCutterNotes'))}, {sql_timestamp(r.get('DateEntry'))}) ")
            f.write("ON CONFLICT (id) DO NOTHING;\n")

        # 3. JOBS
        f.write("\n-- [3] Jobs (Merge missing columns)\n")
        for r in jobs:
            jid = r.get("JobID")
            if not jid: continue
            
            jcode = sql_str(r.get("JobCode") or f"JOB-{jid}")
            
            f.write(f"INSERT INTO public.jobs (job_id, job_code, job_name, job_type_id, physical_mold_id, design_revision_id, start_date, deadline, quantity, release_type, separate_cutter, inventory_check_on_repro, drawing_check_on_repro, qty_sent_to_office, price_quote_required, unit_price, forming_location, year_period, month_period, notes, approved) VALUES ")
            
            jtype = "(SELECT job_type_id FROM job_types LIMIT 1)"
            
            f.write(f"({job_uuid(jid)}, {jcode}, {sql_str(r.get('JobName'))}, {jtype}, {phys_uuid(r.get('MoldID'))}, {design_uuid(r.get('MoldDesignID'))}, {sql_date(r.get('JobStartDate'))}, {sql_date(r.get('DeliveryDeadline'))}, {sql_int(r.get('JobQuantity', 1))}, {sql_str(r.get('ReleasePeriod'))}, {sql_bool(r.get('SeparateCutter'))}, {sql_bool(r.get('InventoryCheckUponReProduction'))}, {sql_bool(r.get('DrawingChecUponReProduction'))}, {sql_int(r.get('QuantitySentToTheOffice'))}, {sql_bool(r.get('PriceQuote'))}, {sql_num(r.get('UnitPrice'))}, {sql_str(r.get('FormingLocation'))}, {sql_int(r.get('YearPeriod'))}, {sql_int(r.get('MonthPeriod'))}, {sql_str(r.get('JobNote'))}, {sql_bool(r.get('Approved'))}) ")
            f.write("ON CONFLICT (job_code) DO UPDATE SET ")
            f.write("start_date = COALESCE(EXCLUDED.start_date, jobs.start_date), ")
            f.write("deadline = COALESCE(EXCLUDED.deadline, jobs.deadline), ")
            f.write("physical_mold_id = COALESCE(EXCLUDED.physical_mold_id, jobs.physical_mold_id), ")
            f.write("quantity = EXCLUDED.quantity, ")
            f.write("release_type = EXCLUDED.release_type, ")
            f.write("separate_cutter = EXCLUDED.separate_cutter, ")
            f.write("inventory_check_on_repro = EXCLUDED.inventory_check_on_repro, ")
            f.write("drawing_check_on_repro = EXCLUDED.drawing_check_on_repro, ")
            f.write("qty_sent_to_office = EXCLUDED.qty_sent_to_office, ")
            f.write("price_quote_required = EXCLUDED.price_quote_required, ")
            f.write("unit_price = EXCLUDED.unit_price, ")
            f.write("forming_location = EXCLUDED.forming_location;\n")

        # 4. JOB STEPS
        f.write("\n-- [4] Job Steps\n")
        job_step_counts = {}
        for r in job_steps:
            sid = r.get("ProcessingDeadlineID")
            jid = r.get("JobID")
            if not sid or not jid: continue
            
            job_step_counts[jid] = job_step_counts.get(jid, 0) + 1
            step_no = job_step_counts[jid]
            
            item_id = sql_int(r.get('ItemTypeID'))
            status_id = sql_int(r.get('ProcessingStatusID'))
            f.write(f"INSERT INTO public.job_steps (step_id, job_id, step_no, processing_item_id, processing_status_id, step_name, deadline, estimated_hours, set_info, machining_location) VALUES ")
            f.write(f"({step_uuid(sid)}, {job_uuid(jid)}, {step_no}, {item_id}, {status_id}, {sql_str(r.get('IDJobNo') or ('Step '+sid))}, {sql_date(r.get('ProcessingDeadline'))}, {sql_num(r.get('EstimatedHours'))}, {sql_str(r.get('Set'))}, {sql_str(r.get('IDCapDC'))}) ")
            f.write("ON CONFLICT (step_id) DO UPDATE SET deadline = EXCLUDED.deadline, estimated_hours = EXCLUDED.estimated_hours, processing_status_id = EXCLUDED.processing_status_id;\n")

        # 5. WORK LOGS
        f.write("\n-- [5] Work Logs\n")
        step_to_job = {r.get("ProcessingDeadlineID"): r.get("JobID") for r in job_steps if r.get("ProcessingDeadlineID")}
        for r in worklogs:
            wid = r.get("WorkLogID")
            sid = r.get("ProcessingDeadlineID")
            jid = step_to_job.get(sid)
            if not wid or not sid or not jid: continue
            
            emp = f"(SELECT employee_id FROM employees WHERE employee_code = 'EMP-' || {sql_str(r.get('EmployeeID', ''))} LIMIT 1)"
            f.write(f"INSERT INTO public.work_logs (log_id, job_id, job_step_id, employee_id, work_date, hours_spent, is_finished, notes) VALUES ")
            dur = sql_num(r.get('ProcessingTime'))
            date = sql_date(r.get('ProcessingDate'))
            notes = sql_str(r.get('ProcessingNotes'))
            f.write(f"({worklog_uuid(wid)}, {job_uuid(jid)}, {step_uuid(sid)}, {emp}, {date}, {dur}, true, {notes}) ")
            f.write("ON CONFLICT (log_id) DO NOTHING;\n")

        f.write("\nCOMMIT;\n")

    print(f"Generated {OUTPUT_FILE} successfully!")

if __name__ == "__main__":
    main()
