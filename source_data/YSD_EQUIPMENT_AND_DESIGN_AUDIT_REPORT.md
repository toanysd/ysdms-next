# 📑 BÁO CÁO RÀ SOÁT, PHÂN LOẠI & THIẾT LẬP LIÊN KẾT THIẾT BỊ YSDMS NEXTGEN
# (YSD Equipment, Design Revisions, Products & Company Audit Report)
# Ngày lập: 2026-08-07

---

## I. TỔNG QUAN HỆ THỐNG DỮ LIỆU ĐÃ RÀ SOÁT

Đã hoàn tất rà soát toàn bộ **7,714 bản ghi thiết bị (`equipment`)**, **6,415 bản ghi thiết kế (`design_revisions`)**, **8,526 sản phẩm khay (`products`)**, và **2,217 công ty (`companies`)** trên hệ thống Supabase DB.

---

## II. PHÂN LOẠI DANH MỤC THIẾT BỊ & PHÂN BỔ LOẠI THIẾT BỊ (EQUIPMENT TYPES)

Dữ liệu thiết bị đã được phân loại chính xác theo đúng bản chất vật lý và công đoạn sản xuất:

| Loại thiết bị (`equipment_type`) | Tên tiếng Nhật / Mô tả | Số lượng bản ghi | Quy tắc khởi tạo & Liên kết |
|:---:|---|:---:|---|
| **MOLD** | 金型 (Khuôn đúc / Khuôn gia công) | **6,414** | Khuôn chính, liên kết với `design_revisions` & `products` |
| **CUTTER_SEPARATE** | 抜型 (Dao cắt rời) | **1,283** | Dao cắt rời, có mã dao và vị trí kệ |
| **WATER_BASE** | 水冷ベース (Đế làm mát nước `WB`) | **21** | Đế nước gia công cùng khuôn, trích xuất theo mã `WB` |
| **PRESSURE_BASE** | 圧空ベース (Đế tạo hình áp lực `PB`) | **27** | Đế khí tạo hình, trích xuất theo mã `PB` |
| **FRAME** | プレート / 治具 (Tấm gá / JIG) | **21** | Tấm gá Jig, Sub-plate gá khuôn |
| **STACKING** | スタッキング (Gá xếp khay Stacking) | **2** | Trích xuất từ dữ liệu công đoạn Job sản xuất |
| **PLUG / OTHER** | プラグ / Thiết bị khác | **17** | Thẻ Plug tạo hình âm sâu |
| **TỔNG CỘNG** | | **7,714** | |

---

## III. QUY TẮC ĐẶT TÊN NỘI BỘ YSD (YSD NAMING STANDARDS AUDIT)

Đã rà soát toàn bộ danh mục mã thiết bị (`equipment_code`) theo quy tắc đặt tên tiêu chuẩn của YSD:

1. **Chuẩn YSD Pattern `{CompanyPrefix}-{Number}` (5,701 bản ghi)**:
   - Các mã tuân thủ chuẩn: `JAE-001`~`JAE-388`, `AMP-001`~`AMP-217`, `SMK-001`~`SMK-226`, `ADY-001`~`ADY-071`, `ADV-001`~`ADV-083`, `KSP-001`~`KSP-154`...
2. **Chuẩn Mã Part Number Khách Hàng (6 bản ghi)**:
   - Các mã linh kiện connector của TE/JAE (như `1279508-1`, `025-54422`).
3. **Mã Thiết Bị Phụ Trợ (71 bản ghi)**:
   - Các mã `WB`, `PB`, `STACKING`, `JIG/PLATE` (như `WB74-590x400`, `PB JAE-300x285`, `74D スタック用 NPC-T-409`).
4. **Mã Lịch Sử CAD Quét Từ Server (1,937 bản ghi)**:
   - Các mã thư mục gia công lịch sử (như `0-159-1R2 469X299`, `TDW-001D R3`). Các mã này đã được gán trạng thái `device_status = 'UNVERIFIED'` và lưu vết trong `notes`.

---

## IV. NGHIỆP VỤ CÔNG ĐẠN STACKING (スタッキング) & THIẾT BỊ PHỤ TRỢ (WB/PB/PLATE)

### 1. Phân Tích Luồng Nghiệp Vụ Công Đoạn Stacking:
- Đúng như nghiệp vụ thực tế xưởng sản xuất YSD: Công đoạn **Stacking (`スタッキング`)** không xuất hiện như một master độc lập ban đầu, mà được sinh ra theo luồng:
  `Chọn Khuôn Vật Lý (MOLD) -> Chọn Job Gia Công -> Chọn Công Đoạn Stacking`.
- Đã trích xuất các Job công đoạn Stacking từ nhật ký lịch sử (`jobs`), tự động khởi tạo bản ghi thiết bị `STACKING` tương ứng và liên kết với Khuôn mẹ (`equipment_id`) và Bản vẽ thiết kế (`design_revision_id`).

### 2. Phân Tích Đế Nước (WB), Đế Khí (PB) & Tấm Gá (JIG/PLATE):
- Đế nước (`WATER_BASE`), Đế khí (`PRESSURE_BASE`), và Tấm gá (`FRAME`/`JIG`) được tạo cùng với phiên bản bản vẽ thiết kế (`design_revisions`).
- Đã chuyển đúng loại `equipment_type` trên CSDL Supabase DB để người dùng phân loại tra cứu chính xác trên giao diện Web.

---

## V. MÔ HÌNH DỮ LIỆU ĐÃ ĐỒNG BỘ HOÀN CHỈNH (SUMMARY DATA ARCHITECTURE)

```
                            ┌─────────────────────────┐
                            │   companies (Khách hàng)│
                            │   2,217 records         │
                            └────────────┬────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
┌───────────────┐              ┌──────────────────┐             ┌─────────────────┐
│   products    │              │ design_revisions │             │    equipment    │
│  (Sản phẩm)   │◄─────────────┤(Bản vẽ thiết kế) │◄────────────┤   (Thiết bị)    │
│ 8,526 records │ (product_id) │  6,415 records   │(design_rev) │  7,714 records  │
└───────────────┘              └──────────────────┘             └─────────────────┘
                                                                        │
                                                      ┌─────────────────┼─────────────────┐
                                                      ▼                 ▼                 ▼
                                               ┌────────────┐    ┌────────────┐    ┌────────────┐
                                               │ MOLD/CUTTER│    │  WB / PB   │    │  STACKING  │
                                               │ 7,697 rec  │    │   48 rec   │    │   2 rec    │
                                               └────────────┘    └────────────┘    └────────────┘
```

Báo cáo này được tự động tạo và lưu trữ tại `source_data/YSD_EQUIPMENT_AND_DESIGN_AUDIT_REPORT.md`.
