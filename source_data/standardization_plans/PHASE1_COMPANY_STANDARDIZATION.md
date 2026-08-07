# 🏢 PHASE 1 — Chuẩn Hóa Dữ Liệu Công Ty
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ — Chỉ được APPEND ghi chú cuối file
# Tạo bởi: Claude (2026-08-07)
# Dùng cho: AI Agent (Gemini/Claude) thực hiện chuẩn hóa

---

## MỤC TIÊU

Từ file `source_data/company_master_data.json` (795 records thô), tạo ra:
1. `source_data/company_normalized.json` — Dữ liệu công ty đã chuẩn hóa
2. `source_data/delivery_sites_normalized.json` — Dữ liệu điểm giao hàng tách riêng
3. `source_data/company_migration.sql` — SQL INSERT sẵn sàng chạy trên Supabase

---

## INPUT

- **File chính:** `source_data/company_master_data.json`
- **Cấu trúc mỗi record:**
```json
{
  "company_code": "AMP",
  "company_name_ja": "タイコ エレクトロニクス ジャパン合同会社",
  "delivery_codes": ["AMP1", "AMP2", ...],
  "addresses": ["川崎市多摩区登戸3816", ...],
  "contacts": ["梱包技術課 小林 康浩", ...],
  "tel": ["044-900-5035", ...],
  "fax": ["044-900-5030", ...],
  "requester_codes": ["A伝", "AMP01", ...]
}
```

---

## QUY TẮC CHUẨN HÓA (BẮT BUỘC TUÂN THEO)

### Rule 1: Chuẩn Hóa Suffix Công Ty

Thống nhất TẤT CẢ suffix thành dạng half-width parentheses:

| Input | Output | Ghi chú |
|-------|--------|---------|
| `（株）` | `(株)` | Full-width → half-width |
| `㈱` | `(株)` | Enclosed → expanded |
| `株式会社` | Xóa khỏi tên, ghi vào `company_suffix` = `株式会社` | Viết đầy đủ |
| `（有）` | `(有)` | |
| `㈲` | `(有)` | |
| `有限会社` | Xóa khỏi tên, ghi vào `company_suffix` = `有限会社` | |
| `合同会社` | Xóa khỏi tên, ghi vào `company_suffix` = `合同会社` | |
| `合資会社` | Xóa khỏi tên, ghi vào `company_suffix` = `合資会社` | |

**Vị trí suffix**: Giữ nguyên vị trí gốc (đầu hoặc cuối tên). Ví dụ:
- `(株)アドバネクス` → giữ prefix `(株)`
- `アドバネクス(株)` → giữ suffix `(株)`

### Rule 2: Chuyển Half-Width Katakana → Full-Width

Sử dụng bảng chuyển đổi:

```python
# Half-width → Full-width katakana mapping
import unicodedata

def normalize_katakana(text):
    """Convert half-width katakana to full-width"""
    return unicodedata.normalize('NFKC', text)
```

**Ví dụ:**
- `ﾌﾟﾗｽﾁｯｸ` → `プラスチック`
- `ｴｰｴﾌｴﾑｼｰ` → `エーエフエムシー`
- `ｱｸｼｽ･ﾈｯﾄ` → `アクシス・ネット`

**CHÚ Ý**: Sau khi NFKC normalize, cần re-apply suffix rules vì `（株）` sẽ bị chuyển thành `(株)` tự động.

### Rule 3: Chuẩn Hóa Whitespace

1. Trim đầu cuối
2. Full-width space `\u3000` → half-width space ` `
3. Multiple spaces → single space
4. Nhưng GIỮ NGUYÊN nội dung (không xóa text)

### Rule 4: Tách Thông Tin Phụ

Nếu tên công ty chứa thêm thông tin site/chi nhánh, tách ra:

| Input | company_name | site_note |
|-------|-------------|-----------|
| `(株)アドバネクス 本社` | `(株)アドバネクス` | `本社` |
| `SMK(株) 富山工場` | `SMK(株)` | `富山工場` |
| `(有)日三化成` | `(有)日三化成` | _(trống)_ |

**Patterns site_note:** `本社`, `本社工場`, `第一工場`, `第二工場`, `XX工場`, `XX事業所`, `XX営業所`, `XX支社`, `XX支店`

### Rule 5: Xác Định Company Type

Dựa trên dữ liệu đã biết:

| Mã | Type | Lý do |
|----|------|------|
| `AMP` | `['CUSTOMER']` | Khách hàng lớn, có thư mục đơn hàng riêng |
| `HAE` | `['CUSTOMER']` | 弘前JAE |
| `NLC` | `['CUSTOMER']` | ニッコー・ロジスティクス |
| `SMK` | `['CUSTOMER']` | Khách hàng lớn |
| `YAE` | `['CUSTOMER']` | 山形JAE |
| `NSK` | `['OUTSOURCE']` | 日三化成 — nhà gia công |
| `MRD` | `['OUTSOURCE']` | 丸大商会 — nhà gia công |
| `YSD` | `['MANUFACTURER']` | ヨシダ成形 — chính YSD |
| Còn lại | `['CUSTOMER']` | Mặc định là khách hàng |

### Rule 6: Tách Delivery Sites

Mỗi delivery_code trong `delivery_codes[]` → 1 record trong `delivery_sites`:

```json
{
  "site_code": "AMP1",
  "company_code": "AMP",
  "site_name": "タイコ エレクトロニクス ジャパン 川崎エンジニアリングセンター",
  "site_address": "川崎市多摩区登戸3816",
  "site_tel": "044-900-5035",
  "contact_person": "梱包技術課 小林 康浩"
}
```

**Lưu ý**: Thông tin delivery site nằm trong file extract gốc (`納入先一覧表_extracted.txt`). Cần parse lại file này để lấy thông tin chính xác cho TỪNG delivery code (không group).

---

## OUTPUT SCHEMA

### company_normalized.json

```json
[
  {
    "company_code": "AMP",
    "company_name": "タイコ エレクトロニクス ジャパン",
    "company_suffix": "合同会社",
    "company_name_display": "タイコ エレクトロニクス ジャパン合同会社",
    "company_name_romaji": null,
    "company_type": ["CUSTOMER"],
    "parent_company_code": null,
    "is_active": true,
    "tel": "044-900-5035",
    "fax": "044-900-5030",
    "address": "川崎市多摩区登戸3816",
    "order_folder_path": "\\\\SERVER\\ysd-folder\\新AMP注文書",
    "notes": "Major customer. TE Connectivity Japan."
  }
]
```

### delivery_sites_normalized.json

```json
[
  {
    "company_code": "AMP",
    "site_code": "AMP1",
    "site_name": "川崎エンジニアリングセンター",
    "site_address": "川崎市多摩区登戸3816",
    "site_tel": "044-900-5035",
    "site_fax": null,
    "contact_person": "梱包技術課 小林 康浩",
    "is_active": true
  }
]
```

---

## SCRIPT CẦN TẠO

### Script 1: `source_data/scripts/normalize_companies.py`

**Chức năng:**
1. Đọc `source_data/company_master_data.json`
2. Đọc `source_data/生産指示書/納入先一覧表_extracted.txt` (cho delivery site detail)
3. Apply Rule 1-5
4. Output: `source_data/company_normalized.json`

### Script 2: `source_data/scripts/extract_delivery_sites.py`

**Chức năng:**
1. Đọc `source_data/生産指示書/納入先一覧表_extracted.txt`
2. Parse TỪNG dòng của sheet `納入先一覧表`
3. Apply Rule 6
4. Output: `source_data/delivery_sites_normalized.json`

### Script 3: `source_data/scripts/generate_migration_sql.py`

**Chức năng:**
1. Đọc `company_normalized.json` + `delivery_sites_normalized.json`
2. Tạo SQL INSERT statements phù hợp schema bảng `companies` và `delivery_sites`
3. Output: `source_data/company_migration.sql`

**Schema bảng target** (từ `SCHEMA_REFERENCE.md`):

```sql
-- companies
CREATE TABLE companies (
  company_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_code TEXT UNIQUE,
  company_name TEXT,
  company_name_romaji TEXT,
  company_type TEXT[],
  parent_company_id UUID REFERENCES companies(company_id),
  is_active BOOLEAN DEFAULT true,
  tel TEXT,
  fax TEXT,
  address TEXT,
  order_folder_path TEXT,
  cad_folder_path TEXT,
  notes TEXT
);

-- delivery_sites
CREATE TABLE delivery_sites (
  site_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(company_id) NOT NULL,
  site_code TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_address TEXT,
  site_tel TEXT,
  site_fax TEXT,
  contact_person TEXT,
  contact_email TEXT,
  delivery_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(company_id, site_code)
);
```

### Script 4: `source_data/scripts/validate_output.py`

**Chức năng:**
1. Đọc output JSON files
2. Kiểm tra: không duplicate company_code, không null tên, format đúng
3. Đếm records: phải >= 795 companies
4. In báo cáo validation

---

## CHECKLIST SAU KHI HOÀN THÀNH

- [ ] `company_normalized.json` tạo thành công, ≥ 795 records
- [ ] `delivery_sites_normalized.json` tạo thành công
- [ ] `company_migration.sql` tạo thành công
- [ ] Validation pass (không duplicate, không null)
- [ ] Tên công ty đọc được rõ ràng (không half-width katakana)
- [ ] Suffix thống nhất
- [ ] APPEND kết quả vào cuối file `MASTER_PLAN.md`
- [ ] KHÔNG ghi đè file plan này

---

## GHI CHÚ THỰC HIỆN (APPEND ONLY)

### 2026-08-07 17:16 — Phase 1 hoàn thành bởi Gemini
- **Companies normalized:** 795 records (`source_data/company_normalized.json`)
- **Delivery sites extracted:** 1,176 records (`source_data/delivery_sites_normalized.json`)
- **Migration SQL generated:** 1,971 statements (795 companies + 1,176 sites) (`source_data/company_migration.sql` - 1.11 MB)
- **Validation:** PASS (0 duplicate company_code, 0 null names, 0 half-width katakana, 0 unmapped delivery sites, SQL statements match record counts)
- **Scripts created:**
  - `source_data/scripts/normalize_companies.py`
  - `source_data/scripts/extract_delivery_sites.py`
  - `source_data/scripts/generate_migration_sql.py`
  - `source_data/scripts/validate_output.py`
- **Issues found:** None


