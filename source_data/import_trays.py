#!/usr/bin/env python3
"""
import_trays.py — Upsert トレイデータ一覧表 → tray_master
Chạy: python import_trays.py "toreiteta-Zhi-Shi-Shu.xlsx"
"""
import sys, os, re
from pathlib import Path
import pandas as pd
import numpy as np

def clean(v):
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return None
    s = str(v).strip()
    return s if s else None

def to_numeric(v):
    c = clean(v)
    if c is None: return None
    try: return float(c)
    except: return None

def merge_remarks(*cols):
    parts = [clean(c) for c in cols if clean(c)]
    return ' / '.join(parts) if parts else None

def main(xlsx_path: str):
    p = Path(xlsx_path).resolve()
    out_dir = p.parent

    df = pd.read_excel(p, sheet_name='トレイデータ一覧表', header=4)
    df = df[df['P/N'].notna() & (df['P/N'].astype(str).str.strip() != '')].copy()
    df.reset_index(drop=True, inplace=True)

    rows = []
    for _, r in df.iterrows():
        pn = clean(r['P/N'])
        if not pn:
            continue
        rows.append({
            'pn':                   pn,
            'mold_number':          clean(r['型\u3000番']),
            'material':             clean(r['材質']),
            'thickness_mm':         to_numeric(r['厚み']),
            'sheet_width':          clean(r['ｼｰﾄ巾']),
            'antistatic':           clean(r['帯電']),
            'silicon':              clean(r['ｼﾘｺﾝ']),
            'coating':              clean(r['塗布']),
            'qty_per_tray':         clean(r['入数']),
            'product_name':         clean(r['Unnamed: 9']),
            'sheet_size':           clean(r['Unnamed: 10']),
            'sheet_size_alt1':      clean(r['Unnamed: 11']),
            'sheet_size_alt2':      clean(r['Unnamed: 12']),
            'tol_long_upper':       clean(r['長手（交差上限）']),
            'tol_long_lower':       clean(r['長手（交差下限）']),
            'tol_short_upper':      clean(r['短手（交差上限）']),
            'tol_short_lower':      clean(r['短手（交差下限）']),
            'dim_long_mm':          to_numeric(r['長手']),
            'dim_short_mm':         to_numeric(r['短手']),
            'mold_exists':          clean(r['有・無']),
            'remarks':              merge_remarks(
                                        r['　　　　　　　　　　　　備\u3000考'],
                                        r['Unnamed: 25'], r['Unnamed: 26'], r['Unnamed: 27']
                                    ),
            'instruction_created_at': clean(r['指示書作成']),
            'instruction_updated_at': clean(r['Unnamed: 32']),
            'instruction_note':     clean(r['Unnamed: 33']),
        })

    def sql_val(v):
        if v is None: return 'NULL'
        if isinstance(v, float):
            return 'NULL' if np.isnan(v) else str(v)
        return "'" + str(v).replace("'", "''") + "'"

    cols = list(rows[0].keys())
    update_cols = [c for c in cols if c != 'pn']

    lines = ["-- tray_master UPSERT", f"-- Source: {p.name}", f"-- Rows: {len(rows)}", ""]
    lines.append("INSERT INTO public.tray_master")
    lines.append("(" + ", ".join(cols) + ")")
    lines.append("VALUES")

    values_list = []
    for row in rows:
        vals = ", ".join(sql_val(row[c]) for c in cols)
        values_list.append(f"  ({vals})")
    lines.append(",\n".join(values_list))

    lines.append("ON CONFLICT (pn) DO UPDATE SET")
    set_parts = [f"  {c} = EXCLUDED.{c}" for c in update_cols]
    lines.append(",\n".join(set_parts))
    lines.append(";")

    out_file = out_dir / f"{p.stem}_trays_upsert.sql"
    out_file.write_text("\n".join(lines), encoding='utf-8')
    print(f"✅ {len(rows)} trays → {out_file}")

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'toreiteta-Zhi-Shi-Shu.xlsx')
