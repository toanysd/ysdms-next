-- =====================================================================
-- Migration 100: Add THERMOFORMING Job Type
-- Date: 2026-09-08
-- Milestone 20: Nippo V2 — Production Worklog Enhancement (Chỉ thị #032)
-- Description:
--   Bổ sung job_type_id = 11 đại diện cho công đoạn sản xuất dập khay
--   định hình (成形生産 / Thermoforming) để kích hoạt khối nhập sản lượng
--   (quantity_done, quantity_ng, machine_id) trong Nippo V2.
-- =====================================================================

INSERT INTO public.job_types 
  (job_type_id, job_type_name_ja, job_type_name_vi, category, sort_order)
VALUES 
  ('11', '成形生産', 'Sản xuất dập khay', 'THERMOFORMING', 50)
ON CONFLICT (job_type_id) DO UPDATE SET
  job_type_name_ja = EXCLUDED.job_type_name_ja,
  job_type_name_vi = EXCLUDED.job_type_name_vi,
  category         = EXCLUDED.category,
  sort_order       = EXCLUDED.sort_order;
