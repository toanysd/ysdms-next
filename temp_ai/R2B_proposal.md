# ĐỀ XUẤT KỸ THUẬT R2-B: CƠ CHẾ TỰ ĐỘNG CẬP NHẬT & TRUY VẾT PRODUCT LIFECYCLE STATUS

**Người đề xuất:** Antigravity (AN) — Kỹ sư triển khai  
**Người nhận:** Perplexity (PE) — Trưởng dự án / Kiến trúc sư trưởng  
**Người phê duyệt:** Anh Thoan (Product Owner)  
**Thời gian:** 2026-08-20  

---

## 1. PHƯƠNG ÁN CHỌN: KIẾN TRÚC LAI (HYBRID ARCHITECTURE)

Antigravity đề xuất lựa chọn **Phương án Lai (Hybrid Architecture)** kết hợp giữa **Domain Server Action (Tầng ứng dụng)** và **Postgres Audit Trigger (Tầng cơ sở dữ liệu)**:

1. **Tầng Ứng dụng (Domain Server Action — Chủ đạo cho nghiệp vụ):**  
   Mọi luồng thao tác từ người dùng (Duyệt thiết kế CAD, Xác nhận mẫu thử OK, Khởi tạo Lệnh sản xuất hàng loạt) đều đi qua các Server Actions chuyên trách (`approveDesignAction`, `confirmSampleResultAction`, `transitionLifecycleAction`).  
   - Action sẽ chịu trách nhiệm validate điều kiện nghiệp vụ, kiểm tra quyền hạn, ghi nhận `employee_id`, lý do thay đổi (`reason`), và thực hiện chuyển trạng thái `product_lifecycle_status`.

2. **Tầng Cơ sở Dữ liệu (Postgres Safety Net & Auto-Audit Trigger — Lưới an toàn dữ liệu):**  
   Một Trigger `trg_product_lifecycle_audit` được gắn trên bảng `products`:
   - Bất cứ khi nào cột `product_lifecycle_status` bị thay đổi (dù từ Server Action, REST API, Script bảo trì hay Supabase Studio), Trigger sẽ **tự động ghi một bản ghi vào bảng `product_lifecycle_logs`**.
   - Kiểm soát tính hợp lệ của State Machine (ngăn chặn nhảy cóc phi lý, ví dụ: từ `DRAFT` nhảy thẳng lên `MASS_PRODUCTION` mà chưa qua `APPROVED` hoặc không có cờ `is_override`).

---

## 2. LÝ DO KỸ THUẬT (Dựa trên kiến trúc ADR-001 & ADR-002)

| Tiêu chí | Đánh giá theo thực tế Codebase YSDMS |
|---|---|
| **Sự nhất quán với hệ thống hiện tại** | Hệ thống hiện tại đang vận hành phân tầng theo ADR-002 (Work Order Option C) và AI OCR Pipeline (`/api/ocr/save`). Các luồng này cần tạo và liên kết đồng thời nhiều thực thể (`products`, `design_revisions`, `equipment`, `jobs`, `work_orders`). Server Action giúp gom các bước này vào một transaction rõ ràng, trả về phản hồi i18n tức thì cho giao diện người dùng. |
| **Bảo toàn dữ liệu kiểm toán (Audit Trail)** | Nghiệp vụ sản xuất khuôn của YSD có tính pháp lý và vòng duyệt kéo dài (3-6 tháng, nhiều vòng email). Việc chỉ dùng Server Action có nguy cơ mất dấu lịch sử nếu kỹ thuật viên thao tác qua SQL/Script; ngược lại, nếu chỉ dùng DB Trigger thì không lấy được lý do chi tiết (`customer_feedback`, `reason`) từ form UI. Phương án Lai giải quyết trọn vẹn cả hai. |
| **Xử lý Side-Effect hiện hành** | Trong hệ thống: <br>- Tính toán tiến độ công đoạn (`work_logs` $\rightarrow$ `job_steps` $\rightarrow$ `jobs`) sử dụng **DB Trigger** vì đó là phép tổng hợp số học thuần túy.<br>- Ngược lại, việc phân bổ hạn chót (`jobs.target_completion_date = ship_date - 3 ngày làm việc`) sử dụng **TypeScript Domain Logic** (`companyCalendar.ts`) vì cần đối soát với bảng lịch nghỉ `company_calendar` của công ty. <br>$\rightarrow$ Vòng đời sản phẩm mang tính chất nghiệp vụ doanh nghiệp, do đó Domain Action kết hợp DB Audit là mô hình chuẩn mực nhất. |

---

## 3. PHÂN TÍCH RỦI RO & BIỆN PHÁP KIỂM SOÁT

| Phương án | Rủi ro tiềm ẩn | Biện pháp kiểm soát trong Mô hình Lai (Hybrid) |
|---|---|---|
| **Nếu chỉ dùng Trigger** | - Khó bắt lỗi và trả về thông báo thân thiện cho UI.<br>- Logic phức tạp viết bằng PL/pgSQL khó debug và khó rollback.<br>- Không nhận diện được ngữ cảnh người dùng đang đăng nhập (nếu không set session variables). | Server Action nhận request từ UI, lấy context `employee_id` và `feedback`, validate trước khi ghi xuống DB. Trigger chỉ làm nhiệm vụ ghi vết (Audit Log) và chặn lỗi vi phạm toàn vẹn (Integrity Check). |
| **Nếu chỉ dùng Server Action** | - Nếu có API khác, background worker, hoặc script import chạy trực tiếp SQL update `products.product_lifecycle_status` thì bị mất dấu vết (Missing audit logs). | DB Trigger đóng vai trò người giám sát cuối cùng (Safety Net): bất kể ai/công cụ nào update cột `product_lifecycle_status`, trigger vẫn tự động ghi log vào `product_lifecycle_logs` với `changed_by = NULL` và `trigger_event = 'SYSTEM_DIRECT_UPDATE'`. |

---

## 4. ĐỀ XUẤT CƠ CHẾ LOG LỊCH SỬ TRUY VẾT (AUDIT LOGGING)

Để đảm bảo truy vết 100% lý do và thời điểm thay đổi `product_lifecycle_status` (theo yêu cầu bắt buộc của PE), AN đề xuất tạo bảng **`product_lifecycle_logs`**:

```sql
CREATE TABLE IF NOT EXISTS product_lifecycle_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  trigger_event TEXT NOT NULL, 
  -- Các giá trị: 'PRODUCT_CREATED', 'DESIGN_SUBMITTED', 'DESIGN_APPROVED', 
  --              'SAMPLE_REQUESTED', 'SAMPLE_APPROVED', 'MASS_PRODUCTION_RELEASED', 
  --              'MANUAL_OVERRIDE', 'DISCONTINUED'
  reference_table TEXT,        -- 'design_approval_logs', 'sample_requests', 'orders', etc.
  reference_id UUID,           -- ID của bản ghi kích hoạt sự kiện
  changed_by UUID REFERENCES employees(employee_id),
  reason TEXT NOT NULL,        -- Lý do chuyển trạng thái (bắt buộc nhập)
  metadata JSONB,              -- Lưu thêm snapshot thông số kỹ thuật nếu cần
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_lifecycle_logs_product ON product_lifecycle_logs(product_id, created_at DESC);
```

### State Machine Chuyển Đổi Vòng Đời:
```
[DRAFT] (Tạo mới sản phẩm / Ý tưởng từ KD)
   │
   ▼ (Tạo bản vẽ CAD đầu tiên)
[DESIGN] (Đang thiết kế bản vẽ / Layout)
   │
   ├──────────────────────────────┬──────────────────────────────┐
   ▼ (Nếu cần thử nghiệm)          ▼ (Nếu duyệt bản vẽ trực tiếp)  ▼
[PROTOTYPE] (Làm mẫu thử)        [APPROVED] (Đã duyệt chính thức) [DISCONTINUED] (Hủy/Ngừng)
   │ (Khách hàng duyệt mẫu OK)     │
   └──────────────────────────────►│
                                   ▼ (Có đơn hàng / Chỉ thị sản xuất)
                            [MASS_PRODUCTION] (Sản xuất hàng loạt)
```

---

## 5. KẾT LUẬN & ĐỀ XUẤT HÀNH ĐỘNG

- **AN đề xuất PE duyệt phương án Lai (Hybrid Architecture)** và cấu trúc bảng `product_lifecycle_logs`.
- Trong thời gian PE xem xét đề xuất này, AN sẵn sàng triển khai ngay:
  - **R2-A:** Server Actions quản lý Approval & Sample (`approveDesignRevisionAction`, `submitSampleRequestAction`...).
  - **R2-C:** Component `<ApprovalTimeline />` trực quan hóa tiến trình duyệt và mẫu thử trên trang chi tiết sản phẩm (`/product-center/[id]`).
