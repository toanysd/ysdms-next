#!/usr/bin/env python3
"""
import_customers.py  —  v3
Đọc sheet 納入先一覧表 từ file Excel, tạo file SQL upsert vào bảng customers.

Tính năng:
  - Tự dedup theo customer_code: ưu tiên dòng có tên hợp lệ, không chỉ dòng cuối
  - Fallback delivery_name: nếu tất cả dòng đều '*'/trống → dùng customer_code
  - is_active KHÔNG bị ghi đè (giữ giá trị thủ công trong DB)
  - Chạy lại bất cứ lúc nào file thay đổi — an toàn, không xóa dữ liệu cũ

Usage:
    python import_customers.py "toreiteta-Zhi-Shi-Shu.xlsx"

Output:
    <tên_file>_customers_upsert.sql  (cùng thư mục với file Excel)
"""

import sys
import re
import pandas as pd
from pathlib import Path
from datetime import datetime

# ── Hằng số ────────────────────────────────────────────────────────────────
SHEET_NAME  = "納入先一覧表"
SKIP_CODES  = {"11", "111", "888", "999"}
NULL_VALUES = {"", "nan", "*", "*****", "NaN"}

# ── Helpers ─────────────────────────────────────────────────────────────────
def clean(val) -> str:
    """Chuyển giá trị thành SQL literal, NULL nếu rỗng/không hợp lệ."""
    if val is None:
        return "NULL"
    s = str(val).strip()
    if s in NULL_VALUES:
        return "NULL"
    return "'" + s.replace("'", "''") + "'"


def extract_req(raw) -> tuple[str, str]:
    """
    Tách cột 依頼元 thành (requester_code, requester_name).
    Ví dụ: 'AAK01　1234' → ('AAK01', 'AAK01　1234')
    """
    if not raw or str(raw).strip() in NULL_VALUES:
        return "NULL", "NULL"
    s = str(raw).strip()
    parts = re.split(r'[\s\u3000]+', s, maxsplit=1)
    return clean(parts[0]), clean(s)


def is_valid_name(val) -> bool:
    """True nếu val là tên hiển thị hợp lệ (không phải NULL/*)."""
    return str(val).strip() not in NULL_VALUES


def pick_best_row(group: pd.DataFrame) -> pd.Series:
    """
    Trong nhóm duplicate, chọn dòng tốt nhất:
      1. Dòng cuối cùng CÓ delivery_name hợp lệ
      2. Nếu không có → dòng cuối cùng (fallback)
    """
    valid = group[group['delivery_name'].apply(is_valid_name)]
    if len(valid) > 0:
        return valid.iloc[-1]
    return group.iloc[-1]


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    if len(sys.argv) < 2:
        print("Usage: python import_customers.py <path_to_excel>")
        sys.exit(1)

    excel_path = Path(sys.argv[1]).resolve()
    if not excel_path.exists():
        print(f"❌  File not found: {excel_path}")
        sys.exit(1)

    print(f"📖  Reading: {excel_path.name}")

    # 1. Đọc sheet
    df = pd.read_excel(excel_path, sheet_name=SHEET_NAME, header=0, dtype=str)

    # 2. Đặt tên cột (dùng vị trí, không phụ thuộc tên tiếng Nhật)
    df = df.rename(columns={
        df.columns[0]: "customer_code",
        df.columns[1]: "delivery_name",
        df.columns[2]: "delivery_address",
        df.columns[3]: "requester_raw",
        df.columns[4]: "contact_person",
        df.columns[5]: "phone",
        df.columns[6]: "fax",
    })

    # 3. Làm sạch customer_code, bỏ dòng đặc biệt
    df["customer_code"] = df["customer_code"].astype(str).str.strip()
    df = df[~df["customer_code"].isin(SKIP_CODES)]
    df = df[df["customer_code"] != "nan"].reset_index(drop=True)
    print(f"    Rows after skip: {len(df)}")

    # 4. Dedup — ưu tiên dòng có tên hợp lệ
    before = len(df)
    df = (
        df.groupby("customer_code", sort=False)
          .apply(pick_best_row, include_groups=False)
          .reset_index()
    )
    removed = before - len(df)
    if removed:
        print(f"⚠️   Removed {removed} duplicate rows (kept best per customer_code)")

    # 5. Fallback: delivery_name vẫn NULL → dùng customer_code
    mask = ~df["delivery_name"].apply(is_valid_name)
    if mask.any():
        fallback_codes = df.loc[mask, "customer_code"].tolist()
        print(f"⚠️   {len(fallback_codes)} rows with no valid name, using code as name: {fallback_codes}")
        df.loc[mask, "delivery_name"] = df.loc[mask, "customer_code"]

    print(f"✅  Final rows: {len(df)}")

    # 6. Sinh SQL
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    out = excel_path.parent / f"{excel_path.stem}_customers_upsert.sql"

    value_rows = []
    for _, r in df.iterrows():
        rc, rn = extract_req(r.get("requester_raw"))
        value_rows.append(
            f"  ({clean(r['customer_code'])}, {clean(r['delivery_name'])}, "
            f"{clean(r['delivery_name'])}, {clean(r['delivery_address'])}, "
            f"{rc}, {rn}, {clean(r.get('contact_person'))}, "
            f"{clean(r.get('phone'))}, {clean(r.get('fax'))}, "
            f"TRUE, '{now}')"
        )

    sql_lines = [
        "-- ============================================================",
        f"-- customers UPSERT",
        f"-- Generated : {now}",
        f"-- Source    : {excel_path.name}",
        f"-- Rows      : {len(df)}  (duplicates removed: {removed})",
        "-- Note      : is_active is NOT updated (manual value preserved)",
        "-- ============================================================",
        "",
        "INSERT INTO public.customers (",
        "  customer_code, customer_name_jp, delivery_name, delivery_address,",
        "  requester_code, requester_name, contact_person, phone, fax,",
        "  is_active, updated_at",
        ") VALUES",
        ",\n".join(value_rows),
        "",
        "ON CONFLICT (customer_code) DO UPDATE SET",
        "  customer_name_jp  = EXCLUDED.customer_name_jp,",
        "  delivery_name     = EXCLUDED.delivery_name,",
        "  delivery_address  = EXCLUDED.delivery_address,",
        "  requester_code    = EXCLUDED.requester_code,",
        "  requester_name    = EXCLUDED.requester_name,",
        "  contact_person    = EXCLUDED.contact_person,",
        "  phone             = EXCLUDED.phone,",
        "  fax               = EXCLUDED.fax,",
        "  updated_at        = EXCLUDED.updated_at",
        "  -- is_active: intentionally excluded from UPDATE",
        ";",
        "",
        f"-- Total rows upserted: {len(df)}",
    ]

    out.write_text("\n".join(sql_lines), encoding="utf-8")
    print(f"💾  SQL saved: {out}")


if __name__ == "__main__":
    main()
