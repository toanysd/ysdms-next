import xlrd, os, glob, openpyxl

print("--- 1. Searching for 成形部門手当 ---")
for root, dirs, files in os.walk(r'\\SERVER\ysd-folder'):
    for f in files:
        if '成形' in f and '手当' in f and (f.endswith('.xls') or f.endswith('.xlsx')):
            fp = os.path.join(root, f)
            print(f'FOUND: {fp} ({os.path.getsize(fp)} bytes)')
            try:
                if fp.endswith('.xls'):
                    wb = xlrd.open_workbook(fp)
                    print(f'Sheets: {wb.sheet_names()}')
                    for name in wb.sheet_names()[:3]:
                        ws = wb.sheet_by_name(name)
                        print(f'  Sheet: {name} ({ws.nrows}R x {ws.ncols}C)')
                        for r in range(min(30, ws.nrows)):
                            vals = []
                            for c in range(min(20, ws.ncols)):
                                v = ws.cell_value(r, c)
                                if v:
                                    vals.append(f'[{c}]{v}')
                            if vals:
                                print(f'    R{r+1}: {" | ".join(vals)}')
                else:
                    wb = openpyxl.load_workbook(fp, data_only=True)
                    print(f'Sheets: {wb.sheetnames}')
                    for name in wb.sheetnames[:3]:
                        ws = wb[name]
                        print(f'  Sheet: {name}')
                        for r_idx, row in enumerate(ws.iter_rows(min_row=1, max_row=30, max_col=20, values_only=True)):
                            vals = []
                            for c_idx, v in enumerate(row):
                                if v:
                                    vals.append(f'[{c_idx}]{v}')
                            if vals:
                                print(f'    R{r_idx+1}: {" | ".join(vals)}')
            except Exception as e:
                print(f'ERROR: {e}')

print("\n--- 2. Parsing recent payroll files ---")
payroll_dir = r'\\SERVER\ysd-folder\社長データ\2）個人ファイル\給与＆損益資料\給与・賞与'
if os.path.exists(payroll_dir):
    files = sorted([f for f in os.listdir(payroll_dir) if '給与' in f and f.endswith('.xlsx')], reverse=True)[:2]
    for f in files:
        fp = os.path.join(payroll_dir, f)
        print(f'\nPARSING: {fp}')
        try:
            wb = openpyxl.load_workbook(fp, read_only=True, data_only=True)
            for name in wb.sheetnames[:2]:
                ws = wb[name]
                print(f'  Sheet: {name}')
                for i, row in enumerate(ws.iter_rows(max_row=15, max_col=20, values_only=False)):
                    vals = []
                    for cell in row:
                        if cell.value:
                            vals.append(f'[{cell.column-1}]{cell.value}')
                    if vals:
                        print(f'    R{i+1}: {" | ".join(vals)}')
        except Exception as e:
            print(f'ERROR: {e}')
else:
    print("Payroll dir not found.")
