-- Migration: Add auxiliary_equipment_id FK to jobs table
-- Date: 2026-07-11 16:20:00
-- Purpose: Cho phép Job liên kết trực tiếp đến thiết bị phụ trợ (Auxiliary Equipment)
--          tương tự cách physical_mold_id đã liên kết Job với khuôn vật lý.

-- 1. Thêm cột auxiliary_equipment_id vào bảng jobs
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS auxiliary_equipment_id uuid REFERENCES public.auxiliary_equipments(equipment_id);

-- 2. Tạo index để tăng hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_jobs_auxiliary_equipment_id ON public.jobs(auxiliary_equipment_id);
