# Rà Soát Tính Nhất Quán Dữ Liệu: Thiết Kế — Thiết Bị — Job — Gantt — Nhật Ký

> **Yêu cầu từ Anh Thoan:** Xác nhận toàn bộ dữ liệu từ thiết kế, thiết bị vật lý, job, Gantt chart, lịch sản xuất, khuôn, nhật ký sản xuất đã đồng bộ và nhất quán chưa?

---

## 1. Tổng Quan Kiến Trúc Hiện Tại (Đã Verify Từ Code Thực Tế)

Hệ thống YSDMS NextGen hiện có **2 luồng sản xuất song song**, mỗi luồng phục vụ bộ phận khác nhau:

### Luồng A: Gia Công Khuôn (Tooling / CNC Workshop)
```
work_orders → jobs → job_steps → work_logs
     ↑           ↑
 products    equipment
     ↑
design_revisions
```
- **UI:** `/equipment/schedule` (Gantt Chart), `/equipment/jobs`
- **Nhật ký:** `work_logs` (7.065 dòng)
- **Trạng thái:** ✅ Hoạt động tốt, sạch 100% ở tầng job_steps ↔ work_logs

### Luồng B: Sản Xuất Khay (Thermoforming / Molding Floor)
```
production_instructions → production_orders → production_logs
         ↑                        ↑
     orders/order_lines       products
```
- **UI:** `/production/*`, `/production-instructions`
- **Nhật ký:** `production_logs` 
- **Trạng thái:** ✅ Code hoạt động tích cực (985 dòng action file)

> [!WARNING]
> Cả 3 bảng `production_orders`, `production_instructions`, `production_logs` đều **KHÔNG có trong `SCHEMA_REFERENCE.md`**. Đây là khoảng hở tài liệu cần bổ sung ngay.

---

## 2. Tính Năng AI OCR — ĐÃ ĐƯỢC XÂY DỰNG VÀ HOẠT ĐỘNG

> [!IMPORTANT]
> Tính năng **"AI OCR 製造工程票 取込"** (AI bóc tách dữ liệu từ ảnh chụp phiếu sản xuất) **ĐÃ ĐƯỢC TRIỂN KHAI ĐẦY ĐỦ** trong codebase, không phải ở giai đoạn lên kế hoạch.

### Kiến trúc AI OCR (2 API routes):

| Route | Chức năng | Dòng code |
|---|---|---|
| [`/api/ocr/extract`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/extract/route.ts) | Gửi ảnh → Gemini 2.5 Flash → Trả về JSON chuẩn hóa | 508 dòng |
| [`/api/ocr/save`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts) | Nhận JSON → Tự động tạo/cập nhật Product + Design Revision + Equipment + Work Order + Job + Job Steps | 904 dòng |

### Luồng xử lý tự động (đã code hoàn chỉnh):
1. **Ảnh chụp 工程票** → Gemini AI bóc tách → JSON chuẩn hóa
2. **Resolve Company** bằng prefix mã sản phẩm (TOW → Towani, JAE → Japan Aviation Electronics)
3. **Tạo/Cập nhật Product** (tránh trùng lặp bằng `product_code`)
4. **Tạo/Cập nhật Design Revision** (resolve `cav_type`, `plastic_type`, cutline, corner R, chamfer C)
5. **Tạo Work Order** (tự sinh `WO-YYYY-XXXXXX`)
6. **Tạo Equipment** (Mold, Cutter, Plug — hỗ trợ cả tạo mới lẫn tái sử dụng thiết bị cũ)
7. **Tạo Job + Job Steps** (mỗi component trên phiếu = 1 job step, gắn đúng equipment)
8. **Tạo Equipment Assignments** (SET linkage giữa Mold ↔ Cutter ↔ Plug ↔ Water Base)

### Các trường AI bóc tách được:
- `product_code`, `product_name_internal`, `customer_name`, `designer_name`
- `cutline_length/width`, `design_length/width/height/depth`
- `plastic_type_designed`, `plug_type`, `has_separate_cutter`
- `corner_r`, `chamfer_c`, `draft_angle`, `tolerance_info`
- `shipping_deadline`, `mold_deadline`, `target_completion_date`
- `components[]` (mỗi row: type, material, arrangement, condition, deadline, hours)
- **Hỗ trợ lịch Nhật Bản** (令和/平成 → ISO date)

---

## 3. Đánh Giá Tính Nhất Quán (Câu Trả Lời Chính)

| Hạng mục | Trạng thái | Chi tiết |
|---|---|---|
| **Gantt Chart ↔ Jobs** | ✅ Đồng bộ | `/equipment/schedule` đọc trực tiếp từ `jobs` + `work_orders` |
| **Job Steps ↔ Work Logs** | ✅ Sạch 100% | 0 orphan cả 2 chiều |
| **AI OCR → Product → Design → Equipment → Job** | ✅ Luồng end-to-end hoàn chỉnh | 1 ảnh chụp → tự động tạo đủ 6 entity |
| **Equipment Assignments (SET)** | ✅ Hoạt động | AI tự link Mold ↔ Cutter ↔ Plug thành SET |
| **`production_schedules`** | ℹ️ Không tồn tại | Bảng này chỉ có trong tài liệu kế hoạch cũ, chưa bao giờ được tạo |

### Các khoảng hở cần xử lý:

| # | Vấn đề | Mức độ | Đề xuất |
|---|---|---|---|
| 1 | `SCHEMA_REFERENCE.md` thiếu 3 bảng: `production_orders`, `production_instructions`, `production_logs` | 🔴 Cao | Bổ sung ngay vào tài liệu |
| 2 | 999 jobs thiếu `equipment_id` | 🟡 Trung bình | Cần phân loại theo `job_category` — job DESIGN/INTERNAL_OPS vốn không cần equipment |
| 3 | 3.189 products thiếu `design_revisions` | 🟡 Trung bình | Phân loại Active vs Legacy/Disposed — sản phẩm cũ import từ Access chưa bao giờ có CAD |
| 4 | `work_orders` chỉ có 6 dòng (99.9% jobs không gắn WO) | 🟡 Trung bình | AI OCR save đã tạo WO tự động — dữ liệu cũ tạo trước khi có AI thì không có WO |
| 5 | Xem xét lại AI OCR có phù hợp cấu trúc hiện tại không | 🟢 Review | Xem Section 4 bên dưới |

---

## 4. Đánh Giá AI OCR So Với Cấu Trúc Hiện Tại

### ✅ Điểm phù hợp tốt:
- AI OCR save route tạo dữ liệu **đúng SSOT**: `products` → `design_revisions` → `equipment` → `work_orders` → `jobs` → `job_steps`
- Không vi phạm RULE-DATA-01 (không parse text runtime, không fallback kích thước)
- Có xử lý trùng lặp (kiểm tra product_code, design_code trước khi insert)
- Hỗ trợ cả tạo mới lẫn cập nhật bổ sung (`ENRICH_EXISTING` vs `NEW_REVISION`)

### ⚠️ Điểm cần review/cải tiến:
1. **Company fallback quá rộng** (dòng 106-113 trong save route): Nếu không tìm thấy KH bằng prefix hay tên → lấy luôn company đầu tiên trong DB. Có thể gây gán sai KH.
2. **`equipment_code` có thể bị trùng** nếu cùng 1 sản phẩm được OCR nhiều lần với revision khác nhau mà naming convention không nhất quán.
3. **Chưa liên kết với `production_orders`/`production_instructions`**: AI OCR tạo job cho xưởng khuôn (Luồng A) nhưng chưa tự động tạo chỉ thị cho xưởng ép (Luồng B). Đây có thể là gap nghiệp vụ cần bổ sung.

---

## 5. Đề Xuất Hành Động Tiếp Theo

1. **Bổ sung `SCHEMA_REFERENCE.md`** với 3 bảng `production_orders`, `production_instructions`, `production_logs`
2. **Phân tích 999 jobs thiếu equipment** theo `job_category` để xác định đâu là thiếu thật
3. **Review AI OCR** theo 3 điểm cần cải tiến ở Section 4
4. **Quyết định** liệu AI OCR có nên tự động tạo cả `production_instructions` cho xưởng ép (Luồng B) hay không

