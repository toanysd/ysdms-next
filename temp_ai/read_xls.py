import pandas as pd
import sys
import traceback
import io

files = [
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\Form lien quan\F 設計&金型部門日報記録書.xls",
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\Form lien quan\F プレス＆検査部門日報記録書 - ベトナム語含む.xls",
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\ISO(2026見直し済み）\文書類　共通\フォーマット\F 金型部門日報兼不適合製品記録書.xls",
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\金型&設計部門(2015～).xls"
]

with open(r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai\xls_output.txt", "w", encoding="utf-8") as out:
    for f in files:
        out.write(f"\n=== {f} ===\n")
        try:
            xls = pd.ExcelFile(f, engine='xlrd')
            for sheet in xls.sheet_names:
                out.write(f"  Sheet: {sheet}\n")
                df = pd.read_excel(xls, sheet_name=sheet, nrows=10, header=None)
                for _, row in df.iterrows():
                    # Clean up nan values for printing
                    clean_row = [str(x) if pd.notna(x) else "" for x in row.tolist()]
                    out.write(f"    {clean_row}\n")
        except Exception as e:
            out.write(f"Error: {e}\n")
            traceback.print_exc(file=out)
