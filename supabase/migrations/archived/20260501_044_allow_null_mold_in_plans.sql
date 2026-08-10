-- Lệnh này xoá bỏ ràng buộc NOT NULL của cột mold_physical_id
-- Cho phép xếp lịch sản xuất (tạo kế hoạch) cho các sản phẩm chưa có khuôn trên hệ thống

ALTER TABLE production_plans ALTER COLUMN mold_physical_id DROP NOT NULL;
