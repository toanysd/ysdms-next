# Phân tích lỗ hổng dữ liệu: 386 Job bị mất (bao gồm dữ liệu gần đây nhất)

## Phát hiện

Anh Thoan đúng — trong CSV gốc có **1.203 jobs**, nhưng chỉ có **817 jobs** được import vào DB. **386 jobs bị bỏ sót**, và phần lớn chính là các jobs gần đây nhất (2025-2026).

## Nguyên nhân gốc (Root Cause Chain)

Chuỗi phụ thuộc trong Stage A tạo ra hiệu ứng cascade loại bỏ:

```
molds.csv (4.769 dòng)
  └─ ItemTypeID → get_equipment_mapping()
       ├─ ItemTypeID = 2,11,3,4,5,6,7 → ✅ Mapped (4.081 dòng)
       └─ ItemTypeID = '' (400) hoặc '0' (288) → ❌ DROPPED (688 dòng)
```

**688 mold trong CSV có `ItemTypeID` trống hoặc = `0`**, nên script `generate_stage_a_sql.py` không biết map sang `equipment_type` nào → bỏ qua → **không tạo record `equipment`**.

Khi Stage B chạy, script tìm `equipment_id` qua `legacy_id = M-{MoldID}`:
- 386 jobs trỏ tới các MoldID thuộc 688 mold bị drop → `equipment_id = None` → **job bị skip**.

## Phân bổ 386 Jobs bị mất theo năm

| Năm | Số lượng |
|-----|---------|
| 2026 | **219** |
| 2025 | **155** |
| 2024 | 11 |
| Không có ngày | 1 |

> **219 jobs deadline 2026 + 155 jobs deadline 2025 = 374/386** — gần như toàn bộ dữ liệu gần đây bị mất!

## Giải pháp đề xuất

### Phương án: Import lại 688 mold thiếu vào `equipment` (KHÔNG cần `design_revision`)

Các mold có `ItemTypeID` = rỗng hoặc `0` rất có thể là **khuôn (MOLD)** — đây là loại phổ biến nhất (82% trong CSV). Script cũ yêu cầu chain đầy đủ `mold → design → product`, nhưng thực tế `equipment` có thể tồn tại **không cần `design_revision_id`** (cột nullable).

**Bước 1:** Import 688 mold còn thiếu vào `equipment` với `equipment_type = 'MOLD'` (mặc định) và `design_revision_id = NULL`.

**Bước 2:** Re-run Stage B cho 386 jobs bị orphan.

**Bước 3:** Patch ngày tháng cho các jobs mới import.

> **Câu hỏi cho anh Thoan:** 688 mold này có ItemTypeID trống hoặc = 0 — anh có muốn tất cả đều mặc định là `MOLD`, hay có cách xác định loại chính xác hơn?
