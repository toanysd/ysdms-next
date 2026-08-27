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
            
    # Remove file extensions and dates
    cleaned = re.sub(r'20\d{6}', '', text)
    cleaned = re.sub(r'\d{6}', '', cleaned)
    cleaned = cleaned.replace('.xls', '').replace('.xlsx', '').strip()
    # Remove all brackets content
    cleaned = re.sub(r'[（\(\[【].*?[）\)\]】]', '', cleaned).strip()
    
    if len(cleaned) >= 2:
        words.append(cleaned)
        
    return list(set(words))

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
            
    print(f"Found {len(address_book)} rows in address book.")
    
    df = pd.read_csv(CSV_PATH)
    group1 = df[df['classification'].str.startswith('Group 1')]
    
    print(f"\nProcessing {len(group1)} companies in Group 1...\n")
    
    matched_count = 0
    
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
            print(f"[ MATCH ] Code: {comp_code} | Name: {comp_name}")
            print(f"   Extracted candidates: {candidates}")
            for m in found_matches[:2]: 
                print(f"   -> {m}")
            if len(found_matches) > 2:
                print(f"   -> ... and {len(found_matches)-2} more")
            print()
        else:
            pass # don't print NO_MATCH to avoid clutter for now, or just print a compact list later
            
    print(f"\nMatched {matched_count} / {len(group1)} Group 1 rows.")

if __name__ == "__main__":
    main()
