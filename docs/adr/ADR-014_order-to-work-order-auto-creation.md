# ADR-014: Order to Work Order Auto-Creation Pipeline

- **Mã:** ADR-014
- **Ngày:** 2026-09-11
- **Trạng thái:** APPROVED
- **Người đề xuất:** AN (Kỹ sư triển khai)
- **Người phê duyệt:** PE (Trưởng dự án)
- **Tham chiếu:** Milestone 27 - Giai đoạn B, ADR-002, ADR-003, ADR-010, ADR-012, Migration 105

---

## 1. Bối cảnh (Context)
- Trong luồng sản xuất thực tế tại Yoshida Package, sau khi đơn hàng được chốt từ Báo giá (`quotations` $\rightarrow$ `orders`), xưởng sản xuất cần lập tức phát hành Lệnh sản xuất tổng thể (`work_orders`) để bộ phận kỹ thuật và gia công phân rã thành các chỉ thị công đoạn (`jobs` & `job_steps`) cho từng thiết bị khuôn (MOLD, CUTTER, PLUG, WATER_BASE...).
- **Khoảng trống kỹ thuật trước Milestone 27B:**
  - Tại trang chi tiết Đơn hàng `/orders/[id]`, file `src/app/orders/[id]/actions.ts` chỉ có hàm `linkWorkOrderAction(woId, orderId)` dùng để gán một WO *đã tồn tại sẵn* vào đơn hàng.
  - Hoàn toàn chưa có Server Action tự động sinh Lệnh sản xuất từ Đơn hàng đã chốt (`CONFIRMED` / `IN_PRODUCTION`).
  - Giao diện `WorkOrderLinker.tsx` chỉ cho phép tìm kiếm và gán các WO có sẵn, hoặc người dùng phải chuyển hướng sang form nhập tay `/production/work-orders/new`, làm gián đoạn trải nghiệm người dùng và tăng nguy cơ sai lệch dữ liệu thiết kế.
  - Liên kết router trong `WorkOrderLinker.tsx` trước đây trỏ nhầm sang `/equipment/jobs/${wo.wo_id}` (vốn là route chi tiết Job nhận `job_id`), gây lỗi 404 khi người dùng truy cập.
- **Yêu cầu đặt ra:** Cần một cơ chế nguyên tử (1-click) để tự động tạo Lệnh sản xuất từ Đơn hàng và tự động phát hành toàn bộ Jobs & Steps theo đúng kiến trúc thiết bị hợp nhất ADR-001, luồng 4 tầng ADR-002 và quy tắc tách job theo thiết bị ADR-003.

---

## 2. Quyết định Kiến trúc (Decisions)

### Quyết định 1: Chọn Phương án 1 — Chuỗi khép kín chuẩn ERP
- **Luồng dữ liệu chuẩn:**
  ```
  quotations (APPROVED) ──[fn_convert_quotation_to_order]──→ orders (CONFIRMED)
                                                                 │
                                                    [createWorkOrderFromOrderAction]
                                                                 │
                                                                 ▼
                                                            work_orders (PLANNED / IN_PROGRESS)
                                                                 │
                                                    [generateJobsForWorkOrder]
                                                                 │
                                                                 ▼
                                                            jobs (1:1 với Equipment)
                                                                 │
                                                                 ▼
                                                            job_steps (Công đoạn song song)
  ```
- **Không thêm cột `quotation_id` vào `work_orders`:**
  - Bảo toàn tính nhất quán tuyệt đối của ADR-002 và ADR-012 (Giao hàng `shipments` gắn với `work_orders.order_id` và `orders.order_id`).
  - Tránh tạo ra 2 nguồn gốc dữ liệu song song (dual-origin) cho Work Orders.
  - Mọi Lệnh sản xuất thương mại đều có nguồn gốc rõ ràng từ Đơn hàng (`order_id`).

### Quyết định 2: Server Action `createWorkOrderFromOrderAction(orderId)`
- Đặt trực tiếp tại `src/app/orders/[id]/actions.ts` để tập trung toàn bộ logic liên kết WO của đơn hàng, tránh phân mảnh mã nguồn.
- **Ràng buộc trạng thái nghiệp vụ (Status Guard):** Chỉ cho phép kích hoạt khi `orders.order_status IN ('CONFIRMED', 'IN_PRODUCTION')`.
- **Ràng buộc Idempotency:** Mỗi Đơn hàng chỉ tự động sinh tối đa 1 Work Order chính (`work_orders.order_id = orderId`). Kiểm tra chặn đứng nếu đơn hàng đã có WO liên kết, ngăn ngừa phát lệnh trùng lặp.
- **Kế thừa thông số kỹ thuật tự động:**
  - Trích xuất dòng `order_lines` đầu tiên của đơn hàng để lấy `product_id` và `design_revision_id`.
  - Nếu `order_lines` chưa có `design_revision_id`, tự động truy vấn bản vẽ CAD mới nhất trong `design_revisions` theo `product_id`.
  - Kế thừa hạn giao hàng `deadline` từ `order_lines.due_date` (fallback về `orders.requested_delivery`).
  - Kế thừa khách hàng `company_id` từ đơn hàng.
  - Tự động đặt tên Lệnh SX: `受注製造: {order_no} - {product_name}`.
- **Sinh mã chuẩn hóa:** Gọi trực tiếp RPC PostgreSQL `generate_wo_code()` trên Supabase để sinh mã tuần tự `WO-YYYY-NNNNNN` (có fallback `WO-{year}-{randSeq}`).

### Quyết định 3: Tự động kích hoạt `generateJobsForWorkOrder`
- Ngay sau khi tạo bản ghi `work_orders`, Server Action lập tức gọi hàm hiện có `generateJobsForWorkOrder(newWo.wo_id)` (tại `src/app/production/work-orders/actions.ts`):
  - Tự động nhận diện thiết bị khuôn chính (`MOLD`) và các thiết bị phụ trợ (`CUTTER`, `PLUG`, `BASE`...) qua `equipment_assignments` (`SET_MEMBER`) hoặc cùng `design_revision_id`.
  - Sinh 1 bản ghi `jobs` cho mỗi thiết bị (ADR-003).
  - Tự động sinh danh sách công đoạn `job_steps` tương ứng từ bảng mẫu `JOB_STEP_TEMPLATES`.
  - Tự động cập nhật `work_orders.wo_status = 'IN_PROGRESS'`.
- Tự động revalidate cache các đường dẫn: `/orders/[id]`, `/production/work-orders`, `/equipment/jobs`.

### Quyết định 4: Trải nghiệm người dùng (UX) tại Tab Lệnh sản xuất
- Tại component `WorkOrderLinker.tsx`:
  - Thêm nút bấm **「製造指示作成」** (Icon `ClipboardList`, màu xanh lục đậm `#059669`) tại thanh tiêu đề Section A và vùng Empty State.
  - Nút chỉ hiển thị khi `orders.order_status IN ('CONFIRMED', 'IN_PRODUCTION')` và `linkedWorkOrders.length === 0`.
  - Hiển thị hộp thoại xác nhận song ngữ (Tiếng Nhật & Tiếng Việt) kèm hiệu ứng Loading (`Loader2`).
  - Sửa dứt điểm lỗi liên kết điều hướng: chuyển từ `/equipment/jobs/${wo.wo_id}` thành `/production/work-orders/${wo.wo_id}`.

---

## 3. Hệ quả & Tương thích ngược (Consequences & Compatibility)

### Tương thích ngược
- Hoàn toàn tương thích và kế thừa 100% hạ tầng hiện có:
  * ADR-001 (Unified Equipment SSOT)
  * ADR-002 (Luồng 4 cấp `work_orders → jobs → job_steps → work_logs`)
  * ADR-003 (Tách Job theo Equipment Type)
  * ADR-010 (Work Order Equipment SET Resolution)
  * ADR-012 (Shipments & 納品書 Delivery Engine)
- Không làm thay đổi cấu trúc bảng hay thêm cột mới vào Database.

### Xử lý trường hợp ngoại lệ
- Đối với các trường hợp sản xuất thử, sửa khuôn hoặc bảo trì nội bộ không thông qua Đơn hàng thương mại, kỹ sư xưởng vẫn sử dụng giao diện tạo WO độc lập tại `/production/work-orders/new` như thiết kế ban đầu.
