import os
import sys
import json
import csv
import re
from collections import defaultdict
from supabase import create_client

def normalize_name(name):
    if not name: return ""
    name = name.upper()
    name = name.replace(" ", "").replace("　", "")
    for suffix in ["CO.,LTD.", "CO.,LTD", "INC.", "LTD.", "CORPORATION", "株式会社", "有限会社"]:
        name = name.replace(suffix, "")
    return name

def fetch_all(supabase, table, columns):
    all_data = []
    offset = 0
    limit = 1000
    while True:
        try:
            res = supabase.table(table).select(columns).range(offset, offset + limit - 1).execute()
            data = res.data
            if not data:
                break
            all_data.extend(data)
            if len(data) < limit:
                break
            offset += limit
        except Exception as e:
            break
    return all_data

def is_format_anomaly(code, name):
    code = code or ""
    name = name or ""
    combined = (code + " " + name).lower()
    
    # Check for file extensions
    if re.search(r'\.(xls|xlsx|doc|docx|pdf|jpg|jpeg|png)$', combined):
        return True, "Contains file extension"
    
    # Check for date-like strings (e.g. 20100927) in company code if length > 7
    if re.search(r'20\d{6}', code) and len(code) > 7:
        return True, "Contains date pattern in code"
        
    # Check for paths/folders patterns like / or \
    if '/' in combined or '\\' in combined:
        return True, "Contains directory paths"
    
    # Check if name is extremely short (e.g. 1 char) or empty
    if len(name.strip()) <= 1 and len(code.strip()) <= 1:
        return True, "Extremely short or empty name/code"
        
    return False, ""

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    from dotenv import load_dotenv
    load_dotenv(".env.local")
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    supabase = create_client(url, key)
    
    with open("source_data/company_normalized.json", "r", encoding="utf-8") as f:
        ssot_data = json.load(f)
    
    ssot_by_code = {r["company_code"]: r for r in ssot_data if r.get("company_code")}
    ssot_by_name = {r["company_name"]: r for r in ssot_data}
    ssot_by_norm_name = {normalize_name(r["company_name"]): r for r in ssot_data}
    
    print("Fetching DB companies...")
    db_companies = fetch_all(supabase, "companies", "*")
    
    fk_columns = [
        ("mold_owners", ["company_id"]),
        ("company_contacts", ["company_id"]),
        ("auxiliary_equipments", ["owner_company_id", "keeper_company_id"]),
        ("delivery_sites", ["company_id"]),
        ("employees", ["company_id"]),
        ("products", ["company_id", "end_user_company_id"]),
        ("quotations", ["company_id"]),
        ("orders", ["company_id"]),
        ("design_revisions", ["company_id"]),
        ("mold_maintenance", ["vendor_id"]),
        ("mold_inventory_items", ["keeper_company_id"]),
        ("mold_disposal_logs", ["requested_by_company"]),
        ("mold_return_logs", ["requested_by_company"]),
        ("certificate_items", ["keeper_company_id"]),
        ("shipment_required_docs", ["required_by"]),
        ("cutter_orders", ["supplier_id"]),
        ("materials", ["supplier_id"]),
        ("plastic_receipt_roll", ["branch_id"]),
        ("jobs", ["company_id", "outsource_company"]),
        ("job_steps", ["outsource_company"]),
        ("work_logs", ["company_id"]),
        ("aluminum_blanks", ["supplier_id"]),
        ("companies", ["parent_company_id"]),
        ("business_cases", ["customer_id"]),
        ("equipment", ["company_id", "keeper_company_id"]),
        ("equipment_history", ["from_company_id", "to_company_id"]),
        ("work_orders", ["company_id"]),
        ("equipment_ship_logs", ["from_company_id", "to_company_id"]),
        ("invoices", ["company_id"])
    ]
    
    fk_counts = defaultdict(lambda: defaultdict(int))
    
    print("Fetching FK counts across 34 columns...")
    for table, cols in fk_columns:
        col_str = ", ".join(cols)
        data = fetch_all(supabase, table, col_str)
        for row in data:
            for col in cols:
                val = row.get(col)
                if val:
                    fk_counts[val][f"{table}.{col}"] += 1
    
    report = []
    
    # Classification Stats
    group_counts = {
        "Group 1: Format Anomaly (Real Garbage)": 0,
        "Group 2: In SSOT 795 (Verified)": 0,
        "Group 3: Not in SSOT, but ACTIVE (Add to SSOT)": 0,
        "Group 4: Not in SSOT, INACTIVE (Review Later)": 0
    }
    
    for db_c in db_companies:
        db_id = db_c["company_id"]
        db_code = db_c.get("company_code") or ""
        db_name = db_c.get("company_name") or ""
        legacy_id = db_c.get("legacy_id") or ""
        created_at = db_c.get("created_at") or ""
        
        fks_dict = fk_counts[db_id]
        total_fks = sum(fks_dict.values())
        breakdown_str = " | ".join([f"{k}({v})" for k, v in fks_dict.items()])
        
        # Check 1: Format Check
        is_anomaly, anomaly_reason = is_format_anomaly(db_code, db_name)
        
        classification = ""
        action = ""
        
        if is_anomaly:
            classification = "Group 1: Format Anomaly (Real Garbage)"
            action = "MANUAL REVIEW & REMAP"
        else:
            # Check 2: SSOT Check
            norm_name = normalize_name(db_name)
            in_ssot = (db_code in ssot_by_code) or (db_name in ssot_by_name) or (norm_name and norm_name in ssot_by_norm_name)
            
            if in_ssot:
                classification = "Group 2: In SSOT 795 (Verified)"
                action = "KEEP"
            else:
                # Check 3: Active vs Inactive
                if total_fks > 0:
                    classification = "Group 3: Not in SSOT, but ACTIVE (Add to SSOT)"
                    action = "ADD TO SSOT"
                else:
                    classification = "Group 4: Not in SSOT, INACTIVE (Review Later)"
                    action = "LEAVE AS IS"
                    
        group_counts[classification] += 1
        
        report.append({
            "classification": classification,
            "db_company_id": db_id,
            "db_company_code": db_code,
            "db_company_name": db_name,
            "db_legacy_id": legacy_id,
            "created_at": created_at,
            "anomaly_reason": anomaly_reason if is_anomaly else "",
            "total_fks": total_fks,
            "fk_breakdown": breakdown_str,
            "action": action
        })
        
    # Sort report by classification then total_fks descending
    report.sort(key=lambda x: (x["classification"], -x["total_fks"]))
    
    with open("temp_ai/company_classification_v3.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=report[0].keys())
        writer.writeheader()
        writer.writerows(report)
        
    print("\n--- CLASSIFICATION SUMMARY ---")
    for k, v in group_counts.items():
        print(f"{k}: {v}")
    
    print("\nReport saved to temp_ai/company_classification_v3.csv")

if __name__ == "__main__":
    main()
