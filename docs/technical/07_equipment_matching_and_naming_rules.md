# 07_EQUIPMENT_MATCHING_AND_NAMING_RULES.md — Quy tắc Thiết bị Dùng chung & Đặt mã Dao cắt

> 📄 **Hồ sơ Kỹ thuật Archive** — Lưu trữ quy tắc nghiệp vụ thực tế về Thiết bị dùng chung (Shared Equipment) và Quản lý Mã Dao cắt (Cutter No).
> **Ngày cập nhật:** 2026-08-05

---

## 1. PHÂN LOẠI VÀ QUY TẮC GỢI Ý THIẾT BỊ DÙNG CHUNG (SHARED EQUIPMENT MATCHING)

Trong nhà máy sản xuất khay nhựa định hình nhiệt YSD, các thiết bị phụ trợ được chia làm **2 nhóm chính** theo cơ chế dùng chung:

### 🔹 NHÓM 1: Dùng chung dựa trên Kích thước ngoài Sản phẩm (Product External Dimensions / Cutline)

| Loại thiết bị | Tên tiếng Nhật | Mã Enum `equipment_type` | Cơ chế Gợi ý Dùng chung |
|---|---|---|---|
| **Dao cắt** | 抜型 / カッター | `CUTTER_SEPARATE`, `CUTTER_INLINE` | Dựa trên **Hình dạng & Kích thước bao ngoài sản phẩm** (`external_length_mm` × `external_width_mm` hoặc `cutline_length` × `cutline_width`), xét thêm chiều cao (`design_height`) nếu cần. |
| **Stacking** | スタッキング | `STACKING` | Khung gỗ xếp chồng sản phẩm sau khi cắt. Dựa trên **Hình dạng & Kích thước bao ngoài sản phẩm** giống hệt cơ chế của Dao cắt. |

**Quy tắc nghiệp vụ:**
- Dao cắt và Stacking hoạt động ở vị trí sau khi sản phẩm đã được cắt rời khỏi tấm nhựa.
- Mọi sản phẩm có cùng kích thước bao ngoài và hình dạng viền cắt đều có thể dùng chung Dao cắt và Stacking.

---

### 🔹 NHÓM 2: Dùng chung dựa trên Kích thước ngoài của Khuôn (CAV Specification)

> ⚠️ **ĐỊNH NGHĨA QUAN TRỌNG VỀ `CAV` (BẮT BUỘC KHÔNG NHẦM LẪN):**
> - **`CAV` KHÔNG PHẢI LÀ SỐ POCKET HOẶC CAVITY NHỎ TRÊN KHAY!**
> - **`CAV` LÀ MÃ KHỔ KÍCH THƯỚC NGOÀI CỦA KHUÔN (`actual_length_mm` × `actual_width_mm`)** theo tiêu chuẩn **YSD規格 CAV - 水冷ベース一覧表**.
> - Ví dụ: Khổ `A` = 470 × 300 mm, Khổ `ZD` = 470 × 347 mm, Khổ `D` = 590 × 300 mm...

| Loại thiết bị | Tên tiếng Nhật | Mã Enum `equipment_type` | Cơ chế Gợi ý Dùng chung |
|---|---|---|---|
| **Đế làm mát** | 水冷盤 / 水冷ベース | `WATER_BASE` | Lắp cùng khuôn trên máy. Dựa trên **Mã khổ CAV (Kích thước ngoài của khuôn)**. |
| **Đế khí nén** | 圧空ベース | `PRESSURE_BASE` | Lắp cùng khuôn trên máy. Dựa trên **Mã khổ CAV (Kích thước ngoài của khuôn)**. |
| **Khung gá** | フレーム | `FRAME` | Lắp cùng khuôn trên máy. Dựa trên **Mã khổ CAV (Kích thước ngoài của khuôn)**. |

**Quy tắc nghiệp vụ:**
- Khuôn và các thiết bị `WATER_BASE`, `PRESSURE_BASE`, `FRAME` được lắp ghép thành một tổ hợp tại cùng một vị trí trên máy định hình.
- Dựa vào kích thước Dài × Rộng của Khuôn, hệ thống tra cứu bảng tiêu chuẩn YSD để biết Khuôn thuộc Mã CAV nào (VD: Khổ `A`, Khổ `ZD`). Từ đó tự động gợi ý danh sách các thiết bị `WATER_BASE`, `PRESSURE_BASE` có cùng Mã CAV.
- **Mã định danh duy nhất:** Một mã CAV (như `ZD`) có thể được xưởng chế tạo **nhiều bộ `WATER_BASE` hoặc `PRESSURE_BASE` vật lý** để chạy song song trên nhiều máy. Vì vậy, mỗi thiết bị này ngoài mã khổ CAV vẫn có **Mã định danh thiết bị riêng (`equipment_code`)** như Khuôn vật lý.
- **Ngoại lệ:** Đối với Khuôn có kích thước đặc biệt không thuộc khổ CAV tiêu chuẩn, thiết bị phụ trợ sẽ được chế tạo riêng và liên kết trực tiếp với `design_revision_id` của khuôn đó.

---

## 2. QUY NĂNG VÀ QUẢN LÝ MÃ DAO CẮT (CUTTER NO & SYSTEM CODE)

### 🔴 Thực trạng nghiệp vụ tại xưởng:
- Ban đầu khi chế tạo dao cắt mới, dao cắt liên kết trực tiếp với bản vẽ thiết kế khuôn ban đầu (thể hiện dao cắt được thiết kế cho khuôn nào).
- Nhân viên xưởng đăng ký thủ công mã `CutterNo` theo dãy số tự nhiên (VD: `1042`).
- Do quản lý thủ công trước đây, xảy ra tình trạng trùng lặp số `CutterNo` và thiếu sự đồng nhất.

### ✅ Quy tắc Quản lý Chuẩn hóa trong YSDMS NextGen:
1. **Tránh hiểu nhầm tên gọi:**
   - **KHÔNG** tự động ghép tiền tố `CT-` tạo thành `CT-1042` nếu dễ gây nhầm lẫn với mã khuôn `CT-1042`.
   - Vì bản ghi trong bảng `equipment` đã có trường phân loại rõ ràng `equipment_type = 'CUTTER_SEPARATE'` hoặc `'CUTTER_INLINE'`, nên mã số gốc hiển thị là `1042` (hoặc `CUTTER-1042`).
2. **Cơ chế Chống trùng lặp CutterNo:**
   - Hệ thống tự động sinh số `CutterNo` tiếp theo (Auto-increment Unique) hoặc kiểm tra `UNIQUE` khi nhập mã thủ công.
   - Quản lý 2 tầng mã:
     - `equipment_code`: Mã hệ thống duy nhất (System Unique Code).
     - `display_name` / `cutter_no`: Số hiệu hiển thị xưởng dùng (`1042`).
