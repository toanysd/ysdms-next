# Task List — YSDMS-NextGen (Cập nhật 2026-06-17)

---

## ✅ COMPLETED — Phase 4 (Tháng 4-5/2026)

- [x] Phase 4A-1: Khai tử bảng trays, thiết lập product_master
- [x] Phase 4A-2: Ánh xạ product_mold_map (2,312 rows)
- [x] Phase 4B: Import Orders & Order Items từ Excel

## ✅ COMPLETED — Schema V3 (Tháng 6/2026)

- [x] Migration 062-063: Core NextGen Schema
- [x] Migration 067: Schema V2→V3 (rename bảng/cột)
- [x] Migration 068: Seed legacy data V3 (~13MB)
- [x] Migration 069: companies.parent_company_id
- [x] Migration 070: delivery_sites contact_person/email + audit trigger
- [x] Migration 071-072: Fix RLS + audit_trigger_func
- [x] Sidebar 5 phòng ban theo kế hoạch 20260613
- [x] Sidebar tái cấu trúc nghiệp vụ: KH→Văn phòng, Máy→Định hình, xóa d0

---

## 🔲 NEXT TASKS — Phase UI Completion

- [ ] Xác minh route `/master/customers` hoạt động đúng trong Văn phòng
- [ ] Kiểm tra 5 dashboard có content thực (không phải placeholder)
- [ ] Quyết định vị trí sidebar cho `/master/employees` (Văn phòng vs Settings)
- [ ] Test flow: Order → Lệnh SX → Kanban → Nhập thực tế
- [ ] Aluminum Blanks: Liên kết Phòng Thiết kế → Phòng Khuôn (Gantt dependency)
- [ ] Trang customers: Thêm cột `parent_company_id` để hiển thị phân cấp KH
