# Architecture Decision Records (ADR)

Thư mục này lưu trữ các **Quyết định kiến trúc (Architecture Decision Records)** quan trọng của dự án YSDMS NextGen.

## Quy ước đặt tên

```
ADR-NNN_short-description.md
```

Ví dụ: `ADR-001_unified-equipment-table.md`, `ADR-002_work-order-option-c.md`

## Trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| `PROPOSED` | Đang đề xuất, chờ phê duyệt |
| `APPROVED` | Đã phê duyệt, đang áp dụng |
| `SUPERSEDED` | Đã bị thay thế bởi ADR mới |
| `DEPRECATED` | Không còn hiệu lực |

## Danh sách ADR

| Mã | Ngày | Trạng thái | Tiêu đề |
|---|---|---|---|
| ADR-001 | 2026-08-05 | APPROVED | Hợp nhất Equipment (physical_molds + cutters → equipment) |
| ADR-002 | 2026-08-10 | APPROVED | Work Order Model Option C (4 tầng) |
| ADR-003 | 2026-08-18 | APPROVED | Tách Job theo Equipment Type & Sửa Filter Lịch Sản Xuất |
| ADR-004 | 2026-08-18 | APPROVED | Deprecate physical_molds/cutters FK |
| ADR-005 | 2026-08-20 | APPROVED | Company Entity Unification and Classification |
| ADR-006 | 2026-08-29 | APPROVED | Multi-Perspective Schedule View & Gantt Tree Structure |
| ADR-007 | 2026-09-04 | APPROVED | Shopfloor Tablet Cockpit & Equipment Lifecycle (Milestone 14) |
| ADR-008 | 2026-09-07 | APPROVED | Rack & Layer Code Convention (Milestone 16) |
| ADR-009 | 2026-09-08 | APPROVED | Mold Custody, Borrowing & Return Workflow (Milestone 18) |
| ADR-010 | 2026-09-08 | APPROVED | Work Order UI & Equipment SET Resolution (Milestone 19) |
| ADR-011 | 2026-09-08 | APPROVED | Nippo V2 — Production Worklog Enhancement (Milestone 20) |
| ADR-012 | 2026-09-08 | PROPOSED | Shipments & 納品書 Delivery Engine (Milestone 21) |
