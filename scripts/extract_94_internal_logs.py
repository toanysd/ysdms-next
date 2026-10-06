import win32com.client
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')
db_path = os.path.abspath('docs/ysdJOB_20261006.accdb')
dao = win32com.client.Dispatch('DAO.DBEngine.120')
db = dao.OpenDatabase(db_path, False, True)

sql = """
SELECT wl.WorkLogID, wl.ProcessingCodeID, pc.ProcessingName, wl.ProcessingNotes, 
       wl.ProcessingDate, wl.ProcessingDeadlineID, wl.ProcessingTime, wl.EmployeeID
FROM tblWorkLog AS wl
LEFT JOIN tblProcessingCode AS pc ON wl.ProcessingCodeID = pc.ProcessingCodeID
WHERE wl.ProcessingDeadlineID IS NULL
ORDER BY wl.WorkLogID
"""

rs = db.OpenRecordset(sql)
rows = []
code_counts = {}

while not rs.EOF:
    r = {
        'WorkLogID': rs.Fields('WorkLogID').Value,
        'ProcessingCodeID': rs.Fields('ProcessingCodeID').Value,
        'ProcessingName': rs.Fields('ProcessingName').Value,
        'ProcessingNotes': rs.Fields('ProcessingNotes').Value,
        'ProcessingDate': str(rs.Fields('ProcessingDate').Value) if rs.Fields('ProcessingDate').Value else None,
        'ProcessingDeadlineID': rs.Fields('ProcessingDeadlineID').Value,
        'ProcessingTime': rs.Fields('ProcessingTime').Value,
        'EmployeeID': rs.Fields('EmployeeID').Value
    }
    rows.append(r)
    pname = r['ProcessingName'] or 'NULL'
    pcode = r['ProcessingCodeID']
    key = f"{pcode}: {pname}"
    code_counts[key] = code_counts.get(key, 0) + 1
    rs.MoveNext()

rs.Close()
db.Close()

print(f"Total rows with ProcessingDeadlineID IS NULL: {len(rows)}")
print("\nDistribution by ProcessingCode:")
for k, v in sorted(code_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {k}: {v} logs")

with open('scripts/evidence_94_internal_logs.json', 'w', encoding='utf-8') as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

print("\nSaved all 94 rows to scripts/evidence_94_internal_logs.json")
