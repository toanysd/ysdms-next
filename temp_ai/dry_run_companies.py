import os
import sys
import json
import csv
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
            # print(f"Error fetching {table}: {e}")
            break
    return all_data

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
        print(f"  Fetching {table}...")
        col_str = ", ".join(cols)
        data = fetch_all(supabase, table, col_str)
        for row in data:
            for col in cols:
                val = row.get(col)
                if val:
                    # Record table.col breakdown
                    fk_counts[val][f"{table}.{col}"] += 1
    
    report = []
    match_stats = {"Exact Code": 0, "Exact Name": 0, "Fuzzy Name": 0, "No Match": 0}
    orphan_total_fks = 0
    
    for db_c in db_companies:
        db_id = db_c["company_id"]
        db_code = db_c.get("company_code")
        db_name = db_c.get("company_name") or ""
        legacy_id = db_c.get("legacy_id")
        
        match_type = "No Match"
        matched_ssot = None
        
        if db_code and db_code in ssot_by_code:
            match_type = "Exact Code"
            matched_ssot = ssot_by_code[db_code]
        elif db_name in ssot_by_name:
            match_type = "Exact Name"
            matched_ssot = ssot_by_name[db_name]
        else:
            norm_name = normalize_name(db_name)
            if norm_name and norm_name in ssot_by_norm_name:
                match_type = "Fuzzy Name"
                matched_ssot = ssot_by_norm_name[norm_name]
                
        match_stats[match_type] += 1
        
        fks_dict = fk_counts[db_id]
        total_fks = sum(fks_dict.values())
        
        breakdown = []
        for key, count in fks_dict.items():
            breakdown.append(f"{key}({count})")
        breakdown_str = " | ".join(breakdown)
        
        status = "KEEP (Matched)" if matched_ssot else "ORPHAN (Garbage?)"
        if not matched_ssot and total_fks > 0:
            status = "ORPHAN WITH FKS (Requires Manual Check)"
            orphan_total_fks += total_fks
            
        report.append({
            "db_company_id": db_id,
            "db_company_code": db_code,
            "db_company_name": db_name,
            "db_legacy_id": legacy_id,
            "match_type": match_type,
            "matched_ssot_code": matched_ssot["company_code"] if matched_ssot else "",
            "matched_ssot_name": matched_ssot["company_name"] if matched_ssot else "",
            "total_fks": total_fks,
            "fk_breakdown": breakdown_str,
            "status": status
        })
        
    with open("temp_ai/company_reconciliation_report_extended.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=report[0].keys())
        writer.writeheader()
        writer.writerows(report)
        
    print("\n--- SUMMARY ---")
    for k, v in match_stats.items():
        print(f"{k}: {v}")
    
    print(f"\nTotal Orphans with FK dependencies: {orphan_total_fks} relations.")
    print("\nReport saved to temp_ai/company_reconciliation_report_extended.csv")

if __name__ == "__main__":
    main()
