# Kế Hoạch Chuẩn Hóa Dữ Liệu — Data Standardization Plan

## Tổng Quan

Chia thành **3 Phase** để chuẩn hóa toàn bộ dữ liệu master:

| Phase | Nội dung | Trạng thái | Dữ liệu nguồn |
|-------|---------|-----------|----------------|
| **Phase 1** | Chuẩn hóa Công ty (`companies` + `delivery_sites`) | ✅ **SẴN SÀNG** | `納入先一覧表.xlsx` + server folders |
| **Phase 2** | Chuẩn hóa Sản phẩm/Khay (`products`) | ⬜ **CẦN RÀ SOÁT** | `トレイデータ一覧表` sheet (7,094 rows) |
| **Phase 3** | Chuẩn hóa Khuôn & Phiên bản (`equipment` + `design_revisions`) | ⬜ **CẦN RÀ SOÁT** | `\\SERVER\ysd-cad\金型データー\` + DB hiện tại |

---

## Phase 1: Chuẩn Hóa Công Ty (READY)

### 1.1 Vấn Đề Phát Hiện

| Vấn đề | Số lượng | Ví dụ |
|--------|---------|------|
| **Suffix không nhất quán** | 747/795 có suffix | `(株)` 428, `（株）` 171, `㈱` 46, `株式会社` 22 |
| **Half-width katakana** | 102 records | `ﾌﾟﾗｽﾁｯｸ` → `プラスチック` |
| **Thiếu địa chỉ** | 32 records | `*` hoặc trống |
| **Thiếu điện thoại** | 28 records | — |
| **Không có suffix** | 48 records | `東工業`, `千葉製作所`, `エレバム` |
| **Nhiều delivery sites** | AMP: 29, ASH: 11, ADV: 10 | Cần tách riêng vào `delivery_sites` |

### 1.2 Quy Tắc Chuẩn Hóa

```
1. SUFFIX → Thống nhất thành (株), (有), (合) — dùng half-width parentheses
   - （株）→ (株),  ㈱ → (株),  株式会社 → append (株)
   - （有）→ (有),  ㈲ → (有),  有限会社 → append (有)
   - 合同会社 → append (合)

2. KATAKANA → Chuyển toàn bộ half-width katakana sang full-width
   - ﾌﾟﾗｽﾁｯｸ → プラスチック
   - ｴｰｴﾌｴﾑｼｰ → エーエフエムシー

3. WHITESPACE → Trim, replace full-width space với half-width
   - 「　」→ 「 」, double spaces → single

4. COMPANY_NAME → Tách suffix ra khỏi tên
   - Input:  「(株)アドバネクス 本社」
   - Output: company_name = 「アドバネクス」, suffix = 「(株)」, site_note = 「本社」

5. DELIVERY_SITES → Tách AMP1~AMP32 thành records riêng trong delivery_sites
   - Mỗi delivery code = 1 record trong delivery_sites  
   - Link về company qua company_id
```

### 1.3 Scripts Tạo Ra

| Script | Mô tả |
|--------|------|
| `source_data/scripts/normalize_companies.py` | Script chính chuẩn hóa tên công ty |
| `source_data/scripts/generate_migration.py` | Tạo SQL migration file từ dữ liệu đã chuẩn hóa |
| `source_data/company_normalized.json` | Output: dữ liệu đã chuẩn hóa |
| `source_data/company_migration.sql` | Output: SQL sẵn sàng chạy trên Supabase |

### 1.4 Kiểm Tra

- Chạy normalization → review output JSON
- Diff trước/sau chuẩn hóa
- Đếm: không mất record nào
- Tên công ty đọc được rõ ràng

---

## Phase 2: Chuẩn Hóa Sản Phẩm / Khay (CẦN RÀ SOÁT)

> **Chưa thực hiện** — cần rà soát dữ liệu `トレイデータ一覧表` (7,094 dòng sản phẩm)

### 2.1 Dữ Liệu Nguồn Đã Biết
- Sheet `トレイデータ一覧表` trong `納入先一覧表.xlsx`: **7,094 rows** chứa P/N, 型番, 材質, 厚み, シート巾, công差
- Bảng `products` hiện tại trong DB (cần kiểm tra số lượng records)
- Mapping product → company (qua P/N prefix hoặc order data)

### 2.2 Công Việc Dự Kiến
1. Parse sheet `トレイデータ一覧表` → extract tất cả P/N và specs
2. Cross-check với bảng `products` hiện tại trên Supabase
3. Tìm duplicates, naming inconsistencies
4. Tạo script chuẩn hóa product_code, product_name
5. Tạo migration script cập nhật/thêm mới

### 2.3 Timeline
- Rà soát: ~2-3 giờ (parse Excel, query DB, cross-check)
- Chuẩn hóa: ~1-2 giờ (viết scripts)

---

## Phase 3: Chuẩn Hóa Khuôn & Phiên Bản (CẦN RÀ SOÁT)

> **Chưa thực hiện** — cần rà soát dữ liệu khuôn trên server và trong DB

### 3.1 Dữ Liệu Nguồn Dự Kiến
- `\\SERVER\ysd-cad\金型データー\加工済み\` — 3,560+ thư mục khuôn đã gia công
- `\\SERVER\ysd-cad\見積案件\` — 1,742 dự án báo giá (chứa design data)
- Bảng `equipment` trong DB (khuôn, dao cắt, đế nước, đế khí...)
- Bảng `design_revisions` trong DB

### 3.2 Công Việc Dự Kiến
1. Catalog tất cả khuôn trên server → extract mã khuôn, phiên bản
2. Cross-check với bảng `equipment` trên Supabase
3. Xác định quan hệ: product → equipment → design_revision
4. Chuẩn hóa mã khuôn (naming convention)
5. Tạo migration script

### 3.3 Timeline
- Rà soát: ~3-4 giờ (server có nhiều dữ liệu)
- Chuẩn hóa: ~2-3 giờ

---

## Verification Plan

### Phase 1
- Chạy `normalize_companies.py` → kiểm tra output JSON
- Chạy `generate_migration.py` → review SQL
- Import vào Supabase staging → verify bằng UI

### Phase 2 & 3
- Sẽ định nghĩa chi tiết khi bắt đầu rà soát
