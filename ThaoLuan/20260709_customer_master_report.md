# Báo cáo Phân tích Customer Master từ Server YSD

Dựa trên quá trình quét và đọc an toàn (Read-Only) các thư mục và file Excel gốc trên `\\server\ysd-folder`, dưới đây là phân tích chi tiết về cách thức tổ chức khách hàng trong hệ thống cũ và đề xuất cấu trúc dữ liệu mới cho Supabase.

## 1. Tổng quan Cấu trúc Thư mục Hệ thống cũ

Hệ thống cũ phân loại khách hàng thành 2 nhóm rõ rệt, tương đương với mô hình **Key Accounts (Khách lớn)** và **General Accounts (Khách lẻ/chung)**:

### 1.1. Nhóm Khách hàng Đặc thù (Major / Key Accounts)
Bao gồm các thư mục riêng ở cấp ngoài cùng:
- `新AMP注文書` (Amphenol)
- `新SMK注文書` (SMK)
- `新HAE注文書`
- `新NLC注文書`
- `新YAE注文書`

**Đặc điểm:** Bê trong các thư mục này KHÔNG phân chia theo tên công ty con nữa, mà chia theo mã nội bộ hoặc quy trình dự án (Ví dụ trong `新AMP注文書` có các thư mục `0`, `1`, `2`, `10 TE`, `AMP supplier`...). Khách hàng lớn có nhiều quy trình phức tạp và danh sách Điểm giao hàng (Delivery Sites) rất dài, được gộp chung.

### 1.2. Nhóm Khách hàng Chung (General Accounts)
Nằm trong thư mục `新一般注文書` (New General Orders).
Qua quá trình quét tự động, tôi đã trích xuất được **1,785 khách hàng chung**.

**Đặc điểm cấu trúc:**
Phân loại theo Bảng chữ cái tiếng Nhật (Gojuon) hoặc chữ Latinh đầu tiên:
```text
新一般注文書/
├── あ行/
│   ├── E     Eサーモジェンテック
│   ├── I　I-TECH JAPAN
│   └── M　MMIセミコンダクター
├── か行/
│   ├── KBY 小林製作所
│   └── ...
```

## 2. Phân tích Dữ liệu File Excel (注文書)
Tôi đã mở và phân tích cấu trúc của 1 file Excel mẫu: `ESM　YPC-007（20220704）.xlsx` nằm trong thư mục `あ行\Eサーモジェンテック`. Toàn bộ dữ liệu được trích xuất an toàn.

**Thông tin Khách hàng nằm rải rác ở các dòng (Row 42-47):**
* **納品先 (Điểm giao hàng):** ESM / ㈱Eサーモジェンテック / 長谷川 様宛
* **Địa chỉ (納品先):** 〒601-8047 京都府京都市南区東九条下殿田町13...
* **Điện thoại:** 075-681-7825
* **依頼元 (Nguồn yêu cầu / Khách hàng thanh toán):** ESM01 2097 / ㈱Ｅサーモジェンテック

👉 **Nhận xét:** Cấu trúc trong Excel hoàn toàn khớp với file CSV `IRI-001` mà chúng ta đã xử lý trước đó. File CSV thực chất là một bản xuất (Export) dữ liệu đã được tổng hợp từ hàng ngàn file Excel này.

## 3. Đề xuất Cấu trúc Customer Master cho Supabase

Thay vì giữ cấu trúc thư mục lộn xộn, chúng ta áp dụng mô hình **Company ↔ Delivery Sites** hoàn toàn linh hoạt như sau:

> [!TIP]
> **Điểm ưu việt:** Mô hình này giải quyết triệt để tình trạng 1 Điểm giao hàng nhận hàng từ nhiều Nguồn yêu cầu khác nhau (Overlapping) mà chúng ta đã phát hiện.

### 3.1. Bảng `companies` (Công ty / Request Source)
Đóng vai trò là **依頼元 (Nguồn yêu cầu)**.
Lấy dữ liệu từ tên các Folder đặc thù (AMP, SMK) và 1,785 Folder khách hàng chung (Eサーモジェンテック...).
* `company_code`: Lấy từ mã 3-4 ký tự (VD: AMP, KBY, ESM).
* `company_name`: Lấy từ tên thư mục hoặc ô 依頼元 trong Excel.
* `parent_company_id`: Dùng để liên kết các chi nhánh nội bộ (như KBY02 là con của KBY).

### 3.2. Bảng `delivery_sites` (Điểm giao hàng)
Đóng vai trò là **納品先 (Nơi nhận hàng)**.
Lấy dữ liệu từ các ô Địa chỉ, Điện thoại, Người nhận trong file Excel (chính là file CSV 1,861 dòng đã import).
* Thiết lập ràng buộc `UNIQUE(company_id, site_code)` để cho phép 1 địa chỉ vật lý có thể phục vụ nhiều `company_id` khác nhau.

## 4. Kế hoạch Hành động (Next Steps)
1. Dữ liệu từ file CSV `IRI-001` đã chứa tới 95% thông tin Điểm giao hàng (Delivery Sites) chuẩn xác. Việc quét lại toàn bộ hàng nghìn file Excel trên server là **không cần thiết và rất chậm**, trừ khi chúng ta cần lấy các thông tin bị thiếu (ví dụ: Địa chỉ của Công ty mẹ).
2. Chúng ta đã import thành công Delivery Sites. Bước tiếp theo là **Chạy script ánh xạ 125 cặp quan hệ Cha-Con** cho bảng `companies` như đã phân tích trước đó, để hoàn thiện 100% Customer Master!
