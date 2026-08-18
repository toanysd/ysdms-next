# ADR-002: Work Order Model Option C (4 tầng)

- **Ngày:** 2026-08-10
- **Trạng thái:** APPROVED
- **Người quyết định:** Anh Thoan (Product Owner)

## Bối cảnh

Dữ liệu Legacy từ Access CSV (1,183+ jobs) chỉ có `jobs` phẳng, mỗi job chứa step cho nhiều loại thiết bị. Cần mô hình phân tầng để quản lý chỉ thị sản xuất rõ ràng hơn.

## Quyết định — Option C (4 Tầng)

```
Tầng 1: work_orders (Chỉ thị gia công tổng thể)
  ↓ 1:N
Tầng 2: jobs (mỗi job = 1 equipment duy nhất)
  ↓ 1:N
Tầng 3: job_steps (công đoạn gia công)
  ↓ 1:N
Tầng 4: work_logs (nhật ký giờ thực tế)
```

### Nguyên tắc cốt lõi:
- **1 Job = 1 Equipment**: Job KHÔNG "sinh ra" thiết bị — Job "vận hành trên" thiết bị.
- `jobs.work_order_id` là **NULLABLE** — jobs cũ và standalone có `work_order_id = NULL`.
- `jobs.equipment_id` trỏ đến `equipment.equipment_id` (1:1 per job).

### Hiển thị UI (Gantt 3 cấp):
- **Level 1:** Work Order (hoặc Standalone Job nếu `work_order_id = NULL`)
- **Level 2:** Job (gắn 1 equipment cụ thể)
- **Level 3:** Job Steps

## Tương thích ngược

- 1,183 jobs cũ giữ nguyên `work_order_id = NULL`, hiển thị như Level 1 độc lập.
- `job_category` đã backfill: `CUTTER_NEW` (958), `MOLD_NEW` (144), `MOLD_MODIFY` (78).
- Quick Create V2 và OCR tự động tạo đồng bộ: `work_orders` → `jobs` → `equipment`.

## Tham chiếu

- Chi tiết: `.agents/mempalace/knowledge/architecture_work_order_model_v1.md`
- Luồng tạo: `src/app/actions/quick-mold-job.ts` (`createQuickMoldJobWorkflow`)
