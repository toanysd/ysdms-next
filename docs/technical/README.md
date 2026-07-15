# 📋 YSDMS NextGen — Technical Documentation

> **Thư mục này chứa tài liệu kỹ thuật chuẩn doanh nghiệp.**
> Tất cả AI model PHẢI đọc tài liệu liên quan trước khi làm việc.

---

## Danh Mục Tài Liệu

| # | Tài liệu | File | Phạm vi |
|---|----------|------|---------| 
| 01 | **Luồng Nghiệp Vụ** | `01_business_process.md` | Quy trình kinh doanh, sản xuất, đặt tên khuôn, luồng dữ liệu |
| 02 | **Mô Hình Dữ Liệu** | `02_data_model.md` | Entity-Relationship, bảng chính, FK, constraints |
| 03 | **Thông Số Máy Móc** | `03_machine_specs.md` | Máy thermoforming, CNC, CAV-machine compatibility, forming conditions |
| 04 | **Kiến Trúc Hệ Thống** | `04_system_architecture.md` | Tech stack, deployment, front-end routes, components |
| 05 | **Quy Tắc Phát Triển** | `05_development_rules.md` | Coding standards, AI binding rules, change management |
| 06 | **Data Migration** | `06_data_migration.md` | Access CSV → Supabase mapping, import thứ tự, V5 seed script |
| 07 | **Trạng Thái Modules** | `07_module_status.md` | 43 trang: DONE/IN_PROGRESS/PLACEHOLDER, sidebar-filesystem gaps |
| 08 | **Từ Điển Dữ Liệu** | `08_data_dictionary.md` | Single Source of Truth cho thuật ngữ và mapping database |

---

## Quy Tắc Sử Dụng

1. **ĐỌC TRƯỚC KHI LÀM** — AI model PHẢI đọc tài liệu liên quan trước khi viết code
2. **KHÔNG TỰ Ý SỬA** — Mọi thay đổi tài liệu PHẢI có USER APPROVAL
3. **APPEND, KHÔNG GHI ĐÈ** — Khi cập nhật, thêm vào cuối section phù hợp
4. **VERSION TRACKING** — Mỗi thay đổi ghi ngày tháng vào Change Log cuối file

---

## Thứ Tự Đọc Khuyến Nghị

**Khi bắt đầu phiên mới:**
1. `01_business_process.md` → Hiểu nghiệp vụ tổng quan
2. `02_data_model.md` → Hiểu cấu trúc dữ liệu
3. `05_development_rules.md` → Hiểu quy tắc code

**Khi viết query/API:**
- `08_data_dictionary.md` → Chi tiết cột và FK

**Khi viết UI:**
- `04_system_architecture.md` → Routes, components, design system

---

*Cập nhật lần cuối: 2026-07-02*
*Phiên bản: 1.0*
