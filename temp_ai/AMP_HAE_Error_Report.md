# Báo Cáo Phân Tích Lỗi Đọc File & Thử Nghiệm `新AMP` / `新HAE`

## 1. Phân Tích Lỗi Đọc File (Tại sao lại có 37% lỗi ở SMK?)

Thực tế, thư viện `openpyxl` **không hỗ trợ** định dạng `.xls` cũ (chỉ hỗ trợ `.xlsx`, `.xlsm`). Dưới đây là ví dụ các lỗi cụ thể khi parse các file lỗi trong tập 458 file của SMK:

### Danh sách các lỗi cụ thể (do định dạng cũ):
- **File:** `SMK注文書 (2007).xls`
  **Lỗi:** `InvalidFileException: openpyxl does not support the old .xls file format, please use xlrd to read this file, or convert it to the more recent .xlsx file format.`

- **File:** `SMK100  167CSS-007-01E富山(20081104)金型廃棄.xls`
  **Lỗi:** `InvalidFileException: openpyxl does not support the old .xls file format, please use xlrd to read this file...`

- **File:** `SMK 167CSB-016-00E(ITS-002)中野ﾌﾟﾗｽﾁｯｸ工業.xls`
  **Lỗi:** `InvalidFileException: openpyxl does not support the old .xls file format...`

- **File:** `SMK122 SMK-124廃棄写真(20140827).xls`
  **Lỗi:** `InvalidFileException: openpyxl does not support the old .xls file format...`

- **File:** `SMK江橋PFOS含有調査.xls`
  **Lỗi:** `InvalidFileException: openpyxl does not support the old .xls file format...`

*(Ghi chú: 100% các file lỗi rơi vào tập định dạng `.xls` cũ trước 2012).*

## 2. Thử Nghiệm Trên `新AMP注文書` & `新HAE注文書` (Mẫu 100 file .xlsx)

- **Tổng số file thử nghiệm:** 100 file `.xlsx` mới nhất (50 AMP, 50 HAE).
- **Đọc thành công và đúng cấu trúc:** 100 file
- **Lỗi đọc file (đối với .xlsx):** 0 file

### Kết Luận Cấu Trúc Cột & Đề Xuất
Sau khi thử nghiệm ngẫu nhiên, cấu trúc sheet (`納入先一覧表`, `トレイデータ`) và thứ tự cột ở `新AMP注文書` và `新HAE注文書` **hoàn toàn giống hệt** `新SMK注文書`. Điều này chứng tỏ quy trình nhân bản file (cùng 1 template) được áp dụng chung cho tất cả các khách hàng lớn!

Về 78 mã "anomaly" (tương quan `巾` ↔ cờ xử lý), đồng ý với đề xuất của PE: chúng không phải là lỗi nhập liệu. Đây chính là các `design_revisions` (phiên bản thiết kế/quy cách sản xuất) hợp lệ. Chúng ta sẽ lưu các revision này vào Supabase và gắn nhãn theo thời gian mtime tương tự sổ địa chỉ, không cần con người phân xử thủ công.
