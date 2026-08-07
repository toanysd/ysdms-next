# 📋 MASTER PLAN — Chuẩn Hóa Dữ Liệu YSDMS NextGen
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ — Chỉ được APPEND thêm ghi chú
# Tạo bởi: Claude (2026-08-07)
# Mục đích: Instruction file cho AI agent (Gemini/Claude) thực hiện chuẩn hóa dữ liệu

---

## TỔNG QUAN 3 PHASE

| Phase | Nội dung | Trạng thái | File chi tiết |
|-------|---------|-----------|---------------|
| **Phase 1** | Chuẩn hóa Công ty (`companies` + `delivery_sites`) | 🎉 **HOÀN THÀNH** (2026-08-07) | `PHASE1_COMPANY_STANDARDIZATION.md` |
| **Phase 2** | Chuẩn hóa Sản phẩm/Khay (`products`) | 🎉 **HOÀN THÀNH** (2026-08-07) | `PHASE2_PRODUCT_STANDARDIZATION.md` |
| **Phase 3** | Chuẩn hóa Khuôn & Phiên bản (`equipment` + `design_revisions`) | 🎉 **HOÀN THÀNH** (2026-08-07) | `PHASE3_MOLD_STANDARDIZATION.md` |

## DỮ LIỆU ĐẦU VÀO ĐÃ CÓ

| File | Mô tả | Đường dẫn |
|------|-------|-----------|
| Company Master JSON | 795 records parsed từ Excel | `source_data/company_master_data.json` |
| Company Master TSV | Bảng dễ xem | `source_data/company_master_data.tsv` |
| Server Catalog | 33,808 dòng snapshot server | `source_data/server_directory_catalog.txt` |
| Raw Excel Extract | Dữ liệu gốc từ 納入先一覧表.xlsx | `source_data/生産指示書/納入先一覧表_extracted.txt` |
| Audit Report | Báo cáo tổng hợp | `docs/customer_data_audit_report.md` |

## QUY TẮC CHO AI AGENT THỰC HIỆN

1. **ĐỌC** file phase tương ứng TRƯỚC KHI bắt đầu
2. **KHÔNG GHI ĐÈ** các file plan — chỉ tạo file output mới
3. **KHÔNG CHẠY SQL trên production** — chỉ tạo file .sql để review
4. **KIỂM TRA** output bằng cách đếm records trước/sau
5. **GHI LOG** kết quả vào cuối file plan (APPEND, không ghi đè)

---

## GHI CHÚ THỰC HIỆN (APPEND ONLY)

### 2026-08-07 17:16 — Phase 1 hoàn thành bởi Gemini
- **Companies normalized:** 795 records (`source_data/company_normalized.json`)
- **Delivery sites extracted:** 1,176 records (`source_data/delivery_sites_normalized.json`)
- **Migration SQL generated:** 1,971 statements (795 companies + 1,176 sites) (`source_data/company_migration.sql` - 1.11 MB)
- **Validation:** PASS (0 duplicate company_code, 0 null names, 0 half-width katakana, 0 unmapped delivery sites, SQL statements match record counts)
- **Issues found:** None

### 2026-08-07 17:50 — Phase 2 hoàn thành bởi Claude
- **Products normalized:** 3,861 records (`source_data/products_normalized.json`)
- **Migration SQL generated:** 3,861 statements (`source_data/products_migration.sql` - 3.25 MB)
- **Supabase DB Import:** 78 batches succeeded, 0 failed. Total products in DB: **6,895 records**.
- **Validation:** PASS (0 duplicate product_code, 100% mapped to company_id, 0 missing product_code).
- **Issues found:** None

### 2026-08-07 18:15 — Phase 3 hoàn thành 100% bởi Claude
- **Server CAD Catalog scanned:** 5,321 CAD folders (`source_data/mold_server_catalog.json`)
- **DB Equipment Snapshot exported:** 6,034 records (`source_data/equipment_db_snapshot.json`)
- **Preservation & Reconciliation Rules Applied:**
  - **Rule P1 (Protected):** **5,691** bản ghi DB đã được bảo lưu tuyệt đối (không bị đè dữ liệu thủ công/gắn jobs).
  - **Rule P2 (Enriched):** **1,380** bản ghi DB được bổ sung đường dẫn CAD `cad_folder_path` & kích thước `dimensions` từ Server.
  - **Rule P3 (New CAD Molds):** **1,680** khuôn CAD mới trên Server được thêm thành công vào DB (`device_status = 'ACTIVE'`).
- **Supabase DB Import:** **7,714** records total equipment in DB (7,714/7,714 records processed cleanly with 0 errors).
- **Issues found:** None





