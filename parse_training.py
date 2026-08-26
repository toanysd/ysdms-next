import xlrd, os

for root, dirs, files in os.walk(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\ISO(2026見直し済み）'):
    for f in files:
        if '教育' in f and f.endswith('.xls'):
            fp = os.path.join(root, f)
            print(f'FOUND: {fp}')
            try:
                wb = xlrd.open_workbook(fp)
                print(f'Sheets: {wb.sheet_names()}')
                for name in wb.sheet_names()[:3]:
                    ws = wb.sheet_by_name(name)
                    print(f'  Sheet: {name} ({ws.nrows}R x {ws.ncols}C)')
                    for r in range(min(20, ws.nrows)):
                        vals = []
                        for c in range(min(25, ws.ncols)):
                            v = ws.cell_value(r, c)
                            if v:
                                vals.append(f'[{c}]{v}')
                        if vals:
                            joined = " | ".join(vals)
                            print(f'    R{r+1}: {joined}')
            except Exception as e:
                print(f'ERROR: {e}')
