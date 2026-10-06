import pyodbc
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = pyodbc.connect(r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb;ReadOnly=1;')
conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
conn.setencoding(encoding='utf-8')
cur = conn.cursor()

# 1. Inspect 20 steps with JobID = null
cur.execute("SELECT * FROM tblProcessingDeadline WHERE JobID IS NULL")
cols = [d[0] for d in cur.description]
rows = cur.fetchall()
print(f"=== 20 STEPS WITH JobID IS NULL ===")
for r in rows:
    sample = {cols[i]: str(r[i]) for i in range(len(cols))}
    print(" ", sample)

# 2. Inspect 94 work logs with ProcessingDeadlineID = null
cur.execute("SELECT * FROM tblWorkLog WHERE ProcessingDeadlineID IS NULL")
wl_cols = [d[0] for d in cur.description]
wl_rows = cur.fetchall()
print(f"\n=== 94 WORK LOGS WITH ProcessingDeadlineID IS NULL ===")
print("Columns:", wl_cols)
# Check dates and notes
dates = [r[wl_cols.index('ProcessingDate')] for r in wl_rows if r[wl_cols.index('ProcessingDate')]]
notes = [r[wl_cols.index('ProcessingNotes')] for r in wl_rows if r[wl_cols.index('ProcessingNotes')]]
codes = [r[wl_cols.index('ProcessingCodeID')] for r in wl_rows if r[wl_cols.index('ProcessingCodeID')]]
companies = [r[wl_cols.index('CompanyID')] for r in wl_rows if r[wl_cols.index('CompanyID')]]

print(f"Dates range: {min(dates)} to {max(dates)}" if dates else "No dates")
print(f"Non-empty notes count: {len(notes)}")
print("Sample notes:")
for n in notes[:10]:
    print("  •", n)

conn.close()
