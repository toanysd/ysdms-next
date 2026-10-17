# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 19:26:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` — **CLOSED & ACCEPTED BY PE** (`9305017d25a0aa28ecc5bc09365f7ad8dbe35fda`, Directive `b8b411ce`).
  - `WO-EQUIP-OPS-WAVE3-WIRING` (**CLOSED** tại `1e935e019accafc76f6549ceab86e8dd4dc58e53`), `WO-AI-EXTRACTION-AUDIT` (**CLOSED** tại `b28131774d5bfe2e501d13f0a65ec912a2852e62`), `WO-DATA-AUDIT-SUMMARY` (**CLOSED**), `WO-MOLD-SYNC-WAVE3` (**CLOSED**), `WO-MOLD-SYNC-WAVE2` (**CLOSED**), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-CONTEXT-PALACE` (**CLOSED**).
- **Work Order hiện hành:** `WO-AI-OCR-PIPELINE-HARDENING` (Theo Chỉ thị PE `b8b411ce`) — **Pha 1 `[KẾ HOẠCH]` ĐÃ ĐỆ TRÌNH ĐẶC TẢ, CHỜ PE PHÊ DUYỆT ĐỂ THI CÔNG CODE**.

## 1. Tóm Tắt Đặc Tả `WO-AI-OCR-PIPELINE-HARDENING` (`docs/audit_logs/2026-10-17_WO-AI-OCR-PIPELINE-HARDENING_SPEC.md`)
1. **Xóa fallback lấy công ty đầu tiên bất kỳ** (`src/app/api/ocr/save/route.ts` dòng `111–119`, tuân thủ `RULE-DATA-01`) + bắt buộc chọn `company_id` trên UI.
2. **Tách rõ Customer vs. Machining Vendor:** `customerCompanyId` (`products`, `design_revisions`, `work_orders`, `jobs`) vs. `equipment.company_id` (`NULL` khi gia công nội bộ tại YSD `IN_HOUSE`, chỉ gán `machining_vendor_id` khi `OUTSOURCED`).
3. **Tạo đầy đủ bản ghi `public.equipment` (`equipment_type = 'PLUG'`) cho `PLUG`:** Gán `SET_MEMBER` vào `equipment_assignments` và gắn `plugEquipId` vào Job `JOB-*-P` (`プラグ製作`).
4. **Gắn `equipment_id = moldEquipmentId` cho Job `DESIGN` (`DES-*`)** và điền `start_date` cho mọi Job thiết bị.
5. **Lưu ảnh phiếu gốc (`新規金型製造工程票`)** lên bucket `equipment-photos` và bảng `public.equipment_photos` (`photo_type = 'DOCUMENT'`) kèm Privacy Blur Shield (`Rule 3 Global`).
6. **Transaction nguyên tử (Atomic Transaction):** Đề xuất Phương án A (Server-side `pg` `BEGIN...COMMIT/ROLLBACK` trong `/api/ocr/save/route.ts`, hỗ trợ cả `dry_run` bằng `BEGIN...ROLLBACK`, không phát sinh DDL) hoặc Phương án B (PostgreSQL RPC 2 cổng PE).
7. **Hỗ trợ dán nội dung Email (`emailText`)** trong `ManufacturingSheetOCRModal.tsx` & `/api/ocr/extract/route.ts` để AI đối chiếu chéo `Image + Email`.
8. **Điểm dừng hiện tại:** Chờ **PE** duyệt đặc tả `[KẾ HOẠCH]` để bước sang Pha 2 `[THI CÔNG]`.
