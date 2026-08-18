# ADR-001: Hợp nhất Equipment (physical_molds + cutters → equipment)

- **Ngày:** 2026-08-05
- **Trạng thái:** APPROVED
- **Người quyết định:** Anh Thoan (Product Owner)

## Bối cảnh

Hệ thống ban đầu sử dụng 2 bảng riêng biệt: `physical_molds` (khuôn vật lý) và `cutters` (dao cắt). Khi mở rộng sang các loại thiết bị khác (Plug, Water Base, Pressure Base, Frame, Stacking), việc tạo thêm bảng mới cho mỗi loại không scalable.

## Quyết định

- Tạo bảng `equipment` thống nhất làm **Single Source of Truth** cho tất cả thiết bị.
- Phân biệt loại qua cột `equipment_type`: `MOLD`, `CUTTER_INLINE`, `CUTTER_SEPARATE`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`, `PLUG`.
- `physical_molds` và `cutters` → **DEPRECATED** — giữ lại cho backward compat, code mới bắt buộc dùng `equipment`.
- Bảng `equipment_assignments` quản lý quan hệ N:N (SET_MEMBER, SHARED/COMPATIBLE).
- Bảng `mold_revisions` bị DROP — `equipment.design_revision_id` liên kết trực tiếp.

## Hệ quả

- Mọi query thiết bị mới phải dùng `equipment`, không dùng `physical_molds`/`cutters`.
- ~32 files UI cũ vẫn reference `physical_molds` — sẽ refactor dần (Phase 2).

## Tham chiếu

- Chi tiết: `.agents/mempalace/knowledge/thermoforming_equipment_set.md`
- Quy tắc đặt tên: `docs/technical/07_equipment_matching_and_naming_rules.md`
