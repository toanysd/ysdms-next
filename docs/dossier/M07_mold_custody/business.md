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
- **Đã triển khai (`7/15` mục đầy đủ, `4/15` một phần):** Migration 098 (`equipment_loans`), 3 mẫu PDF chuẩn Nhật, xuất Excel khảo sát (`exportCustomerSurveyExcel`), và sửa `/maintenance` + KPI `/equipment/lifecycle` (`6,497` thiết bị) đọc `v_equipment_lifecycle_status` (`WO-MOLD-UNIFY` Commit 3 `9de2c64c`).
- **Còn thiếu (`4/15` mục + Wave 4):** (1) Đồng bộ `Wave 4` (`587` `tblMoldShipLog`, `4,686` `tblTeflonLog` có `SentDate` theo Quyết định 3.D Phương án B, và đối chiếu `209` `mold_loan_certificates`); (2) Công cụ tính phí lưu kho Fujikura `307.5¥/tháng + 3% lãi`; (3) Checklist 4 thành phần hủy khuôn SMK/Omura; (4) Cổng dập mẫu thử sau Teflon.
