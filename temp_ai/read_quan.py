import sys
import traceback
import io

try:
    import pandas as pd
except:
    import subprocess; subprocess.run([sys.executable, '-m', 'pip', 'install', 'pandas', 'openpyxl', 'xlrd'], capture_output=True)
    import pandas as pd

files = [
    (r"\\SERVER\ysd-folder\社長データ\社長移動時フォルダ\クアン日報チェック\クアン設計集計.xlsx", 'openpyxl'),
    (r"\\SERVER\ysd-folder\社長データ\社長移動時フォルダ\クアン日報チェック\クアン日報.xls", 'xlrd')
]

with open(r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai\quan_output.txt", "w", encoding="utf-8") as out:
    for f, engine in files:
        out.write(f"\n=== {f} ===\n")
        try:
            xls = pd.ExcelFile(f, engine=engine)
            out.write(f"Sheets: {xls.sheet_names}\n")
            # Only read first 5 sheets
            for sheet in xls.sheet_names[:5]:
                out.write(f"\n  Sheet: {sheet}\n")
                df = pd.read_excel(xls, sheet_name=sheet, nrows=10, header=None)
                for i, row in df.iterrows():
                    clean_row = [str(x) if pd.notna(x) else "" for x in row.tolist()[:20]]
                    out.write(f"    Row {i+1}: {clean_row}\n")
        except Exception as e:
            out.write(f"Error: {e}\n")
            traceback.print_exc(file=out)
