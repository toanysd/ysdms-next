# Báo Cáo Hợp Nhất `新SMK注文書` (V2 - Phân Tích Nghiệp Vụ)

- **Đọc thành công:** 767 file (từ bản copy local)

## 1. Sổ Địa Chỉ (`納入先一覧表`) - Time Series

- **Tổng số mã `No.`:** 1869
- **Có lịch sử thay đổi qua thời gian:** 281 (15.0%)
*Giải pháp đề xuất đã áp dụng:* Sắp xếp theo `mtime` file, bản ghi mới nhất là bản hiện hành, các bản cũ là lịch sử. Không còn khái niệm "xung đột".

## 2. Sản Phẩm (`トレイデータ`) - Phân Lớp Trường Dữ Liệu

- **Tổng số mã `P/N`:** 5873
- **XUNG ĐỘT THẬT SỰ (Khác `材質` vật liệu hoặc `厚み` độ dày):** 153 (2.6%)
*(Tỷ lệ xung đột đã giảm cực mạnh so với 39.1% ban đầu khi loại bỏ nhiễu từ các trường vận hành).*

### ⚠️ Danh Sách Cần Review: Tương Quan Bất Thường Giữa Kích Thước (`巾`) và Cờ Xử Lý

Phát hiện **78** mã sản phẩm có sự thay đổi về chiều rộng (`巾`) luôn đi kèm với sự thay đổi của cờ xử lý bề mặt (`帯電`, `シリコン`, `塗布`). Đây có thể là Revision thiết kế khác nhau hoặc chạy trên line sản xuất đặc thù.

*Ví dụ Top 5:*

**Mã `P/N` = 1279334-1** có các combo Width ↔ Flags sau:
- `巾: 520` ↔ `帯電: 有 | シリコン: 無 | 塗布: 無` (VD file: SMK-205　167CSB-058-01E(20260820)量産-2.xlsx)
- `巾: 460` ↔ `帯電: 無 | シリコン: 有 | 塗布: 無` (VD file: SMK100  167CSS-007-01E富山(20081104)金型廃棄.xlsx)

**Mã `P/N` = 1279508-1** có các combo Width ↔ Flags sau:
- `巾: 520` ↔ `帯電: 有 | シリコン: 無 | 塗布: 無` (VD file: SMK-205　167CSB-058-01E(20260820)量産-2.xlsx)
- `巾: 435` ↔ `帯電: 無 | シリコン: 有 | 塗布: 無` (VD file: SMK100  167CSS-007-01E富山(20081104)金型廃棄.xlsx)

**Mã `P/N` = 1279508-2** có các combo Width ↔ Flags sau:
- `巾: 520` ↔ `帯電: 有 | シリコン: 無 | 塗布: 無` (VD file: SMK-205　167CSB-058-01E(20260820)量産-2.xlsx)
- `巾: 435` ↔ `帯電: 無 | シリコン: 有 | 塗布: 無` (VD file: SMK100  167CSS-007-01E富山(20081104)金型廃棄.xlsx)

**Mã `P/N` = 1279508-3** có các combo Width ↔ Flags sau:
- `巾: 520` ↔ `帯電: 有 | シリコン: 無 | 塗布: 無` (VD file: SMK-205　167CSB-058-01E(20260820)量産-2.xlsx)
- `巾: 435` ↔ `帯電: 無 | シリコン: 有 | 塗布: 無` (VD file: SMK100  167CSS-007-01E富山(20081104)金型廃棄.xlsx)

**Mã `P/N` = 1279509-1** có các combo Width ↔ Flags sau:
- `巾: 520` ↔ `帯電: 有 | シリコン: 無 | 塗布: 無` (VD file: SMK-205　167CSB-058-01E(20260820)量産-2.xlsx)
- `巾: 435` ↔ `帯電: 無 | シリコン: 有 | 塗布: 無` (VD file: SMK100  167CSS-007-01E富山(20081104)金型廃棄.xlsx)
