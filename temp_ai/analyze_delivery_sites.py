import pandas as pd
import openpyxl
import os
from dotenv import load_dotenv
from supabase import create_client

EXCEL_PATH = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\トレイデータ&指示書.xlsx"
REPORT_PATH = r"C:\Users\遠藤 健一\.gemini\antigravity\brain\2eead688-eb02-4306-9292-d48f42741443\Delivery_Sites_Analysis.md"

def fetch_all(supabase, table, select="*"):
    data = []
    limit = 1000
    offset = 0
    while True:
        res = supabase.table(table).select(select).range(offset, offset + limit - 1).execute()
        data.extend(res.data)
        if len(res.data) < limit:
            break
        offset += limit
    return data

def main():
    print("Loading Excel file...")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True, read_only=True)
    sheet_name = "納入先一覧表"
    ws = wb[sheet_name]
    
    excel_rows = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0: continue
        
        if len(row) >= 5:
            no = str(row[0]).strip() if row[0] else ""
            dest = str(row[1]).strip() if row[1] else ""
            addr = str(row[2]).strip() if row[2] else ""
            req = str(row[3]).strip() if row[3] else ""
            sub = str(row[4]).strip() if row[4] else ""
            
            if no and no.lower() != 'none':
                excel_rows.append({
                    'no': no,
                    'destination': dest,
                    'address': addr,
                    'requester': req,
                    'contact': sub
                })
                
    df_excel = pd.DataFrame(excel_rows)
    print(f"Read {len(df_excel)} rows from Excel.")
    
    req_counts = df_excel['requester'].value_counts()
    multi_site_reqs = req_counts[req_counts > 1]
    
    addr_req_groups = df_excel[df_excel['address'] != ""].groupby('address')['requester'].nunique()
    multi_req_addrs = addr_req_groups[addr_req_groups > 1]
    
    load_dotenv(r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\.env.local")
    url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)
    
    print("Fetching companies...")
    db_companies = fetch_all(supabase, 'companies', 'company_id, company_code, legacy_id')
    
    print("Fetching delivery_sites...")
    db_sites = fetch_all(supabase, 'delivery_sites', 'site_id, site_code, site_address, company_id, requester_name')
        
    print(f"Fetched {len(db_companies)} companies and {len(db_sites)} delivery sites from DB.")
    
    db_comp_codes = {c['company_code'] for c in db_companies if c['company_code']}
    db_legacy_ids = {c['legacy_id'] for c in db_companies if c['legacy_id']}
    
    matched_reqs = set()
    unmatched_reqs = set()
    
    unique_reqs = df_excel['requester'].dropna().unique()
    for req in unique_reqs:
        if not req or req.lower() == 'none': continue
        if req in db_comp_codes or req in db_legacy_ids:
            matched_reqs.add(req)
        else:
            unmatched_reqs.add(req)
            
    loose_matches = {}
    for req in unmatched_reqs:
        for code in db_comp_codes:
            if req.startswith(code):
                loose_matches[req] = code
                break
                
    db_site_codes = {s['site_code'] for s in db_sites if s['site_code']}
    
    new_excel_sites = []
    existing_excel_sites = []
    
    for _, row in df_excel.iterrows():
        site_code = row['no']
        if site_code in db_site_codes:
            existing_excel_sites.append(site_code)
        else:
            new_excel_sites.append(site_code)
            
    report = f"""# Phân Tích Sổ Địa Chỉ & Nghiệp Vụ Delivery Sites

**Nguồn dữ liệu:** `トレイデータ&指示書.xlsx` (sheet `納入先一覧表`)
**Số dòng Excel hợp lệ:** {len(df_excel)}

## 1. Giả thuyết "1 Công ty, Nhiều Địa điểm/Liên hệ"
Có **{len(multi_site_reqs)}** mã `依頼元` (Người đặt hàng) xuất hiện nhiều hơn 1 lần trong Excel.
*Ví dụ Top 5:*
"""
    for req, count in multi_site_reqs.head(5).items():
        report += f"- Mã `{req}`: xuất hiện {count} lần.\n"
        
    report += f"\n## 2. Giả thuyết \"1 Điểm đến, Nhiều Công ty đặt hàng\""
    report += f"\nCó **{len(multi_req_addrs)}** địa chỉ được đặt hàng bởi nhiều `依頼元` khác nhau.\n*Ví dụ Top 5 địa chỉ phổ biến nhất:*\n"
    for addr, count in multi_req_addrs.head(5).items():
        reqs = df_excel[df_excel['address'] == addr]['requester'].unique()
        report += f"- Địa chỉ `{addr[:30]}...`: {count} mã đặt hàng ({', '.join(reqs)})\n"
        
    report += f"\n## 3. Đối chiếu mã `依頼元` (Cột D) với Database `companies`\n"
    report += f"- Tổng số mã `依頼元` duy nhất trong Excel: {len(unique_reqs)}\n"
    report += f"- Khớp chính xác hoàn toàn với `company_code` hoặc `legacy_id` trong DB: **{len(matched_reqs)}** mã.\n"
    report += f"- Không khớp chính xác: **{len(unmatched_reqs)}** mã.\n"
    if loose_matches:
        report += f"  *(Tuy nhiên, phát hiện {len(loose_matches)} mã có thể khớp theo tiền tố, ví dụ: "
        examples = list(loose_matches.items())[:3]
        report += ", ".join([f"`{k}` -> `{v}`" for k, v in examples])
        report += ")*\n"
        
    report += f"\n## 4. Đối chiếu Excel với Database `delivery_sites` hiện có\n"
    report += f"- Tổng số site hiện có trong DB: {len(db_sites)}\n"
    report += f"- Số mã `No.` (Cột A) trong Excel ĐÃ CÓ TRONG DB: **{len(existing_excel_sites)}** dòng.\n"
    report += f"- Số mã `No.` (Cột A) trong Excel CHƯA CÓ TRONG DB (Dữ liệu mới): **{len(new_excel_sites)}** dòng.\n"
    
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write(report)
        
    print("Report generated.")

if __name__ == "__main__":
    main()
