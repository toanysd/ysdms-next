import xlrd, os, glob, openpyxl

with open('out_allowances_direct_utf8.txt', 'w', encoding='utf-8') as fh:
    fh.write("--- 1. Searching for 成形部門手当 ---\n")
    for root, dirs, files in os.walk(r'\\SERVER\ysd-folder'):
        for f in files:
            if '成形' in f and '手当' in f and (f.endswith('.xls') or f.endswith('.xlsx')):
                fp = os.path.join(root, f)
                fh.write(f'FOUND: {fp} ({os.path.getsize(fp)} bytes)\n')
                try:
                    if fp.endswith('.xls'):
                        wb = xlrd.open_workbook(fp)
                        fh.write(f'Sheets: {wb.sheet_names()}\n')
                        for name in wb.sheet_names()[:3]:
                            ws = wb.sheet_by_name(name)
                            fh.write(f'  Sheet: {name} ({ws.nrows}R x {ws.ncols}C)\n')
                            for r in range(min(30, ws.nrows)):
                                vals = []
                                for c in range(min(20, ws.ncols)):
                                    v = ws.cell_value(r, c)
                                    if v:
                                        vals.append(f'[{c}]{v}')
                                if vals:
                                    fh.write(f'    R{r+1}: {" | ".join(vals)}\n')
                    else:
                        wb = openpyxl.load_workbook(fp, data_only=True)
                        fh.write(f'Sheets: {wb.sheetnames}\n')
                        for name in wb.sheetnames[:3]:
                            ws = wb[name]
                            fh.write(f'  Sheet: {name}\n')
                            for r_idx, row in enumerate(ws.iter_rows(min_row=1, max_row=30, max_col=20, values_only=True)):
                                vals = []
                                for c_idx, v in enumerate(row):
                                    if v:
                                        vals.append(f'[{c_idx}]{v}')
                                if vals:
                                    fh.write(f'    R{r_idx+1}: {" | ".join(vals)}\n')
                except Exception as e:
                    fh.write(f'ERROR: {e}\n')

    fh.write("\n--- 2. Parsing recent payroll files ---\n")
    payroll_dir = r'\\SERVER\ysd-folder\社長データ\2）個人ファイル\給与＆損益資料\給与・賞与'
    if os.path.exists(payroll_dir):
        files = sorted([f for f in os.listdir(payroll_dir) if '給与' in f and f.endswith('.xlsx')], reverse=True)[:2]
        for f in files:
            fp = os.path.join(payroll_dir, f)
            fh.write(f'\nPARSING: {fp}\n')
            try:
                wb = openpyxl.load_workbook(fp, read_only=True, data_only=True)
                for name in wb.sheetnames[:2]:
                    ws = wb[name]
                    fh.write(f'  Sheet: {name}\n')
                    for i, row in enumerate(ws.iter_rows(max_row=15, max_col=20, values_only=False)):
                        vals = []
                        for cell in row:
                            if cell.value:
                                vals.append(f'[{cell.column-1}]{cell.value}')
                        if vals:
                            fh.write(f'    R{i+1}: {" | ".join(vals)}\n')
            except Exception as e:
                fh.write(f'ERROR: {e}\n')
