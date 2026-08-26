# Implementation Plan — Chuẩn Hóa Trạng Thái Duyệt Thiết Kế (`status`) & Quy Trình Thử Nghiệm ↔ Hàng Loạt

## Context & Business Process Analysis

### 1. Ý nghĩa & Thực trạng hiện tại của nhãn `APPROVED`
- **Thực trạng DB:** Hiện tại trong bảng `design_revisions`, toàn bộ dữ liệu mẫu/migrated ban đầu đều bị hardcode giá trị `status = 'APPROVED'`, dẫn đến **tất cả các phiên bản thử nghiệm** (kể cả bản thử nghiệm thất bại hoặc bản thử cũ như `TDW001DR2`) đều hiển thị nhãn xanh `APPROVED`.
- **Nghiệp vụ thực tế tại YSD:**
  - Khâu thiết kế mẫu thử (`試作ポケット`) sẽ tạo ra các bản mẫu (DR1, DR2, DR3...).
  - Mẫu thử sau khi sản xuất sẽ gửi cho Khách hàng đo thử & kiểm tra mẫu (`サンプル測定・承認`).
  - Nếu mẫu thử **không đạt** (VD: DR2) ➔ Trạng thái phải là `REJECTED` (🔴 不採用 / Không đạt) hoặc `SUPERSEDED` (⚪ 舊版 / Đã thay thế).
  - Chỉ khi mẫu thử **đạt OK** (VD: DR3) ➔ Trạng thái mới là `APPROVED` (🟢 承認済). Lúc này công ty mới tiến hành thiết kế khuôn chính thức (`本型` / `TDW001R3`) kế thừa từ DR3.

---

## Giải Pháp Đề Xuất (System & Data Remediation)

### 1. Phân Loại Trạng Thái Duyệt Bắt Buộc (`status` Enum)

| Status Code | Tiêu đề hiển thị (JA / VI) | Ý nghĩa nghiệp vụ | Badge Style |
|---|---|---|---|
| `APPROVED` | **🟢 承認済** (Đã duyệt) | Mẫu thử / Thiết kế đã được KH duyệt thành công | Badge thành công (`badge--success` / Teal) |
| `PENDING_APPROVAL` | **🟡 承認待ち** (Chờ duyệt) | Mẫu thử mới làm, đang chờ KH đo đạc & xác nhận | Badge cảnh báo (`badge--warning` / Orange) |
| `REJECTED` | **🔴 不採用** (Không duyệt) | Mẫu thử bị từ chối / không đạt, phải làm lại | Badge lỗi (`badge--error` / Red) |
| `SUPERSEDED` | **⚪ 舊版** (Đã thay thế) | Bản thử nghiệm cũ đã bị thay thế bởi bản thử nghiệm mới | Badge trung tính (`badge--neutral` / Gray) |

### 2. Cập Nhật Dữ Liệu Thực Tế (`TDW-001` Remediation)
- **`TDW001R3`** (`MASS_PRODUCTION`): Giữ `status = 'APPROVED'` (Khuôn chính đã duyệt sản xuất).
- **`TDW001DR3`** (`PROTOTYPE_POCKET`): Giữ `status = 'APPROVED'` (Mẫu thử thành công, là bản cha `parent_design_id` của `TDW001R3`).
- **`TDW001DR2`** (`PROTOTYPE_POCKET`): Cập nhật `status = 'SUPERSEDED'` (hoặc `REJECTED`), thể hiện đây là bản thử nghiệm cũ không được chọn lên khuôn chính.

### 3. Logic Suy Luận Thông Minh Trên Giao Diện (Smart Status Inference)
Nếu bản thiết kế là `試作` (Prototype) mà **không có bản khuôn chính nào trỏ `parent_design_id` đến nó** và `status === 'APPROVED'` (dữ liệu cũ chưa sửa):
-> Giao diện hiển thị nhãn **`⚪ 舊版`** hoặc **`🔴 不採用`** thay vì hiển thị nhãn `APPROVED`, tránh gây hiểu nhầm cho người dùng.

---

## User Review Required

> [!IMPORTANT]
> **Câu hỏi xác nhận từ người dùng:**
> 1. Bạn muốn đối với các bản thử nghiệm cũ không lên hàng loạt (như `TDW001DR2`), nhãn trạng thái hiển thị nên là **`⚪ 舊版` (Đã thay thế)** hay **`🔴 不採用` (Không duyệt/Thất bại)**?
> 2. Có cần thêm chức năng cho phép Kỹ sư / Sale đổi nhanh trạng thái Duyệt thiết kế (`Status Selector`) ngay trên khối Technical Specs không?

---

## Proposed Changes

### Database & Utilities

#### [UPDATE] DB Data Script (`scripts/remediate_design_status.mjs`)
Script cập nhật lại trạng thái `status` chính xác cho các bản thiết kế cũ.

#### [MODIFY] [moldNaming.ts](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/lib/utils/moldNaming.ts)
Thêm helper `getEffectiveDesignStatus(revision, allRevs)` để tự động suy luận trạng thái chuẩn khi hiển thị.

#### [MODIFY] [TabOverview.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/product-center/[id]/_components/TabOverview.tsx)
Cập nhật hiển thị badge trạng thái chuẩn (`🟢 承認済`, `🟡 承認待ち`, `🔴 不採用`, `⚪ 舊版`) trong sub-sidebar và khối thông số thiết kế.

---

## Verification Plan

### Manual Verification
- Mở sản phẩm `TDW-001`.
- Kiểm tra danh sách phiên bản thiết kế:
  - `TDW001R3`: `🟢 承認済`
  - `TDW001DR3`: `🟢 承認済` (Thử nghiệm thành công)
  - `TDW001DR2`: `⚪ 舊版` / `🔴 不採用` (Bản thử nghiệm không lên hàng loạt)
- Kiểm tra biên dịch TypeScript `npx tsc --noEmit` -> 0 errors.
