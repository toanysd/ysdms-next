# SESSION CONTEXT: YSDMS-NextGen Phase V3
**Date Captured:** 2026-06-17
**Session Phase:** Post Schema V3 Migration — UI Alignment & Nghiệp vụ Review

---

## 1. Thành tựu đã hoàn thành (Lũy kế đến 17/06/2026)

### Schema & Database
- **V3 Schema** hoàn toàn active trên Supabase (migrations 062→072)
- `mold_designs` → **`design_revisions`** (rename + merge design_projects)
- `design_masters` gộp vào **`mold_masters`** (giảm từ 6 → 4 bảng khuôn)
- Rename cột kỹ thuật: `cutline_x/y` → `cutline_length/width`, `piece_count` → `cavity_count`
- `companies.parent_company_id` ✅ tồn tại (1,710 records)
- `delivery_sites.contact_person/email` ✅ tồn tại
- RLS + Audit trigger đã fix (migrations 071, 072)
- Seed data V3: ~13MB legacy data đã import thành công

### UI / Frontend
- **Sidebar 5 phòng ban** hoàn chỉnh theo kế hoạch 20260613
- Sidebar đã được cải thiện nghiệp vụ (17/06):
  - Xóa section "Dữ liệu gốc" (nhóm sai nghiệp vụ)
  - **Khách hàng → Văn phòng** (item thứ 2 sau Dashboard)
  - **Master Máy móc → Phòng Định hình** (gắn với máy ép)

### Data Flows đã seed
- `orders` & `order_items`: Import từ Excel via `upload_orders.py` ✅
- `product_mold_map`: 2,312 rows ánh xạ khuôn-khay ✅

---

## 2. Kiến trúc Schema V3 (Current State)

```
companies (1,710 KH) ──→ orders ──→ order_items
                                         │
products ──→ mold_masters ──→ design_revisions (revisions thiết kế)
                  │                    │
           mold_revisions ←────────────┘ (bản duyệt → gia công)
                  │
           physical_molds → cutters, auxiliary_equipment
                  │
           product_mold_map (2,312 ánh xạ)
```

---

## 3. Next Steps tiếp theo

1. **Trang `/master/customers`**: Xác minh route & UI cho trang Khách hàng mới trong Văn phòng hoạt động đúng.
2. **Trang dashboard các phòng ban**: Kiểm tra 5 dashboard đã có nội dung thực chưa.
3. **Luồng Đơn hàng → Sản xuất**: Test end-to-end flow từ order → lệnh SX → kanban.
4. **Aluminum Blanks workflow**: Liên kết Phôi nhôm giữa Phòng Thiết kế → Phòng Khuôn.
5. **Nhân viên (Employees)**: Hiện `master/employees` chưa có mục trong sidebar — cần xem xét đặt ở Cài đặt hay Văn phòng.

---

*Trạng thái DB: ✅ Ổn định | Trạng thái UI: ✅ Sidebar đã align nghiệp vụ*
