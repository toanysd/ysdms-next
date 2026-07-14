# 06_SCHEMA_DECISIONS — Quyết định Thiết kế Database
# YSDMS | YSD Manufacturing System
**Phiên bản:** 1.1
**Ngày ban hành:** 2026-07-13
**Cập nhật lần cuối:** 2026-07-14
**Người phê duyệt:** Thoan (Product Owner)
**Trạng thái:** ACTIVE

---

## SD-01: Quy tắc 3 lớp tên khuôn
**Quyết định:** Bảng `physical_molds` dùng 3 cột riêng biệt.

| Cột | Kiểu | Bắt buộc | Mục đích |
|---|---|---|---|
| `system_code` | TEXT | NOT NULL | Mã hệ thống / QR Code (`JAE-001AB-R2`) |
| `display_name` | TEXT | NOT NULL | Hiển thị màn hình (`JAE-001 AB R2`) |
| `physical_stamp` | TEXT | NULL | Ký hiệu khắc khuôn thực tế |

**Lý do:** Tách biệt 3 ngữ cảnh sử dụng khác nhau. Không dùng computed column
vì `physical_stamp` có thể khác `system_code` (khuôn legacy).

**Bảng liên quan:** `mold_name_history` — lưu toàn bộ lịch sử đổi tên.
**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI

---

## SD-02: Phân tách `design_revisions` và `mold_revisions`
**Vấn đề:** Hiện có 2 bảng dễ nhầm lẫn:
- `design_revisions`: Phiên bản bản vẽ CAD (R1, R2, R3...)
- `mold_revisions`: Phiên bản khuôn vật lý sau cải tiến

**Quyết định:**
- `design_revisions` = Thiết kế CAD, do bộ phận thiết kế quản lý
- `mold_revisions` = Cải tiến khuôn vật lý, do xưởng khuôn quản lý
- Quan hệ: `mold_revisions.design_revision_id` → `design_revisions`

**Quy tắc:** Khi có yêu cầu cải tiến khuôn, tạo record trong `mold_revisions`
(không sửa `design_revisions` cũ). Khi bản vẽ CAD thay đổi, tạo record mới
trong `design_revisions` với `revision_number` tăng dần.
**Trạng thái DB:** ✅ SCHEMA SẴN SÀNG — Cần tài liệu hướng dẫn sử dụng cho team

---

## SD-03 (REVISED 2): Tách biệt luồng Chỉ thị Khuôn và Chỉ thị Khay
**Vấn đề:** Bảng `production_orders` ban đầu gộp chung 2 loại Chỉ thị: Khuôn mới (工程票) và Khay thường (注文書). Điều này sai về mặt nghiệp vụ do khác biệt về trigger (thủ công vs tự động), tần suất, và dữ liệu yêu cầu.

**Quyết định:**
- Giữ `production_orders` = 注文書 (Chỉ thị Khay, tạo tự động từ order_line).
- Tạo bảng mới `mold_work_orders` = 工程票 (Chỉ thị Khuôn mới, tạo thủ công).
- Dọn dẹp các cột kỹ thuật khuôn (cut_method, instruction_notes, req_mold_date...) khỏi `production_orders` và đưa sang `mold_work_orders`.
- `mold_work_orders` liên kết với `physical_molds` (chân 1) và `order_lines` (chân 2 - nullable).

**Trạng thái DB:** 🟡 CẦN MIGRATION — `20260714100000_sd03_rev2_mold_work_orders.sql`

---

## SD-04: Phân loại mẫu trong `order_lines`
**Vấn đề:** `order_lines.is_free_sample` chỉ có true/false,
không phân biệt được 4 loại mẫu theo nghiệp vụ thực tế.

**Quyết định:** Thêm cột `sample_type` vào `order_lines`.

| Giá trị | JA | Tính phí |
|---|---|---|
| `FREE` | 無償サンプル | Không |
| `QC_INSPECT` | 入検用 | Không |
| `MACHINE_ADJUST` | 設備調整用 | Có |
| `OFFICE` | 事務所用 | Không |
| `NULL` | — | Đơn hàng SX thường |

**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI — `20260713170500_order_lines_packaging.sql`

---

## SD-05: Packaging Instructions
**Vấn đề:** `order_lines.packing_style` là text tự do, không validate được.

**Quyết định:** Thêm 2 cột có cấu trúc vào `order_lines`: `box_type` (PLAIN/PRINTED) và `bagging_required` (boolean). `packing_style` giữ nguyên cho ghi chú tự do.

**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI — `20260713170500_order_lines_packaging.sql`

---

## SD-06: Kiến trúc luồng Giao hàng (Shipments & Lots)
**Vấn đề:** `shipments` thiếu phân loại loại hàng và template giấy tờ. `production_lots` thiếu liên kết khuôn vật lý cho in phiếu.

**Quyết định:** Mở rộng `shipments` (shipment_type, document_template) và `production_lots` (lot_no, physical_mold_id, good_qty, defective_qty). Tạo bảng `shipment_required_docs` cho giấy tờ bắt buộc theo khách hàng (SMK, KYD).

**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI — `20260713180900_sd06_shipments_lots.sql`

---

## SD-07: Kiến trúc quản lý Vật tư (Materials & BOM)
**Vấn đề:** Cần quản lý trừ lùi vật tư, định mức BOM và báo cáo môi trường PPWR.

**Quyết định:** Mở rộng `material_inventory` (quantity_reserved, min_stock_alert, kanban_status) và `mold_material_bom` (unit, ppwr_reportable). Tạo `material_consumption_logs`. Thêm `bom_reference_mold_id` vào `production_orders`.

**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI — `20260713180900_sd07_materials_bom.sql`

---

## SD-08: Mở rộng QC & Quản lý Hàng Lỗi
**Vấn đề:** Bảng `inspections` thiếu phân tách QC Split (Good/NG), mã lỗi có cấu trúc, và liên kết `production_lots`.

**Quyết định:** Mở rộng `inspections` thêm 6 cột mới (production_lot_id, inspected_qty, good_qty, ng_qty, ng_category, inspection_stage). Tạo bảng `ng_detail_logs` cho chi tiết từng lỗi NG kèm ảnh.

**Công thức QC:** `inspected_qty = good_qty + ng_qty`

**Các stage kiểm tra:**
| Stage | Mô tả | Map với |
|---|---|---|
| `in_process` | Kiểm tra trong quá trình SX | — |
| `final` | Kiểm tra thành phẩm trước giao | — |
| `incoming` | Kiểm tra đầu vào | `sample_type = QC_INSPECT` |

**Trạng thái DB:** ✅ ĐÃ TRIỂN KHAI — `20260714090000_sd08_extend_inspections.sql`

---

## SD-09: Xuất PDF Chỉ thị Sản xuất (Tầng Ứng Dụng)
**Vấn đề:** Cần render PDF tờ `新規金型製造工程票` dựa trên dữ liệu từ DB.

**Quyết định:** Không cần migration DB mới. Toàn bộ dữ liệu đã đầy đủ sau SD-03 đến SD-08. Thực hiện tại tầng Next.js server.

**Mapping dữ liệu → PDF fields:**

| Vùng trên PDF | Nguồn dữ liệu |
|---|---|
| Mã chỉ thị (工程票番号) | `production_orders.po_code` |
| Tên khuôn / Mold No | `physical_molds.display_name` |
| Ký hiệu khắc | `physical_molds.physical_stamp` |
| Khách hàng | `companies.company_name` |
| Phương pháp cắt | `production_orders.cut_method` |
| Ngày yêu cầu khuôn | `production_orders.req_mold_date` |
| Ngày yêu cầu định hình | `production_orders.req_molding_date` |
| Vật liệu nhựa / Khổ / Dày | `mold_material_bom` qua `bom_reference_mold_id` |
| Phụ trách phê duyệt | `approved_by_mold_shop`, `approved_by_molding_shop`... |
| Ghi chú đặc thù | `production_orders.instruction_notes` |

**Query mẫu cho PDF generation:**
```sql
SELECT
  po.*,
  pm.display_name    AS mold_display_name,
  pm.physical_stamp  AS mold_stamp,
  c.company_name,
  bom.material_type, bom.width_mm, bom.thickness_mm,
  bom.quantity_per_shot
FROM production_orders po
JOIN physical_molds pm      ON pm.physical_mold_id = po.bom_reference_mold_id
JOIN order_lines ol         ON ol.order_line_id    = po.order_line_id
JOIN orders o               ON o.order_id          = ol.order_id
JOIN companies c            ON c.company_id        = o.company_id
LEFT JOIN mold_material_bom bom ON bom.physical_mold_id = po.bom_reference_mold_id
WHERE po.po_id = $1;
```

**Thư viện gợi ý:** `@react-pdf/renderer` (render tại server) hoặc `puppeteer` (HTML → PDF)

**Trạng thái DB:** ✅ KHÔNG YÊU CẦU MIGRATION — Chờ frontend implementation.
