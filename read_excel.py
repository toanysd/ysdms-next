import pandas as pd
import json

try:
    file_path = "F:/AntiGravity/ysdms-nextgen/source_data/tray_instruction_data.xlsx"
    xl = pd.ExcelFile(file_path)
    
    output = {"Sheets": xl.sheet_names, "Data": {}}
    for s in xl.sheet_names:
        df = pd.read_excel(xl, sheet_name=s)
        output["Data"][s] = {
            "Columns": df.columns.astype(str).tolist(),
            "Head": df.head(3).fillna("").astype(str).to_dict(orient="records")
        }
    
    with open("F:/AntiGravity/ysdms-nextgen/excel_output.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print("Exported to excel_output.json successfully.")
except Exception as e:
    print("Error:", e)
