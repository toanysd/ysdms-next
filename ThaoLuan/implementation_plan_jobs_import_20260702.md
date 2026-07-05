# Phân tích & Đề xuất Cập nhật — Module Jobs

## 1. Đánh giá Plan của Gemini

Plan của Gemini (phiên trước) có **hướng đi đúng** nhưng **chưa đầy đủ**. Cụ thể:

### ✅ Đúng:
- Bóc tách 3 khái niệm thời gian (`ship_date`, `mold_deadline`, `manufacturing_date`) — hợp lý.
- Map `physical_mold_id` từ `MoldID` — cần thiết, đang thiếu.

### ❌ Thiếu sót nghiêm trọng:

| Vấn đề | Chi tiết |
|---------|----------|
| **Script `job.py` bỏ sót rất nhiều cột** | Trong 39 cột của `jobs.csv`, chỉ có **7 cột** được map. Các trường quan trọng bị bỏ: `MoldID`, `JobStartDate`, `DeliveryDeadline`, `YearPeriod`, `MonthPeriod`, `Approved`. |
| **Script bỏ qua `ProcessingDeadline` của job_steps** | Đây là kỳ hạn riêng của TỪNG công đoạn (91% có dữ liệu, 2136/2360 rows). Hiện tại trường `deadline` của `job_steps` trong DB đang **hoàn toàn rỗng**. |
| **Script bỏ qua `DrawingReceiptDate` của job_steps** | Ngày nhận bản vẽ (83% có dữ liệu, 1967/2360 rows). Trường `drawing_receipt_date` có sẵn trong DB nhưng không được import. |
| **Chưa giải thích cách xử lý `job_type_id`** | Bảng `jobs` có `job_type_id` là NOT NULL, nhưng script đang không map trường này (sẽ gây lỗi insert nếu DB có constraint). |

---

## 2. Phân tích dữ liệu Legacy (CSV)

### Bảng `jobs.csv` (1146 rows):

| Cột CSV | Có dữ liệu | Map vào DB | Ghi chú |
|---------|-------------|-----------|---------|
| `MoldID` | **100%** (1146/1146) | `physical_mold_id` | ❌ **ĐANG THIẾU** — mọi job đều gắn với 1 khuôn |
| `DeliveryDeadline` | **92%** (1049/1146) | `ship_date` | ❌ **ĐANG THIẾU** — Ngày xuất hàng Khay |
| `JobStartDate` | **66%** (762/1146) | `start_date` | ❌ **ĐANG THIẾU** |
| `YearPeriod` | **89%** (1023/1146) | `year_period` | ❌ **ĐANG THIẾU** |
| `MonthPeriod` | **85%** (974/1146) | `month_period` | ❌ **ĐANG THIẾU** |
| `Approved` | Có | `approved` | ❌ **ĐANG THIẾU** |
| `MoldShippingDate` | **5%** (60/1146) | — | Ít dữ liệu, có thể bỏ qua |

### Bảng `processingdeadline.csv` (job_steps — 2360 rows):

| Cột CSV | Có dữ liệu | Map vào DB | Ghi chú |
|---------|-------------|-----------|---------|
| `ProcessingDeadline` | **91%** (2136/2360) | `deadline` | ❌ **ĐANG THIẾU** — Kỳ hạn của từng Step |
| `DrawingReceiptDate` | **83%** (1967/2360) | `drawing_receipt_date` | ❌ **ĐANG THIẾU** |
| `EstimatedHours` | **0%** (0/2360) | `estimated_hours` | Không có dữ liệu — OK bỏ qua |

### Ví dụ dữ liệu Job 228 (5 công đoạn):

```
ItemTypeID  ProcessingDeadline  DrawingReceiptDate
1 (Nhôm)    8/17/2022           8/23/2022
3 (Plug)    8/25/2022           8/23/2022
4 (Khuôn)   8/24/2022           8/23/2022
2 (Khuôn)   8/25/2022           8/23/2022
10 (...)     8/29/2022           8/23/2022
```

> [!IMPORTANT]
> Dữ liệu cho thấy mỗi công đoạn có kỳ hạn riêng biệt (VD: Nhôm phải xong 17/8, Plug phải xong 25/8, Khuôn phải xong 24-25/8). Điều này khẳng định rằng **kỳ hạn Job** (deadline của job) khác hoàn toàn với **kỳ hạn từng Step** (deadline trên job_steps).

---

## 3. Đề xuất Chuẩn hóa Hoàn chỉnh

### 3.1. Hệ thống Kỳ hạn (Deadline System)

```
Đơn hàng (orders)
  └─ requested_delivery (Ngày giao khay cho khách)
       │
       ▼
Job (jobs)
  ├─ ship_date        ← Ngày xuất hàng Khay = DeliveryDeadline (từ CSV)
  ├─ mold_deadline    ← Kỳ hạn Khuôn = ship_date - 2 ngày (tính toán)
  ├─ deadline         ← Hạn chung của Job = MAX(tất cả step deadlines) (tính toán)
  ├─ start_date       ← Ngày bắt đầu Job = JobStartDate (từ CSV)
  │
  └─ Job Steps (job_steps)
       ├─ Step 1 (Nhôm):    deadline = 8/17 ← ProcessingDeadline (từ CSV)
       ├─ Step 2 (Plug):    deadline = 8/25 ← ProcessingDeadline (từ CSV)
       ├─ Step 3 (Khuôn):   deadline = 8/24 ← ProcessingDeadline (từ CSV)
       └─ ...
```

### 3.2. Quy tắc Kỳ hạn

| Trường | Bảng | Ý nghĩa | Legacy (Import) | Hệ thống mới (Tạo mới) |
|--------|------|---------|------------------|------------------------|
| `ship_date` | `jobs` | Ngày xuất hàng Khay | = `DeliveryDeadline` | User nhập hoặc kéo từ Đơn hàng |
| `mold_deadline` | `jobs` | Kỳ hạn Khuôn phải xong | = `DeliveryDeadline` - 2 ngày | Tự tính = `ship_date` - 2 ngày, User có thể sửa |
| `deadline` | `jobs` | Hạn chung Job (tất cả step phải xong) | = MAX(`ProcessingDeadline` của các steps) | Tự tính = MAX(step deadlines) |
| `deadline` | `job_steps` | Kỳ hạn từng công đoạn | = `ProcessingDeadline` (từ CSV) | User tự nhập hoặc AI phân bổ ngược từ `mold_deadline` |

> [!NOTE]
> Dữ liệu cũ 100% job đều có `MoldID`, tức tất cả job cũ đều liên quan khuôn. Trong hệ thống mới, khi tạo Job không liên quan khuôn thì `ship_date`, `mold_deadline`, `physical_mold_id` sẽ để trống, chỉ dùng `deadline` (hạn chung) và `step.deadline` (hạn từng bước).

---

## 4. Kế hoạch Thực thi (Đã chỉnh sửa)

### Bước 1: Sửa `job.py` — Bổ sung các trường thiếu

```python
# THÊM vào job_records:
'physical_mold_id': registry.resolve('physical_molds', row['MoldID']),
'ship_date': row['DeliveryDeadline'],           # Ngày xuất khay (giữ nguyên)
'mold_deadline': tính_toán(DeliveryDeadline - 2 ngày),
'start_date': row['JobStartDate'],
'year_period': row['YearPeriod'],
'month_period': row['MonthPeriod'],
'approved': row['Approved'] == 'TRUE',
```

### Bước 2: Sửa `job.py` — Bổ sung deadline cho job_steps

```python
# THÊM vào step_records:
'deadline': row['ProcessingDeadline'],           # Kỳ hạn từng Step
'drawing_receipt_date': row['DrawingReceiptDate'],  # Ngày nhận bản vẽ
```

### Bước 3: Tính `jobs.deadline` = MAX(step deadlines)
Sau khi import xong tất cả steps, chạy 1 lượt UPDATE:
```sql
UPDATE jobs SET deadline = (
  SELECT MAX(deadline) FROM job_steps WHERE job_steps.job_id = jobs.job_id
) WHERE deadline IS NULL;
```

### Bước 4: Sửa `mold.py` — manufacturing_date
- Giữ nguyên logic lấy từ `DeliveryDeadline` nhưng trừ 2 ngày (= mold_deadline).

### Bước 5: Chạy lại `seed_v5` toàn bộ

### Bước 6: Cập nhật SCHEMA_REFERENCE.md (thêm bảng `jobs` và `job_steps`)

> [!IMPORTANT]
> **Xác nhận từ bạn:** 
> 1. Bạn có đồng ý với sơ đồ Deadline System ở mục 3.1 không?
> 2. Trường `job_type_id` (NOT NULL) trong DB — dữ liệu cũ không có cột tương ứng rõ ràng. Bạn muốn đặt 1 giá trị mặc định gì cho tất cả job legacy? (VD: tạo 1 job_type "MOLD_FABRICATION" mặc định)
> 3. Có cần import thêm các trường phụ khác không? (`NoiGCkhuon`, `FormingLocation`, `ToleranceX/Y`, `PriceQuote`, `UnitPrice`...)
