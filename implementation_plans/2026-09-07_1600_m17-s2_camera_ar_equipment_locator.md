# Implementation Plan — Milestone 17 Sprint 2: Camera AR Equipment Locator & Scan-to-Move

Triển khai Phân hệ **Camera AR Equipment Locator & Scan-to-Move** cho Khuôn & Thiết bị theo **Chỉ thị #025** tiếp nối thành công của Sprint M17-S1 (In ấn tem mã QR).

---

## 1. User Review Required

> [!IMPORTANT]
> - **Zero DB Migration:** M17-S2 thuần Front-end và Server Action mở rộng, khai thác toàn bộ dữ liệu đã chuẩn hóa từ Migration 096 (12 Zones, 90 Kệ, 380 Tầng, 4,761 Thiết bị) cùng bảng `equipment`, `rack_layers`, `racks`, `asset_location_logs`.
> - **Thư viện Quét QR Chuẩn: `jsQR`:**
>   - Sử dụng `jsQR` + HTML5 `<canvas>` + `navigator.mediaDevices.getUserMedia` thay vì thư viện wrapper cồng kềnh `html5-qrcode`.
>   - Đảm bảo 100% khả năng kiểm soát luồng camera, tối ưu hóa pin và hiệu năng CPU trên thiết bị di động/tablet xưởng (12–15 fps decoding loop trên nền 60 fps camera stream).
> - **Kiến trúc Multi-Region 6 Vùng (Matrix HUD Grid):**
>   - Khung hình camera được phân bổ theo ma trận 6 vùng trực quan (2 cột × 3 hàng tương ứng với các ô tầng giá kệ xưởng).
>   - Tọa độ quét trả về từ `jsQR` (`topLeftCorner`, `topRightCorner`, `bottomRightCorner`, `bottomLeftCorner`) được ánh xạ tức thì vào 1 trong 6 vùng để định vị không gian vật lý của thiết bị trên kệ.
> - **Visual Locator AR Overlay:**
>   - Vẽ đa giác bounding box động viền neon teal bám theo con tem QR trong thời gian thực.
>   - Hiển thị AR Floating Pin/Card ngay trên mã QR: Loại thiết bị (`[金型]`, `[抜型]`, `[PLUG]`...), Mã thiết bị (Bold mono), Tên sản phẩm, Tầng kệ hiện tại (`MR-01-L2`).
>   - Âm thanh phản hồi trực tiếp (Web Audio API Synthesizer 880Hz/1760Hz double-beep + rung haptic `navigator.vibrate(50)`).
> - **Chế độ Tìm Kiếm / Định Vị (Locate Mode):**
>   - Nhập/chọn mã khuôn cần tìm (hỗ trợ query param `?find=CODE`).
>   - Khi camera lướt qua đúng thiết bị mục tiêu, AR Overlay lập tức đổi sang viền ngọc lục bảo phát sáng (Emerald Glow), âm báo đặc biệt và huy hiệu `MATCH FOUND / 検出完了`.
> - **Quy trình Scan-to-Move Siêu Tốc trong `LocationMoveModal`:**
>   - Tích hợp nút `Scan QR Tầng Kệ` ngay cạnh bộ chọn tầng kệ trong modal.
>   - Công nhân chỉ cần quét tem tầng kệ (VD: `MR-01-L2`), hệ thống tự động nhận diện Zone, Rack, Layer và điền tức thì vào form, giảm thời gian thao tác từ 15 giây xuống 1 giây.

---

## 2. Proposed Changes & Architecture

### Dependencies & Setup
#### `package.json`
- Cài đặt `jsqr` và `@types/jsqr`.

---

### Core Scanner Components & AR Overlay

#### [NEW] `src/components/equipment/qr/CameraARScanner.tsx`
- Engine quét Camera và AR Overlay lõi:
  - Quản lý `MediaStream` qua `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })`.
  - Hỗ trợ đổi camera trước/sau (`facingMode`) và bật/tắt đèn Flash/Torch (đối với thiết bị hỗ trợ `torch: true`).
  - Vòng lặp `requestAnimationFrame` kết hợp throttle (~70ms) để giải mã QR bằng `jsQR(imageData.data, width, height)`.
  - Canvas AR Renderer vẽ bounding polygon neon và tính toán tâm điểm `(cx, cy)` để xác định vùng trong ma trận 6 ô.
  - Bộ phát âm thanh Web Audio API (không cần tải file mp3 bên ngoài).

#### [NEW] `src/components/equipment/qr/ScannerAROverlay.tsx`
- Lớp giao diện HUD & AR Card:
  - Hiển thị khung ngắm thông minh với lưới 6 vùng (tùy chọn bật/tắt Grid).
  - AR Floating Badge neo ngay phía trên con tem:
    - Loại thiết bị (Badge màu chuẩn).
    - Mã thiết bị & Tên khuôn/sản phẩm.
    - Vị trí hiện tại (Tầng kệ `MR-01-L2`).
  - Drawer chi tiết thiết bị trượt lên từ đáy màn hình khi quét thành công:
    - Nút 📍 **"Chuyển vị trí (Scan-to-Move)"** $\rightarrow$ Kích hoạt `LocationMoveModal`.
    - Nút 👁️ **"Xem chi tiết"** $\rightarrow$ Điều hướng `/equipment/molds/[id]`.
    - Nút 🔄 **"Quét tiếp"** $\rightarrow$ Tiếp tục quét tức thì.
  - Chế độ Target Mode (Tìm kiếm mục tiêu):
    - Khung tìm kiếm ở đỉnh màn hình: Chọn hoặc nhập mã khuôn cần tìm.
    - Highlight đặc biệt khi camera quét trúng mục tiêu.

#### [NEW] `src/components/equipment/qr/MiniLayerQRScannerModal.tsx`
- Modal quét QR nhanh thu nhỏ chuyên dụng cho thao tác gán tầng kệ:
  - Khung ngắm camera gọn nhẹ tối ưu cho tablet cầm tay.
  - Tự động nhận diện mã tầng kệ dạng `{ZONE}-{NN}-L{N}` (như `MR-01-L2`) hoặc mã Kệ.
  - Tự động đóng modal và truyền kết quả về `LocationMoveModal`.

---

### Integration into Existing Views & Modals

#### [MODIFY] `src/app/equipment/locations/_components/LocationMoveModal.tsx`
- Bổ sung nút **`📷 Scan QR Tầng Kệ`** cạnh dropdown chọn tầng kệ (`selectLayer`).
- Bấm nút mở `MiniLayerQRScannerModal`:
  - Khi quét được tem kệ (VD: `MR-01-L2`):
  - Tự động tìm kiếm trong `lookups.racks` và mảng `layers` tương ứng.
  - Tự động gán `selectedZone`, `selectedRackId`, `selectedLayerId`.
  - Hiển thị thông báo thành công xanh lá "Đã nhận diện tầng: MR-01-L2".

#### [MODIFY] `src/app/equipment/scan/page.tsx`
- Thay thế toàn bộ code stub placeholder tạm thời bằng giao diện Phân hệ Camera AR Scanner hoàn chỉnh:
  - Tích hợp `CameraARScanner` với đầy đủ tính năng: Free Scan, Find/Locate Mode, 6-Zone HUD.
  - Nút bấm chuyển nhanh về danh sách vị trí `/equipment/locations`.
  - Tích hợp `LocationMoveModal` ngay trên trang scan để công nhân có thể scan khuôn rồi chuyển kệ ngay tại chỗ mà không cần chuyển trang.

#### [MODIFY] `src/app/equipment/locations/actions.ts`
- Bổ sung Server Action `resolveScannedQRCode(payload: string)`:
  - Tự động bóc tách tiền tố: `{TypePrefix}-{equipment_code}` (như `M-ARK001-4`), URL Web (`/equipment/molds/{uuid}`), UUID hoặc mã tầng kệ (`MR-01-L2`).
  - Trả về thông tin chi tiết thiết bị: mã, tên, loại, trạng thái, tầng kệ hiện tại, công ty sở hữu, công ty quản lý.

#### [MODIFY] `src/components/layout/Sidebar.tsx`
- Thêm mục menu **`ARスキャナー / Quét QR AR`** (`/equipment/scan`) trong nhóm Thiết bị (`sections.equipment`, `id: 'd3'`).
- Icon: `ScanLine` (hoặc `QrCode`).

#### [MODIFY] `messages/ja.json` & `messages/vi.json`
- Bổ sung nhóm dịch:
  - `Navigation.items.scan`: `"ARスキャナー"` / `"Quét QR AR"`.
  - `EquipmentLocations.scanner`: Các nhãn cho HUD 6 vùng, đèn flash, đổi camera, AR Card, Target Mode, lỗi cấp quyền camera.

---

## 3. Verification Plan

### Automated Checks
- Cài đặt thư viện: `npm install jsqr @types/jsqr`
- Kiểm tra biên dịch TypeScript: `npx tsc --noEmit` $\rightarrow$ Bắt buộc **0 errors**.
- Kiểm tra đồng bộ đa ngôn ngữ: `node scripts/check_translations.mjs` $\rightarrow$ Bắt buộc **0 missing keys**.
- Quét mã song ngữ hardcode: `node scripts/find_hardcoded_bilingual.mjs` $\rightarrow$ Clean.

### Manual Verification Flow
1. **Kiểm tra Sidebar & Routing:**
   - Mở thanh điều hướng Sidebar $\rightarrow$ Xác nhận xuất hiện mục `ARスキャナー` với icon đẹp mắt.
   - Bấm vào link $\rightarrow$ Điều hướng mượt mà đến `/equipment/scan`.
2. **Kiểm tra Camera AR Scanner (`/equipment/scan`):**
   - Khởi động camera trên thiết bị (cho phép quyền truy cập camera).
   - Kiểm tra các nút điều khiển: Bật/Tắt Flash (trên mobile), Đổi camera trước/sau, Bật/Tắt Lưới 6 vùng HUD.
   - Thử nghiệm quét tem mã QR M17-S1 (định dạng `M-ARK001-4` hoặc Web URL):
     - Xác nhận đa giác bounding box bám theo mã QR trên màn hình.
     - Xác nhận âm thanh phát ra (beep).
     - Xác nhận AR Card hiển thị đúng mã thiết bị, tên khuôn, và vị trí tầng kệ hiện tại (`MR-01-L2`).
3. **Kiểm tra Chế độ Tìm Kiếm (Find/Locate Mode):**
   - Nhập mã khuôn cần tìm vào ô tìm kiếm trên đỉnh màn hình (hoặc vào qua URL `?find=ARK001`).
   - Hướng camera vào nhiều mã khác nhau: Mã không trùng hiện viền mờ bình thường, mã trùng mục tiêu phát sáng xanh ngọc lục bảo và hiện nhãn `MATCH FOUND`.
4. **Kiểm tra Scan-to-Move trong `LocationMoveModal`:**
   - Mở modal chuyển kệ từ nút bấm trên AR Card hoặc từ bảng vị trí.
   - Bấm `Scan QR Tầng Kệ` $\rightarrow$ Quét mã tầng kệ `MR-01-L2`.
   - Xác nhận dropdown Zone, Rack và Layer tự động nhảy sang đúng tầng kệ được quét mà không cần chọn tay.
   - Bấm Lưu di chuyển $\rightarrow$ Xác nhận dữ liệu ghi nhận thành công vào `asset_location_logs` và cập nhật `equipment.current_rack_layer_id`.
