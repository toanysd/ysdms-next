# BÁO CÁO KẾT QUẢ LIVE REMEDIATION (Chỉ thị #031 / #033)

**Ngày thực hiện:** 2026-08-31
**Tác giả:** AN

## 1. Tóm tắt kết quả chạy LIVE
Script `remediate_orphan_equipment_live_v2.js` đã thực thi thành công trên Production Database với cơ chế Batch Insert/Update và kiểm tra Idempotency (Check exists before insert).

**Kết quả số liệu thực tế:**
- **Equipment cập nhật:** `657` (Thành công 100%, Lỗi 0). Các bản ghi đã được link đúng `design_revision_id`.
- **Design Revisions tạo mới:** `70`. (Các bản vẽ còn lại đã được script tìm thấy sẵn trong DB thông qua `design_code` và map thành công).
- **Products tạo mới:** `0`. (Toàn bộ 489 Product đích đã có sẵn trong hệ thống từ các đợt import/sync trước đó với mã `product_code` khớp hoàn toàn với `TrayCode` gốc).
- **Orphans bị giữ nguyên (Bỏ qua):** `75`. (Đúng yêu cầu không ép gán).

## 2. Xác minh tính toàn vẹn (Theo chỉ thị #034)
Query xác minh 5 thiết bị ngẫu nhiên vừa được cập nhật cho thấy liên kết chính xác 100% so với dữ liệu Access gốc:
- `M-5817` (Equipment: `KSP216R3`) -> Design: `KSP216R3` -> Product: `KSP-216` (Đúng với Access: `TrayID 5289`).
- `M-5818` (Equipment: `MDS010N01`) -> Design: `MDS010` -> Product: `MDS-010` (Đúng với Access: `TrayID 5290`).
- `M-5815` (Equipment: `KSP215R2`) -> Design: `KSP215R2` -> Product: `KSP-215` (Đúng với Access: `TrayID 5287`).

**Kết luận:** Kịch bản A là chính xác. Sản phẩm đã tồn tại hợp lệ trong hệ thống (chỉ bị thiếu liên kết thiết kế/khuôn), không có hiện tượng map sai do trùng code rác.

## 3. Danh sách 75 Equipment mồ côi (Pending Manual Review)
Dưới đây là 75 mã equipment không có `TrayID` hoặc `MoldDesignID` hợp lệ trong CSDL Access, cần được Anh Thoan review thủ công trong task backlog:
ADY030, YMT011, YSDE, SSJ013, SSJ013-2, TE50520 フィルム, レザーシート小56Φｘ33Φ, YSDH, ADY, YSDE-2, TH, V, NPC, NOKIA, SMK087, 鈴木トレイ, ブラシ小, KYM, Aタイプ, Aタイプ-2, YMT011-2, SSM, CLDS, NOKIA-2, SMK064, SNT, SMK067, 足形, YSDH-2, SSM-2, WOODBASE74C（590ｘ290）, SLK139R, SLK132, SLK134, SLK140, SLK129, SLK123, SLK136, SLK116, SLK125, SLK141, SLK133, OTP004, OTP002, OTP001, OTP005, SMK012, SMK148, SMK081, SMK095, SMK022, SMK021, SMK016, SMK018, SMK064-2, SMK077, SMK170, SMK024, SMK035, SMK063, SMK072, SMK067-2, SMK073, SMK069, SMK080, KND, JR, NPC-2, TH-2, YSDH-3, ADY-2, SSM-3, V-2, CLDS-2, TE00731
