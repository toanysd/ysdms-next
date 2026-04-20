#!/usr/bin/env python3
"""
import_customers.py
Đọc sheet 納入先一覧表 từ file Excel, tạo file SQL upsert vào bảng customers.
Chạy lại bất cứ lúc nào file Excel thay đổi — an toàn, không xóa dữ liệu cũ.

Usage:
    python import_customers.py "toreiteta-Zhi-Shi-Shu.xlsx"
"""

import sys
import re
import pandas as pd
from pathlib import Path
from datetime import datetime

def clean(val):
    """Chuỗi rỗng/NaN/dấu * → NULL SQL"""
    if val is None:
        return "NULL"
    s = str(val).strip()
    if s in ('', 'nan', '*', '*****', 'NaN'):
        return "NULL"
    # Escape single quotes
    s = s.replace("'", "''")
    return f"'{s}'"

def extract_parent_code(requester_name):
    """
    Cột 依頼元 thường có dạng 'AAK01' hoặc 'AAK01　1234'
    → lấy phần đầu làm parent_code / requester_code
    """
    if not requester_name or str(requester_name).strip() in ('', 'nan', '*'):
        return "NULL", "NULL"
    s = str(requester_name).strip()
    # Tách theo khoảng trắng full-width hoặc half-width
    parts = re.split(r'[\s\u3000]+', s, maxsplit=1)
    code = parts[0].strip() if parts else s
    return clean(code), clean(s)

def main():
    if len(sys.argv) < 2:
        print("Usage: python import_customers.py <path_to_excel>")
        sys.exit(1)

    excel_path = Path(sys.argv[1]).resolve()
    if not excel_path.exists():
        print(f"File not found: {excel_path}")
        sys.exit(1)

    print(f"Reading: {excel_path}")

    # --- Đọc sheet ---
    df = pd.read_excel(
        excel_path,
        sheet_name='納入先一覧表',
        header=0,
        dtype=str
    )

    # Đặt tên cột theo thứ tự thực tế
    col_map = {
        df.columns[0]: 'customer_code',
        df.columns[1]: 'delivery_name',
        df.columns[2]: 'delivery_address',
        df.columns[3]: 'requester_raw',
        df.columns[4]: 'contact_person',
        df.columns[5]: 'phone',
        df.columns[6]: 'fax',
    }
    df = df.rename(columns=col_map)

    # --- Lọc bỏ các dòng đặc biệt ---
    SKIP_CODES = {'11', '111', '888', '999'}
    df['customer_code'] = df['customer_code'].astype(str).str.strip()
    df = df[~df['customer_code'].isin(SKIP_CODES)]
    df = df[df['customer_code'].notna()]
    df = df[df['customer_code'] != 'nan']
    df = df.reset_index(drop=True)

    print(f"Valid rows: {len(df)}")

    # --- Sinh SQL ---
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    output_path = excel_path.parent / f"{excel_path.stem}_customers_upsert.sql"

    lines = []
    lines.append("-- ============================================================")
    lines.append(f"-- customers UPSERT — generated {now}")
    lines.append(f"-- Source: {excel_path.name}  ({len(df)} rows)")
    lines.append("-- ON CONFLICT(customer_code): UPDATE tất cả cột trừ id, created_at")
    lines.append("-- Rows không có trong Excel: GIỮ NGUYÊN (không xóa)")
    lines.append("-- ============================================================")
    lines.append("")
    lines.append("INSERT INTO public.customers (")
    lines.append("  customer_code,")
    lines.append("  customer_name_jp,")
    lines.append("  delivery_name,")
    lines.append("  delivery_address,")
    lines.append("  requester_code,")
    lines.append("  requester_name,")
    lines.append("  contact_person,")
    lines.append("  phone,")
    lines.append("  fax,")
    lines.append("  is_active,")
    lines.append("  updated_at")
    lines.append(")")
    lines.append("VALUES")

    value_rows = []
    for _, row in df.iterrows():
        code       = clean(row.get('customer_code'))
        # customer_name_jp = delivery_name (tên JP chính thức)
        name_jp    = clean(row.get('delivery_name'))
        d_name     = clean(row.get('delivery_name'))
        d_addr     = clean(row.get('delivery_address'))
        req_raw    = row.get('requester_raw', '')
        req_code, req_name = extract_parent_code(req_raw)
        contact    = clean(row.get('contact_person'))
        phone      = clean(row.get('phone'))
        fax        = clean(row.get('fax'))

        value_rows.append(
            f"  ({code}, {name_jp}, {d_name}, {d_addr}, "
            f"{req_code}, {req_name}, {contact}, {phone}, {fax}, "
            f"TRUE, '{now}')"
        )

    lines.append(",\n".join(value_rows))
    lines.append("")
    lines.append("ON CONFLICT (customer_code) DO UPDATE SET")
    lines.append("  customer_name_jp  = EXCLUDED.customer_name_jp,")
    lines.append("  delivery_name     = EXCLUDED.delivery_name,")
    lines.append("  delivery_address  = EXCLUDED.delivery_address,")
    lines.append("  requester_code    = EXCLUDED.requester_code,")
    lines.append("  requester_name    = EXCLUDED.requester_name,")
    lines.append("  contact_person    = EXCLUDED.contact_person,")
    lines.append("  phone             = EXCLUDED.phone,")
    lines.append("  fax               = EXCLUDED.fax,")
    lines.append("  updated_at        = EXCLUDED.updated_at")
    lines.append("  -- is_active KHÔNG cập nhật (giữ giá trị thủ công)")
    lines.append(";")
    lines.append("")
    lines.append(f"-- Tổng số dòng: {len(df)}")

    sql_content = "\n".join(lines)
    output_path.write_text(sql_content, encoding='utf-8')
    print(f"✅ SQL saved: {output_path}")
    print(f"   Rows: {len(df)}")

if __name__ == '__main__':
    main()