import pandas as pd
import openpyxl
import re

EXCEL_PATH = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\トレイデータ&指示書.xlsx"
CSV_PATH = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\src\app\master\data-sync\source_data\company_classification_v4.csv"

def extract_potential_names(text):
    if pd.isna(text):
        return []
    text = str(text)
    
    bracket_matches = re.findall(r'[（\(\[【](.*?)[）\)\]】]', text)
    words = []
    for bm in bracket_matches:
        if len(bm) >= 2:
            words.append(bm)
            
    cleaned = re.sub(r'20\d{6}', '', text)
    cleaned = re.sub(r'\d{6}', '', cleaned)
    cleaned = cleaned.replace('.xls', '').replace('.xlsx', '').strip()
    cleaned = re.sub(r'[（\(\[【].*?[）\)\]】]', '', cleaned).strip()
    
    if len(cleaned) >= 2:
        words.append(cleaned)
        
    return list(set(words))

def main():
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True, read_only=True)
    sheet_name = "納入先一覧表"
    ws = wb[sheet_name]
    
    address_book = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        row_strs = [str(cell).strip() for cell in row if cell and str(cell).strip() and str(cell).strip() != 'None']
        if len(row_strs) >= 2:
            address_book.append(row_strs)
            
    df = pd.read_csv(CSV_PATH)
    group1 = df[df['classification'].str.startswith('Group 1')]
    
    matched_count = 0
    results = []
    
    for _, row in group1.iterrows():
        comp_code = row['db_company_code']
        comp_name = row['db_company_name']
        
        candidates = extract_potential_names(comp_code) + extract_potential_names(comp_name)
        candidates = list(set(candidates))
        
        found_matches = []
        for cand in candidates:
            if cand.isdigit() or cand.lower() in ['xls', 'xlsx']:
                continue
            for ab_row in address_book:
                ab_row_str = " | ".join(ab_row)
                if cand in ab_row_str:
                    found_matches.append(ab_row_str)
                    
        found_matches = list(set(found_matches))
        
        if found_matches:
            matched_count += 1
            res_str = f"**{comp_code}** (Name: {comp_name})\n"
            res_str += f"- *Tìm theo:* {', '.join(candidates)}\n"
            for m in found_matches[:2]: 
                res_str += f"- *Khớp với:* {m}\n"
            if len(found_matches) > 2:
                res_str += f"- *...và {len(found_matches)-2} kết quả khác*\n"
            results.append(res_str)
            
    # Write artifact
    artifact_md = f"""# Kết Quả Đối Chiếu Group 1 (Rác Hình Thức) với Sổ Địa Chỉ

Đã quét file Excel `トレイデータ&指示書.xlsx` (sheet `納入先一覧表`, chế độ read-only).
Tìm thấy **{len(address_book)}** dòng địa chỉ.

Trong **{len(group1)}** công ty thuộc Group 1, đã tìm thấy **{matched_count}** công ty có tên/mã xuất hiện trong sổ địa chỉ này. 
Dưới đây là các kết quả khớp:

"""
    for r in results:
        artifact_md += r + "\n"

    with open(r"C:\Users\遠藤 健一\.gemini\antigravity\brain\2eead688-eb02-4306-9292-d48f42741443\Group1_AddressBook_Match.md", "w", encoding="utf-8") as f:
        f.write(artifact_md)

if __name__ == "__main__":
    main()
