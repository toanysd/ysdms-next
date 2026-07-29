# YSDMS NextGen — Tài Liệu Yêu Cầu Sản Phẩm (PRD)

> **Phiên bản:** 1.1 (Cập nhật i18n & Loại bỏ Song ngữ Tĩnh)  
> **Ngày cập nhật:** 2026-07-18  
> **Lĩnh vực:** Hệ thống Quản lý Sản xuất & Kho bãi Doanh nghiệp (ERP)  
> **Đối tượng:** Product Owner, Lập trình viên, và AI Agents

---

## 1. Tóm tắt & Tầm nhìn

**Công ty TNHH Yoshida Package** chuyên sản xuất khay nhựa định hình bằng nhiệt (thermoforming). **YSDMS NextGen** là hệ thống ERP cấp doanh nghiệp được xây dựng để số hóa và kết nối toàn bộ chuỗi giá trị của họ.

Tầm nhìn cốt lõi là đạt được khả năng truy xuất nguồn gốc từ đầu đến cuối và vận hành tinh gọn, phá bỏ các rào cản thông tin giữa các phòng ban: **Kinh doanh**, **Kỹ thuật**, **Xưởng Khuôn**, **Sản xuất**, **Logistics**, và **Chất lượng**. Hệ thống cung cấp "Nguồn Sự Thật Duy Nhất" (Single Source of Truth) trải dài từ các yêu cầu ban đầu của khách hàng, thiết kế CAD của khuôn cho đến các công đoạn phay CNC, chạy sản xuất và giao hàng cuối cùng.

---

## 2. Hiện trạng Hệ thống

### 2.1 Stack Công nghệ
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database / Backend:** Supabase (PostgreSQL), Server Actions
- **Styling:** Tailwind CSS + Design System Tùy chỉnh (`globals.css`)
- **Kiến trúc:** Monorepo (Thiết lập Chạy trên Ổ cứng Local SSD và Lưu trữ Source trên USB để tối ưu hiệu năng)
- **Đa ngôn ngữ:** `next-intl` (Cơ chế không có tiền tố URL - Locale-free routing, lưu trạng thái qua cookie `NEXT_LOCALE`)

### 2.2 Tỷ lệ hoàn thành Module (~72%)
- **✅ Đã hoàn thành:** Master Data (Khách hàng, Sản phẩm, Máy móc), Kỹ thuật (Thiết kế), Thiết bị (Khuôn, Tiến độ gia công, Dao cắt), Đơn hàng (Danh sách/Giao hàng), Báo cáo.
- **🔧 Đang thực hiện:** Lập kế hoạch/Lịch trình sản xuất (Gantt), MRP (Lập kế hoạch nhu cầu vật tư), Bảo trì thiết bị.
- **🔲 Kế hoạch / Backlog:** Báo giá, Vòng đời Tồn kho chi tiết, Theo dõi lỗi (Defect), Kanban xưởng sản xuất.

---

## 3. Yêu cầu cho các Giai đoạn Tiếp theo

### 3.1 Cấu trúc Database (Mô hình DB)
DB phải hỗ trợ các mở rộng sau đây mà không làm phá vỡ tính toàn vẹn dữ liệu:

1. **Tái cấu trúc Master Entity:** 
   - Hấp thụ hoàn toàn bảng legacy `mold_masters` vào `products`. Tất cả logic mới phải dựa vào `products` như một thực thể chính (Khay = MoldMaster = Sản phẩm).
   - Đảm bảo `company_id` được liên kết chặt chẽ qua tất cả các thực thể cốt lõi (Đơn hàng, Sản phẩm).
2. **Luồng Từ Đơn Hàng đến Sản Xuất (O2P):**
   - Liên kết trực tiếp `order_lines` (hiện có `design_revision_id` cho phép null) vào kế hoạch sản xuất và giao hàng để theo dõi theo thời gian thực.
3. **MRP & Theo dõi Vật tư (Cuộn nhựa tính bằng mét):**
   - Bổ sung `plastic_master`, `plastic_receipt`, `plastic_receipt_roll`, và `plastic_adjustment_log`.
   - Theo dõi `feed_length_mm` (Bước tiến nhựa) trong thông số máy và ghi lại số mét tiêu hao (`meters_consumed`), số mét còn lại (`meters_remaining`), và số mét hao phí (`meters_wasted`) vào `production_log`.
4. **Phân quyền dựa trên Vai trò (RBAC):**
   - Chuẩn hóa các `departments` (MOLDING, CUTTING, RECYCLING, OFFICE) và liên kết rõ ràng người dùng thông qua bảng `employees` (KHÔNG dùng `users` hay `profiles`).

### 3.2 Yêu cầu UI / UX & Di trú sang Đa ngôn ngữ Động (next-intl)

Hệ thống tiến hành cải tổ triệt để phần giao diện bằng cách **loại bỏ hoàn toàn hiển thị song ngữ tĩnh** (hiển thị đồng thời cả tiếng Nhật và tiếng Việt trên cùng màn hình) để giải phóng không gian hiển thị, cải thiện trải nghiệm người dùng chuyên nghiệp và gọn gàng.

#### 3.2.1 Nguyên tắc Loại bỏ Song ngữ Tĩnh
1. **Loại bỏ đồng thời:** Không hiển thị cả hai ngôn ngữ cùng lúc dưới dạng nhãn kép (ví dụ: `タイトル / Tiêu đề`).
2. **Xóa bỏ các class CSS song ngữ tĩnh:** Các class `label-ja`, `label-vi`, `.ja`, `.vi` (và các thẻ `<span>` lồng nhau tương ứng) sử dụng cho việc hiển thị song ngữ đồng thời sẽ bị loại bỏ khỏi các thành phần UI động.
3. **Quản lý tập trung:** 100% các chuỗi văn bản (Labels, Placeholders, Table Headers, Tooltips, Tab Names, Toast/Error Messages) phải được khai báo trong các file cấu hình dịch (`messages/ja.json` và `messages/vi.json`) và truy xuất thông qua hàm `t('key')` hoặc `tCommon('key')` của `next-intl`.

#### 3.2.2 Phạm vi Di trú Hệ thống (Migration Scope)
Toàn bộ các trang và module của hệ thống bắt buộc phải được chuyển đổi sang cơ chế đa ngôn ngữ động của `next-intl`:
- **Sidebar (Menu điều hướng):** Chuyển đổi các nhãn tĩnh trong `Sidebar.tsx` (như "事案管理 / Quản lý Sự việc") sang sử dụng namespace `Navigation`.
- **Topbar (Thanh công cụ đầu trang):** Việt hóa/Nhật hóa các nhãn tìm kiếm toàn cục, placeholder, nhãn bộ lọc nâng cao, và thông tin tài khoản.
- **Dashboard (Bảng điều khiển):** Động hóa các nhãn thẻ KPI (Doanh số, Sản lượng, Số khuôn), tiêu đề biểu đồ, trạng thái đơn hàng.
- **Cases (Quản lý Sự việc):** Form tạo mới sự việc (`/cases/new`), Danh sách sự việc, Chi tiết sự việc (`/cases/[id]`), các nhãn trường (Tiêu đề, Loại sự việc, Khách hàng, Hạn yêu cầu giao hàng, Chỉ thị ban đầu).
- **Engineering (Kỹ thuật & Thiết kế):** Thông số thiết kế khuôn (`design_revisions`), lịch sử phiên bản thiết kế, trạng thái phê duyệt thiết kế CAD.
- **Master Data (Dữ liệu gốc):**
  - Khách hàng (`/master/customers`): Mã KH, Tên công ty, Phân loại, Điện thoại, Người liên hệ.
  - Sản phẩm (`/master/products`): Mã sản phẩm, Tên nội bộ, Tên khách hàng, Trạng thái.
  - Máy móc & Kệ chứa (`/master/machines`, `/master/racks`): Thông số máy, Vị trí kệ, Sức chứa.
- **Orders & Shipments (Đơn hàng & Giao hàng):** Chi tiết đơn hàng, dòng đơn hàng (`order_lines`), thông tin đóng gói, Phiếu giao hàng (`/orders/shipments`), Trạng thái giao hàng.
- **Equipment & Inventory (Thiết bị & Tồn kho):** Khuôn vật lý (`/equipment/molds`), Dao cắt (`/equipment/cutting-dies`), Quy trình kiểm kê tồn kho (`/equipment/lifecycle`), Quản lý cuộn nhựa, Log sản xuất.
- **Reports & Worklogs (Báo cáo & Nhật ký):** Báo cáo hiệu suất, Nhật ký làm việc hàng ngày (Nippo) của công nhân.

#### 3.2.3 Quy chuẩn Layout Động & Độ mật độ hiển thị (Dynamic Layout & Density)
1. **Quản lý Font-Family Tự động:** Sử dụng selector `html[lang="ja"]` và `html[lang="vi"]` trong `globals.css` để tự động chuyển đổi font-family (`Noto Sans JP` cho tiếng Nhật, `Inter` cho tiếng Việt) ở cấp tài liệu thay vì áp dụng thủ công ở từng component.
2. **Khả năng thích ứng chiều dài:** Tiếng Việt thường dài hơn tiếng Nhật khoảng 20-30%. Các layout form và bảng dữ liệu phải sử dụng `flex-wrap` hoặc `grid` linh hoạt để nhãn không bị tràn, đè lên các trường nhập liệu hoặc bị cắt cụt mất nghĩa.
3. **Mật độ Hiển thị Cấp Doanh nghiệp (Enterprise Compact Density):** 
   - Chiều cao header bar: **48px**.
   - Chiều cao input/select: **36px**.
   - Padding dòng của bảng (Table Row Padding): **6px 10px**.
   - Kích thước chữ nhãn (Label Font Size): Đồng nhất ở **12px** (font-medium hoặc bold tùy trạng thái active) cho cả tiếng Nhật và tiếng Việt khi hiển thị động, thay vì dùng chữ 10px quá nhỏ cho tiếng Việt như trước.
   - Thêm thuộc tính `text-overflow: ellipsis` kèm `title` tooltip cho các bảng dữ liệu khi độ rộng cột bị giới hạn để đảm bảo không bị vỡ giao diện.

#### 3.2.4 Đồng bộ Tìm kiếm & Điều hướng
- **Tìm kiếm & Lọc:** Áp dụng `useSearchHistory(key)` để lưu các tìm kiếm gần đây. Mọi thao tác tìm kiếm phải dùng debounce (300-500ms) và phản ánh trên URL param `?search=`.
- **Điều hướng Nhất quán:** 
   - Trang danh sách (List): Phải dùng chuẩn `PageHeader` -> `FilterBar/TabBar` -> `Content Area` với `.card-flat`. 
   - Trang chi tiết (Detail): Dùng `BackBar` -> `Tab Navigation` -> `Tab Content`. Các màn hình master data với nhiều thông tin nên dùng `.detail-layout` (chia đôi màn hình trái/phải).

### 3.3 Logic Nghiệp vụ
- **Kiểm soát Quy tắc Đặt tên:** Xác thực nghiêm ngặt tên khuôn dựa trên `{Mã_Khách_Hàng}-{Số}{Biến_thể}-{Phiên_bản}-{Loại}-{Bản_sao}` (vd: `JAE-001AB-R2-D-N01`). Đảm bảo `system_code`, `display_name`, và `physical_stamp` được tạo đúng.
- **Phiếu Công đoạn (新規金型製造工程票):** Tự động tạo Phiếu Công đoạn mạnh mẽ, lấy dữ liệu từ Đơn hàng đã chốt, thiết kế đã duyệt (`design_revision`), và Công suất máy. Cung cấp chức năng xuất PDF.
- **Logic Hàng Mẫu & Đóng gói:** Tách biệt hàng mẫu miễn phí, mẫu QC, mẫu setup, và mẫu có tính phí. Gán phong cách đóng gói (`packing_style`) cụ thể cho mỗi `order_line`.
- **Hạn chót Gia công (Job Deadlines):** Tự động tính toán hạn chót cho từng bước gia công (vd: Hạn chót Job - 3 ngày làm việc) cho Xưởng Khuôn.

### 3.4 Xử lý Dữ liệu & Hiệu năng
- **Phân trang Server-Side:** Không bao giờ dùng `.select('*')` cho các bảng không giới hạn. Luôn áp dụng `.range(from, to)` (mặc định 50 dòng) kết hợp với `<Pagination />`.
- **Dropdown Bất đồng bộ Thông minh:** Đối với các bảng > 50 dòng (Công ty, Sản phẩm), dùng tính năng lọc `ilike` ở server-side giới hạn 20 kết quả và debounce (`AsyncSearchableSelect`), thay vì load toàn bộ dữ liệu vào bộ nhớ.
- **Độ tin cậy của Action:** Tất cả các thay đổi dữ liệu (mutations) phải đi qua Next.js Server Actions kèm xác thực Zod nghiêm ngặt. Dùng Supabase RPCs khi cần đảm bảo an toàn giao dịch trên nhiều bảng hoặc tính toán phức tạp.

---

## 4. Tuân thủ Vận hành & Lập trình

Tất cả các AI Agent và Lập trình viên PHẢI tuân thủ:
1. **AGENTS.md & AI_SYSTEM_RULES.md:** Đọc và làm theo Nguồn Sự Thật Duy Nhất (Single Source of Truth).
2. **Quy tắc "Không Đoán Mò":** Xác nhận các thay đổi schema so với các file hiện tại (`SCHEMA_REFERENCE.md`) và tránh bịa đặt bảng, cột, hoặc bối cảnh cũ.
3. **An toàn TypeScript:** Chạy `npx tsc --noEmit` ở local (hoặc `node ".\node_modules\typescript\bin\tsc" --noEmit`) để xác nhận 0 lỗi trước khi hoàn tất bất kỳ task nào.
4. **CSS Tokens:** Không bao giờ dùng màu Tailwind thuần (`bg-blue-500`). Dùng các biến CSS đã định nghĩa (`var(--accent)`, `var(--bg-surface)`).

---

## 5. Các Cột mốc Sắp tới

1. **Phase 2.1 - MRP & Tồn kho Nhựa:** Ra mắt View `plastic_stock`, ghi nhận tiêu hao mét nhựa, và cập nhật thông số Máy móc (bước tiến nhựa).
2. **Phase 2.2 - Tái cấu trúc Đơn hàng:** Hoàn tất việc chuyển đổi bỏ tham chiếu đến `mold_masters`, chuyển hẳn sang `products` và liên kết luồng bán hàng từ đầu đến cuối.
3. **Phase 2.3 - Di trú Quốc tế hóa (i18n):** Hoàn tất di trú động 100% mã nguồn khỏi các lớp hiển thị song ngữ tĩnh và chuỗi text hardcoded.
4. **Phase 2.4 - Báo giá & Hóa đơn:** Số hóa chức năng xuất PDF báo giá liên kết với bảng chi phí của `products`.
