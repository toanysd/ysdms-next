---
date: 2026-04-14
project: YSDMS Next-Gen
phase: Giai đoạn 1 hoàn tất, Cấp độ 2 (Mold Revision) sẵn sàng
---

# Báo cáo Trạng thái Phiên Làm Việc (SESSION BACKUP)

## 📍 Vị trí hiện hành
- Dự án YSDMS-Nextgen đã dựng thành công nền móng Next.js với Tailwind v3.4 (khắc phục lỗi Webpack Windows).
- Hệ thống đẩy lên GitHub `toanysd/ysdms-next` thành công.
- Hoàn thành Toàn Bộ Tầng 1 Master Data CRUD (Supabase UI + Server Actions):
  - `plastic_master` (Nhựa)
  - `mold_base` (Khuôn Tầng 1) -> Đã gắn `customer_id` ForeignKey.
  - `cutter_master` (Dao cắt)
  - `product_master` (Khay)
  - `machine_master` (Máy đúc)
  - `customers` (Khách hàng)

## 💾 Kiến trúc Dữ liệu Chuyên sâu (Vừa Cập Nhật)
Hệ thống Khách hàng (`customers`) đã được đồng bộ chuẩn 1:1 với file gốc `A.-Na-Ru-Xian-Yi-Lan-Biao.xlsx` (納入先一覧表):
- Gồm: `customer_code`, `delivery_name`, `delivery_address`, `requester_code`, `contact_person`, `phone`, `fax`, `parent_code`.
- File Migration v3: `supabase/migrations/20260414_003_update_customers.sql` (Đã có sẵn để User tự drop/create).
- Script Python Extract: `scripts/migration/import_customers.py` (Script trích xuất từ Excel sinh lệnh UPSERT tự động chống đè).

## 🚀 Nhiệm vụ Chưa Hoàn Thành (Máy Khác Sẽ Tiếp Quản)
User cần mang theo máy quét và thao tác 2 việc sau TRƯỚC KHI code tiếp:
1. Chạy `20260414_003_update_customers.sql` lên Supabase để reset bảng Customer.
2. Ném file `toreiteta-Zhi-Shi-Shu.xlsx` vào chung mục `scripts/migration` và chạy `python import_customers.py`.

👉 **Sau đó:** Đội AI (phiên tiếp theo) sẽ bắt tay vào Code BOM TẤN: `mold_design_revision` (Nested Form Bản Vẽ). Đây là Tầng 2, quy tụ JAE-001 thành R1, R2, R3.

## 🗂 Cục Nghề AI Backup
- Các file `task.md`, `implementation_plan.md`, `walkthrough.md` đã được chép đè gốc vào thư mục `.agents/context_backup/` của thiết bị lưu trữ.
- Khi cắm USB vào máy mới, hãy dùng `/resume-session` để AI đọc lại toàn bộ thư mục này.
