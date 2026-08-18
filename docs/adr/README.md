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
