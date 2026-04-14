import pandas as pd
import uuid
import sys
import os
import math

def safe_str(val):
    if pd.isna(val) or val == '*' or str(val).strip() == '':
        return None
    return str(val).strip()

def process_customers(excel_path):
    print(f"Bắt đầu đọc file Excel: {excel_path}")
    if not os.path.exists(excel_path):
        print(f"Lỗi: Không tìm thấy file {excel_path}")
        return

    try:
        df = pd.read_excel(excel_path, sheet_name="納入先一覧表", dtype=str)
    except Exception as e:
        print(f"Lỗi khi đọc file Excel (Sheet: 納入先一覧表 có tồn tại không?): {e}")
        return

    # Lọc bỏ các cột trống tinh không có No.
    df = df.dropna(subset=['No.'])
    
    upsert_lines = [
        "-- TỰ ĐỘNG TẠO BỞI SCRIPT MIGRATION",
        "-- YSDMS NEXT-GEN",
        "BEGIN;"
    ]

    count = 0
    # Cấu trúc: No. | 送り先 | 住所 | 依頼元(依頼主) | サブ | 電話番号 | FAX 
    for index, row in df.iterrows():
        customer_code = safe_str(row.get('No.'))
        
        if not customer_code or customer_code in ['888', '999']:
            continue
            
        delivery_name = safe_str(row.get('送り先'))
        delivery_address = safe_str(row.get('住所'))
        requester_code = safe_str(row.get('依頼元(依頼主)'))  # Tuỳ vào version có thể thiếu ngoặc, fallback
        if requester_code is None and '依頼元' in row:
            requester_code = safe_str(row.get('依頼元'))

        contact_person = safe_str(row.get('サブ'))
        phone = safe_str(row.get('電話番号'))
        fax = safe_str(row.get('FAX'))
        
        # Parent Code (Dùng ký hiệu bằng chữ nếu có chứa số đằng sau, VD AMP1 -> AMP)
        import re
        parent_code = re.sub(r'\d+$', '', customer_code) if customer_code else None

        # Format cẩn thận để chống SQL Injection dạng nhẹ (escape dấu nhaý đơn ')
        def sql_escape(text):
            if text is None: return "NULL"
            return "'" + text.replace("'", "''") + "'"

        sql = f"""
INSERT INTO public.customers (
    customer_code, delivery_name, delivery_address, requester_code, contact_person, phone, fax, parent_code
) VALUES (
    {sql_escape(customer_code)}, 
    {sql_escape(delivery_name)}, 
    {sql_escape(delivery_address)}, 
    {sql_escape(requester_code)}, 
    {sql_escape(contact_person)}, 
    {sql_escape(phone)}, 
    {sql_escape(fax)}, 
    {sql_escape(parent_code)}
) ON CONFLICT (customer_code) DO UPDATE SET
    delivery_name = EXCLUDED.delivery_name,
    delivery_address = EXCLUDED.delivery_address,
    requester_code = EXCLUDED.requester_code,
    contact_person = EXCLUDED.contact_person,
    phone = EXCLUDED.phone,
    fax = EXCLUDED.fax,
    parent_code = EXCLUDED.parent_code;
"""
        upsert_lines.append(sql.strip())
        count += 1

    upsert_lines.append("COMMIT;")

    # Ghi ra file
    out_file = "toreiteta-Zhi-Shi-Shu_customers_upsert.sql"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n\n".join(upsert_lines))
        
    print(f"Hoàn tất! Đã trích xuất {count} khách hàng.")
    print(f"File Output đã tạo sẵn: {os.path.abspath(out_file)}")
    print("Vui lòng lấy nội dung file này chạy thẳng vào cổng SQL của Supabase.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        process_customers(sys.argv[1])
    else:
        print("Sử dụng: python import_customers.py <path_to_excel_file>")
