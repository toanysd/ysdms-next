# YSDMS NextGen - Order & Customer Phase

## 1. Goal Description

Triển khai phân hệ Quản lý Đơn hàng (Orders) và Khách hàng (Customers) dựa trên thực tế vận hành tại YSD:
- Đơn hàng khay nhựa (Products) được tạo song song hoặc sau khi tạo Lệnh sản xuất (Work Orders).
- Cho phép liên kết (link) thủ công giữa Đơn hàng (`orders`) và Lệnh sản xuất khuôn/khay (`work_orders`).
- Thiết lập Master Khách hàng (`companies`) với luồng xem nhanh thông tin Đơn hàng và Sản phẩm.
- Không backfill `order_lines` cho dữ liệu legacy từ Access, chỉ xử lý đơn hàng mới từ nay về sau. Legacy Orders chỉ dùng làm reference.

## 2. Business Rules & Decisions (PE Approved)

- **Order Type:** YSDMS quản lý Đơn hàng Bán khay nhựa (`products`). Chi phí liên quan đến khuôn/thiết bị sẽ không quản lý ở đơn hàng này mà nằm ở phân hệ `invoices` (Phase R5).
- **Creation Flow:** Nhập Order là bước sau khi tạo Work Order (do OCR đảm nhiệm). Việc link giữa `orders` và `work_orders` được thực hiện thủ công trên giao diện chi tiết.
- **Legacy Migration:** Không populate `order_lines` cho ~200+ legacy orders hiện tại. Giữ chúng ở trạng thái "shell records" read-only.
- **Order Status Flow:** `DRAFT` → `CONFIRMED` → `IN_PRODUCTION` → `SHIPPED` → `CLOSED`. Bỏ `BILLED` khỏi status flow của orders.

## 3. User Review Required

- **Xác nhận Schema Status:** Schema `orders.order_status` hiện đang dùng TEXT với các trạng thái cũ `('NEW' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'CANCELLED')`. Việc sử dụng `DRAFT` và `CLOSED` thay cho `NEW` và `CANCELLED` cần một script ALTER. Chúng ta sẽ thêm script migration `070_update_order_status.sql` để điều chỉnh check constraint hoặc rule.
- **Form Tạo Đơn:** Chỉ tạo giao diện đơn giản (Header + Add lines inline). Không dùng wizard phức tạp.

## 4. Proposed Changes

### Database Migrations

#### [NEW] `supabase/migrations/070_update_order_status.sql`
- Điều chỉnh check constraint cho `orders.order_status` để phản ánh flow mới: `DRAFT`, `CONFIRMED`, `IN_PRODUCTION`, `SHIPPED`, `CLOSED`, `CANCELLED`.
- Giữ lại `CANCELLED` như một trạng thái ngoại lệ.

### Master Data: Customers

#### [NEW] `src/app/master/customers/page.tsx`
- Server Component (danh sách khách hàng).
- Data table (`data-table`) gọi dữ liệu từ bảng `companies`.
- Search, Pagination, Sort mặc định theo `sort_order` hoặc tên KH.

#### [NEW] `src/app/master/customers/[id]/page.tsx`
- Giao diện chi tiết với Detail Page Pattern.
- Header: Thông tin Công ty.
- 3 Tabs: 
  - **Thông tin KH**: Các `company_contacts`, `delivery_sites` (hiện tại read-only).
  - **Đơn hàng lịch sử**: Danh sách `orders` liên quan (sắp xếp giảm dần theo ngày).
  - **Sản phẩm thuộc KH**: Danh sách `products` của khách hàng này.

### Transactions: Orders

#### [NEW] `src/app/orders/page.tsx`
- Server Component hiển thị danh sách toàn bộ `orders`.
- Cột: Mã Đơn hàng (`order_no`), Khách hàng, Trạng thái, Ngày đặt (`order_date`), Ngày giao yêu cầu (`requested_delivery`).
- Sắp xếp: Mới nhất ở trên cùng (`order_date DESC`).

#### [NEW] `src/app/orders/[id]/page.tsx`
- Giao diện chi tiết đơn hàng (Header + Tabs).
- Tab 1: **Chi tiết Đơn (Lines)** - Grid/Bảng hiển thị `order_lines` (có form inline để add/edit line cho đơn DRAFT).
- Tab 2: **Lệnh sản xuất (WOs liên quan)** - Danh sách `work_orders` có `work_orders.order_id = orders.order_id`. Cung cấp UI component cho phép search WO (đặc biệt WO-L-xxx) và gán `order_id` vào WO đó (Link thủ công).

#### [NEW] `src/components/orders/OrderHeaderForm.tsx`
- Component cho Header của Order, cho phép sửa đổi `order_no`, `order_date`, `target_delivery_date`.

#### [NEW] `src/components/orders/OrderLineForm.tsx`
- Component dạng inline-row để thêm/sửa `order_lines` nhanh chóng trên cùng trang.

#### [NEW] `src/components/orders/WorkOrderLinker.tsx`
- Sub-component nằm trong Tab "Lệnh sản xuất".
- Chứa input search `AsyncSearchableSelect` để tìm Work Order theo mã hoặc tên.
- Action: Bấm "Liên kết" → gọi API cập nhật `work_orders.order_id = current_order_id`.

## 5. Verification Plan

### Automated Checks
- `npx tsc --noEmit` sau khi code xong UI và Actions.
- Chạy script kiểm tra i18n keys: `node scripts/check_translations.mjs`.

### Manual Verification
1. Mở `/master/customers`, chọn một Khách hàng, xem đủ 3 tab.
2. Tạo thử Đơn hàng mới cho khách đó.
3. Trong chi tiết đơn hàng, nhập thêm Line sản phẩm.
4. Chuyển qua tab "Lệnh sản xuất", tìm kiếm `WO-L-1248` và tiến hành link vào đơn hàng mới tạo.
5. Kiểm tra DB xem `work_orders.order_id` đã được gán chính xác hay chưa.
