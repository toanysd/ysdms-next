import xlrd, sys, os
def dump_xls(f, out):
    with open(out, 'w', encoding='utf-8') as fh:
        wb = xlrd.open_workbook(f)
        fh.write(f'File: {os.path.basename(f)}\n')
        for name in wb.sheet_names():
            ws = wb.sheet_by_name(name)
            fh.write(f'Sheet: {name} ({ws.nrows}R x {ws.ncols}C)\n')
            for r in range(min(25, ws.nrows)):
                vals = []
                for c in range(ws.ncols):
                    v = ws.cell_value(r, c)
                    if v:
                        vals.append(f'[{c}]{v}')
                if vals:
                    fh.write(f'  R{r+1}: {" | ".join(vals)}\n')

if __name__ == '__main__':
    dump_xls(sys.argv[1], sys.argv[2])
