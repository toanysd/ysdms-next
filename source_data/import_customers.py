#!/usr/bin/env python3
"""
import_customers.py
-------------------
Đọc sheet '納入先一覧表' từ file Excel và sinh file SQL migration cho bảng customers.

Cách dùng:
    python import_customers.py <đường_dẫn_file.xlsx>

Ví dụ:
    python import_customers.py "C:/Users/you/toreiteta-Zhi-Shi-Shu.xlsx"

Kết quả:
    File SQL được tạo ngay trong cùng thư mục với file Excel.
    Chạy lại bất kỳ lúc nào khi file Excel thay đổi — dữ liệu mới được UPSERT,
    dữ liệu cũ không bị xóa nếu không có trong file mới.
"""

import sys
import re
import os
from pathlib import Path
from datetime import datetime

try:
    import pandas as pd
except ImportError:
    print("Thiếu thư viện pandas. Cài bằng: pip install pandas openpyxl")
    sys.exit(1)

# ── Cấu hình ────────────────────────────────────────────────────────────────
SHEET_NAME    = "納入先一覧表"
OUTPUT_SUFFIX = "_customers_upsert.sql"
SKIP_CODES    = {"*", "888", "999"}   # Dòng đặc biệt không import

# ── Helper ───────────────────────────────────────────────────────────────────
def clean(val):
    """Chuỗi sạch, None → NULL"""
    if val is None or (isinstance(val, float) and str(val) == 'nan'):
        return None
    s = str(val).strip()
    return None if s in ('', '*', 'nan') else s

def sql_str(val):
    """Python str → SQL literal, None → NULL"""
    if val is None:
        return "NULL"
    escaped = val.replace("'", "''")
    return f"'{escaped}'"

def infer_parent_code(code: str) -> str | None:
    """
    ADV1..ADV11 → 'ADV',  AMP1..AMP32 → 'AMP',  AAK → None
    Quy tắc: lấy phần chữ đầu nếu sau nó là số.
    """
    if not code:
        return None
    m = re.match(r'^([A-Za-z]+)\d+$', code)
    return m.group(1) if m else None

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    if len(sys.argv) < 2:
        print("Cách dùng:  python import_customers.py <file.xlsx>")
        sys.exit(1)

    xlsx_path = Path(sys.argv[1]).resolve()
    if not xlsx_path.exists():
        print(f"Không tìm thấy file: {xlsx_path}")
        sys.exit(1)

    out_path = xlsx_path.parent / (xlsx_path.stem + OUTPUT_SUFFIX)
    print(f"Đọc: {xlsx_path}")

    # ── Đọc sheet ────────────────────────────────────────────────────────────
    try:
        df = pd.read_excel(xlsx_path, sheet_name=SHEET_NAME, header=0, dtype=str)
    except Exception as e:
        print(f"Lỗi đọc sheet '{SHEET_NAME}': {e}")
        sys.exit(1)

    # Chuẩn hoá tên cột
    cols = list(df.columns)
    # Các cột cố định
    col_code     = cols[0]   # No.
    col_name     = cols[1]   # 送り先
    col_address  = cols[2]   # 住所
    col_req_code = cols[3]   # 依頼元
    col_contact  = cols[4]   # サブ
    col_phone    = cols[5]   # 電話
    col_fax      = cols[6]   # FAX
    col_note     = cols[7] if len(cols) > 7 else None  # Unnamed:7 (ghi chú thay đổi)

    rows_ok  = 0
    rows_skip = 0
    sql_values = []

    for _, row in df.iterrows():
        code = clean(row[col_code])
        if not code or code in SKIP_CODES:
            rows_skip += 1
            continue

        name     = clean(row[col_name])
        address  = clean(row[col_address])
        req_code = clean(row[col_req_code])
        contact  = clean(row[col_contact])
        phone    = clean(row[col_phone])
        fax      = clean(row[col_fax])
        note     = clean(row[col_note]) if col_note else None
        parent   = infer_parent_code(code)

        # Tách requester_code (phần trước khoảng trắng) và requester_name (phần sau)
        # Ví dụ: "AAT01　　1334" → code="AAT01", name="1334"
        req_code_clean = None
        req_name_clean = None
        if req_code:
            parts = req_code.split(None, 1)  # tách theo whitespace
            req_code_clean = parts[0] if parts else None
            req_name_clean = parts[1].strip() if len(parts) > 1 else None

        sql_values.append(
            f"  ({sql_str(code)}, {sql_str(name)}, {sql_str(address)}, "
            f"{sql_str(req_code_clean)}, {sql_str(req_name_clean)}, "
            f"{sql_str(contact)}, {sql_str(phone)}, {sql_str(fax)}, "
            f"{sql_str(parent)}, {sql_str(note)})"
        )
        rows_ok += 1

    # ── Tạo SQL ──────────────────────────────────────────────────────────────
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sql_lines = [
        f"-- ============================================================",
        f"-- customers UPSERT migration",
        f"-- Nguồn: {xlsx_path.name}",
        f"-- Tạo lúc: {generated_at}",
        f"-- Tổng: {rows_ok} khách hàng  |  Bỏ qua: {rows_skip} dòng",
        f"-- Chạy lại file này bất kỳ lúc nào — UPSERT an toàn, không xóa dữ liệu.",
        f"-- ============================================================",
        f"",
        f"-- Tạo bảng nếu chưa có (idempotent)",
        f"CREATE TABLE IF NOT EXISTS customers (",
        f"  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),",
        f"  customer_code   text        NOT NULL UNIQUE,",
        f"  delivery_name   text,",
        f"  delivery_address text,",
        f"  requester_code  text,",
        f"  requester_name  text,",
        f"  contact_person  text,",
        f"  phone           text,",
        f"  fax             text,",
        f"  parent_code     text,",
        f"  change_note     text,",
        f"  is_active       boolean     NOT NULL DEFAULT true,",
        f"  created_at      timestamptz NOT NULL DEFAULT now(),",
        f"  updated_at      timestamptz NOT NULL DEFAULT now()",
        f");",
        f"",
        f"-- Index để lookup nhanh",
        f"CREATE INDEX IF NOT EXISTS idx_customers_code   ON customers (customer_code);",
        f"CREATE INDEX IF NOT EXISTS idx_customers_parent ON customers (parent_code);",
        f"",
        f"-- Trigger tự cập nhật updated_at",
        f"CREATE OR REPLACE FUNCTION set_updated_at()",
        f"RETURNS TRIGGER LANGUAGE plpgsql AS $$",
        f"BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;",
        f"",
        f"DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;",
        f"CREATE TRIGGER trg_customers_updated_at",
        f"  BEFORE UPDATE ON customers",
        f"  FOR EACH ROW EXECUTE FUNCTION set_updated_at();",
        f"",
        f"-- ── UPSERT data ─────────────────────────────────────────────────",
        f"-- Khi chạy lại: cập nhật các cột thay đổi, giữ nguyên id & created_at & is_active.",
        f"INSERT INTO customers",
        f"  (customer_code, delivery_name, delivery_address,",
        f"   requester_code, requester_name, contact_person,",
        f"   phone, fax, parent_code, change_note)",
        f"VALUES",
    ]

    sql_lines.append(",\n".join(sql_values))
    sql_lines += [
        f"ON CONFLICT (customer_code) DO UPDATE SET",
        f"  delivery_name    = EXCLUDED.delivery_name,",
        f"  delivery_address = EXCLUDED.delivery_address,",
        f"  requester_code   = EXCLUDED.requester_code,",
        f"  requester_name   = EXCLUDED.requester_name,",
        f"  contact_person   = EXCLUDED.contact_person,",
        f"  phone            = EXCLUDED.phone,",
        f"  fax              = EXCLUDED.fax,",
        f"  parent_code      = EXCLUDED.parent_code,",
        f"  change_note      = EXCLUDED.change_note;",
        f"",
        f"-- Xác nhận kết quả",
        f"SELECT COUNT(*) AS total_customers FROM customers;",
    ]

    out_path.write_text("\n".join(sql_lines), encoding="utf-8")
    print(f"✅  Đã tạo: {out_path}")
    print(f"    {rows_ok} khách hàng được import | {rows_skip} dòng bị bỏ qua")

if __name__ == "__main__":
    main()
