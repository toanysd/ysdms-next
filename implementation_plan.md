# Kế hoạch Triển khai: Data Sync Center & Data Remapping (Priority 8b)

**Mục tiêu**: Xây dựng một module UI chuẩn trên Web (Next.js) để tự động hóa việc đồng bộ dữ liệu từ Access (CSVs) sang Supabase, đồng thời cung cấp giao diện trực quan để làm sạch 1.271 công ty rác hiện tại mà không làm hỏng 5.410 Khóa ngoại (FKs).

Thay vì dùng các script Python thủ công chạy ngầm (đã gây ra việc rác dữ liệu trước đây), hệ thống này sẽ mang lại quyền kiểm soát 100% cho người dùng cuối.

## 1. Trả lời các câu hỏi của Anh Thoan
- **Tính năng này đã có chưa?** Chưa có trên Web. Trước đây chúng ta chỉ dùng các đoạn script Python rải rác trong `source_data/scripts/` để đẩy data 1 chiều. Các script này không có cơ chế đối chiếu (Diff), dẫn đến việc sinh ra 1.271 công ty rác bị lặp lặp.
- **Có thể tự động hóa về sau không?** CÓ THỂ. Khi có UI, anh chỉ cần kéo thả file CSV mới nhất xuất từ Access vào. Hệ thống sẽ tự phân tích dòng nào thêm mới, dòng nào cập nhật, và hỏi anh có muốn đồng bộ hay không.

## 2. Kiến trúc Module `Data Sync Center`

**Route dự kiến:** `/master/data-sync` (Nằm trong menu Master Data)

### 2.1. Tab 1: CSV Sync & Diff Report (Đồng bộ định kỳ)
Giao diện cho phép:
1. Upload file CSV (vd: `customers.csv`, `mold_masters.csv`).
2. **Diff Engine (Chạy trên trình duyệt/Server Action)**:
   - Đọc CSV và đối chiếu với Database bằng `legacy_id`.
   - Hiển thị Bảng Báo Cáo (Preview):
     - 🟢 **New**: Có bao nhiêu dòng mới hoàn toàn.
     - 🟡 **Updated**: Có bao nhiêu dòng có thay đổi (chỉ ghi đè nếu `is_manually_edited = false`).
     - ⚪ **Unchanged**: Dữ liệu không đổi.
3. Nút **"Xác nhận Đồng bộ" (Execute Sync)**: Khi bấm, hệ thống sẽ thực hiện UPSERT an toàn thông qua Supabase RPC, có Transaction.

### 2.2. Tab 2: Orphan Resolution & Remapping (Xử lý dọn rác lịch sử)
Giải quyết dứt điểm 1.271 công ty rác và 5.410 FKs (Khóa ngoại) hiện tại.
Giao diện sẽ hiển thị 1 bảng (Data Table) chuyên dụng:
- **Cột 1 (Dữ liệu rác)**: Tên công ty không chuẩn (vd: `Cong ty TNHH ABC (giao hang)`).
- **Cột 2 (Mức độ ảnh hưởng)**: Đang được dùng bởi bao nhiêu Đơn hàng / Sản phẩm (vd: `52 Orders, 13 Products`).
- **Cột 3 (Gợi ý chuẩn hóa)**: Dropdown chứa 795 công ty chuẩn (SSOT). Hệ thống tự fuzzy-search để gợi ý tên giống nhất (vd: `CUST-102: ABC Co., Ltd`).
- **Hành động**: Nút **"Remap & Khóa"**. Khi bấm, Server Action sẽ:
  1. Trỏ (UPDATE) 52 Orders và 13 Products kia sang ID của `CUST-102`.
  2. Đánh dấu `is_active = false` cho công ty rác kia để nó biến mất khỏi hệ thống.

## 3. Các bước code (Thứ tự thực hiện)

### Bước 1: UI / Layout (Client)
- Đăng ký route mới vào `Sidebar.tsx`.
- Tạo `src/app/master/data-sync/page.tsx`.
- Dựng UI Tabs và Data Table (sử dụng thư viện UI hiện có, tuân thủ `AGENTS.md`).

### Bước 2: Server Actions & Supabase RPC (Backend)
- Viết hàm `reconcile_company_fks(old_id, new_id)` trong Supabase bằng PL/pgSQL để đảo FK an toàn và có Transaction.
- Viết API route hoặc Server Action để parse CSV trả về JSON Diff.

### Bước 3: Áp dụng dọn rác đợt 1
- Hướng dẫn Anh Thoan dùng chính công cụ UI này để xử lý 10-20 công ty rác có lượng FK lớn nhất để kiểm chứng độ an toàn trên Production.

## 4. User Review Required (Cần phê duyệt)
> [!IMPORTANT]
> - Anh Thoan có đồng ý xây dựng tính năng này thành 1 trang UI trên Web theo kiến trúc trên không?
> - Trước mắt chúng ta sẽ làm tính năng Sync cho bảng **Công ty (Companies)** trước, sau khi ổn định sẽ mở rộng kiến trúc này cho bảng **Khuôn/Thiết bị** và **Sản phẩm**.
