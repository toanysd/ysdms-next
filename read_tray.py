import pandas as pd
import json

try:
    file_path = "F:/AntiGravity/ysdms-nextgen/source_data/tray_instruction_data.xlsx"
    xl = pd.ExcelFile(file_path)
    
    df = pd.read_excel(xl, sheet_name="トレイデータ一覧表", header=None, nrows=10)
    data = df.fillna("").astype(str).values.tolist()
    
    with open("F:/AntiGravity/ysdms-nextgen/excel_tray_raw.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Exported raw tray data!")
except Exception as e:
    print("Error:", e)
