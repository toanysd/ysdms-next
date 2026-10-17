import xlrd, os, sys
def parse_xls(filepath, out_path):
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            wb = xlrd.open_workbook(filepath)
            f.write(f'\n{"="*70}\n')
            f.write(f'FILE: {os.path.basename(filepath)}\n')
            f.write(f'Sheets: {wb.sheet_names()}\n')
            for name in wb.sheet_names()[:3]:
                ws = wb.sheet_by_name(name)
                f.write(f'\n  Sheet: {name} ({ws.nrows}R x {ws.ncols}C)\n')
                for r in range(min(15, ws.nrows)):
                    vals = []
                    for c in range(min(20, ws.ncols)):
                        v = ws.cell_value(r, c)
                        if v:
                            vals.append(f'[{c}]{v}')
                    if vals:
                        f.write(f'    R{r+1}: {" | ".join(vals)}\n')
    except Exception as e:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(f'ERROR {filepath}: {e}\n')

if __name__ == "__main__":
    parse_xls(sys.argv[1], sys.argv[2])
