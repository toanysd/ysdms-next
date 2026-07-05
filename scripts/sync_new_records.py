#!/usr/bin/env python3
"""
Tool 1: sync_new_records.py — Đồng bộ Record Mới từ Access → Web
=====================================================================
Quét TẤT CẢ các file CSV trong thư mục Access.
So sánh với file tương ứng trong thư mục Web.
Nếu có file Web, CHỈ thêm các record mới (ID chưa tồn tại trên Web) từ Access.
Nếu file chưa có trên Web, copy toàn bộ file Access sang.
KHÔNG chạm vào bất kỳ record nào đã tồn tại.

Đầu ra được lưu vào: source_data/csv-merged_output/tool1_sync_new
Sử dụng: run_tool1_sync.bat
"""
import sys
import os
import csv
import glob
import shutil

sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# CẤU HÌNH
# ============================================================
BASE = r'f:\AntiGravity\Projects\ysdms-nextgen'
ACCESS_DIR = os.path.join(BASE, r'source_data\csv-access-data')
WEB_DIR = os.path.join(BASE, r'source_data\csv-web-data')
OUTPUT_DIR = os.path.join(BASE, r'source_data\csv-merged_output\tool1_sync_new')
ACTIVE_LIST_FILE = os.path.join(BASE, r'scripts\active_tables.txt')

# Đảm bảo thư mục output tồn tại
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# HELPER FUNCTIONS
# ============================================================
def get_csv_headers_and_id_field(filepath):
    """Lấy danh sách header và id_field (cột đầu tiên)."""
    with open(filepath, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
            if headers:
                return headers, headers[0]
        except StopIteration:
            pass
    return [], None

def read_csv_map(filepath, id_field):
    """Đọc CSV thành dict {id: row}, trả về (headers, map, ordered_rows)."""
    if not os.path.exists(filepath):
        return [], {}, []
    with open(filepath, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        headers = list(reader.fieldnames or [])
        rows = []
        row_map = {}
        for row in reader:
            rid = (row.get(id_field, '') or '').strip()
            if rid and rid != '"':
                rows.append(dict(row))
                row_map[rid] = dict(row)
    return headers, row_map, rows

def write_csv_clean(filepath, headers, rows):
    """Ghi CSV UTF-8 CÓ BOM (utf-8-sig) để tránh lỗi font trong Excel/Access."""
    with open(filepath, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers, lineterminator='\r\n',
                                quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        for row in rows:
            clean = {h: (row.get(h, '') or '') for h in headers}
            writer.writerow(clean)

# ============================================================
# MAIN: SYNC NEW RECORDS
# ============================================================
def sync_table(access_path):
    filename = os.path.basename(access_path)
    web_path = os.path.join(WEB_DIR, filename)
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    print(f"\n{'─'*60}")
    print(f"  📋 {filename}")
    print(f"{'─'*60}")
    
    headers, id_field = get_csv_headers_and_id_field(access_path)
    if not id_field:
        print(f"  ⚠️ Bỏ qua file rỗng hoặc không có header.")
        return
        
    print(f"  ID Field tự động nhận diện: {id_field}")

    if not os.path.exists(web_path):
        # Nếu chưa có trên Web, copy toàn bộ từ Access
        print(f"  🆕 File chưa tồn tại trên Web. Đang copy toàn bộ file từ Access...")
        shutil.copy2(access_path, output_path)
        print(f"  ✅ Đã lưu vào {output_path}")
        return

    # Đọc cả hai nguồn
    access_h, access_map, access_rows = read_csv_map(access_path, id_field)
    web_h, web_map, web_rows = read_csv_map(web_path, id_field)
    
    print(f"  Access: {len(access_map)} records")
    print(f"  Web:    {len(web_map)} records")
    
    # Tìm ID mới (có trong Access nhưng KHÔNG có trên Web)
    access_ids = set(access_map.keys())
    web_ids = set(web_map.keys())
    new_ids = access_ids - web_ids
    
    if not new_ids:
        print(f"  ✅ Đã đồng bộ — không có record mới. Giữ nguyên data Web hiện tại.")
        # Vẫn ghi ra thư mục output để có đầy đủ bộ file
        write_csv_clean(output_path, web_h, web_rows)
        return
    
    print(f"  🆕 Tìm thấy {len(new_ids)} record mới: {sorted(new_ids)[:10]}{'...' if len(new_ids) > 10 else ''}")
    
    # Tạo rows mới, map theo headers của Web
    new_rows = []
    for nid in sorted(new_ids, key=lambda x: int(x) if x.isdigit() else x):
        src = access_map[nid]
        new_row = {}
        for h in web_h:
            new_row[h] = src.get(h, '') or ''
        new_rows.append(new_row)
    
    # Append vào cuối file Web
    all_rows = web_rows + new_rows
    write_csv_clean(output_path, web_h, all_rows)
    
    print(f"  ✅ Đã thêm {len(new_rows)} records mới vào {filename}")
    print(f"     Tổng records: {len(all_rows)}")
    print(f"  ✅ Đã lưu vào {output_path}")

if __name__ == '__main__':
    print("🔵 TOOL 1: SYNC NEW RECORDS (Access → Web)")
    print("=" * 60)
    print(f"Quét thư mục: {ACCESS_DIR}")
    print(f"Output:       {OUTPUT_DIR}")
    print("Chỉ thêm record mới, KHÔNG chạm data Web hiện có.\n")
    
    print("CHỌN CHẾ ĐỘ XỬ LÝ:")
    print("  1. Chỉ xử lý các bảng ĐANG HOẠT ĐỘNG (Active Tables - Khuyên dùng)")
    print("  2. Xử lý TOÀN BỘ file CSV có trong thư mục (Bao gồm cả rác/lưu trữ)")
    
    mode = input("\nNhập lựa chọn của bạn (1/2) [Mặc định: 1]: ").strip()
    if mode not in ['1', '2']:
        mode = '1'
        
    active_files = set()
    if mode == '1' and os.path.exists(ACTIVE_LIST_FILE):
        with open(ACTIVE_LIST_FILE, 'r', encoding='utf-8') as f:
            active_files = set(line.strip().lower() for line in f if line.strip())
    
    all_files = glob.glob(os.path.join(ACCESS_DIR, '*.csv'))
    
    if mode == '1' and active_files:
        process_list = [f for f in all_files if os.path.basename(f).lower() in active_files]
        print(f"\n✅ Chế độ 1: Xử lý {len(process_list)} files đang hoạt động...")
    else:
        process_list = all_files
        print(f"\n✅ Chế độ 2: Xử lý toàn bộ {len(process_list)} files...")
    
    for file_path in process_list:
        sync_table(file_path)
    
    print(f"\n{'='*60}")
    print("🎉 Hoàn thành Tool 1! Dữ liệu xuất nằm tại thư mục output.")
    print("=" * 60)
