# 🗺️ NHIỆM VỤ 4: KẾ HOẠCH TÁI CẤU TRÚC HỒ SƠ DỰ ÁN THEO MODULE (MODULAR DOSSIER) & LỘ TRÌNH TRIỂN KHAI TỔNG THỂ

- **Mã tài liệu:** `YSDMS-MPV2-04-MODULAR-ROADMAP`
- **Ngày lập:** `2026-10-14 JST`
- **Mục tiêu:** Thực thi chỉ thị của **Minh Chủ THOAN** về việc xây dựng mới bộ Hồ sơ & Kế hoạch Dự án theo kiến trúc **bóc tách từng module thành file riêng trong một thư mục chuyên biệt**, tối ưu hóa tuyệt đối Token Economy và làm nền tảng vững chắc để triển khai dứt điểm các hạng mục kỹ thuật tiếp theo.

---

## PHẦN I: THIẾT KẾ CẤU TRÚC THƯ MỤC HỒ SƠ DỰ ÁN PHÂN TÁCH THEO MODULE (`docs/dossier/`)

Thay vì gom toàn bộ quy tắc, schema, kế hoạch và lịch sử phiên vào các file đơn lẻ khổng lồ (`ysdms-nextgen_MASTER.md` 149.7 KB, `SESSION_HANDOFF.md` 90.4 KB, `SCHEMA_REFERENCE.md` 46.6 KB), toàn bộ hồ sơ dự án sẽ được tổ chức tại thư mục **`docs/dossier/`** với nguyên tắc:
1. **Mỗi file $\le 150$ dòng ($\le 6\text{ KB}$, tương đương $\sim 1,500\text{ tokens}$).**
2. **Làm việc ở Module nào $\rightarrow$ Chỉ đọc đúng File Schema và File Nghiệp vụ/Kế hoạch của Module đó.**
3. **Sửa đổi Kế hoạch ở đâu $\rightarrow$ Chỉ cập nhật đúng file của Module đó (không chạm vào các module khác).**

### Sơ đồ Cây Thư mục `docs/dossier/` Đề xuất:

```
docs/dossier/
├── 00_INDEX.md                              ← Chỉ mục gốc toàn dự án + Bản đồ trạng thái 10 Modules (<= 80 dòng)
├── 00_ACTIVE_HANDOFF.md                     ← Bàn giao phiên hiện tại (<= 80 dòng, ghi đè có kiểm soát, lịch sử cũ đẩy vào archive/)
│
├── 01_rules_and_conventions/                ← Bộ quy tắc tinh gọn (Không trùng lặp)
│   ├── R01_CORE_PROTOCOL_PE_THOAN_AN.md     ← QUY TẮC 0, RULE-PROC-01, RULE-PROC-02, Bridge v2.5.0
│   ├── R02_DATA_AND_SCHEMA_COMPLIANCE.md    ← RULE-DATA-01 (No Fallback), RULE-DATA-02 (SSOT Schema), Fuzzy Search
│   └── R03_UI_DESIGN_AND_I18N.md            ← Page Anatomy, Compact Header, Paper Style (RULE-UI-10), next-intl
│
├── 02_schema_modules/                       ← Bóc tách SCHEMA_REFERENCE.md (46.6 KB) thành 6 file sạch, 0 trùng lặp
│   ├── S00_SCHEMA_ERD_INDEX.md              ← Sơ đồ quan hệ tổng thể + Bảng tra cứu PK/FK & Bảng đã DROP/DEPRECATED
│   ├── S01_COMPANIES_AND_MASTER.md          ← companies, company_contacts, delivery_sites, employees, machines, racks, calendar
│   ├── S02_CASES_QUOTES_ORDERS.md           ← business_cases, technical_reviews, quotations, quotation_lines, orders, order_lines
│   ├── S03_PRODUCTS_AND_CAD_DESIGNS.md      ← products, design_revisions, cav_types
│   ├── S04_EQUIPMENT_SET_AND_CUSTODY.md     ← equipment, equipment_assignments, equipment_photos, equipment_loans, views/RPCs
│   ├── S05_WO_JOBS_NIPPO_PRODUCTION.md      ← work_orders, jobs, job_steps, work_logs, production_instructions
│   └── S06_SHIPMENTS_INVENTORY_FINANCE.md   ← shipments, v_product_stock_summary, plastic_*, invoices, invoice_lines, debt view
│
└── 03_business_modules/                     ← 10 File Kế hoạch & Đặc tả Nghiệp vụ độc lập theo từng Phân hệ
    ├── M01_BUSINESS_CASES_AND_REVIEWS.md    ← Phân hệ 1: Quản lý Sự việc (/cases) & Thẩm định Kỹ thuật
    ├── M02_QUOTATIONS_AND_PRICING_ENGINE.md ← Phân hệ 2: Báo giá (/orders/quotations), Ma trận Giá khuôn & 3 Trụ cột Giá khay
    ├── M03_ORDERS_AND_PRODUCTION_PIPE.md    ← Phân hệ 3: Đơn hàng (/orders) & Luồng chuyển đổi sang Work Order / Chỉ thị SX
    ├── M04_PRODUCT_CENTER_AND_CAD_DESIGN.md ← Phân hệ 4: Product Center (/product-center) & Thiết kế Bản vẽ (/engineering/designs)
    ├── M05_EQUIPMENT_UNIFIED_AND_SET.md     ← Phân hệ 5: Thiết bị Hợp nhất (/equipment/unified), Bộ SET 8 loại, Đặt phôi nhôm
    ├── M06_MOLD_JOBS_AND_SCHEDULE_GANTT.md  ← Phân hệ 6: Gia công Khuôn (/equipment/jobs, /equipment/schedule) & 3 Tracks MOLD/PLUG/CUTTER
    ├── M07_MOLD_CUSTODY_AUDIT_AND_LOANS.md  ← Phân hệ 7: Lưu giữ, Mượn trả, Kiểm kê JAE/Canon, Phí lưu kho Fujikura, Teflon, Pallet QR
    ├── M08_THERMOFORMING_FLOOR_AND_NIPPO.md ← Phân hệ 8: Định hình (/production/*) & Nhật ký Công việc (/worklogs, A4 Nippo)
    ├── M09_QUALITY_KCS_AND_SAMPLE_GATE.md   ← Phân hệ 9: Duyệt mẫu thử KCS, Kiểm tra chất lượng (/quality/*) & Truy xuất nguồn gốc
    └── M10_SHIPMENTS_WMS_AND_INVOICES.md    ← Phân hệ 10: Giao hàng 納品書 (/shipments), Kho Nhựa/Khay (/plastics, /inventory) & Công nợ
```

---

## PHẦN II: CẤU TRÚC CHUẨN CỦA MỖI FILE MODULE TRONG `docs/dossier/03_business_modules/`

Mỗi file `M01` $\rightarrow$ `M10` đều tuân thủ một khuôn mẫu 5 mục thống nhất (chỉ dài 80–120 dòng):
1. **Luồng Nghiệp vụ Thực tế Chuẩn (Real-World Business Specification):** Tóm tắt các quy tắc nghiệp vụ cốt lõi và các trường hợp đặc thù theo khách hàng (JAE, Canon, Panasonic, SMK, Shin-Ei, Minebea, Fujikura).
2. **Nguồn Dữ liệu SSOT (Tables, Views, RPCs):** Chỉ định chính xác tên bảng/cột và dẫn chiếu tới file `02_schema_modules/S0x_*.md`.
3. **Cấu trúc Route & Component Chuẩn (Canonical Routes):** Đường dẫn trên `Sidebar.tsx` và các component thuộc phân hệ.
4. **Trạng thái Hiện tại (Implemented & Verified):** Những gì đã làm xong và đã qua kiểm thử.
5. **Danh sách Hạng mục Cần Sửa / Nâng cấp (Open Action Items / Backlog của riêng Module đó):** Ghi rõ mã task, file cần sửa, dòng code liên quan.

---

## PHẦN III: TRẠNG THÁI PHÊ DUYỆT & LỘ TRÌNH CÁC GÓI CÔNG VIỆC

### ✅ HẠNG MỤC 0 (PHƯƠNG ÁN C — ĐÃ ĐỐI SOÁT DỮ LIỆU CHỈ-ĐỌC TRÊN PRODUCTION):
- **Cơ chế Join chuẩn xác:**
  - Cột `resolved_order_id` **KHÔNG tồn tại** trong `public.staging_order_lines_backfill`.
  - Kết nối chuẩn: `staging_order_lines_backfill.order_no = orders.order_no`, sau đó dùng `orders.order_id` để đối chiếu `order_lines.order_id`.
- **Kết quả đã xác minh độc lập bởi PE (`2026-10-14 10:34:30 JST`):**
  - `staging_order_lines_backfill = 6,279` dòng; `order_lines = 6,279` dòng; `orders = 2,396`; `products = 8,489`.
  - Khớp `6,279 / 6,279` dòng theo `(order_id, line_no, product_id, quantity)`; `0` trùng lặp; `0` thiếu FK; `0` khoảng trống `line_no`; `PENDING = 6,277`, `NORMALIZED = 2`.
- **Danh sách bảng đã xác minh qua `information_schema.tables`:**
  - **TỒN TẠI:** `profiles`, `employees`, `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.
  - **KHÔNG TỒN TẠI:** `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`.

### 🟡 GIAI ĐOẠN A (`WO-DOC-MODULAR` — CHỈ DUYỆT BƯỚC HỢP NHẤT `AGENTS.md`, CÁC BƯỚC CÒN LẠI CHƯA DUYỆT):
- **Đã thực hiện (Commit `309d41beb629bb34a3e348af4efdbe1ab7d30746`, chờ PE nghiệm thu nội dung diff):**
  - Hợp nhất `AGENTS.md` (`11,347 bytes` = `11.08 KiB` / `11.35 KB` $\le 12\text{ KB}$) và rút gọn `.agents/AGENTS.md` (`1,461 bytes` stub tham chiếu), ghi bài học `L006` vào `docs/SO_BAI_HOC.md`.
- **Chưa duyệt (Ý tưởng / Đề xuất):**
  - Bóc tách `SCHEMA_REFERENCE.md` thành 6 file trong `docs/dossier/02_schema_modules/`.
  - Khởi tạo 10 file hồ sơ phân hệ `M01` $\rightarrow$ `M10` trong `docs/dossier/03_business_modules/`.

### ⚪ CÁC GÓI ĐỀ XUẤT TIẾP THEO (TRẠNG THÁI: Ý TƯỞNG — CHƯA DUYỆT, CẦN BẰNG CHỨNG TÁI HIỆN TRƯỚC KHI LẬP WORK ORDER):
1. **`WO-PIPE-FIX` (Ý tưởng — Chưa duyệt):**
   - Kiểm tra và đối chiếu thực tế bảng `profiles` vs `employees` trong `/cases/[id]` (`src/app/cases/[id]/page.tsx:93`, `actions.ts:16` — lưu ý cả hai bảng `profiles` và `employees` đều **TỒN TẠI** trong DB).
   - Thay thế 5 ô `<input type="text">` nhập UUID thô trong `TechnicalReviewForm.tsx:115-240` bằng `AsyncSearchableSelect`.
   - Chuẩn hóa `QuotationFormModal.tsx` & `CreateQuotationModal.tsx:331-340`, `/engineering/designs/[moldMasterId]/page.tsx`, và `/equipment/jobs/[id]/page.tsx` sau khi có bằng chứng tái hiện trên trình duyệt/truy vấn.
2. **`WO-MOLD-UNIFY` (Ý tưởng — Chưa duyệt):**
   - Chuyển 7 vị trí còn truy vấn bảng `mold_design_cutters` (hiện vẫn **TỒN TẠI** trong DB) sang đọc/ghi bảng chuẩn `equipment_assignments`.
   - Hợp nhất `/maintenance` vào `/equipment/lifecycle` trên nền bảng `equipment`.
3. **`WO-ROUTE-CLEANUP` & `WO-SAMPLE-QC-GATE` (Ý tưởng — Chưa duyệt, tách khỏi lô đầu chờ Minh Chủ THOAN chốt):**
   - Quy hoạch lại `Sidebar.tsx` và cổng duyệt mẫu thử KCS (`Sample Approval Gate`).

