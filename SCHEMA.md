# YSDMS NextGen — Thiết kế Cấu trúc Database (Các Phase Tiếp Theo)

> **Căn cứ:** Bám sát theo `PRD.md` và `SCHEMA_REFERENCE.md`.
> **Phân đoạn:** Phase 2.1 (MRP), Phase 2.2 (Tái cấu trúc Đơn hàng), Phase 2.3 (Báo giá)

## 1. Phase 2.1 - MRP & Tồn kho Nhựa (Tính bằng mét)

### Bảng `machines` (Cập nhật Thông số Máy)
Thêm trường để theo dõi tốc độ tiêu hao vật liệu trong quá trình sản xuất.
- `feed_length_mm` (`NUMERIC`): Thông số bước tiến nhựa của máy trên mỗi chu kỳ.

### Các Thực thể Theo dõi Vật tư
Các thực thể này quản lý vòng đời của cuộn nhựa, quá trình nhập kho và tiêu hao.

**`plastic_master`** (Cấu hình)
- `plastic_id` (`UUID`) - Khóa chính (PK)
- `plastic_code` (`TEXT`, UNIQUE): Mã loại nhựa
- `plastic_family` (`TEXT`): Dòng nhựa (PET, PP, PS...)
- `thickness_mm` (`NUMERIC`): Độ dày (mm)
- `width_mm` (`INTEGER`): Khổ rộng (mm)

**`plastic_receipt`** & **`plastic_receipt_roll`**
- Tuân thủ theo các định nghĩa trong `SCHEMA_REFERENCE.md` để quản lý nhập kho và theo dõi từng cuộn nhựa riêng biệt.

**`production_log`** (Ghi nhận Số mét Tiêu hao)
Ghi lại chính xác số mét nhựa tiêu hao trong quá trình chạy máy. Bảng này sẽ mở rộng hoặc liên kết với `work_logs`.
- `log_id` (`UUID`) - PK
- `job_id` (`UUID`) - FK -> `jobs(job_id)`
- `roll_id` (`UUID`) - FK -> `plastic_receipt_roll(id)`
- `meters_consumed` (`NUMERIC`): Số mét nhựa đã tiêu hao.
- `meters_remaining` (`NUMERIC`): Số mét còn lại trên cuộn.
- `meters_wasted` (`NUMERIC`): Số mét hao phí / phế phẩm.

## 2. Phase 2.2 - Tái cấu trúc Đơn hàng & Luồng O2P (Order-to-Production)

### Thực thể Cốt lõi (Master Entity): `products`
Bảng `products` chính thức hấp thụ bảng cũ `mold_masters` (Khay = MoldMaster = Sản phẩm).
- `company_id` (`UUID`) - FK -> `companies(company_id)`, **NOT NULL**. Đóng vai trò là mỏ neo liên kết mọi dữ liệu tuyến dưới (Đơn hàng, Thiết kế).

### Theo dõi Đơn hàng đến Sản xuất (O2P)
**`production_plans`** (Thực thể Liên kết Mới)
Kết nối Đơn hàng Bán và Hoạt động xưởng sản xuất để theo dõi thời gian thực.
- `plan_id` (`UUID`) - PK
- `line_id` (`UUID`) - FK -> `order_lines(line_id)` (Liên kết trực tiếp từ dòng đơn hàng)
- `job_id` (`UUID`) - FK -> `jobs(job_id)`
- `planned_quantity` (`INTEGER`): Số lượng kế hoạch
- `status` (`TEXT`): PLANNED, IN_PROGRESS, COMPLETED

**`order_lines`** (Cập nhật)
- `design_revision_id` (`UUID`, NULLABLE): FK -> `design_revisions(revision_id)`. Được chỉ định rõ khi có nhiều phiên bản thiết kế đang cùng kích hoạt.
- `packing_style` (`TEXT`): Xác định yêu cầu đóng gói (vd: tách riêng mẫu QC, mẫu miễn phí, mẫu tính phí).

## 3. Phase 2.3 - Báo giá & Chi tiết Chi phí

**`quotations`**
Số hóa chức năng xuất Báo giá PDF, liên kết với các sản phẩm cụ thể.
- `quotation_id` (`UUID`) - PK
- `company_id` (`UUID`) - FK -> `companies(company_id)`
- `product_id` (`UUID`) - FK -> `products(product_id)`
- `quotation_no` (`TEXT`, UNIQUE): Số báo giá
- `date_issued` (`DATE`): Ngày phát hành
- `status` (`TEXT`): DRAFT, SENT, APPROVED, REJECTED
- `pdf_export_path` (`TEXT`): Đường dẫn file PDF
- `total_amount` (`NUMERIC`): Tổng tiền

**`quotation_breakdowns`**
Chi tiết cấu thành chi phí để đảm bảo tính minh bạch.
- `breakdown_id` (`UUID`) - PK
- `quotation_id` (`UUID`) - FK -> `quotations(quotation_id)`
- `category` (`TEXT`): MATERIAL, MACHINING, LABOR, SETUP (Vật tư, Gia công, Nhân công, Setup)
- `amount` (`NUMERIC`): Thành tiền
- `description` (`TEXT`): Mô tả

## 4. Phân quyền Dựa trên Vai trò (RBAC)

**`departments`**
Chính thức hóa các phòng ban nghiệp vụ.
- `department_id` (`UUID`) - PK
- `code` (`TEXT`, UNIQUE): vd: 'MOLDING', 'CUTTING', 'RECYCLING', 'OFFICE'
- `name` (`TEXT`)

**`employees`**
Nguồn sự thật tuyệt đối cho quyền truy cập người dùng và các liên kết nghiệp vụ (thay thế cho sự phụ thuộc vào bảng `users` hay `profiles` chung chung).
- `employee_id` (`UUID`) - PK
- `department_id` (`UUID`) - FK -> `departments(department_id)`
- Tất cả vai trò hệ thống và trách nhiệm công việc phải liên kết trực tiếp vào bảng này.

## 5. Kiến trúc Đa ngôn ngữ Động & Thiết kế Schema (Dynamic i18n & Schema Impact)

Hệ thống ysdms-nextgen áp dụng cơ chế đa ngôn ngữ động (Dynamic i18n) và loại bỏ hoàn toàn hiển thị song ngữ tĩnh trên UI. Điều này có tác động trực tiếp đến cách thiết kế Schema và quản lý dữ liệu:

### 5.1 Nguyên tắc Thiết kế Schema Quốc tế hóa
- **Không nhân bản cột theo ngôn ngữ**: Tuyệt đối không thiết kế các cột dạng `column_ja`, `column_vi` trong cơ sở dữ liệu (ví dụ: `product_name_ja`, `product_name_vi`). Dữ liệu gốc trong database được lưu giữ độc lập với ngôn ngữ hiển thị (language-agnostic).
- **Sử dụng Cột Đơn chuẩn (Single Column Standard)**: Các thuộc tính như `product_name` hay `company_name` được lưu dưới dạng một cột duy nhất đại diện cho tên chính thức hoặc tên nội bộ chung. Việc dịch các nhãn hệ thống (Labels), danh mục tĩnh (Static Enums/Status), và các chuỗi giao diện được chuyển hoàn toàn sang tầng ứng dụng thông qua `next-intl`.
- **Hỗ trợ Đa ngôn ngữ cho Master Data**: Trong trường hợp các thực thể cần lưu trữ bản dịch động cho dữ liệu do người dùng nhập (ví dụ: mô tả chi tiết sản phẩm bằng cả tiếng Nhật và tiếng Việt), chúng ta sẽ sử dụng cấu trúc JSONB hoặc bảng quan hệ dịch (Translation Table) thay vì tạo thêm cột tĩnh để đảm bảo khả năng mở rộng.

### 5.2 Kiến trúc Tầng Ứng dụng (next-intl)
- **Locale-free Routing (Không tiền tố URL)**: Hệ thống sử dụng cấu trúc App Router thông thường mà không cần bọc các route trong thư mục `[locale]`. Điều này giữ cho URL sạch (ví dụ: `/dashboard`, `/master/products` thay vì `/ja/dashboard`, `/vi/master/products`).
- **Cookie-based State Storage**: Trạng thái ngôn ngữ được lưu trữ ở cookie `NEXT_LOCALE` phía Client và được truyền lên Server trong mọi request.
- **Server-side Request Config**: File `src/i18n/request.ts` đọc cookie `NEXT_LOCALE` (mặc định là `ja` nếu không tồn tại) để cấu hình `locale` và tự động load file dịch tương ứng (`messages/ja.json` hoặc `messages/vi.json`) trong lúc render Server Component.

