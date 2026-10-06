import pyodbc
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = pyodbc.connect(r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb;ReadOnly=1;')
conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
conn.setencoding(encoding='utf-8')
cur = conn.cursor()

def fetch_all(tbl):
    cur.execute(f"SELECT * FROM [{tbl}]")
    cols = [d[0] for d in cur.description]
    rows = cur.fetchall()
    return cols, rows

# 1. Inspect tblPLASTICforForming
p_cols, p_rows = fetch_all('tblPLASTICforForming')
print(f"=== tblPLASTICforForming ({len(p_rows)} rows) ===")
print("Columns:", p_cols)
combines = [r[p_cols.index('PlasticForFormingCombine')] for r in p_rows if r[p_cols.index('PlasticForFormingCombine')]]
print("Sample Combines (Tổ hợp thông số nhựa):")
for c in combines[:10]:
    print("  •", c)

# Check foreign keys in tblPLASTICforForming
with_job = sum(1 for r in p_rows if r[p_cols.index('JobID')])
with_mold = sum(1 for r in p_rows if r[p_cols.index('MoldID')])
with_design = sum(1 for r in p_rows if r[p_cols.index('MoldDesignID')])
print(f"Linkages: with JobID={with_job}, with MoldID={with_mold}, with MoldDesignID={with_design}")

# 2. Inspect DatHangVTTbl
d_cols, d_rows = fetch_all('DatHangVTTbl')
print(f"\n=== DatHangVTTbl ({len(d_rows)} rows) ===")
print("Columns:", d_cols)
dh_jobs = sum(1 for r in d_rows if r[d_cols.index('JobID')])
print(f"Linkage with JobID: {dh_jobs} / {len(d_rows)}")
print("Sample DatHangVTTbl:")
for r in d_rows[:5]:
    sample = {d_cols[i]: str(r[i]) for i in range(len(d_cols))}
    print(" ", sample)

# 3. Inspect VatTuSDtbl
vsd_cols, vsd_rows = fetch_all('VatTuSDtbl')
print(f"\n=== VatTuSDtbl ({len(vsd_rows)} rows) ===")
print("Columns:", vsd_cols)
vsd_wl = sum(1 for r in vsd_rows if r[vsd_cols.index('WorkLogID')])
print(f"Linkage with WorkLogID: {vsd_wl} / {len(vsd_rows)}")
print("Sample VatTuSDtbl:")
for r in vsd_rows[:5]:
    sample = {vsd_cols[i]: str(r[i]) for i in range(len(vsd_cols))}
    print(" ", sample)

# 4. Inspect VatTuTbl
vt_cols, vt_rows = fetch_all('VatTuTbl')
print(f"\n=== VatTuTbl ({len(vt_rows)} rows) ===")
print("Columns:", vt_cols)
print("Sample VatTuTbl:")
for r in vt_rows[:5]:
    sample = {vt_cols[i]: str(r[i]) for i in range(len(vt_cols))}
    print(" ", sample)

conn.close()
