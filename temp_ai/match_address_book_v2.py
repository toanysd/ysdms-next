import pandas as pd
import openpyxl
import re
import os

EXCEL_PATH = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\トレイデータ&指示書.xlsx"
CSV_PATH = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\src\app\master\data-sync\source_data\company_classification_v4.csv"

STOP_WORDS = ["サンプル", "初回", "工務", "試作", "改", "センター", "変更", "修正", "図面", "寸法", "確認", "保留", "見積", "客先"]

def is_valid_cand(text):
    if not text: return False
    if len(text) < 2: return False
    if text.isdigit(): return False
    if text.lower() in ['xls', 'xlsx']: return False
    for sw in STOP_WORDS:
        if sw in text or text in sw:
            return False
    return True

def extract_candidates(text):
    if pd.isna(text):
        return {"cleaned": "", "brackets": []}
    text = str(text)
    
    bracket_matches = re.findall(r'[（\(\[【](.*?)[）\)\]】]', text)
    brackets = [b.strip() for b in bracket_matches if is_valid_cand(b.strip())]
    
    cleaned = re.sub(r'20\d{6}', '', text)
    cleaned = re.sub(r'\d{6}', '', cleaned)
    cleaned = cleaned.replace('.xls', '').replace('.xlsx', '').strip()
    cleaned = re.sub(r'[（\(\[【].*?[）\)\]】]', '', cleaned).strip()
    
    if not is_valid_cand(cleaned):
        cleaned = ""
        
    return {"cleaned": cleaned, "brackets": list(set(brackets))}

def main():
    print("Loading Excel file...")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True, read_only=True)
    sheet_name = "納入先一覧表"
    ws = wb[sheet_name]
    
    address_book = []
    # Skip header
    for row in ws.iter_rows(min_row=2, values_only=True):
        row_strs = [str(cell).strip() for cell in row if cell and str(cell).strip() and str(cell).strip() != 'None']
        if len(row_strs) >= 2:
            address_book.append(row_strs)
            
    df = pd.read_csv(CSV_PATH)
    group1 = df[df['classification'].str.startswith('Group 1')]
    
    results = []
    high_count = 0
    low_count = 0
    
    for _, row in group1.iterrows():
        comp_code = row['db_company_code']
        comp_name = row['db_company_name']
        
        cands_code = extract_candidates(comp_code)
        cands_name = extract_candidates(comp_name)
        
        cleaned_cands = set([cands_code["cleaned"], cands_name["cleaned"]])
        cleaned_cands = [c for c in cleaned_cands if c]
        
        bracket_cands = set(cands_code["brackets"] + cands_name["brackets"])
        bracket_cands = [c for c in bracket_cands if c and c not in cleaned_cands]
        
        # Match function against Name (idx 1) or Code (idx 0)
        # We also check the whole string just in case, but prioritize Name/Code
        def find_matches(cand_list):
            matches = []
            for cand in cand_list:
                for ab_row in address_book:
                    name_code_str = " | ".join(ab_row[:2]) # Just search in Code and Name!
                    if cand in name_code_str:
                        matches.append(" | ".join(ab_row))
            return list(set(matches))
            
        high_matches = find_matches(cleaned_cands)
        low_matches = []
        if not high_matches:
            low_matches = find_matches(bracket_cands)
            
        if high_matches:
            high_count += 1
            res_str = f"[ HIGH ] **{comp_code}** (Name: {comp_name})\n"
            res_str += f"   - *Cleaned Name Match:* {', '.join(cleaned_cands)}\n"
            for m in high_matches[:2]: res_str += f"     -> {m}\n"
            results.append(res_str)
        elif low_matches:
            low_count += 1
            res_str = f"[ LOW  ] **{comp_code}** (Name: {comp_name})\n"
            res_str += f"   - *Bracket Match:* {', '.join(bracket_cands)}\n"
            for m in low_matches[:2]: res_str += f"     -> {m}\n"
            results.append(res_str)
            
    # Output to markdown
    artifact_md = f"# Kết Quả Đối Chiếu Group 1 (V2 - Cải Tiến Thuật Toán)\n\n"
    artifact_md += f"Đã quét file Excel `トレイデータ&指示書.xlsx`.\n"
    artifact_md += f"**Group 1 (100 công ty)** -> **HIGH: {high_count}**, **LOW: {low_count}**\n\n"
    
    for r in results:
        artifact_md += r + "\n"

    with open(r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai\Group1_AddressBook_Match_V2.md", "w", encoding="utf-8") as f:
        f.write(artifact_md)
        
    print(f"Done. HIGH: {high_count}, LOW: {low_count}")

if __name__ == "__main__":
    main()
