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

def fetch_table(table_name):
    print(f"Fetching {table_name}...")
    cur.execute(f"SELECT * FROM [{table_name}]")
    cols = [d[0] for d in cur.description]
    rows = cur.fetchall()
    result = []
    for r in rows:
        row_dict = {}
        for i, val in enumerate(r):
            row_dict[cols[i]] = serialize(val)
        result.append(row_dict)
    print(f"  -> {len(result)} rows fetched")
    return result

export_data = {
    'exported_at': datetime.now().isoformat(),
    'source_file': db_path,
    'tblJOB': fetch_table('tblJOB'),
    'tblProcessingDeadline': fetch_table('tblProcessingDeadline'),
    'tblWorkLog': fetch_table('tblWorkLog'),
    'tblMoldBorrow': fetch_table('tblMoldBorrow'),
    'tblEmployee': fetch_table('tblEmployee'),
    'tblResponsiblePerson': fetch_table('tblResponsiblePerson'),
    'tblMachine': fetch_table('tblMachine'),
    'tblProcessingCode': fetch_table('tblProcessingCode'),
    'tblProcessingStatus': fetch_table('tblProcessingStatus'),
    'tblProcessingItem': fetch_table('tblProcessingItem'),
    'tblCalendar': fetch_table('tblCalendar')
}

out_file = 'scripts/access_audit_export.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(export_data, f, ensure_ascii=False)

print(f"\nSuccessfully exported candidate tables to {out_file}!")
conn.close()
