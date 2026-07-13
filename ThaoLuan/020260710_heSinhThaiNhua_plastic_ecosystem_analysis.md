# Đánh giá Kiến trúc: Hệ Sinh Thái Quản Lý Nhựa (Plastic Ecosystem)

Báo cáo này đánh giá mức độ sẵn sàng của hệ thống `ysdms-nextgen` trước 9 yêu cầu quản trị vật liệu nhựa khắt khe nhất trong sản xuất, đồng thời đề xuất thiết kế giao diện MRP Dashboard theo tiêu chuẩn ERP quốc tế (như SAP, Odoo, Katana MRP).

---

## Phần 1: Khả năng đáp ứng 9 yêu cầu cốt lõi

### 1. Trang tổng quan (Dashboard) toàn cảnh
> *Yêu cầu: Thấy tình trạng hiện tại, nhu cầu, cảnh báo tồn kho, nhập xuất, thống kê tần suất...*
- **Đánh giá:** **ĐÁP ỨNG ĐƯỢC NGAY TRONG PHASE NÀY.**
- **Giải pháp:** Xây dựng một trang `/plastics/dashboard` đóng vai trò Control Center. Trang này sẽ sử dụng các Widget (Biểu đồ, Thẻ chỉ số) để tổng hợp dữ liệu từ `orders` (nhu cầu), `plastic_receipt_roll` (tồn kho) và `plastic_adjustment_log` (nhập xuất). 

### 2. Báo cáo thống kê tách biệt giữa các nhà xưởng
> *Yêu cầu: Tách biệt tồn kho, nhu cầu giữa Ibaraki, Sakata, Honsha...*
- **Đánh giá:** **ĐÃ SẴN SÀNG VỀ DATA.**
- **Giải pháp:** Nhờ vào bản Migration vừa chạy, mọi cuộn nhựa (`plastic_receipt_roll`) và mọi đơn hàng (`orders`) đều đã được gắn với `branch_id` / `company_id`. Báo cáo sẽ có dropdown "Chọn Xưởng" để tự động lọc (filter) toàn bộ hệ sinh thái theo từng địa điểm. Hệ thống cũng có thể phát hiện xưởng A dư, xưởng B thiếu để đề xuất **Luân chuyển nội bộ**.

### 3. Liên kết Mã chuẩn và Mã Nhà cung cấp
> *Yêu cầu: Cùng 1 mã chuẩn có nhiều nhà cung cấp, hiển thị ghi chú tự động trên chỉ thị sản xuất.*
- **Đánh giá:** **CẤU TRÚC ĐÃ CHUẨN BỊ SẴN.**
- **Giải pháp:** Hệ thống đã có bảng lõi `plastic_master` (Mã chuẩn nội bộ YSD). Cần thiết kế thêm bảng phụ `plastic_supplier_codes` (Mã quy đổi NCC) liên kết 1-N. Khi in Chỉ thị sản xuất, hệ thống sẽ tự động map từ Mã Chuẩn ra các Mã NCC tương ứng để công nhân lấy đúng vật liệu.

### 4. Thống kê theo chủng loại, màu sắc, đặc tính, phụ gia
> *Yêu cầu: Phân loại chi tiết vật liệu.*
- **Đánh giá:** **ĐÃ SẴN SÀNG VỀ DATA.**
- **Giải pháp:** Bảng `plastic_master` hiện đã chứa các trường phân loại sâu: `plastic_family` (PET, PS, PP), `plastic_subtype`, `color`, `thickness_mm` (độ dày), `width_mm` (khổ rộng). Mọi báo cáo Pivot/Biểu đồ đều có thể Group theo các tiêu chí này.

### 5. Tìm kiếm/lọc đa dạng
> *Yêu cầu: Lọc nhựa theo bất kỳ thông tin nào, chia nhóm.*
- **Đánh giá:** **ĐÁP ỨNG TOÀN DIỆN.**
- **Giải pháp:** Giao diện NextJS áp dụng kiến trúc DataTable với bộ lọc đa chiều (Multi-faceted Search). Người dùng có thể lọc kết hợp: Vật liệu = PET + Khổ = 310mm + Màu = Trong suốt + Tồn kho < 500m.

### 6. Truy vết (Traceability) lô nhựa tới sản phẩm
> *Yêu cầu: Biết sản phẩm này được sản xuất từ lô nhựa nào.*
- **Đánh giá:** **KIẾN TRÚC ĐÃ LÀM XONG.**
- **Giải pháp:** Đây là điểm mạnh nhất của hệ thống. Dòng chảy dữ liệu được khóa chặt:
  `plastic_receipt_roll` (Cuộn nhựa vật lý #123) ➔ `plastic_adjustment_log` (Nhật ký xén 50m) ➔ `work_logs` (Công nhân A chạy máy số 1 ngày 10/7) ➔ `jobs` (Lệnh sản xuất #456) ➔ `products` (Khay đựng trứng).
  👉 Hệ thống truy xuất được 2 chiều (Top-down & Bottom-up).

### 7. Cuộn nhựa định danh (Roll-level Tracking)
> *Yêu cầu: Mỗi cuộn phải có định danh, tính tồn kho theo mét/cuộn.*
- **Đánh giá:** **ĐÃ CÓ SẴN (Bảng `plastic_receipt_roll`).**
- **Giải pháp:** Hệ thống **KHÔNG** quản lý tồn kho theo kiểu "Tổng có 5000 mét". Hệ thống quản lý theo chuẩn WMS: "Kho có 10 cuộn. Cuộn 1 dài 500m, cuộn 2 dài 450m...". Mỗi cuộn có 1 `roll_barcode` duy nhất (Định danh vật lý).

### 8. Tích hợp Máy quét mã vạch tự động trừ kho
> *Yêu cầu: Quét mã vạch cuộn để trừ tồn kho, hao tổn.*
- **Đánh giá:** **THUỘC PHASE 2 (Shopfloor). Đã có nền móng Data.**
- **Giải pháp:** Khi xây dựng màn hình Tablet cho xưởng, công nhân chỉ cần cầm súng tít mã vạch cuộn nhựa, nhập số lượng sản phẩm làm ra. Hệ thống sẽ bắn API trừ trực tiếp vào `current_length_m` của đúng cuộn đó.

### 9. Báo cáo Thâm hụt & Chi phí (Material Variance)
> *Yêu cầu: Tự động tính thâm hụt thực tế so với lý thuyết, biểu đồ hao hụt theo tháng.*
- **Đánh giá:** **ĐÁP ỨNG ĐƯỢC.**
- **Giải pháp:** 
  - *Hao hụt lý thuyết*: (Số SP x Bước tiến nhựa Okuri)
  - *Hao hụt thực tế*: Tổng mét bị trừ từ các cuộn (thông qua mã vạch).
  - *Độ lệch (Variance)*: Thực tế - Lý thuyết. 
  - Nhân độ lệch này với "Đơn giá/mét", ta có biểu đồ Chi phí Thâm hụt (Scrap Cost) hàng tháng.

---

## Phần 2: Đề xuất Giao diện MRP Dashboard chuẩn ERP Quốc tế

Để quản lý một hệ sinh thái như trên, giao diện không thể chỉ là bảng tính Excel thông thường. Theo chuẩn của các ERP hiện đại (như Katana hay Odoo), trang MRP Dashboard `/plastics/mrp` sẽ được bố cục thành 3 vùng chiến lược:

### Vùng 1: Global KPIs & Health Score (Trên cùng)
Thay vì bắt người dùng tự tìm lỗi, hệ thống phải "kêu lên" ngay khi mở trang.
- **Thẻ 1: Khủng hoảng (Critical Shortages)** - Số lượng mã nhựa sẽ "thủng kho" trong 7 ngày tới. (Màu Đỏ)
- **Thẻ 2: Cảnh báo (Low Stock)** - Số lượng mã nhựa dưới mức an toàn. (Màu Vàng)
- **Thẻ 3: Mất cân đối Xưởng** - Số lượng mã nhựa đang dư ở Xưởng A nhưng thiếu ở Xưởng B (Đề xuất luân chuyển nội bộ thay vì mua mới). (Màu Xanh lơ)

### Vùng 2: Action Center / Smart Recommendations (Bên trái hoặc Khối nội bật)
Hệ thống AI/Thuật toán đề xuất trực tiếp hành động:
- 🛒 **Cần đặt mua gấp:** Mã nhựa `PET-310-CL` thiếu 5,000m cho đơn hàng của Cty ABC vào ngày 15/07. [Nút: Tạo Purchase Order]
- 🔄 **Cần luân chuyển:** Chuyển 2,000m `PS-250-BK` từ Honsha sang Ibaraki (MARUDAI) để bù đắp sản xuất ngày mai.

### Vùng 3: Timeline Matrix Grid (Chiếm 70% không gian chính)
Đây là "linh hồn" của trang MRP, hiển thị dự báo tương lai.
- **Trục Y (Hàng):** Danh sách các Mã Nhựa Chuẩn (Có thể gộp/mở rộng theo Xưởng).
- **Trục X (Cột):** Trục thời gian T+1, T+2, ... T+30 (30 ngày tới).
- **Ô dữ liệu (Cells):** Hiển thị số lượng Tồn Kho Dự Kiến (Projected Inventory).
  - *Logic:* Tồn đầu ngày + Nhập kho dự kiến (Từ NCC) - Nhu cầu Sản xuất dự kiến (Từ Đơn hàng).
  - *Màu sắc UX:* Ô nào có giá trị `< 0` lập tức tô đỏ máu. Ô nào gần cạn `< 1000m` tô vàng.
  - *Tương tác:* Click vào một ô bất kỳ sẽ mở ra Popup (Drill-down) giải thích: Tại sao ngày đó lại tụt 5,000m? (Liệt kê chính xác 3 Lệnh sản xuất nào "đốt" số nhựa đó).

---
**Kết luận:** Kiến trúc hiện tại hoàn toàn gánh vác được tầm nhìn xa của anh/chị. Với thiết kế UI MRP Matrix này, khối Kế Hoạch có thể nhìn thấy tương lai 30 ngày của kho nhựa chỉ trong vòng 3 giây lướt web.
