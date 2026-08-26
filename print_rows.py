import xlrd, sys
def print_rows(filepath, out_path, r_start, r_end):
    with open(out_path, 'w', encoding='utf-8') as f:
        wb = xlrd.open_workbook(filepath)
        ws = wb.sheet_by_index(0)
        for r in range(r_start, r_end):
            vals = []
            for c in range(min(20, ws.ncols)):
                v = ws.cell_value(r, c)
                if v: vals.append(f'[{c}]{v}')
            if vals: f.write(f'    R{r+1}: {" | ".join(vals)}\n')

if __name__ == "__main__":
    print_rows(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
