import pyodbc
import os
import sys
import datetime
import json

sys.stdout.reconfigure(encoding='utf-8')

db_path = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'
conn_str = f'DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={db_path};ReadOnly=1;'

def run_audit():
    print(f"Connecting to: {db_path}...")
    conn = pyodbc.connect(conn_str)
    conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
    conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
    conn.setencoding(encoding='utf-8')
    cursor = conn.cursor()
    print("Connected successfully with proper cp932/utf-16-le decoding!\n")

    # 1. Lấy tất cả bảng
    all_tables = [row.table_name for row in cursor.tables(tableType='TABLE')]
    user_tables = [t for t in all_tables if not t.startswith('~')]
    tmp_tables = [t for t in all_tables if t.startswith('~')]
    print(f"Tổng số bảng: {len(all_tables)} ({len(user_tables)} bảng nghiệp vụ, {len(tmp_tables)} bảng tạm clipboard)\n")

    table_stats = []
    for t in sorted(user_tables):
        try:
            cursor.execute(f"SELECT count(*) FROM [{t}]")
            row_count = cursor.fetchone()[0]
            
            # Lấy columns
            columns = []
            for col in cursor.columns(table=t):
                columns.append({
                    'name': col.column_name,
                    'type': col.type_name,
                    'size': col.column_size,
                    'nullable': col.is_nullable
                })
            table_stats.append({
                'table_name': t,
                'row_count': row_count,
                'column_count': len(columns),
                'columns': columns
            })
            print(f"  • {t:<28} | {row_count:>8} rows | {len(columns):>3} cols")
        except Exception as e:
            print(f"  • {t:<28} | ERROR: {e}")
            table_stats.append({
                'table_name': t,
                'row_count': -1,
                'error': str(e)
            })

    with open('scripts/access_table_stats.json', 'w', encoding='utf-8') as f:
        json.dump(table_stats, f, ensure_ascii=False, indent=2, default=str)
    print("\nĐã lưu thống kê toàn bộ 50 bảng nghiệp vụ vào scripts/access_table_stats.json")

    conn.close()

if __name__ == '__main__':
    run_audit()
