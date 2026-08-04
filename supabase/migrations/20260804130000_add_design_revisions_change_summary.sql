-- Migration: Add change_summary column to design_revisions table
-- Purpose: Store revision change notes (e.g., "Pocket mở rộng 0.2mm", "Đổi loại nhựa sang PET")
-- Date: 2026-08-04
-- Author: AI Agent (PA2+ Stage 2)

ALTER TABLE design_revisions
  ADD COLUMN IF NOT EXISTS change_summary TEXT;

COMMENT ON COLUMN design_revisions.change_summary IS 'Tóm tắt các điểm thay đổi so với phiên bản trước (dùng cho Auto-diff và tra cứu lịch sử)';
