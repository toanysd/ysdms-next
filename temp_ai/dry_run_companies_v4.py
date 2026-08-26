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
    if re.search(r'\.(xls|xlsx|doc|docx|pdf|jpg|jpeg|png)$', combined):
        return True, "Contains file extension"
    if re.search(r'20\d{6}', code) and len(code) > 7:
        return True, "Contains date pattern in code"
    if '/' in combined or '\\' in combined:
        return True, "Contains directory paths"
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
    
    transaction_fk_columns = [
        ("orders", ["company_id"]),
        ("products", ["company_id", "end_user_company_id"]),
        ("design_revisions", ["company_id"]),
        ("jobs", ["company_id", "outsource_company"]),
        ("equipment", ["company_id", "keeper_company_id"]),
        ("work_orders", ["company_id"]),
        ("invoices", ["company_id"]),
        ("quotations", ["company_id"]),
        ("cutter_orders", ["supplier_id"]),
        ("materials", ["supplier_id"]),
        ("aluminum_blanks", ["supplier_id"]),
        ("plastic_receipt_roll", ["branch_id"]),
        ("job_steps", ["outsource_company"]),
        ("work_logs", ["company_id"]),
        ("equipment_history", ["from_company_id", "to_company_id"]),
        ("equipment_ship_logs", ["from_company_id", "to_company_id"]),
        ("business_cases", ["customer_id"])
    ]
    
    metadata_fk_columns = [
        ("mold_owners", ["company_id"]),
        ("company_contacts", ["company_id"]),
        ("auxiliary_equipments", ["owner_company_id", "keeper_company_id"]),
        ("delivery_sites", ["company_id"]),
        ("employees", ["company_id"]),
        ("mold_maintenance", ["vendor_id"]),
        ("mold_inventory_items", ["keeper_company_id"]),
        ("mold_disposal_logs", ["requested_by_company"]),
        ("mold_return_logs", ["requested_by_company"]),
        ("certificate_items", ["keeper_company_id"]),
        ("shipment_required_docs", ["required_by"]),
        ("companies", ["parent_company_id"])
    ]
    
    trans_fk_counts = defaultdict(lambda: defaultdict(int))
    meta_fk_counts = defaultdict(lambda: defaultdict(int))
    
    print("Fetching Transaction FKs...")
    for table, cols in transaction_fk_columns:
        data = fetch_all(supabase, table, ", ".join(cols))
        for row in data:
            for col in cols:
                val = row.get(col)
                if val: trans_fk_counts[val][f"{table}.{col}"] += 1

    print("Fetching Metadata FKs...")
    for table, cols in metadata_fk_columns:
        data = fetch_all(supabase, table, ", ".join(cols))
        for row in data:
            for col in cols:
                val = row.get(col)
                if val: meta_fk_counts[val][f"{table}.{col}"] += 1
                
    report = []
    
    group_counts = {
        "Group 1: Format Anomaly (Real Garbage)": 0,
        "Group 2: In SSOT 795 (Verified)": 0,
        "Group 3: Not in SSOT, but ACTIVE TRANSACTIONS": 0,
        "Group 4: Not in SSOT, ONLY METADATA OR INACTIVE": 0
    }
    
    for db_c in db_companies:
        db_id = db_c["company_id"]
        db_code = db_c.get("company_code") or ""
        db_name = db_c.get("company_name") or ""
        legacy_id = db_c.get("legacy_id") or ""
        
        t_fks = trans_fk_counts[db_id]
        m_fks = meta_fk_counts[db_id]
        
        total_trans = sum(t_fks.values())
        total_meta = sum(m_fks.values())
        
        # Combine breakdown strings
        trans_str = " | ".join([f"{k}:{v}" for k, v in t_fks.items()])
        meta_str = " | ".join([f"{k}:{v}" for k, v in m_fks.items()])
        
        is_anomaly, anomaly_reason = is_format_anomaly(db_code, db_name)
        
        classification = ""
        
        if is_anomaly:
            classification = "Group 1: Format Anomaly (Real Garbage)"
        else:
            norm_name = normalize_name(db_name)
            in_ssot = (db_code in ssot_by_code) or (db_name in ssot_by_name) or (norm_name and norm_name in ssot_by_norm_name)
            
            if in_ssot:
                classification = "Group 2: In SSOT 795 (Verified)"
            else:
                if total_trans > 0:
                    classification = "Group 3: Not in SSOT, but ACTIVE TRANSACTIONS"
                else:
                    classification = "Group 4: Not in SSOT, ONLY METADATA OR INACTIVE"
                    
        group_counts[classification] += 1
        
        report.append({
            "classification": classification,
            "db_company_id": db_id,
            "db_company_code": db_code,
            "db_company_name": db_name,
            "db_legacy_id": legacy_id,
            "anomaly_reason": anomaly_reason if is_anomaly else "",
            "total_transactions": total_trans,
            "total_metadata": total_meta,
            "transaction_breakdown": trans_str,
            "metadata_breakdown": meta_str
        })
        
    report.sort(key=lambda x: (x["classification"], -x["total_transactions"]))
    
    with open("temp_ai/company_classification_v4.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=report[0].keys())
        writer.writeheader()
        writer.writerows(report)
        
    print("\n--- CLASSIFICATION SUMMARY ---")
    for k, v in group_counts.items():
        print(f"{k}: {v}")
        
    print("\n--- TOP 20 COMPANIES BY TRANSACTIONS (Group 2 & 3) ---")
    active_companies = [r for r in report if not r["classification"].startswith("Group 1") and r["total_transactions"] > 0]
    active_companies.sort(key=lambda x: x["total_transactions"], reverse=True)
    
    for r in active_companies[:20]:
        print(f"{r['db_company_code']:>8} | {r['db_company_name'][:30]:<30} | Trans: {r['total_transactions']:<4} | Meta: {r['total_metadata']:<4} | {r['classification']}")

if __name__ == "__main__":
    main()
