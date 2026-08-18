# ADR-003: Tách Job theo Equipment Type & Sửa Filter Lịch Sản Xuất

- **Ngày:** 2026-08-18
- **Trạng thái:** APPROVED
- **Người quyết định:** Anh Thoan (Product Owner)

## Bối cảnh

Job OOT-046 (Legacy) gắn với 1 khuôn vật lý nhưng chứa step cho nhiều loại thiết bị (MOLD, PLUG, CUTTER, STACKING). Khi thêm hạng mục スタッキング mới (deadline 8/17), job không hiển thị trên lịch sản xuất vì bộ lọc chỉ kiểm tra `jobs.deadline/mold_deadline/start_date/ship_date`, không xét `job_steps.deadline`.

## Quyết định

### 1. Sửa bộ lọc lịch sản xuất (Phase A)
- Bổ sung 2-Pass Query: lấy `job_ids` từ `job_steps` có `deadline` trong phạm vi lọc → merge vào filter OR chính.
- **KHÔNG cập nhật `jobs.deadline`** khi thêm step mới — giữ nguyên deadline gốc của job (liên quan đến kỳ hạn xuất hàng, thay đổi sẽ gây sai lệch).

### 2. Tạo Job mới tách rời cho thiết bị khác loại (Phase B)
- Khi cần thêm thiết bị mới (STACKING, PLUG, CUTTER...) cho sản phẩm đã có job cũ → Tạo Job mới riêng biệt gắn với Equipment tương ứng.
- KHÔNG nhồi step thiết bị khác loại vào Job của khuôn.
- Tuân thủ kiến trúc Option C: **1 Job = 1 Equipment**.

### 3. Quan hệ dữ liệu chuẩn mực
```
Equipment: Khuôn OOT-046 (MOLD, sở hữu KH)
Equipment: Stacking STK-xxx (STACKING, sở hữu YSD)
  ↕ equipment_assignments (SET_MEMBER)

Job cũ: equipment_id → Khuôn OOT-046
Job mới: equipment_id → Stacking STK-xxx
```

### 4. Gợi ý thiết bị dùng chung
- Hệ thống tự động gợi ý thiết bị đã có (theo kích thước), người dùng xác nhận trước khi tạo mới.

## Tương thích ngược
- ~1,183 jobs Legacy (multi-equipment steps, `work_order_id = NULL`) giữ nguyên, không tách.
- Sửa filter đảm bảo chúng hiển thị đúng khi step có deadline trong phạm vi.
- Job mới từ nay tuân thủ Option C (1 Job = 1 Equipment).

## Hệ quả
- Filter lịch sản xuất cần thêm 1 sub-query vào `job_steps`.
- UI "Thêm công đoạn" cần dialog hỏi người dùng khi track khác loại thiết bị của Job.
- Cần action `createEquipmentJob()` cho luồng tạo Job tách rời.
