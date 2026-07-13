# Kế hoạch Triển khai: MRP Dashboard (Material Requirements Planning)

Tính năng MRP thay thế file Excel `材料在庫(yy-m-d)指示書連動.xlsx`. Mục tiêu: tự động hóa dự báo nhu cầu vật liệu dựa trên lệnh sản xuất.

## 1. Chuẩn hóa Dữ liệu Chi nhánh (INTERNAL)

- Cập nhật công ty có mã `MARUDAI` (hiện đang là 茨城（株）丸大) thành loại `INTERNAL` và thiết lập làm **YSD Ibaraki Factory**.
- Thêm/Chuẩn hóa các chi nhánh khác: 本社工場 (Headquarters), 坂田工場 (Sakata Factory), 相模原倉庫 (Sagamihara Warehouse).
- Bảng `plastic_receipt_roll` sẽ sử dụng logic mapping từ tên kho về các Branch này để tính tồn kho theo từng địa điểm.

---

## 2. Chuẩn hóa Khái niệm "Pitch" (BƯỚC NGOẶT KỸ THUẬT QUAN TRỌNG)

Để tính toán chính xác vật liệu và thiết kế dao cắt, hệ thống phải tách bạch rõ ràng 2 khái niệm:

1. **Mold Cavity Pitch (Bước khuôn / Khoảng cách khuôn)**: Khoảng cách giữa tâm các sản phẩm trên cùng 1 khuôn dập.
   - **Tác dụng:** Dùng để thiết kế và tìm kiếm Dao cắt (Cutter) phù hợp.
   - **Tên DB:** Cột `pitch_mm` hiện tại trong bảng `design_revisions` sẽ được Rename thành **`cavity_pitch_mm`**.
2. **Machine Feed Pitch (Bước tiến nhựa / 送り - Okuri)**: Chiều dài đoạn nhựa được máy kéo lên sau mỗi chu kỳ (shot).
   - **Tác dụng:** Dùng để tính toán số mét nhựa bị tiêu hao thực tế.
   - **Tên DB:** Thêm cột mới **`machine_feed_pitch_mm`** (numeric, nullable) vào bảng `design_revisions` (bởi vì mỗi thiết kế khuôn sẽ quy định một bước tiến máy khác nhau). 
   - **Tương lai:** Trong quy trình tính toán báo giá hoặc tạo lệnh sản xuất, hệ thống sẽ yêu cầu kỹ thuật viên nhập/xác nhận `machine_feed_pitch_mm`. Nếu chưa có, có thể tính nháp bằng công thức: `cutline_length + 15mm (margin)`.

*(Việc dùng từ `cavity_pitch_mm` và `machine_feed_pitch_mm` sẽ đảm bảo 100% không bao giờ xảy ra hiểu lầm trên toàn hệ thống).*

---

## 3. Thuật toán MRP Engine (Auto-Calculate Timeline)

Sẽ xây dựng Postgres Function `calculate_plastic_mrp_v2(start_date, end_date)`.

**A. Công thức Tính Nhu Cầu Vật Liệu (Dựa trên Machine Feed Pitch)**
- Chiều dài 1 nhịp dập máy (m): Lấy từ **`design_revisions.machine_feed_pitch_mm`** / 1000. 
- Hệ số hao hụt chung (ロス率): `1.05` (5%).
- Tổng Mét Nhựa (m) = `(Order Qty / Cavity) * (Machine_Feed_Pitch_mm / 1000) * 1.05`

**B. Timeline Trừ lùi Dự báo (Planning Level)**
1. Tồn kho ban đầu = Tổng `current_length_m` của các cuộn trong kho.
2. Nhu cầu tương lai = Các đơn hàng đang Open (rải theo `due_date`).
3. Tồn kho ngày T = `Tồn kho (T-1) + Nhập kho dự kiến (T) - Nhu cầu SX (T)`.

**C. Đề xuất Luân chuyển kho nội bộ**
- Cảnh báo **"Cần Luân chuyển" (Transfer Needed)** nếu Xưởng A thiếu nhưng Xưởng B thừa vật liệu.

---

## 4. Giao diện MRP Dashboard (`/plastics/mrp`)

- **Khu vực Action Required:** Cảnh báo các mã nhựa bị "Thủng kho" (< 0m) trong 14 ngày tới.
- **Timeline Grid:** Hiển thị ma trận Tồn kho - Từng chi nhánh - Dãy ngày (T+1 -> T+30).

---

## 5. Lộ trình tích hợp Tồn kho thực tế (Shopfloor Execution) - ⚠️ NEXT PHASE

**Hiện trạng Data:** Schema DB đã có bảng `plastic_adjustment_log` liên kết chặt chẽ với bảng `work_logs` (Nhật ký SX) và `plastic_receipt_roll` (Cuộn nhựa).

**Lộ trình xử lý (Phase 2 - Module Quản lý Sản xuất):**
Tính tồn kho thực tế sẽ được xử lý ở màn hình thao tác của Công nhân (Workers) tại xưởng:
1. Scan mã vạch cuộn nhựa thực tế đưa lên máy.
2. Điền số lượng sản phẩm hoàn thành vào Nhật ký SX (`work_logs`).
3. Hệ thống ghi nhận số mét nhựa tiêu hao vào `plastic_adjustment_log` và tự động trừ trực tiếp vào `current_length_m` của cuộn nhựa.

> [!NOTE]  
> Việc tách Dashboard MRP (Văn phòng - Dự báo Macro) và Shopfloor Data Collection (Xưởng - Thực tế Micro) làm 2 giai đoạn giúp không chồng chéo logic và tối ưu UI/UX.

---

## Verification Plan (Phase MRP)
1. **Migration DB:** Rename `pitch_mm` -> `cavity_pitch_mm`. Thêm `machine_feed_pitch_mm` vào `design_revisions`. Cập nhật MARUDAI.
2. **Test SQL Function:** Kiểm tra tính toán trừ lùi bằng `machine_feed_pitch_mm`.
3. **Triển khai UI:** Cập nhật các form nhập thiết kế khuôn để làm rõ "Cavity Pitch" vs "Machine Feed Pitch (Okuri)". Trang MRP hiển thị dữ liệu Timeline.
