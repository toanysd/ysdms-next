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

## SD-03: Bảng Production Instructions (Chỉ thị SX) — CẦN TẠO MỚI
**Vấn đề:** Chưa có bảng lưu Chỉ thị Sản xuất (新規金型製造工程票).
Hiện tại `jobs` đảm nhận một phần vai trò này nhưng không đủ trường.

**Quyết định:** Tạo bảng `production_instructions` mới.

```sql
CREATE TABLE production_instructions (
  pi_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_code          TEXT NOT NULL UNIQUE,   -- Mã chỉ thị, ví dụ: PI-2026-001
  order_id         UUID REFERENCES orders(order_id),
  design_rev_id    UUID REFERENCES design_revisions(revision_id),
  machine_id       UUID REFERENCES machines(machine_id),
  cut_method       TEXT,   -- 'BETANUKI' (別抜き) | 'INLINE'
  -- Phân công
  material_mgr_id  UUID REFERENCES employees(employee_id),  -- Yoshida
  mold_maker_id    UUID REFERENCES employees(employee_id),  -- Endo
  forming_mgr_id   UUID REFERENCES employees(employee_id),  -- Kohi
  -- Tiến độ
  mold_deadline    DATE,
  ship_deadline    DATE,
  -- Trạng thái
  status           TEXT DEFAULT 'DRAFT',
  issued_by        UUID REFERENCES employees(employee_id),
  issued_date      DATE,
  pdf_path         TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**Trạng thái DB:** 🔴 CHƯA TRIỂN KHAI — Chờ PE xuất Migration spec

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
