import pyodbc
import json
import sys
from datetime import date, datetime

sys.stdout.reconfigure(encoding='utf-8')

db_path = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={db_path};ReadOnly=1;'

conn = pyodbc.connect(conn_str)
conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
conn.setencoding(encoding='utf-8')
cur = conn.cursor()

def serialize(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    return obj

tables_to_inspect = [
    'tblJOB',
    'tblWorkLog',
    'tblProcessingDeadline',
    'tblProcessingStatus',
    'tblProcessingCode',
    'tblProcessingItem',
    'tblMoldBorrow',
    'tblCalendar',
    'tblEmployee',
    'tblResponsiblePerson',
    'tblMachine'
]

results = {}

for tbl in tables_to_inspect:
    print(f"Inspecting {tbl}...")
    cur.execute(f"SELECT * FROM [{tbl}]")
    cols = [d[0] for d in cur.description]
    rows = cur.fetchall()
    
    sample_rows = []
    for r in rows[:5]:
        sample_rows.append({cols[i]: serialize(r[i]) for i in range(len(cols))})
        
    results[tbl] = {
        'total_rows': len(rows),
        'column_names': cols,
        'sample_rows': sample_rows
    }
    
    # Specific stats
    if tbl == 'tblJOB':
        job_nos = [r[cols.index('JobNo')] for r in rows if r[cols.index('JobNo')]]
        order_dates = [r[cols.index('OrderDate')] for r in rows if r[cols.index('OrderDate')]]
        delivery_dates = [r[cols.index('DeliveryDate')] for r in rows if r[cols.index('DeliveryDate')]]
        results[tbl]['min_order_date'] = serialize(min(order_dates)) if order_dates else None
        results[tbl]['max_order_date'] = serialize(max(order_dates)) if order_dates else None
        results[tbl]['distinct_job_nos'] = len(set(job_nos))
        
    elif tbl == 'tblWorkLog':
        work_dates = [r[cols.index('WorkDate')] for r in rows if r[cols.index('WorkDate')]]
        results[tbl]['min_work_date'] = serialize(min(work_dates)) if work_dates else None
        results[tbl]['max_work_date'] = serialize(max(work_dates)) if work_dates else None
        
    elif tbl == 'tblMoldBorrow':
        borrow_dates = [r[cols.index('BorrowDate')] for r in rows if 'BorrowDate' in cols and r[cols.index('BorrowDate')]]
        results[tbl]['min_borrow_date'] = serialize(min(borrow_dates)) if borrow_dates else None
        results[tbl]['max_borrow_date'] = serialize(max(borrow_dates)) if borrow_dates else None

with open('scripts/access_candidate_details.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved detailed candidate inspection to scripts/access_candidate_details.json")
conn.close()
