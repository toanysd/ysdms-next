# BÁO CÁO NGHIỆM THU CUỐI CÙNG PHASE R2 (ATOMIC RPC & SESSION GUARD)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Thời gian thực hiện:** 2026-08-20 11:41:30 (JST)
- **Môi trường:** Live Supabase Database (`iirezrszalmecsslbruo`)
- **Trạng thái:** ✅ **ĐÃ THAY THẾ HOÀN TOÀN CƠ CHẾ 2S WINDOW BẰNG ATOMIC RPC + SESSION GUARD TRIGGER — ALL 3 SCENARIOS PASS 100%**

---

## 1. TỔNG QUAN THAY ĐỔI KIẾN TRÚC ĐÃ TRIỂN KHAI

Theo chỉ thị của PE, AN đã dứt điểm thay thế cơ chế time-window heuristic bằng kiến trúc **Atomic RPC + Session Guard Flag**:

1. **Migration DB (`20260820120000_r2b_atomic_rpc_and_guard_trigger.sql`):**
   - Tạo hàm `public.fn_transition_product_lifecycle(p_product_id, p_to_status, p_trigger_event, p_reference_table, p_reference_id, p_reason, p_changed_by, p_metadata)` thực thi nguyên tử trong 1 transaction, tự động bật cờ `PERFORM set_config('app.bypass_lifecycle_trigger', 'true', true)`.
   - Cập nhật Trigger `trg_product_lifecycle_audit` thành Guard kiểm tra `current_setting('app.bypass_lifecycle_trigger', true) = 'true'`. Bỏ hoàn toàn đoạn code `created_at >= now() - interval '2 seconds'`.

2. **Refactor Server Actions:**
   - [`src/app/actions/product-lifecycle.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/actions/product-lifecycle.ts): `transitionProductLifecycleAction` gọi `fn_transition_product_lifecycle` qua RPC.
   - [`src/app/actions/design-approval.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/actions/design-approval.ts): `submitDesignApprovalLogAction` gọi `fn_transition_product_lifecycle` khi duyệt bản vẽ đạt.
   - [`src/app/actions/sample-requests.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/actions/sample-requests.ts): `createSampleRequestAction` và `updateSampleStatusAction` gọi `fn_transition_product_lifecycle` khi tạo mẫu / báo kết quả `CUSTOMER_OK` / `CUSTOMER_NG`.

---

## 2. KẾT QUẢ KIỂM THỬ THỰC TẾ 3 KỊCH BẢN (SAU KHI REFACTOR)

### Kịch bản 1: Double Trigger Check (Atomic RPC Dedup)
- **Hành động:** Gọi RPC `fn_transition_product_lifecycle` với `to_status = 'PROTOTYPE'`, `trigger_event = 'DESIGN_APPROVED'`, `ref = design_approval_logs`.
- **Query kết quả thực tế:**
```json
[
  {
    "log_id": "90c339d0-0cda-4ccc-bf16-53645a048ec6",
    "product_id": "45619e4a-0d63-45c9-8d88-ccf0ebcc4420",
    "from_status": "DESIGN",
    "to_status": "PROTOTYPE",
    "trigger_event": "DESIGN_APPROVED",
    "reference_table": "design_approval_logs",
    "reference_id": "04b14c7d-97af-4cc8-993e-c330e0a06ea5",
    "changed_by": null,
    "reason": "Bản vẽ TEST-R2-VERIFY-V2-REV1 được phê duyệt (LAYOUT)",
    "created_at": "2026-08-20T02:41:16.364052+00:00"
  }
]
```
- **Đánh giá:** ✅ **PASS** — Đúng 1 dòng duy nhất, cờ session ngăn chặn trigger DB double write 100%.

---

### Kịch bản 2: NG-Loop Check (Chuyển trạng thái ngược về DESIGN qua RPC)
- **Hành động:** Cập nhật kết quả mẫu thử `CUSTOMER_NG` qua `fn_transition_product_lifecycle` với lý do `'Pocket depth -0.3mm NG, linh kiện bị cấn khi ráp thử tại nhà máy khách hàng'`.
- **Query kết quả thực tế:**
  - `products.product_lifecycle_status`: **`DESIGN`**
  - Danh sách logs:
```json
[
  {
    "log_id": "90c339d0-0cda-4ccc-bf16-53645a048ec6",
    "from_status": "DESIGN",
    "to_status": "PROTOTYPE",
    "trigger_event": "DESIGN_APPROVED",
    "reference_table": "design_approval_logs",
    "reference_id": "04b14c7d-97af-4cc8-993e-c330e0a06ea5",
    "reason": "Bản vẽ TEST-R2-VERIFY-V2-REV1 được phê duyệt (LAYOUT)",
    "created_at": "2026-08-20T02:41:16.364052+00:00"
  },
  {
    "log_id": "d623f8db-f22f-4f34-ade4-c53928ffd605",
    "from_status": "PROTOTYPE",
    "to_status": "DESIGN",
    "trigger_event": "SAMPLE_REJECTED",
    "reference_table": "sample_requests",
    "reference_id": "d082e003-5b6a-45af-944e-03c9741fa435",
    "reason": "Mẫu thử không đạt (CUSTOMER_NG): Pocket depth -0.3mm NG, linh kiện bị cấn khi ráp thử tại nhà máy khách hàng (V2 RPC)",
    "created_at": "2026-08-20T02:41:16.532453+00:00"
  }
]
```
- **Đánh giá:** ✅ **PASS** — Trạng thái sản phẩm quay về `DESIGN`, sự kiện là `SAMPLE_REJECTED`, lưu trữ toàn văn lý do NG.

---

### Kịch bản 3: Sessionless Direct Update (Trigger Guard bắt thay đổi trực tiếp)
- **Hành động:** Chạy lệnh UPDATE trực tiếp `products` ngoài RPC/Server Action:
  ```sql
  UPDATE products SET product_lifecycle_status = 'MASS_PRODUCTION' WHERE product_id = '45619e4a-0d63-45c9-8d88-ccf0ebcc4420';
  ```
- **Query kết quả thực tế:**
```json
{
  "log_id": "f4e0c680-b05c-4489-be60-cff6d94d9926",
  "product_id": "45619e4a-0d63-45c9-8d88-ccf0ebcc4420",
  "from_status": "DESIGN",
  "to_status": "MASS_PRODUCTION",
  "trigger_event": "SYSTEM_UPDATE",
  "reference_table": null,
  "changed_by": null,
  "reason": "SYSTEM: Tự động ghi nhận thay đổi trực tiếp sang MASS_PRODUCTION",
  "created_at": "2026-08-20T02:41:16.617883+00:00"
}
```
- **Đánh giá:** ✅ **PASS** — Do không có cờ `app.bypass_lifecycle_trigger`, Trigger Guard kích hoạt ngay lập tức, ghi log `SYSTEM_UPDATE` với `changed_by = null` và lý do rõ ràng.

---

## 3. KIỂM TRA MÃ NGUỒN & HỆ THỐNG
- **TypeScript:** `npx tsc --noEmit` $\rightarrow$ **0 errors**.
- **Đa ngôn ngữ i18n:** `node scripts/check_translations.mjs` $\rightarrow$ **0 missing keys**.
- **Dọn dẹp DB:** Đã xóa bản ghi kiểm thử `TEST-R2-VERIFY-V2`.

AN kính báo Trưởng dự án PE nghiệm thu đóng chính thức Phase R2 để mở **CHỈ THỊ #008 — Phase R3**.
