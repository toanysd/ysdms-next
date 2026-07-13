# Phân tích Luồng nghiệp vụ Khuôn & Kế hoạch nhập liệu STT-002

Bản kế hoạch này mô tả quy trình thực tế từ khi có chỉ thị sản xuất mới đến khi bộ phận khuôn lập kế hoạch và ghi nhận nhật ký, đồng thời trích xuất thông tin thực tế của mã khuôn STT-002 từ lịch sử email để làm dữ liệu kiểm thử (test data) trên hệ thống YSDMS NextGen.

## 1. Toàn bộ các công đoạn cần thiết khi có chỉ thị sản xuất mới

Khi có một email chỉ thị sản xuất/thiết kế mới, bộ phận khuôn (Khuôn/Dao cắt/Thiết kế) cần thực hiện chuỗi thao tác sau trên hệ thống:

1. **Tiếp nhận & Tạo Master Data (Master Management):**
   - **Thiết kế (Design Revision):** Tạo mã bản vẽ, phân bản cập nhật (Revision), tải lên file CAD/PDF dữ liệu thiết kế.
   - **Sản phẩm (Product Master):** Nếu là khay nhựa mới, tạo mã khay (Tray) tương ứng.
   - **Khuôn (Mold Master):** Tạo mã khuôn (Mold Master) và liên kết với sản phẩm (khay). Xác định khuôn này là khuôn đúc đơn hay khuôn bộ (set mold - ví dụ ghép A/B).
   - **Dao cắt (Cutter Master):** Tạo mã dao cắt (nếu có bản vẽ dao bế/cắt).

2. **Lập Kế hoạch Công việc (Job Planning & Scheduling):**
   - **Tạo Job (Khuôn / Dao cắt / Khác):** Từ yêu cầu, tạo ra các Job cụ thể (Ví dụ: Chế tạo khuôn thử nghiệm, Chế tạo khuôn thật, Sửa chữa khuôn, Làm dao cắt).
   - **Thiết lập công đoạn (Routing/Steps):** Gán các bước gia công cần thiết cho Job (Phay CNC, Tiện, Bắn điện EDM, Cắt dây, Đánh bóng, Lắp ráp...).
   - **Phân bổ tài nguyên (Resource Allocation):** Trên màn hình **Bảng kế hoạch (Gantt Chart)**, kéo dài thời gian dự kiến (Planned H), gán thời gian bắt đầu/kết thúc (Start/End Date), phân công Máy gia công (Machine) và Người phụ trách (Employee).

3. **Ghi Nhật ký Sản xuất (Production Logging - Worklogs):**
   - Khi nhân viên bắt đầu làm việc, họ sẽ báo cáo tiến độ (Bắt đầu, Tạm dừng, Hoàn thành).
   - **Nhập Worklog:** Ghi nhận ngày làm việc thực tế (Actual Date), thời gian gia công thực tế (Actual H).
   - **Cập nhật trạng thái (Status Update):** Trạng thái Job và từng công đoạn chuyển từ `PENDING` -> `IN_PROGRESS` -> `COMPLETED`. Mức độ hoàn thành (%) tự động tính toán và hiển thị trên Gantt Chart.

---

## 2. Thông tin nghiệp vụ trích xuất từ Email cho "STT-002"

Dựa vào lịch sử email liên lạc (`toanysdmail.CSV`), dưới đây là các thông tin thực tế được bóc tách:

### A. Thông tin Master Data (Khuôn, Khay, Thiết kế)
- **Tên dự án/Khay:** Khay dẫn điện (導電性トレー) STT-002.
- **Loại khay:** Khay A và Khay B (Aトレイ/Bトレイ). Ban đầu có thể là khay đơn nhưng sau đổi thành thông số A/B. Mức độ xếp chồng: 4 tầng (4段積み).
- **Thiết kế (Design Revisions):**
  - Bản vẽ cũ: `STT-002P（Q）R２`
  - Bản vẽ mới: `STT-002P（Q）_A/B` (Được yêu cầu bổ sung thêm khắc chữ màu đỏ - 赤字の刻印).
- **Khuôn (Mold):** `STT-002` là khuôn bộ (セット取り金型) dùng chung để dập cả khay A và khay B.
- **Dao cắt (Cutter):** Có bản vẽ dao cắt (抜き図面) đi kèm cho STT-002.
- **Khuôn thử nghiệm (Test Mold):** Đã làm khuôn thử nghiệm túi (ポケット試作) lần 1. Đang tiến hành chuẩn bị cho khuôn thử nghiệm lần 2 (2回目試作図).
- **Chi phí (Cost):** Phí thiết kế là 40,000 Yên (Cần xuất hóa đơn).

### B. Danh sách Nghiệp vụ/Sự kiện đã phát sinh (Business Events)
| STT | Sự kiện (Event) | Phân loại | Hành động tương ứng trên YSDMS |
|---|---|---|---|
| 1 | Yêu cầu thiết kế lại thành thông số Khay A/Khay B | Thiết kế | Tạo Design Revision mới (STT-002P(Q)_A/B) |
| 2 | Yêu cầu thêm dữ liệu xếp chồng 4 tầng | Thiết kế | Cập nhật thông số kỹ thuật của Khay |
| 3 | Yêu cầu tạo bản vẽ khuôn thử nghiệm | Thử nghiệm | Tạo Job: Chế tạo Khuôn thử nghiệm (Test Mold) |
| 4 | Bàn giao bản vẽ thử nghiệm lần 2 & Tiến hành chuẩn bị gia công pocket | Gia công | Lập kế hoạch các công đoạn CNC/Tiện cho Job thử nghiệm trên Gantt |
| 5 | Gửi bản vẽ khuôn chính thức (Set A/B) | Khuôn chính thức | Tạo Master Khuôn chính thức (STT-002) |
| 6 | Yêu cầu khắc thêm chữ đỏ lên bản vẽ | Gia công | Thêm công đoạn "Khắc chữ" (Engraving) vào Job |
| 7 | Gửi bản vẽ dao cắt | Dao cắt | Tạo Master Dao cắt & Job làm Dao cắt |
| 8 | Phát hành hóa đơn phí thiết kế 4 vạn Yên | Kế toán/Báo giá | Ghi chú phí thiết kế vào đơn hàng/Khuôn |

---

## 3. Kế hoạch nhập liệu kiểm thử (Implementation Plan)

Để kiểm chứng luồng thao tác trên hệ thống mới (NextGen), chúng ta sẽ tiến hành từng bước nhập liệu đối ứng như sau:

### [Bước 1] Khởi tạo Master Data (Phòng Thiết kế)
- Truy cập `Master Management -> Products`: Tạo 2 sản phẩm khay `STT-002-A` và `STT-002-B` với thuộc tính "Khay dẫn điện".
- Truy cập `Engineering -> Designs`: Tạo Design Project cho STT-002, upload 2 revisions: `STT-002P(Q)R2` và bản mới `STT-002P(Q)_A/B`.
- Truy cập `Master Management -> Molds`: Tạo Mold Master `STT-002`, đánh dấu là "Set Mold", liên kết với 2 khay A và B.
- Truy cập `Master Management -> Cutters`: Tạo mã dao cắt tương ứng.

### [Bước 2] Lập kế hoạch Gia công (Bảng Kế hoạch / Gantt Chart)
- Truy cập `Equipment -> Jobs` hoặc `Gantt Chart`: Tạo mới 1 Job loại `MOLD` cho khuôn STT-002.
- Thêm các công đoạn (Steps) vào Job:
  - Công đoạn 1: Phay CNC (Pocket 1)
  - Công đoạn 2: Phay CNC (Pocket 2)
  - Công đoạn 3: Khắc chữ (Theo yêu cầu email)
- Trên giao diện **Gantt Chart**, thử nghiệm tính năng vừa sửa:
  - Gán thời gian dự kiến (`予定H`).
  - Kéo dài thanh bar để gán ngày bắt đầu/kết thúc (`開始 / 終了`).
  - Phân bổ Máy móc (VD: Máy YCM, Máy FANUC) và gán hạn chót (`期限`).

### [Bước 3] Ghi Nhật ký & Cập nhật Tiến độ (Production Logging)
- Đóng vai nhân viên đứng máy: Mở chi tiết Job STT-002.
- Thêm Worklog cho Công đoạn 1: Nhập số giờ thực tế (`実績H`) và ngày làm việc (`実績日`). Đánh dấu Trạng thái là "Hoàn thành" (完了).
- Quay lại giao diện **Gantt Chart** để kiểm tra:
  - Thanh tiến độ (Progress bar) có tự động tăng lên % không.
  - Số giờ thực tế có được tổng hợp chính xác trên cột `実績H` không.
  - Cột `状態` (Trạng thái) và `期限` (Hạn chót) có hiển thị đúng màu (Xanh lá / Đỏ) không.

## User Review Required
> [!IMPORTANT]
> - Đây là kế hoạch nhập liệu dựa trên các tài liệu thực tế của dự án.
> - Kế hoạch này dùng để chạy User Acceptance Testing (UAT) đối với tính năng Gantt Chart và quản lý Khuôn.
> - Xin vui lòng xác nhận xem cách bóc tách dữ liệu từ STT-002 đã khớp với nghiệp vụ thực tế của quý công ty chưa, trước khi chúng ta tiến hành từng bước nhập liệu trên giao diện web.
