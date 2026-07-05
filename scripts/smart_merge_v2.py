#!/usr/bin/env python3
"""
Tool 2: smart_merge_v2.py — Access Nền + Web Cập Nhật → GitHub
================================================================
Lấy Access CSV làm NỀN (encoding đúng, chứa mọi record mới),
áp dụng các field đã được Web cập nhật, tạo file hoàn chỉnh.

Quy tắc vàng:
  - Access sở hữu: cấu trúc record, tên, mã, liên kết (creation data)
  - Web sở hữu: vị trí, trạng thái, ghi chú, cập nhật (operational data)
  - Encoding: Luôn lấy từ Access (UTF-8 BOM → UTF-8 clean)

Sử dụng: python scripts/smart_merge_v2.py
"""
import sys
import os
import csv
import copy

sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# CẤU HÌNH
# ============================================================
BASE = r'f:\AntiGravity'
ACCESS_DIR = os.path.join(BASE, r'Projects\ysdms-nextgen\source_data\csv-access-data')
WEB_DIR = os.path.join(BASE, r'Projects\ysdms-nextgen\source_data\csv-web-data')
OUTPUT_DIR = os.path.join(BASE, r'Projects\ysdms-nextgen\source_data\csv-merged_output\tool2_smart_merge')
ACTIVE_LIST_FILE = os.path.join(BASE, r'Projects\ysdms-nextgen\scripts\active_tables.txt')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# FIELD OWNERSHIP MATRIX
# ============================================================
# Web-owned fields: Web App có quyền cập nhật, merger sẽ LẤY từ Web
# Tất cả field KHÔNG nằm trong list này → lấy từ Access
WEB_OWNED_FIELDS = {
    'molds.csv': [
        'RackLayerID',          # Vị trí kệ (api/locationlog)
        'MoldWeight',           # Trọng lượng (quick_update)
        'MoldLengthModified',   # Kích thước (quick_update)
        'MoldWidthModified',    # Kích thước (quick_update)
        'MoldHeightModified',   # Chiều cao (quick_update)
        'MoldNotes',            # Ghi chú (extended_editor)
        'MoldUsageStatus',      # Trạng thái sử dụng (quick_update)
        'MoldDisposing',        # Tình trạng xử lý (quick_update)
        'MoldDisposedDate',     # Ngày xử lý
        'MoldReturning',        # Tình trạng trả lại
        'MoldReturnedDate',     # Ngày trả lại
        'DeviceStatus',         # Trạng thái thiết bị (shiplog)
        'KeeperCompany',        # Đơn vị giữ khuôn (shiplog)
        'JobID',                # Công việc liên kết
        'UpdatedAt',            # Thời gian cập nhật
        'UpdatedBy',            # Người cập nhật
    ],
    'cutters.csv': [
        'RackLayerID',
        'CutterWeight',
        'CutterLengthModified',
        'CutterWidthModified',
        'CutterHeightModified',
        'CutterNotes',
        'CutterUsageStatus',
        'CutterDisposing',
        'CutterDisposedDate',
        'CutterReturning',
        'CutterReturnedDate',
        'DeviceStatus',
        'KeeperCompany',
        'JobID',
        'UpdatedAt',
        'UpdatedBy',
    ],
}

# Bảng cần merge Access+Web (có ID field)
MERGE_TABLES = [
    {'name': 'molds.csv', 'id_field': 'MoldID'},
    {'name': 'cutters.csv', 'id_field': 'CutterID'},
]

# Bảng log: gộp tất cả rows (union by ID)
LOG_TABLES = [
    {'name': 'statuslogs.csv', 'id_field': 'StatusLogID'},
    {'name': 'teflonlog.csv', 'id_field': 'TeflonLogID'},
    {'name': 'shiplog.csv', 'id_field': 'ShipLogID'},
    {'name': 'locationlog.csv', 'id_field': 'LocationLogID'},
]

# Bảng master: copy thẳng từ Access (encoding đúng)
COPY_TABLES = [
    'moldmaster.csv', 'molddesign.csv', 'moldrevision.csv',
    'companies.csv', 'customers.csv', 'employees.csv',
    'tray.csv', 'racks.csv', 'racklayers.csv', 'itemtype.csv',
    'jobs.csv', 'worklog.csv',
    'processingdeadline.csv', 'processingstatus.csv',
]

# Mojibake detection patterns
GARBLE_PATTERNS = [
    '蟒・', '・｣・', '驥大梛', '霑泌唆', '蜃ｺ闕', '蝮ら伐',
    '繝ｻ', '譌ｧ', '逕ｨ遖', '・ｸ・',
]
GARBLE_MARKERS_STRONG = [
    '蟒', '驥', '菴', '蝮', '蝗', '霑', '譁', '蜃', '譌',
    '蟾', '蝣', '蝙', '菫', '蠢', '繝', '縲', '遒', '隱',
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================
def is_garbled(value):
    """Kiểm tra giá trị có bị mojibake hay không."""
    if not value:
        return False
    for p in GARBLE_PATTERNS:
        if p in value:
            return True
    count = sum(1 for m in GARBLE_MARKERS_STRONG if m in value)
    return count >= 2


def read_csv_map(filepath, id_field):
    """Đọc CSV thành (headers, {id: row}, [rows])."""
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
                d = dict(row)
                rows.append(d)
                row_map[rid] = d
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


import shutil

def preserve_bom_copy(src, dst):
    """Copy file, GIỮ NGUYÊN BOM (để tránh lỗi font Excel)."""
    shutil.copy2(src, dst)


# ============================================================
# MERGE LOGIC
# ============================================================
def merge_table(table_config):
    """Merge một bảng: Access nền + Web updates."""
    name = table_config['name']
    id_field = table_config['id_field']
    web_fields = WEB_OWNED_FIELDS.get(name, [])
    
    access_path = os.path.join(ACCESS_DIR, name)
    web_path = os.path.join(WEB_DIR, name)
    output_path = os.path.join(OUTPUT_DIR, name)
    
    print(f"\n{'─'*60}")
    print(f"  🔀 MERGE: {name}")
    print(f"{'─'*60}")
    
    if not os.path.exists(access_path):
        print(f"  ⚠️ Access file not found, skipping.")
        return
    
    # Đọc nguồn: Access = base, Web = nguồn cập nhật (csv-web-data)
    access_h, access_map, access_rows = read_csv_map(access_path, id_field)
    web_h, web_map, web_rows = read_csv_map(web_path, id_field) if os.path.exists(web_path) else (access_h, {}, [])
    
    print(f"  Access: {len(access_map)} records, {len(access_h)} columns")
    print(f"  Web:    {len(web_map)} records, {len(web_h)} columns")
    print(f"  Web-owned fields: {web_fields}")
    
    # Dùng Access headers làm chuẩn (encoding đúng)
    headers = access_h
    
    access_ids = set(access_map.keys())
    web_ids = set(web_map.keys())
    common_ids = access_ids & web_ids
    only_access = access_ids - web_ids
    only_web = web_ids - access_ids
    
    stats = {
        'from_access': len(only_access),
        'from_web': len(only_web),
        'merged': 0,
        'web_fields_applied': 0,
        'garble_blocked': 0,
    }
    
    merged_rows = []
    
    # 1. Common IDs: Access nền + Web updates
    for rid in sorted(common_ids, key=lambda x: int(x) if x.isdigit() else x):
        access_row = access_map[rid]
        web_row = web_map[rid]
        
        # Bắt đầu từ Access row (encoding đúng)
        merged = copy.deepcopy(access_row)
        
        # Áp dụng Web-owned fields
        for wf in web_fields:
            web_val = (web_row.get(wf, '') or '').strip()
            access_val = (access_row.get(wf, '') or '').strip()
            
            if not web_val:
                continue  # Web không có giá trị → giữ Access
            
            if is_garbled(web_val):
                stats['garble_blocked'] += 1
                continue  # Web bị garble → giữ Access
            
            if web_val != access_val:
                # Web có giá trị khác → Web ưu tiên (đây là cập nhật từ Web)
                merged[wf] = web_val
                stats['web_fields_applied'] += 1
            else:
                # Giá trị giống nhau → giữ nguyên
                pass
        
        merged_rows.append(merged)
        stats['merged'] += 1
    
    # 2. Only in Access: thêm nguyên row (record mới)
    for rid in sorted(only_access, key=lambda x: int(x) if x.isdigit() else x):
        merged_rows.append(copy.deepcopy(access_map[rid]))
    
    # 3. Only on Web: giữ nguyên (web-only data, e.g. created via web)
    for rid in sorted(only_web, key=lambda x: int(x) if x.isdigit() else x):
        merged_rows.append(copy.deepcopy(web_map[rid]))
    
    # Ghi output
    write_csv_clean(output_path, headers, merged_rows)
    
    print(f"\n  📊 KẾT QUẢ:")
    print(f"    Records merged:        {stats['merged']}")
    print(f"    New from Access:       {stats['from_access']}")
    print(f"    Web-only kept:         {stats['from_web']}")
    print(f"    Web fields applied:    {stats['web_fields_applied']}")
    print(f"    Garble blocked:        {stats['garble_blocked']}")
    print(f"    Total output:          {len(merged_rows)}")


def merge_log_table(table_config):
    """Gộp bảng log: union all rows by ID."""
    name = table_config['name']
    id_field = table_config['id_field']
    
    access_path = os.path.join(ACCESS_DIR, name)
    web_path = os.path.join(WEB_DIR, name)
    output_path = os.path.join(OUTPUT_DIR, name)
    
    print(f"\n  📎 LOG MERGE: {name}")
    
    access_h, access_map, _ = read_csv_map(access_path, id_field) if os.path.exists(access_path) else ([], {}, [])
    web_h, web_map, _ = read_csv_map(web_path, id_field) if os.path.exists(web_path) else ([], {}, [])
    
    # Headers: ưu tiên Web (có thể có thêm cột)
    headers = web_h if web_h else access_h
    if not headers:
        print(f"    Skipped (no data)")
        return
    
    # Union: Web ưu tiên (dữ liệu mới hơn)
    merged = {}
    for rid, row in access_map.items():
        merged[rid] = row
    for rid, row in web_map.items():
        merged[rid] = row  # Web ghi đè nếu trùng ID
    
    rows = list(merged.values())
    new_from_access = len(set(access_map.keys()) - set(web_map.keys()))
    
    write_csv_clean(output_path, headers, rows)
    print(f"    Total: {len(rows)} rows (+{new_from_access} from Access)")


# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    print("🟢 TOOL 2: SMART MERGE V2 (Access Nền + Web Updates)")
    print("=" * 60)
    print("Access = nền dữ liệu | Web = cập nhật trường")
    print("Encoding: Luôn lấy từ Access (UTF-8 clean)")
    
    # 1. Merge bảng chính (molds, cutters)
    print("\n📦 PHASE 1: Merge bảng chính")
    for table in MERGE_TABLES:
        merge_table(table)
    
    # 2. Merge bảng log
    print(f"\n{'─'*60}")
    print("📦 PHASE 2: Merge bảng log (union)")
    print(f"{'─'*60}")
    for table in LOG_TABLES:
        merge_log_table(table)
    
    # 3. Copy bảng master từ Access
    print("\n" + "─"*60)
    print("📦 PHASE 3: Copy bảng master từ Access")
    print("─" * 60)
    
    print("\nCHỌN CHẾ ĐỘ XỬ LÝ PHASE 3:")
    print("  1. Chỉ copy các bảng ĐANG HOẠT ĐỘNG (Active Tables - Khuyên dùng)")
    print("  2. Copy TOÀN BỘ file CSV có trong thư mục (Bao gồm cả rác/lưu trữ)")
    
    mode = input("\nNhập lựa chọn của bạn (1/2) [Mặc định: 1]: ").strip()
    if mode not in ['1', '2']:
        mode = '1'
        
    active_files = set()
    if mode == '1' and os.path.exists(ACTIVE_LIST_FILE):
        with open(ACTIVE_LIST_FILE, 'r', encoding='utf-8') as f:
            active_files = set(line.strip().lower() for line in f if line.strip())
            
    processed_files = {'molds.csv', 'cutters.csv', 'statuslogs.csv', 'teflonlog.csv', 'shiplog.csv', 'locationlog.csv'}
    copied = 0
    all_files = [f for f in os.listdir(ACCESS_DIR) if f.endswith('.csv')]
    
    if mode == '1' and active_files:
        process_list = [f for f in all_files if f.lower() in active_files]
        print(f"\n✅ Chế độ 1: Đang copy các file đang hoạt động...")
    else:
        process_list = all_files
        print(f"\n✅ Chế độ 2: Đang copy toàn bộ file...")

    for name in process_list:
        if name in processed_files:
            continue
            
        src = os.path.join(ACCESS_DIR, name)
        dst = os.path.join(OUTPUT_DIR, name)
        if os.path.exists(src):
            preserve_bom_copy(src, dst)
            copied += 1
            print(f"  ✅ {name}")
        else:
            print(f"  ⚠️ Lỗi: Không tìm thấy {name}")
            
    print(f"  Copied {copied} files.")
    
    # 4. Xác nhận
    print(f"\n{'='*60}")
    print("🎉 HOÀN THÀNH!")
    print(f"File output đã ghi vào: {OUTPUT_DIR}")
    print("Kiểm tra dữ liệu trước khi copy sang syncs.")
    print("=" * 60)
