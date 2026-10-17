# 🛡️ M07 — Lưu Giữ, Mượn Trả, Kiểm Kê, Phí Lưu Kho, Teflon & Bảo Trì Khuôn (`M07_mold_custody/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 181 Threads / 1,149 Emails & `MOLD_CUSTODY_BUSINESS_SPEC.md`)
- **Ranh giới pháp lý (`下請法` & `固定資産会計基準`):**
  1. `CUSTOMER_LOAN` (`金型借用書兼預り証`): Khách giao khuôn cho YSD giữ. Phải chụp 2 ảnh (`photo_overall_url` kèm thước dây `メジャー` + Biển Placard $L \times W \times H, kg$ cho **Shin-Ei Hitec / Transtron**; `photo_nameplate_url` mác khắc), đóng 2 dấu (`角印` + `丸印`), gửi PDF và bưu điện bản gốc.
  2. `RETURN_TO_CUSTOMER` (`金型返却書`): Hoàn trả khuôn trên **Pallet chuẩn $1,100 \times 1,100\text{ mm}$**, khai báo chiều cao tổng xe cẩu, bắt buộc quét nhãn **QR Code** (không có QR cấm trả — **Panasonic Shirakawa**). Với hủy tài sản (**Omura Giken / SMK**), gom trả đủ: Khuôn + Phụ tùng + Bản vẽ + Biên nhận gốc gửi `着払い`.
  3. `OUTSOURCE_PROCESSING` (`外注加工出し`): Xuất khuôn đi phủ Teflon / mạ crôm (**Minebea** `XMN0P0-0020`). Khi khuôn về (`テフロン戻り`), phải dập thử 24–60 tấm trước khi chạy hàng loạt.
  4. **Cấm tuyệt đối:** Không dùng phiếu mượn trả cho điều chuyển nội bộ giữa các xưởng YSD (`INTERNAL_TRANSFER`: Kawasaki <-> Yashio <-> Saitama).
- **Kiểm kê T10–T2 (`棚卸` JAE/Canon/Panasonic/Rhythm/A&T):** Xuất Excel cột `G (貸出書), H (金型有無), I (保管場所), J/K (非稼働 >=3年)`.
- **Khuôn ngưng $\ge 3$ năm (`非稼働金型`) & Phí lưu kho (`型保管料` Fujikura):** Đơn giá **307.5 JPY/khuôn/tháng** + **3% lãi phạt chậm trả** niên độ cũ (`source_data/金型保管料(20250704)`).

## 2. Cấu Trúc Route & Component Chuẩn
- **Routes:** `/equipment/loans`, `/equipment/loans/[id]`, `/equipment/lifecycle`, `/maintenance`, `/maintenance/log`.
- **PDF Templates:** `MoldLoanPDFDocument.tsx`, `OutsourceProcessingPDFDocument.tsx`, `PanasonicPalletReturnPDFDocument.tsx`.

## 3. Trạng Thái Hiện Tại & Hạng Mục Còn Thiếu (`Backlog`)
- **Đã triển khai (`9/15` mục đầy đủ, `4/15` một phần):**
  - Migration 098 (`equipment_loans`), 3 mẫu PDF chuẩn Nhật, xuất Excel khảo sát (`exportCustomerSurveyExcel`), sửa `/maintenance` + KPI `/equipment/lifecycle` (`6,525` thiết bị) đọc `v_equipment_lifecycle_status`.
  - Hoàn tất đồng bộ lịch sử `WO-MOLD-SYNC-WAVE3` (`2,829` dòng mới vào `equipment_history = 1,896`, `equipment_ship_logs = 356`, `mold_maintenance = 190`, `mold_name_history = 35`, `equipment_status_logs = 352`).
  - **Hoàn tất `WO-EQUIP-OPS-WAVE3-WIRING` (`2026-10-17 JST`):** Liên thông 5 module vận hành trong Modal Chi tiết Thiết bị (`src/app/equipment/_components/detail-modal/modules/`) trực tiếp vào các bảng SSOT của Wave 3, hiển thị đầy đủ **`2,386` dòng lịch sử** trên UI:
    1. `TeflonCoatingModule.tsx`: Đọc/ghi trực tiếp `public.mold_maintenance` (`maintenance_type = 'TEFLON_COATING'`, `190` dòng) + tự động ghi `equipment_ship_logs` & `equipment_status_logs` ở Bước 3 (Xuất đi mạ) và Bước 4 (Nhận khuôn về).
    2. `TransportModule.tsx`: Đọc/ghi `public.equipment_ship_logs` (`356` dòng) + `equipment_history` (`SHIP_OUT`, `SHIP_IN`, `SHIP_TRANSFER`, `TRANSFER`) và áp dụng Golden Rule tự động cập nhật `usage_status` (`IN`/`OUT`).
    3. `LocationMoveModule.tsx`: Đọc/ghi `public.equipment_history` với `action_type IN ('RELOCATE', 'LOCATION_CHANGE')` (`1,488` dòng), hiển thị rõ `📍 from_location ➔ to_location`.
    4. `CheckInOutModule.tsx` & `InventoryAuditModule.tsx`: Đọc/ghi `public.equipment_status_logs` (`352` dòng) + `equipment_history` (`STATUS_IN`, `STATUS_OUT`, `STATUS_DISPOSED`, `STATUS_RETURNED`, `STATUS_AUDIT`) và bổ sung nút **Stamp Kiểm kê 1 chạm (`🔍 棚卸 (AUDIT)`)**.
    5. `PhotoManagerModule.tsx`: Bổ sung **Privacy Blur Shield mặc định** (`filter: blur(12px)`, `:hover` xem rõ, nút/checkbox `Toggle Blur`, và mở Popup Lightbox xem rõ chi tiết theo Quy tắc Toàn cục số 3).
- **Còn thiếu (`2/15` mục UI/Nghiệp vụ):** (1) Công cụ tính phí lưu kho Fujikura `307.5¥/tháng + 3% lãi`; (2) Checklist 4 thành phần hủy khuôn SMK/Omura & đối chiếu `209` `mold_loan_certificates`.
