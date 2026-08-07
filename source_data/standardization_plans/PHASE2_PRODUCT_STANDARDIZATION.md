# 📦 PHASE 2 — Chuẩn Hóa Sản Phẩm / Khay (Products & Trays)
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ — Chỉ được APPEND ghi chú cuối file
# Tạo bởi: Claude & Gemini (2026-08-07)
# Trạng thái: ✅ SẴN SÀNG THỰC HIỆN

---

## MỤC TIÊU

Từ sheet `トレイデータ一覧表` (3,872 records sản phẩm khay trong file `source_data/生産指示書/納入先一覧表_extracted.txt`), tạo ra:
1. `source_data/products_normalized.json` — Dữ liệu sản phẩm khay đã chuẩn hóa
2. `source_data/products_migration.sql` — SQL INSERT / UPSERT sẵn sàng chạy trên Supabase DB

---

## INPUT DATA

- **File nguồn chính:** `source_data/生産指示書/納入先一覧表_extracted.txt` (sheet `トレイデータ一覧表`, dòng 74+)
- **Cấu trúc cột:**
  - `P/N`: Mã sản phẩm (ví dụ `AMP-010`, `1279508-1`, `ADY-071`)
  - `型番`: Mã kiểu dáng/gá khay (ví dụ `1279508-1 (×12)`)
  - `材質`: Chất liệu nhựa (ví dụ `PS(CL)`, `PP(N)`, `PVC(CL)`, `A-PET(CL)`)
  - `厚み`: Độ dày (mm) (ví dụ `0.5`, `0.8`)
  - `シート巾`: Chiều rộng cuộn nhựa (mm) (ví dụ `520`, `405`)
  - `帯電/シリコン/塗布`: Tính chất bề mặt (Chống tĩnh điện, Phủ Silicon)
  - `入数`: Số lượng đóng gói / khay
  - `備考 / 仕様`: Mô tả kích thước khay & Pocket layout

---

## QUY TẮC CHUẨN HÓA (BẮT BUỘC TUÂN THEO)

### Rule 1: Chuẩn Hóa Mã Sản Phẩm (`product_code` vs `product_name_internal`)

- `product_code`: Mã compact không chứa ký tự đặc biệt thừa, chuyển half-width (ví dụ `AMP010`, `ADY071`, `1279508-1`).
- `product_name_internal`: Tên hiển thị nội bộ YSD (ví dụ `AMP-010`, `1279508-1 (×12)`).
- `product_name`: Tên tiếng Nhật chính thức (nếu có từ備考/specs, mặc định lấy `product_name_internal`).

### Rule 2: Chuẩn Hóa Material & Specs (`notes`)

- Chất liệu nhựa: Chuyển full-width kana sang full-width, chuẩn hóa mã nhựa:
  - `PS(CL)`, `PP(N)`, `PVC(CL)`, `A-PET(CL)`, `PS(B)`, `PS(茶)`
- Đưa độ dày, rộng cuộn, chất liệu vào trường `notes` dưới dạng JSON/Text chuẩn hóa:
  `Material: PS(CL), Thickness: 0.5mm, SheetWidth: 520mm, Cavity: 12`

### Rule 3: Mapping `company_id` Qua Company Code

- Tách Prefix từ `P/N` (ví dụ `AMP-010` → Prefix `AMP`, `SMK-001` → Prefix `SMK`, `ADY-071` → Prefix `ADY`).
- Map Prefix với mã `company_code` trong bảng `companies` trên Supabase.
- Đối với P/N thuần số (ví dụ `1279508-1` connector Part Number của TE/AMP): Mặc định map với `AMP` hoặc `JAE` dựa trên ghi chú sản phẩm.
- Nếu không tìm thấy công ty tương ứng: Mặc định map với công ty YSD (`YSD`).

### Rule 4: Cấu Trúc Record Target (`products` table)

```json
{
  "product_code": "1279508-1",
  "product_name": "COVER FOR HMZD CONN.COVER 2PAIR 15.95×100.6",
  "product_name_internal": "1279508-1 (×12)",
  "company_code": "AMP",
  "product_status": "ACTIVE",
  "notes": "Material: PS(CL) | Thickness: 0.5mm | SheetWidth: 520mm | Cavity: 12 | Qty: 4000"
}
```

---

## 4 SCRIPTS CẦN TẠO

Các script lưu trong thư mục `source_data/scripts/`:

1. `parse_products.py` — Parse sheet `トレイデータ一覧表`, apply Rule 1-3, tạo `source_data/products_normalized.json`.
2. `generate_products_sql.py` — Đọc `products_normalized.json`, sinh file `source_data/products_migration.sql` (cú pháp INSERT ON CONFLICT).
3. `validate_products.py` — Kiểm tra: không duplicate `product_code`, đếm records (≥ 3,500), 100% records có `company_id`.
4. `import_phase2_rest.py` — Upsert `products_normalized.json` trực tiếp lên Supabase DB thông qua REST API.

---

## GHI CHÚ THỰC HIỆN (APPEND ONLY)

### 2026-08-07 17:50 — Phase 2 hoàn thành bởi Claude
- **Products normalized:** 3,861 records (`source_data/products_normalized.json`)
- **Migration SQL generated:** 3,861 statements (`source_data/products_migration.sql` - 3.25 MB)
- **Supabase DB Import:** 78 batches succeeded, 0 failed. Total products in DB: **6,895 records**.
- **Validation:** PASS (0 duplicate product_code, 100% mapped to company_id, 0 missing product_code).
- **Scripts created:**
  - `source_data/scripts/parse_products.py`
  - `source_data/scripts/generate_products_sql.py`
  - `source_data/scripts/validate_products.py`
  - `source_data/scripts/import_phase2_rest.py`
- **Issues found:** None

