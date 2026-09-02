# YSDMS NextGen — Các Quyết Định Kiến Trúc Kỹ Thuật

> **Phiên bản:** 1.1
> **Ngày cập nhật:** 2026-08-24
> **Ngữ cảnh:** Sự thống nhất kiến trúc xuất phát từ `PRD.md`, `AI_SYSTEM_RULES.md`, và `SCHEMA_REFERENCE.md`.

## 1. Kiến Trúc Môi Trường & Hạ Tầng
- **Chiến lược Monorepo Cơ động (USB vào SSD Local):** 
  Để loại bỏ thắt nút cổ chai I/O của USB và lỗi symlink, mã nguồn được đặt trên ổ đĩa USB nhưng quá trình thực thi (Next.js server, node_modules) sẽ chạy trên Local SSD (`C:\AntiGravity_Workspace` hoặc `D:\AntiGravity_Workspace`).
- **Cách Ly Dependency:** 
  Thư mục `node_modules` và bộ đệm build `.next` được giữ nghiêm ngặt trên Local SSD. Chúng bị loại trừ khỏi các script đồng bộ USB (`USB_SYNC_SAVE.bat`).
- **Cấu Hình Build:**
  - **Môi trường Development:** Nghiêm túc sử dụng `next dev --turbo` để khởi động nhanh và tiết kiệm bộ nhớ.
  - **Môi trường Production:** Lệnh `next build` chỉ dùng Webpack để tránh các lỗi truy xuất symlink hiện đang có trong Turbopack.

## 2. Các Quyết Định về Mô Hình Database & Dữ Liệu
- **Hợp nhất Thực thể Cốt lõi (Master Entity):** 
  Bảng cũ `mold_masters` chính thức bị loại bỏ. Bảng `products` đóng vai trò là nguồn sự thật duy nhất cho khay/khuôn (Khay = MoldMaster = Sản phẩm). Mọi chức năng mới đều phải tham chiếu tới `products.product_id`.
- **Quy tắc Đặt tên Khóa Chính (Primary Key):** 
  Được chuẩn hóa thành `{tên_bảng_số_ít}_id` (ví dụ: `product_id`, `employee_id`). Ngoại lệ đáng chú ý là bảng `order_lines` sử dụng `line_id`.
- **Thực Thể Xác Thực & Phân Quyền (RBAC):** 
  Toàn bộ logic phân quyền truy cập đều gắn với bảng `employees` kết hợp với bảng `departments` (ví dụ: MOLDING, CUTTING, RECYCLING, OFFICE). Chúng ta không gắn trực tiếp các quan hệ nghiệp vụ vào bảng xác thực chung chung như `users` hay `profiles`.

## 3. Các Mô Thức API & Nạp Dữ Liệu
- **Phân trang Server-Side:** 
  Các truy vấn lấy ra dữ liệu không giới hạn bắt buộc phải dùng `.range(from, to)` kết hợp `{ count: 'exact' }`. Kích thước trang (page size) mặc định là 50. Tuyệt đối nghiêm cấm việc client tải toàn bộ bảng (`select('*')`).
- **Dropdown Bất đồng bộ Thông minh (Smart Async Dropdowns):** 
  Các ô chọn lọc quản lý >50 bản ghi (như Công ty, Sản phẩm) phải dùng độ trễ (debounce 300ms) và lọc `ilike` ở phía máy chủ, giới hạn trả về 20 kết quả thông qua component `AsyncSearchableSelect`. Chặn việc tải trước toàn bộ mảng tùy chọn để tối ưu hiệu năng.
- **Quản lý Trạng thái Bộ Lọc:** 
  Từ khóa tìm kiếm và các bộ lọc phải đồng bộ hóa với tham số tìm kiếm trên URL (ví dụ: `?search=`). Điều này giúp tạo ra các view có thể chia sẻ được và phân trang không lưu trạng thái tĩnh.

## 4. Các Quy Chuẩn UI / UX
- **Mật độ Hiển thị Cấp Doanh nghiệp (Enterprise Compact Density):** 
  Không gian được tối ưu cho mật độ dữ liệu cao: chiều cao input 36px, khoảng đệm hàng trong bảng 6px 10px, và font size văn bản cơ bản 14px (`var(--text-primary)`). Tránh các khoảng trắng không cần thiết.
- **Di trú sang Đa ngôn ngữ Động (Dynamic i18n):** 
  Loại bỏ hoàn toàn hiển thị song ngữ tĩnh đồng thời (ví dụ: `タイトル / Tiêu đề`) và các class CSS/thẻ span liên quan (`label-ja`, `label-vi`, `.ja`, `.vi`). 100% các chuỗi văn bản (Labels, Placeholders, Table Headers, Tooltips, Tab Names, Toast/Error Messages) phải được khai báo trong `messages/*.json` và truy xuất qua `next-intl` (`t('key')` hoặc `tCommon('key')`).
- **Quản lý Font-Family Tự động & Độ thích ứng:** 
  Sử dụng selector `html[lang="ja"]` và `html[lang="vi"]` trong `globals.css` để tự động đổi font-family (`Noto Sans JP` cho tiếng Nhật, `Inter` cho tiếng Việt) ở cấp tài liệu. Do tiếng Việt dài hơn tiếng Nhật 20-30%, dùng `flex-wrap` hoặc `grid` linh hoạt, kích thước chữ nhãn đồng nhất ở **12px** (font-medium hoặc bold), và sử dụng `text-overflow: ellipsis` kèm `title` cho cột bảng.
- **Hệ Thống CSS & Biến (Variables):** 
  Màu Tailwind nguyên bản (ví dụ: `bg-blue-500`) bị cấm sử dụng để hỗ trợ dark mode và theming. Phải dùng trực tiếp các CSS token được chỉ định như `var(--bg-surface)` và `var(--accent)`.
- **Mô Thức Bố Cục (Layout Patterns):** 
  - **Màn hình Danh sách (List Views):** Tuân thủ mô hình: `PageHeader` (Icon + Title + Actions) -> `FilterBar/TabBar` -> `Content Area` (`.card-flat`).
  - **Màn hình Chi tiết (Detail Views):** Tuân thủ mô hình: `BackBar` -> `Tab Navigation` -> `Tab Content`. Master data với các thuộc tính dày đặc cần dùng giao diện chia đôi `.detail-layout` (left/right panel).

## 5. Cập nhật Backend & An Toàn Giao Dịch
- **Server Actions & Zod:** 
  Các thao tác ghi dữ liệu được đóng gói nghiêm ngặt trong Next.js Server Actions. Cấu trúc payload bắt buộc phải được xác thực bằng schema Zod trước khi tương tác với database.
- **Giao Dịch Phức Tạp (Supabase RPCs):** 
  Các thao tác liên quan tới nhiều bảng hoặc yêu cầu khóa tính toán (ví dụ: giữ trước vật tư MRP, lệnh xác nhận đơn hàng dây chuyền) phải đẩy xuống xử lý tại PostgreSQL thông qua Supabase RPCs.
- **Tự động hóa Có Tính Toán:** 
  Quy tắc đặt tên khuôn (ví dụ: `{Mã_Khách_Hàng}-{Số}{Biến_thể}-{Phiên_bản}-{Loại}-{Bản_sao}`) phải được thi hành nghiêm ngặt. Phiếu Công Đoạn Sản Xuất (PDF) và Hạn chót Gia công (ví dụ: Hạn chót - 3 ngày) được tự động tạo theo quy trình.

## 6. Quyết định Kiến trúc Quốc tế hóa (i18n Decisions)
- **Locale-free Routing (Không tiền tố URL):**
  Lựa chọn chạy i18n không làm thay đổi URL cấu trúc (ví dụ: `/dashboard` thay vì `/ja/dashboard` hay `/vi/dashboard`). Quyết định này giúp loại bỏ sự phức tạp khi xử lý rewrite/redirect URL trong App Router và đơn giản hóa việc liên kết, chia sẻ URL giữa các bộ phận.
- **Language State Management (Quản lý trạng thái ngôn ngữ qua Cookie):**
  Trạng thái ngôn ngữ được lưu trữ ở cookie `NEXT_LOCALE` với thời hạn 1 năm (`maxAge: 31536000`), có hiệu lực trên toàn bộ domain (`path: '/'`). Component `LanguageSwitcher` kích hoạt chuyển đổi thông qua Server Action `setUserLocale` để ghi cookie, sau đó gọi `router.refresh()` nhằm re-render giao diện mà không cần reload trang vật lý.
- **Translation Files & Namespace Organization (Tổ chức file dịch & Namespace):**
  Tất cả các bản dịch được tổ chức tập trung tại `/messages/ja.json` và `/messages/vi.json` với cấu trúc JSON lồng nhau. Sử dụng các namespace phân rã rõ ràng để tránh xung đột:
  - `Common`: Các từ khóa và hành động dùng chung (`back`, `list`, `save`, `cancel`, `edit`, `search`, `addNew`, `status`...).
  - `Navigation`: Chứa nhãn cho Sidebar và Topbar menu.
  - `Orders`: Từ vựng liên quan đến quản lý đơn hàng và giao hàng.
  - `Customers`: Từ vựng liên quan đến danh mục khách hàng, nhà cung cấp, và người liên hệ.
  - `Plastics`: Từ vựng liên quan đến quản lý nhựa, lô sản xuất, và đo đạc tiêu hao mét nhựa.
  - `Login`: Từ vựng cho màn hình đăng nhập và các thông báo lỗi xác thực.

## 7. Phát Hiện Vận Hành Phase R6 — "Activate" (2026-08-24)

### [R6-S1] job_steps schema discovery — 2026-08-24

- **Vấn đề:** Khi PE verify schema `job_steps`, query với `limit=15` cắt mất nhiều cột — báo cáo chỉ có 15 cột và không có `progress_percent`. Thực tế bảng có **36 cột** bao gồm `progress_percent` (integer type).
- **Quyết định:** AN phát hiện sai lệch và tự điều chỉnh — vẫn dùng logic `step_status` (theo chỉ thị PE) thay vì `progress_percent` (đang toàn 0). Kết quả backfill đúng.
- **Bài học:** Luôn query `information_schema.columns` **không giới hạn** khi verify schema. Không dùng `LIMIT` cho metadata queries.
- **Thêm:** AN cũng phát hiện PE dùng `jobs.id` và `jobs.status` trong SQL mẫu — tên đúng là `jobs.job_id` và `jobs.job_status`. AN tự điều chỉnh khi apply.

### [R6-S2] product_code convention mismatch — 2026-08-24

- **Vấn đề:** `SCHEMA_REFERENCE.md` ghi `product_code` = mã nội bộ YSD compact (bỏ gạch ngang, VD: `ADY071`). Nhưng dữ liệu thực tế trong DB dùng format **có gạch ngang** (VD: `ADY-071`, `JAE-047`, `DIC-018`).
- **Bằng chứng:** Dry-run ETL lookup `JAE-047` (có gạch ngang) → tìm thấy 6/6 mẫu test đầu tiên. Tổng 8,288 product codes trong DB đều dùng format có gạch ngang.
- **Quyết định:** ETL script dùng format có gạch ngang là đúng. `SCHEMA_REFERENCE.md` cần cập nhật convention cho khớp thực tế.
- **Ghi chú:** `product_code` và `product_name_internal` hiện tại gần như trùng format trong DB (cả hai đều có gạch ngang). Convention compact chỉ tồn tại trên tài liệu, không trong data.

## 2026-09-02: B3 Plastic WMS — 16 Unmatched Specs
- 16 spec từ 材料在庫棚4-21.xlsx không match plastic_master
- Nguyên nhân: width quá nhỏ (<100mm) hoặc loại đặc biệt (ミネロン, レグルス, PVC slim)
- Quyết định: Bỏ qua trong ETL lần này, chờ nhập thủ công qua UI plastic_master CRUD
- Status: ACCEPTED — không phải lỗi hệ thống
