# Implementation Plan — Milestone 17 Sprint 1: QR Code Generation & Print

Triển khai Phân hệ **Tạo & In Mã QR Thiết Bị (Khuôn & Dao Cắt)** theo Chỉ thị #024 đã được PE phê duyệt và tinh chỉnh sát với thực tế xưởng YSD.

---

## 1. User Review Required

> [!IMPORTANT]
> - **Không thay đổi Database Schema:** M17-S1 thuần front-end, sử dụng thư viện `qrcode` (local canvas/svg renderer) và đọc dữ liệu sẵn có từ bảng `equipment` (`equipment_code`, `equipment_type`, `equipment_id`, `display_name`, `current_rack_layer_id`).
> - **Hỗ trợ 2 định dạng mã hóa (Toggle):**
>   1. `Tem dán xưởng (Mã siêu ngắn - Mặc định)`: `{TypePrefix}-{equipment_code}` (VD: `M-ARK001-4`, `C-K102`). Ít hạt ma trận, mật độ thấp, đọc cực nhạy ở cự ly 1.5–2m trên tablet.
>   2. `Tài liệu Web (URL)`: `https://{BASE_URL}/equipment/molds/{equipment_id}` (Mở trực tiếp trên smartphone khi scan tài liệu).
> - **Prefix Table bất biến:**
>   - `M`: `MOLD` (4,736 chiếc)
>   - `C`: `CUTTER_SEPARATE` & `CUTTER_INLINE` (1,731 chiếc)
>   - `P`: `PLUG` (6 chiếc)
>   - `W`: `WATER_BASE` (9 chiếc)
>   - `B`: `PRESSURE_BASE` (14 chiếc)
>   - `S`: `STACKING` (1 chiếc)
>   - `F`: `FRAME` (0 chiếc)
> - **3 kích thước tem dán:** 30×30 mm (nhỏ), 40×40 mm (tiêu chuẩn), 50×50 mm (lớn).
> - **Khổ in chuẩn A4 (Grid):** Tự động dàn trang `@media print` với viền cắt nét đứt `0.5px dotted #999` để công nhân cắt dán vào khuôn.

---

## 2. Proposed Changes

### Dependencies & Setup
#### `package.json`
- Cài đặt `qrcode` và `@types/qrcode`.

---

### New Components & Pages

#### [NEW] `src/components/equipment/QRCodeDisplay.tsx`
- Component render tem QR đơn lẻ:
  - Canvas QR code độ nét cao.
  - Prefix table bất biến (`M`, `C`, `P`, `W`, `B`, `S`, `F`).
  - Anatomy tem in:
    - QR canvas ở giữa.
    - Dòng 1 (Header): `[Loại] Mã thiết bị` (VD: `[金型] ARK001-4`, font mono bold).
    - Dòng 2 (Sub): Tên sản phẩm / khuôn (max 20 chars, truncate với `…`).
    - Dòng 3 (Location): Mã tầng kệ hiện tại (VD: `MR-01-L2`).
    - Viền: `0.5px dotted #999`.

#### [NEW] `src/components/equipment/QRCodeModal.tsx`
- Modal xem và thao tác trên tem QR đơn lẻ:
  - Toggle kích thước: 30mm / 40mm / 50mm.
  - Toggle định dạng: Tem xưởng (Ngắn) vs Tài liệu (URL).
  - 3 nút hành động:
    - 🖨️ **In tem lẻ:** Mở print dialog chuyên biệt chỉ in đúng con tem.
    - ⬇️ **Tải ảnh PNG:** Lưu file ảnh tem để gửi đối tác hoặc lưu trữ.
    - 📋 **Copy ảnh vào Clipboard:** Dùng `navigator.clipboard.write([ClipboardItem])` để paste ngay vào tài liệu/Excel.

#### [NEW] `src/components/equipment/QRBatchPrintSheet.tsx`
- Modal & Giao diện in hàng loạt A4:
  - Nhận danh sách `items` thiết bị.
  - Bộ chọn kích thước tem (30mm, 40mm, 50mm) và định dạng (Short vs URL).
  - Checkboxes tùy chọn hiển thị: Hiện mã, Hiện tên, Hiện vị trí kệ.
  - Danh sách checklist: Cho phép chọn tất cả / bỏ chọn / tích chọn từng thiết bị cần in.
  - Nút **"印刷プレビュー / In A4"**:
    - Dàn trang CSS Grid `auto-fill minmax(${size}mm, 1fr)`.
    - Định dạng in chuẩn `@page { size: A4 portrait; margin: 10mm; }`.
    - Tránh gãy trang giữa chừng (`page-break-inside: avoid;`).

#### [NEW] `src/app/equipment/scan/page.tsx`
- Route stub cho phân hệ Quét Camera (S2):
  - Hiển thị placeholder thông báo chức năng quét camera AR đang hoàn thiện cho Sprint 2.
  - Tránh lỗi 404 khi người dùng truy cập.

---

### Modifications in Existing Views

#### [MODIFY] `src/app/equipment/molds/[id]/MoldDetailHeader.tsx`
- Thêm nút bấm **`QRコード`** (icon `QrCode` từ `lucide-react`) cạnh nút Sửa / Bản sửa đổi.
- Bấm nút mở `QRCodeModal` nạp sẵn thông tin của khuôn đang xem.

#### [MODIFY] `src/app/equipment/molds/[id]/tabs/LocationTab.tsx`
- Thêm thumbnail QR (64×64px) trong thẻ "Vị trí lưu kho" (`Current Storage Location Card`).
- Bấm vào thumbnail mở `QRCodeModal` phóng to.

#### [MODIFY] `src/app/equipment/locations/[rackId]/_components/VisualShelfView.tsx`
- Thêm nút **"一括印刷 (In QR cả kệ)"** trên thanh tiêu đề của Kệ.
- Thêm nút icon mini **"In tầng này"** trên thanh tiêu đề của từng tầng kệ.
- Thêm nút icon **"QR"** trên từng thẻ thiết bị trong tầng.
- Tích hợp `QRBatchPrintSheet` và `QRCodeModal`.

#### [MODIFY] `messages/ja.json` & `messages/vi.json`
- Bổ sung nhóm dịch `EquipmentLocations.qr` cho các thao tác in, chọn kích cỡ, định dạng tem.

---

## 3. Verification Plan

### Automated Checks
- `npm install qrcode @types/qrcode`
- `npx tsc --noEmit` ➔ Bắt buộc 0 errors
- `node scripts/check_translations.mjs` ➔ Bắt buộc 0 missing keys
- `node scripts/find_hardcoded_bilingual.mjs` ➔ Clean

### Manual Verification
1. Mở `/equipment/molds/[id]`, kiểm tra nút "QRコード" trên Header và thumbnail QR trong Tab Vị trí ➔ kiểm tra in tem đơn lẻ, tải PNG, copy clipboard.
2. Mở `/equipment/locations/[rackId]`, kiểm tra nút "一括印刷" và "In tầng này" ➔ kiểm tra danh sách checklist lọc, kiểm tra preview in A4 đúng kích thước 30/40/50mm.
3. Truy cập `/equipment/scan` ➔ kiểm tra trang placeholder hiển thị mượt mà không lỗi 404.
