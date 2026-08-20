# BÁO CÁO KHẢO SÁT SCHEMA PHÂN HỆ BÁO GIÁ (R4-S1-A SCHEMA CHECK)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày khảo sát:** 2026-08-20
- **Phạm vi:** Khảo sát Schema thực tế trên Live Supabase DB cho Phân hệ Báo Giá 見積書 (Sprint R4-S1)
- **Trạng thái:** ✅ **HOÀN THÀNH KHẢO SÁT — KHÔNG CẦN MIGRATION MỚI**

---

## 1. KẾT QUẢ KIỂM TRA BẢNG BÁO GIÁ (`quotations` / `quotation_lines`)

Live Database **ĐÃ CÓ SẴN 2 BẢNG CHUẨN HÓA** cho Phân hệ Báo giá:

### 🔹 Bảng `quotations` (Báo Giá Cha / Header):
| Tên cột | Kiểu dữ liệu | Mô tả & Khóa ngoại (FK) |
|---|---|---|
| `quotation_id` | `uuid` (PK) | Khóa chính duy nhất của bản ghi Báo giá |
| `quotation_no` | `text` (NOT NULL) | Số báo giá (VD: `Q2408-001`, `EST-2026-089`) |
| `company_id` | `uuid` (NOT NULL) | FK $\rightarrow$ `companies.company_id` (Khách hàng nhận báo giá) |
| `case_id` | `uuid` (NULLABLE) | FK $\rightarrow$ `business_cases.id` (Liên kết Sự việc/Dự án) |
| `quote_date` | `date` (NOT NULL) | Ngày lập báo giá (見積日) |
| `valid_until` | `date` (NULLABLE) | Thời hạn hiệu lực báo giá (有効期限) |
| `status` | `text` (NULLABLE) | Trạng thái: `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED` |
| `quotation_type` | `text` (NULLABLE) | Loại báo giá: `MOLD` (Khuôn/Dao), `TRAY` (Khay nhựa), `SET` (Tổng hợp) |
| `total_amount` | `numeric` (NULLABLE) | Tổng giá trị báo giá trước/sau thuế (¥) |
| `prepared_by` | `uuid` (NULLABLE) | FK $\rightarrow$ `employees.employee_id` (Người lập báo giá) |
| `file_path` | `text` (NULLABLE) | Đường dẫn file PDF đính kèm / xuất ra |
| `extra_json` | `jsonb` (NULLABLE) | Chứa tham số tính toán chi tiết (định mức, phôi nhôm, tỷ trọng, v.v.) |
| `raw_text_snapshot`| `text` (NULLABLE) | Lưu snapshot nội dung văn bản điều khoản thương mại |
| `notes` | `text` (NULLABLE) | Ghi chú & Điều kiện thương mại (Thanh toán, Giao hàng) |

### 🔹 Bảng `quotation_lines` (Chi Tiết Từng Mục / Breakdown Items):
| Tên cột | Kiểu dữ liệu | Mô tả & Khóa ngoại (FK) |
|---|---|---|
| `line_id` | `uuid` (PK) | Khóa chính dòng chi tiết |
| `quotation_id` | `uuid` (NOT NULL) | FK $\rightarrow$ `quotations.quotation_id` |
| `line_no` | `integer` (NOT NULL) | Thứ tự dòng (1, 2, 3...) |
| `item_type` | `text` (NOT NULL) | Phân loại: `MOLD`, `CUTTER`, `SAMPLE`, `PRODUCT`, `SHIPPING`, `OTHER` |
| `description` | `text` (NULLABLE) | Tên hạng mục / Quy cách chi tiết |
| `quantity` | `numeric` (NULLABLE) | Số lượng |
| `unit_price` | `numeric` (NULLABLE) | Đơn giá (¥) |
| `amount` | `numeric` (NULLABLE) | Thành tiền = `quantity` $\times$ `unit_price` (¥) |
| `notes` | `text` (NULLABLE) | Ghi chú dòng |

---

## 2. KẾT QUẢ KHẢO SÁT BẢNG `orders` & `order_lines`

| Bảng | Các cột dữ liệu hiện có | Đánh giá & Khuyến nghị |
|---|---|---|
| `orders` | `order_id`, `order_no`, `company_id`, `order_date`, `order_status`, `order_type`, `customer_order_no`, `requested_delivery`, `lot_no`, `notes` | Lưu thông tin hành chính đơn hàng. |
| `order_lines` | `line_id`, `order_id`, `product_id`, `design_revision_id`, `quantity`, `unit`, `delivery_site_id`, `due_date`, `ship_date`, `box_type`, `packing_style`, `is_free_sample`, `charge_type` | Tập trung theo dõi tiến độ sản xuất & giao hàng (Quantity, Due Date, Delivery Site). |

👉 **Kết luận kiến trúc:** Tách biệt rõ ràng giữa **Thương mại Báo giá (`quotations` + `quotation_lines`)** và **Chỉ thị Đơn hàng (`orders` + `order_lines`)** là hoàn toàn chuẩn theo mô hình ERP chuyên nghiệp, không làm phình bảng `orders`.

---

## 3. KHẢO SÁT THÔNG SỐ TÍNH GIÁ TỪ `design_revisions`

Đối chiếu với công thức tính giá khuôn và giá sản phẩm nhựa định hình, bảng `design_revisions` đã có **ĐẦY ĐỦ 100% CÁC TRƯỜNG DỮ LIỆU CỐT LÕI**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MAPPING DỮ LIỆU TÍNH TOÁN BÁO GIÁ (CAD DESIGN REVISIONS → QUOTATION ENGINE)            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. TÍNH GIÁ KHUÔN NHÔM & DAO CẮT (MOLD & TOOLING COST):                                │
│    • Kích thước phôi nhôm: design_length × design_width × design_height                │
│    • Số lòng khuôn (Cavity): pocket_numbers / cavity_count                             │
│    • Độ sâu tạo hình (Draw Depth): design_depth, under_depth                           │
│    • Dao cắt: has_separate_cutter, cutline_length, cutline_width, corner_r, chamfer_c  │
│    • Thiết bị phụ trợ: plug_type, water_cooling_plate_spec, frame_spec                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. TÍNH ĐƠN GIÁ KHAY NHỰA (TRAY UNIT PRICE):                                          │
│    • Quy cách màng nhựa: plastic_type_designed, thickness_mm                           │
│    • Bước tiến máy dập: machine_feed_pitch_mm                                          │
│    • Diện tích tiêu hao màng: (machine_feed_pitch_mm × sheet_width) ÷ cavity_count     │
│    • Trọng lượng khay: diện tích × thickness_mm × tỷ trọng nhựa                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. ĐỀ XUẤT KIẾN TRÚC TRIỂN KHAI SPRINT R4-S1

1. **Về Cơ Sở Dữ Liệu:**
   - **KHÔNG CẦN TẠO MIGRATION MỚI**: Cả 2 bảng `quotations` và `quotation_lines` đều đã sẵn sàng trên database với đầy đủ quan hệ khóa ngoại (`company_id`, `case_id`, `prepared_by`).
   - Tận dụng trường `extra_json` trên `quotations` để lưu vết toàn bộ công thức và hệ số tính giá (như đơn giá nhôm ¥/kg, hệ số hao hụt %, đơn giá chạy máy ¥/giờ).

2. **Về Giao Diện & Tính Năng (`/orders/quotations`):**
   - **Màn hình Danh sách Báo Giá:** Bảng dữ liệu chuẩn (Pagination, Filter theo khách hàng, Status badge DRAFT/SENT/ACCEPTED, Nút Tạo mới).
   - **Engine Tính Giá Tự Động (Auto-Estimator Modal / Drawer):**
     - Chọn `product_id` / `design_revision_id` $\rightarrow$ Tự động load thông số kỹ thuật.
     - Cho phép chọn loại báo giá: Khuôn mới, Khay sản phẩm, hoặc Trọn gói.
     - Tự động điền các dòng `quotation_lines` và tổng tiền `total_amount`.
   - **Bộ Xuất PDF Báo Giá (見積書 PDF Renderer):**
     - Tạo mẫu in A4 chuẩn Nhật: Logo YSD, Thông tin Công ty YSD, Tên khách hàng + Kính ngữ (御中), Bảng chi tiết hạng mục, Thuế tiêu thụ 10%, và Điều khoản giao hàng/thanh toán.
     - Hỗ trợ xem trước (Print Preview) và nút Tải PDF trực tiếp.

---

Kính trình Trưởng dự án PE xem xét kết quả khảo sát schema và phê duyệt để AN tiến hành triển khai Sprint R4-S1!
