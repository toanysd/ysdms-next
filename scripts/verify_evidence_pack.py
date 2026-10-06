import win32com.client
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
db_path = os.path.abspath('docs/ysdJOB_20261006.accdb')
dao = win32com.client.Dispatch('DAO.DBEngine.120')
db = dao.OpenDatabase(db_path, False, True)

print("="*60)
print("1. EXACT TABLE COUNTS VS SUBSETS")
print("="*60)

for t in ['tblTeflonLog', 'tblLocationLog', 'tblShipLog']:
    try:
        rs = db.OpenRecordset(f"SELECT COUNT(*) AS cnt FROM [{t}]")
        print(f"Table [{t}] total rows: {rs.Fields('cnt').Value}")
        rs.Close()
    except Exception as e:
        print(f"Error reading {t}: {e}")

# Check tblTeflonLog details
print("\n--- tblTeflonLog Subsets ---")
try:
    rs = db.OpenRecordset("SELECT COUNT(*) AS cnt FROM [tblTeflonLog] WHERE MoldID IS NOT NULL")
    print(f"tblTeflonLog with MoldID IS NOT NULL: {rs.Fields('cnt').Value}")
    rs.Close()
    rs = db.OpenRecordset("SELECT COUNT(DISTINCT MoldID) AS cnt FROM [tblTeflonLog] WHERE MoldID IS NOT NULL")
    # DAO might not support COUNT(DISTINCT ...), let's use GROUP BY
except Exception as e:
    print("tblTeflonLog error:", e)

# Check tblLocationLog details
print("\n--- tblLocationLog Subsets ---")
try:
    rs = db.OpenRecordset("SELECT COUNT(*) AS cnt FROM [tblLocationLog] WHERE MoldID IS NOT NULL")
    print(f"tblLocationLog with MoldID IS NOT NULL: {rs.Fields('cnt').Value}")
    rs.Close()
    rs = db.OpenRecordset("SELECT COUNT(*) AS cnt FROM [tblLocationLog] WHERE CutterID IS NOT NULL")
    print(f"tblLocationLog with CutterID IS NOT NULL: {rs.Fields('cnt').Value}")
    rs.Close()
except Exception as e:
    print("tblLocationLog error:", e)

# Check tblShipLog details
print("\n--- tblShipLog Subsets ---")
try:
    rs = db.OpenRecordset("SELECT COUNT(*) AS cnt FROM [tblShipLog]")
    print(f"tblShipLog total: {rs.Fields('cnt').Value}")
    rs.Close()
except Exception as e:
    print("tblShipLog error:", e)

db.Close()
