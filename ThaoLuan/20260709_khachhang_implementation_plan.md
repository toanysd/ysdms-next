# Phân tích và Xây dựng Customer Master từ Dữ liệu Server Gốc

Theo yêu cầu tuyệt đối bảo mật và an toàn dữ liệu, toàn bộ quá trình này sẽ chỉ thực hiện các lệnh đọc (Read-Only) để liệt kê và phân tích cấu trúc thư mục trên `\\server\ysd-folder`.

## Mục tiêu
1. Khảo sát cấu trúc phân loại khách hàng trong các thư mục `注文書` (Order Forms) khác nhau (Ví dụ: Khách hàng đặc thù như AMP, SMK vs Khách hàng chung `一般`).
2. Trích xuất danh sách tên khách hàng, mã (nếu có) từ cấu trúc cây thư mục.
3. Tổng hợp thành một Báo cáo phân tích và Xây dựng một Bảng Customer Master toàn diện.
4. Đối chiếu Bảng Customer Master này với dữ liệu Database hiện tại (`companies`, `delivery_sites`) để chuẩn bị cho giai đoạn Import.

## Đề xuất Kế hoạch (Implementation Plan)

### Bước 1: Khảo sát cấu trúc cấp cao (Top-level Folders)
- Liệt kê toàn bộ các thư mục chứa từ khóa `注文書` trong `\\server\ysd-folder`.
- **Dự kiến:** `新AMP注文書`, `新HAE注文書`, `新NLC注文書`, `新SMK注文書`, `新YAE注文書`, `新一般注文書`, `ＹＳＤ注文書`, `ﾌﾞﾘｽﾀｰ注文書`.

### Bước 2: Phân tích cấu trúc Khách hàng Đặc thù (Major Customers)
- Khảo sát bên trong các thư mục của khách lớn như `新AMP注文書` hoặc `新SMK注文書`.
- **Giả thuyết:** Với khách hàng lớn (Major), các thư mục bên trong không phải là tên khách hàng nữa, mà có thể là mã số dự án, mã sản phẩm (Ví dụ: `0`, `1`, `10 TE`), hoặc phân loại theo thời gian/dòng sản phẩm. Chúng ta cần xác định cách hệ thống cũ lưu trữ "Điểm giao hàng" hoặc "Sub-contractors" của AMP.

### Bước 3: Phân tích cấu trúc Khách hàng Chung (General Customers)
- Khảo sát bên trong thư mục `新一般注文書` (Đơn hàng chung).
- **Giả thuyết:** Thư mục này chia theo bảng chữ cái AIUEO (`あ行`, `か行`...). Bên trong các thư mục chữ cái là các thư mục tên công ty cụ thể (Ví dụ: `Eサーモジェンテック`, `MMIセミコンダクター`).
- **Thực thi:** Tôi sẽ dùng lệnh PowerShell (với mã hóa UTF-8) quét đệ quy các thư mục này để thu thập danh sách tên tất cả các khách hàng chung.

### Bước 4: Xây dựng Bảng Customer Master (Báo cáo tổng hợp)
Dựa trên dữ liệu thu thập được từ Bước 2 và 3, tôi sẽ tạo một file Báo cáo (Artifact) chứa:
- **Phân loại Nhóm Khách hàng:** Major Account (AMP, SMK...) vs General Account (Nhiều khách nhỏ).
- **Bảng Customer Master:** Tổng hợp danh sách tên khách hàng trích xuất từ thư mục (đặc biệt là khách hàng chung), đối chiếu với mã công ty nếu có thể suy luận.
- **Ánh xạ nghiệp vụ:** Phân tích cách ánh xạ cấu trúc thư mục này vào cấu trúc DB hiện tại của chúng ta (`companies` làm cha, `delivery_sites` làm con).

> [!CAUTION]
> **Cam kết an toàn:** Tất cả các lệnh tương tác với Server đều chỉ dùng `Get-ChildItem` (Liệt kê thư mục) của PowerShell. Không sử dụng lệnh Ghi, Sửa, hoặc Xóa. Không mở hoặc can thiệp nội dung file trong Server.

## Yêu cầu Phê duyệt (User Review Required)
Anh/chị vui lòng xem qua kế hoạch trên. Nếu anh/chị đồng ý với hướng tiếp cận quét danh mục thư mục để xây dựng Customer Master, hãy nhấn **Proceed / Chấp nhận** để tôi bắt đầu chạy các lệnh quét tự động và tạo báo cáo chi tiết cho anh/chị!
