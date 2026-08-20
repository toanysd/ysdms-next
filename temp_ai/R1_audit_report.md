# BÁO CÁO AUDIT KỸ THUẬT GIAI ĐOẠN R1 (R1-A AUDIT REPORT)

**Người thực hiện:** Antigravity (AN) — Kỹ sư triển khai mã nguồn  
**Người nhận:** Perplexity (PE) — Trưởng dự án / Kiến trúc sư trưởng  
**Người giám sát:** Anh Thoan (Product Owner)  
**Thời gian:** 2026-08-20  
**Trạng thái Codebase:** Next.js 14 App Router, Supabase TypeScript, 0 lỗi `tsc --noEmit`.

---

## 1. KẾT QUẢ AUDIT CHI TIẾT (Theo chỉ thị #001)

### 1.1. Bảng `mold_masters`
- **Kết quả quét `from('mold_masters')` trong `src/`:** **0 kết quả**. Không còn bất kỳ câu query runtime nào trỏ tới `mold_masters`.
- **Kết quả quét `mold_masters` trong `src/types/database.types.ts`:** **0 kết quả**. Bảng này đã được DROP trong migration `067_schema_v2_to_v3.sql`.
- **Các vị trí còn sót text `mold_masters` trong mã nguồn (Chỉ là comment & fallback an toàn):**
  1. `src/app/actions/engineering.ts` (Dòng 67: Comment giải thích `mold_masters DROPPED`)
  2. `src/app/engineering/designs/page.tsx` (Dòng 78: Comment ghi chú `products = mold_masters`)
  3. `src/app/production/products/upsert-actions.ts` (Dòng 61: Comment giải thích quan hệ trực tiếp qua `product_id`)
  4. `src/components/equipment/JobQuickViewDrawer.tsx` (Dòng 199, 200, 557, 562, 567: Fallback `(job as any).mold_masters?.products?.product_name || job.products?.product_name`)
  5. `src/components/equipment/MoldJobGantt.tsx` (Dòng 1428: Fallback tương tự)
- **Foreign Key trỏ vào `mold_masters`:** Không có ràng buộc Foreign Key cứng nào trong Database schema hiện hành. Cột `products.mold_master_id` và `equipment.mold_master_id` là UUID nullable (không có constraint).

### 1.2. Cột `products.company_pn`
- **Kết quả quét `company_pn` trong `src/`:** **0 kết quả**.
- **Hiện trạng bảng `products`:** Bảng `products` đã sử dụng cột chuẩn `customer_product_name` (Tên/mã part do khách hàng gọi) và `product_name_internal` (Mã hiển thị nội bộ YSD). Cột `company_pn` không còn xuất hiện trong `database.types.ts` hay bất kỳ form UI nào.

### 1.3. Mô hình Thiết bị (Equipment Model) Hiện Tại (Đã triển khai từ 2026-07-31)
- **Kiến trúc Hợp nhất đã có sẵn (ADR-001):** Bảng `equipment` đã được tạo và làm **Single Source of Truth** cho tất cả 8 loại thiết bị:
  - `MOLD` (Khuôn)
  - `CUTTER_INLINE` / `CUTTER_SEPARATE` (Dao dập liền / Dao dập rời)
  - `WATER_BASE` (Đế làm mát)
  - `PRESSURE_BASE` (Đế khí nén)
  - `FRAME` (Khung gá)
  - `STACKING` (Bộ xếp chồng khay)
  - `PLUG` (Chày ép)
- **Dữ liệu thực tế:** Đã đồng bộ thành công ~6,034 thiết bị vật lý vào bảng `equipment` (`20260731070000_populate_equipment_from_legacy.sql`).
- **Quan hệ N:N & SET Thiết bị (Bảng `equipment_assignments`):** Đã có sẵn bảng `equipment_assignments` liên kết Main Mold với Dao cắt, Khung, Đế với các `relationship_type`:
  - `'SET_MEMBER'` (Thiết bị gá lắp trong cùng 1 SET)
  - `'SHARED'` / `'COMPATIBLE'` (Thiết bị dùng chung giữa các sản phẩm)
- **Quan hệ Sản phẩm $\leftrightarrow$ Thiết bị:**
  - `products` (1:N) $\rightarrow$ `design_revisions` (qua `product_id`)
  - `design_revisions` (1:N) $\rightarrow$ `equipment` (qua `equipment.design_revision_id`)
  - `work_orders` (1:N) $\rightarrow$ `jobs` (1:1 per equipment via `jobs.equipment_id`)

---

## 2. ĐÁNH GIÁ & ĐỀ XUẤT PHẢN HỒI KIẾN TRÚC CHO PE

| Đề xuất ban đầu từ PE | Hiện trạng thực tế tại Antigravity | Đề xuất tối ưu tiếp theo |
|---|---|---|
| Tạo VIEW `mold_masters_compat` để tránh break 32 file | Code UI đã refactor sạch 100% sang `products`, không còn file nào query `mold_masters`. | **Không cần tạo VIEW `mold_masters_compat`**, chỉ cần dọn sạch các dòng fallback cuối cùng trong `JobQuickViewDrawer.tsx` và `MoldJobGantt.tsx`. |
| Đổi tên `products.company_pn` $\rightarrow$ `legacy_customer_pn` | Cột `company_pn` đã được thay bằng `customer_product_name`. | **Bảo toàn schema `customer_product_name`**, không cần chạy migration đổi tên. |
| Tạo mới bảng `equipment_types` + `product_equipment_map` | Đã có sẵn bảng `equipment` (với cột `equipment_type`) và bảng `equipment_assignments` quản lý SET N:N. | **Tận dụng bảng `equipment` + `equipment_assignments` hiện có**, không tạo thêm bảng dư thừa để tránh phân mảnh dữ liệu. |
| Thêm trạng thái vòng đời sản phẩm `product_lifecycle_status` | Hiện bảng `products` có `product_status` (`ACTIVE`, `MAINTENANCE`, `DISPOSED`, `MERGED`). | **Nâng cấp `product_status`** hoặc bổ sung `product_lifecycle_status` rõ ràng: `DRAFT`, `DESIGN`, `PROTOTYPE`, `APPROVED`, `MASS_PRODUCTION`, `DISCONTINUED`. |
| Thêm bảng `design_approval_logs` & `sample_requests` | Hiện chưa có bảng tracking vòng duyệt bản vẽ và yêu cầu mẫu thử (GAP P0). | **Triển khai ngay Phase R1-B**: Tạo bảng `design_approval_logs` và `sample_requests` để khép kín luồng duyệt với khách hàng. |

---

## 3. ĐỀ XUẤT CÔNG VIỆC TIẾP THEO (Gửi PE duyệt)

1. **Dọn sạch 100% code tham chiếu fallback `mold_masters`** trong `JobQuickViewDrawer.tsx` và `MoldJobGantt.tsx`.
2. **Tạo Migration cho Approval & Sample Flow (Giai đoạn cốt lõi của R1)**:
   - `design_approval_logs` (`log_id`, `design_revision_id`, `approval_stage`, `approver_id`, `customer_feedback`, `status`, `approved_date`, `notes`)
   - `sample_requests` (`request_id`, `product_id`, `design_revision_id`, `sample_type`, `requested_qty`, `target_date`, `result_status`, `ng_reason`, `notes`)
   - Cập nhật enum `product_lifecycle_status` vào `products`.
