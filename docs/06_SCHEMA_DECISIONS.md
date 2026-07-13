# 06_SCHEMA_DECISIONS — Quyết định Thiết kế Database
# YSDMS | YSD Manufacturing System
**Phiên bản:** 1.0
**Ngày ban hành:** 2026-07-13
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

## SD-03 (REVISED): Mở rộng bảng `production_orders` cho Chỉ thị SX
**Vấn đề:** Ban đầu định tạo bảng `production_instructions` để lưu Chỉ thị Sản xuất (新規金型製造工程票). Tuy nhiên, phân tích schema cho thấy bảng `production_orders` đã có sẵn và đóng vai trò tương tự. Bảng `jobs` và `inspections` cũng đã liên kết khóa ngoại vào bảng này.

**Quyết định:** 
- KHÔNG tạo bảng mới để tránh phá vỡ khóa ngoại và luồng liên kết.
- Tận dụng `production_orders`.
- Dùng `ALTER TABLE` để bổ sung các cột còn thiếu cho nghiệp vụ Chỉ thị SX.

```sql
ALTER TABLE production_orders
  -- Phương pháp cắt
  ADD COLUMN IF NOT EXISTS cut_method TEXT NULL,
  -- Ghi chú chỉ thị sản xuất chi tiết
  ADD COLUMN IF NOT EXISTS instruction_notes TEXT NULL,
  -- Trạng thái chỉ thị (nếu chưa có)
  ADD COLUMN IF NOT EXISTS instruction_status TEXT NULL DEFAULT 'draft';

COMMENT ON COLUMN production_orders.cut_method IS 'SD-03: Phương pháp cắt — e.g. straight_cut, contour_cut';
COMMENT ON COLUMN production_orders.instruction_notes IS 'SD-03: Ghi chú chỉ thị sản xuất chi tiết';
```

**Trạng thái DB:** 🟡 CẦN MIGRATION — Đã xuất file `20260713XXXXXX_sd03_extend_production_orders.sql`

---

## SD-04: Phân loại mẫu trong `order_lines`
**Vấn đề:** `order_lines.is_free_sample` chỉ có true/false,
không phân biệt được 4 loại mẫu theo nghiệp vụ thực tế.

**Quyết định:** Thêm cột `sample_type` vào `order_lines`.

```sql
ALTER TABLE order_lines
  ADD COLUMN sample_type TEXT
  CHECK (sample_type IN ('FREE', 'QC_INSPECT', 'MACHINE_ADJUST', 'OFFICE', NULL));
-- NULL = không phải mẫu thử (đơn hàng sản xuất thông thường)
-- FREE = 無償サンプル
-- QC_INSPECT = 入検用
-- MACHINE_ADJUST = 設備調整用 (có phí)
-- OFFICE = 事務所用
```

**Trạng thái DB:** 🟡 CẦN MIGRATION — AN thực hiện sau khi PO phê duyệt

---

## SD-05: Packaging Instructions
**Vấn đề:** `order_lines.packing_style` là text tự do, không validate được.

**Quyết định:** Thêm 2 cột có cấu trúc vào `order_lines`.

```sql
ALTER TABLE order_lines
  ADD COLUMN box_type TEXT
    CHECK (box_type IN ('PLAIN', 'PRINTED', NULL)),
  ADD COLUMN bagging_required BOOLEAN DEFAULT false;
-- packing_style giữ nguyên cho ghi chú tự do
```

**Trạng thái DB:** 🟡 CẦN MIGRATION — AN thực hiện sau khi PO phê duyệt
