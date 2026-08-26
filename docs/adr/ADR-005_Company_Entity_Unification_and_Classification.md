# ADR-005: Company Entity Unification and Classification

**Ngày lập**: 2026-08-26
**Trạng thái**: Đã phê duyệt
**Người phê duyệt**: Anh Thoan, PE

## Bối cảnh
Dữ liệu khách hàng/công ty (`companies`) trên hệ thống hiện đang bị phân mảnh và chứa nhiều rác do việc kết hợp từ 2 nguồn CSV trên Access:
- `customers.csv`: Sinh ra từ tiền tố mã khuôn (Ví dụ: YSD, TE, AMP). Chứa dữ liệu của "Chủ khuôn" (Mold Owner). Đáng tin cậy. (Tiền tố `legacy_id` là `CUST-`)
- `companies.csv`: Sinh ra từ việc bóc tách tên thư mục lưu đơn hàng/khay. Chứa nhiều rác (tên file .pdf, .xls, ghi chú) và dễ bị sai lệch. (Tiền tố `legacy_id` là `COMP-`)

Trước đây, có đề xuất tách ra thành 2 bảng riêng biệt. Tuy nhiên, quan hệ giữa chủ khuôn, khách đặt hàng, công ty nhánh và nơi giao hàng rất phức tạp và chồng chéo. Việc tách 2 bảng sẽ gây khó khăn cho truy vấn và liên kết dữ liệu.

## Quyết định
1. **KHÔNG TÁCH BẢNG**: Vẫn duy trì 1 bảng duy nhất là `companies`.
2. **Sử dụng `company_type` array và `parent_company_id`** để giải quyết các mối quan hệ phức tạp.
3. **Thêm `MOLD_OWNER` vào enum `company_type`**.
4. **Sử dụng `legacy_id` làm khóa duy nhất (UNIQUE)** để định danh thực thể khi đồng bộ dữ liệu từ Access sang Web.
5. **Thêm cơ chế chống ghi đè**: Bổ sung cột `is_manually_edited` và `last_synced_at` để bảo vệ dữ liệu đã được người dùng chỉnh sửa tay trên Web khỏi bị đè bởi script đồng bộ (CSV Sync).
6. **Làm sạch Database**: Sử dụng bộ dữ liệu chuẩn hóa ngày 07/08/2026 (`company_normalized.json` gồm 795 công ty sạch) làm Nguồn Sự Thật (SSOT) để làm sạch bảng `companies` hiện tại (2.214 công ty).
7. **Đồng bộ ngược về Access**: Sau khi hoàn tất làm sạch, Web sẽ xuất ngược file CSV chuẩn để Access sử dụng, biến Supabase thành SSOT vĩnh viễn.

## Hệ quả
- Schema sẽ an toàn hơn và hỗ trợ tốt việc đồng bộ liên tục (Continuous Sync).
- Cần thực hiện script Fuzzy Match & Merge để gom 2.214 dòng về 795 dòng mà không làm đứt gãy Khóa ngoại (Foreign Keys) đang có. Script này phải chạy dưới dạng Dry-run và được phê duyệt trước khi apply.
