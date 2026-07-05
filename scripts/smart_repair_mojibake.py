#!/usr/bin/env python3
"""
Smart Repair Mojibake (文字化け修復)
====================================
Sửa chính xác từng ô bị lỗi tiếng Nhật trong CSV trên GitHub,
giữ nguyên các ô đã được Web App cập nhật đúng.

Luồng xử lý:
  1. Đọc Access CSV (UTF-8 BOM, dữ liệu gốc đúng) → Map theo ID
  2. Đọc Syncs CSV (GitHub, garbled) → Map theo ID
  3. Với mỗi ID chung: chỉ ghi đè ô có garble marker → dùng giá trị Access
  4. Giữ nguyên row chỉ có trên GitHub (web-only data)
  5. Thêm row chỉ có trên Access (mới nhất)
  6. Ghi output file đã sửa
"""
import sys
import os
import csv
import copy
import io

sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# CẤU HÌNH
# ============================================================
BASE = r'f:\AntiGravity'

REPAIR_TARGETS = [
    {
        'name': 'molds.csv',
        'id_field': 'MoldID',
        'access_path': os.path.join(BASE, r'Projects\ysdms-nextgen\source_data\csv-access-data\molds.csv'),
        'syncs_path': os.path.join(BASE, r'syncs\MoldCutterSearch_syncs\data\molds.csv'),
    },
    {
        'name': 'companies.csv',
        'id_field': 'CompanyID',
        'access_path': os.path.join(BASE, r'Projects\ysdms-nextgen\source_data\csv-access-data\companies.csv'),
        'syncs_path': os.path.join(BASE, r'syncs\MoldCutterSearch_syncs\data\companies.csv'),
    },
]

# Mojibake marker characters - ký tự CHỈ xuất hiện trong dữ liệu bị garble,
# KHÔNG phải kanji thông dụng trong tên công ty hay địa chỉ Nhật Bản.
# Loại bỏ: 鴻(địa chỉ), 鷹(tên), 邊(tên), 隧(từ thật), 辟(từ thật)
# Loại bỏ toàn bộ half-width kana (ｸｾｦｮｼｻｽｺｳ) — chúng là furigana hợp lệ
GARBLE_MARKERS_STRONG = [
    '蟒', '驥', '菴', '蝮', '蝗', '霑', '譁', '蜃', '譌',
    '蟾', '蝣', '蝙', '菫', '蠢', '繝', '縲', '遒', '隱',
]

# Chuỗi garble pattern đặc trưng — xuất hiện khi UTF-8 bị đọc nhầm CP932
# Đây là dấu hiệu chắc chắn 100% là mojibake
GARBLE_PATTERNS = [
    '蟒・',   # Rất phổ biến, là pattern cốt lõi
    '・｣・',  # Half-width bracket + middle dot combo
    '驥大梛', # 金型 bị garble
    '霑泌唆', # Common garble sequence
    '蜃ｺ闕',  # 出荷 garble
    '蝮ら伐', # 廃棄 garble
    '繝ｻ',   # Common tail pattern
    '譌ｧ',   # Common pattern
    '逕ｨ遖',  # 使用新 garble
    '・ｸ・',  # Triple garble pattern
]

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def is_garbled(value):
    """Kiểm tra xem giá trị có chứa ký tự mojibake hay không.
    Sử dụng 2 cấp phát hiện:
      1. Pattern matching (chuỗi garble đặc trưng) - chắc chắn nhất
      2. Strong marker + kiểm tra bối cảnh (tránh false positive)
    """
    if not value:
        return False
    # Cấp 1: Pattern match — chắc chắn 100%
    for pattern in GARBLE_PATTERNS:
        if pattern in value:
            return True
    # Cấp 2: Strong marker — chỉ flag nếu có >= 2 markers trong cùng 1 giá trị
    marker_count = sum(1 for m in GARBLE_MARKERS_STRONG if m in value)
    if marker_count >= 2:
        return True
    return False


def read_csv_robust(filepath):
    """Đọc CSV với xử lý BOM và quote đúng cách."""
    with open(filepath, 'r', encoding='utf-8-sig', newline='') as f:
        content = f.read()
    
    # Loại bỏ dòng trống
    reader = csv.DictReader(io.StringIO(content))
    headers = reader.fieldnames
    rows = []
    for row in reader:
        # Bỏ qua dòng hoàn toàn rỗng hoặc dòng rác
        id_val = list(row.values())[0] if row else ''
        if id_val and id_val.strip() and id_val.strip() != '"':
            rows.append(dict(row))
    return headers, rows


def write_csv_clean(filepath, headers, rows):
    """Ghi CSV UTF-8 không BOM, dùng CRLF line ending."""
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers, lineterminator='\r\n',
                                quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        for row in rows:
            # Đảm bảo tất cả field đều có giá trị (empty string nếu thiếu)
            clean_row = {h: row.get(h, '') or '' for h in headers}
            writer.writerow(clean_row)


def repair_file(config):
    """Thực hiện Smart Repair cho một file CSV."""
    name = config['name']
    id_field = config['id_field']
    access_path = config['access_path']
    syncs_path = config['syncs_path']
    
    print(f"\n{'='*70}")
    print(f"  SMART REPAIR: {name}")
    print(f"{'='*70}")
    
    if not os.path.exists(access_path):
        print(f"  ⚠️ Access file not found: {access_path}")
        return None
    if not os.path.exists(syncs_path):
        print(f"  ⚠️ Syncs file not found: {syncs_path}")
        return None
    
    # 1. Đọc cả hai nguồn
    access_headers, access_rows = read_csv_robust(access_path)
    syncs_headers, syncs_rows = read_csv_robust(syncs_path)
    
    print(f"  Access: {len(access_rows)} rows, {len(access_headers)} columns")
    print(f"  Syncs:  {len(syncs_rows)} rows, {len(syncs_headers)} columns")
    
    # Xác nhận header khớp
    if access_headers != syncs_headers:
        print(f"  ⚠️ Headers mismatch!")
        print(f"    Access: {access_headers}")
        print(f"    Syncs:  {syncs_headers}")
        # Dùng syncs headers làm chuẩn (vì đó là file production)
    
    headers = syncs_headers  # Giữ nguyên header của production
    
    # 2. Build index
    access_map = {}
    for row in access_rows:
        rid = row.get(id_field, '').strip()
        if rid:
            access_map[rid] = row
    
    syncs_map = {}
    for row in syncs_rows:
        rid = row.get(id_field, '').strip()
        if rid:
            syncs_map[rid] = row
    
    # 3. Smart Repair: Duyệt từng row trong Syncs
    stats = {
        'cells_repaired': 0,
        'rows_touched': 0,
        'rows_kept_intact': 0,
        'rows_added_from_access': 0,
        'garbled_cells_detail': {},  # column_name -> count
    }
    
    repaired_rows = []
    processed_ids = set()
    
    for syncs_row in syncs_rows:
        rid = syncs_row.get(id_field, '').strip()
        if not rid:
            continue
        processed_ids.add(rid)
        
        access_row = access_map.get(rid)
        if not access_row:
            # Row chỉ có trên GitHub — giữ nguyên
            repaired_rows.append(syncs_row)
            stats['rows_kept_intact'] += 1
            continue
        
        # Kiểm tra từng field
        repaired_row = copy.deepcopy(syncs_row)
        row_was_touched = False
        
        for col in headers:
            syncs_val = syncs_row.get(col, '') or ''
            access_val = access_row.get(col, '') or ''
            
            if is_garbled(syncs_val):
                # ÔNG BỊ LỖI → thay bằng Access value
                repaired_row[col] = access_val
                row_was_touched = True
                stats['cells_repaired'] += 1
                stats['garbled_cells_detail'][col] = stats['garbled_cells_detail'].get(col, 0) + 1
        
        repaired_rows.append(repaired_row)
        if row_was_touched:
            stats['rows_touched'] += 1
        else:
            stats['rows_kept_intact'] += 1
    
    # 4. Thêm rows chỉ có trên Access (dữ liệu mới nhất)
    for rid, access_row in access_map.items():
        if rid not in processed_ids:
            repaired_rows.append(access_row)
            stats['rows_added_from_access'] += 1
    
    # 5. Ghi file output
    output_path = syncs_path + '.repaired'
    write_csv_clean(output_path, headers, repaired_rows)
    
    # 6. Report
    print(f"\n  📊 KẾT QUẢ REPAIR:")
    print(f"    Tổng rows output:        {len(repaired_rows)}")
    print(f"    Rows đã sửa garble:      {stats['rows_touched']}")
    print(f"    Cells đã sửa:            {stats['cells_repaired']}")
    print(f"    Rows giữ nguyên:          {stats['rows_kept_intact']}")
    print(f"    Rows thêm từ Access:      {stats['rows_added_from_access']}")
    print(f"\n    Chi tiết theo cột:")
    for col, cnt in sorted(stats['garbled_cells_detail'].items(), key=lambda x: -x[1]):
        print(f"      {col}: {cnt} ô đã sửa")
    print(f"\n  ✅ Output: {output_path}")
    
    return output_path


def verify_repair(original_path, repaired_path, id_field):
    """Kiểm chứng kết quả repair bằng cách so sánh trước/sau."""
    print(f"\n  🔍 VERIFICATION:")
    
    _, orig_rows = read_csv_robust(original_path)
    _, repaired_rows = read_csv_robust(repaired_path)
    
    # Kiểm tra: repaired file còn garble không?
    remaining_garble = 0
    for row in repaired_rows:
        for val in row.values():
            if is_garbled(val or ''):
                remaining_garble += 1
                break
    
    print(f"    Original rows with garble:  (checked earlier)")
    print(f"    Repaired rows with garble:  {remaining_garble}")
    
    if remaining_garble == 0:
        print(f"    ✅ PASS: Không còn garble markers!")
    else:
        print(f"    ⚠️ WARNING: Vẫn còn {remaining_garble} rows có garble")
    
    # Sample: hiển thị 3 ô đã sửa
    orig_map = {}
    for row in orig_rows:
        rid = row.get(id_field, '').strip()
        if rid:
            orig_map[rid] = row
    
    print(f"\n    📝 Sample repairs (3 dòng đầu):")
    count = 0
    for row in repaired_rows:
        rid = row.get(id_field, '').strip()
        if rid and rid in orig_map:
            orig_row = orig_map[rid]
            for col in row:
                orig_val = orig_row.get(col, '') or ''
                new_val = row.get(col, '') or ''
                if orig_val != new_val and is_garbled(orig_val):
                    print(f"      [{id_field}={rid}] {col}:")
                    print(f"        Trước: {orig_val[:60]}")
                    print(f"        Sau:   {new_val[:60]}")
                    count += 1
                    if count >= 3:
                        break
        if count >= 3:
            break


# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    print("🚀 SMART REPAIR MOJIBAKE (文字化け修復)")
    print("=" * 70)
    
    results = []
    for target in REPAIR_TARGETS:
        output = repair_file(target)
        if output:
            results.append((target, output))
    
    # Verification
    for target, output in results:
        verify_repair(target['syncs_path'], output, target['id_field'])
    
    print(f"\n{'='*70}")
    print("🎉 HOÀN THÀNH!")
    print("Các file .repaired đã được tạo. Hãy review rồi rename để áp dụng.")
    print("=" * 70)
