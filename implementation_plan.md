# Priority 8a: Data Reconciliation Module - Diff Engine (Companies)

Mục tiêu: Xây dựng bộ đồng bộ hóa (Continuous Sync Engine) cho phép đọc `companies.csv` và `customers.csv` từ thư mục `source_data/csv-access-data/`, so sánh với dữ liệu đang có trên Supabase (bảng `companies`), và xuất báo cáo sự sai khác (Diff Report) trước khi thực hiện cập nhật an toàn (Upsert).

## Nguyên tắc thiết kế (Core Principles)
1. **SSOT Anchor**: Sử dụng cột `legacy_id` (VD: `CUST-12`, `COMP-45`) làm định danh mỏ neo không bao giờ thay đổi.
2. **Deterministic UUID**: Không dùng `uuid.uuid4()`. Nếu `legacy_id` đã có trong DB, tái sử dụng UUID cũ. Nếu chưa có, tạo UUID mới.
3. **Dry-run Mặc định**: Chỉ quét và báo cáo, tuyệt đối không gọi lệnh Insert/Update nếu không có cờ `--apply`.
4. **Field-level Diffing**: So sánh từng trường (Tên công ty, Mã công ty, v.v.). Báo cáo chính xác trường nào đổi từ giá trị cũ sang giá trị mới.

## Proposed Changes

### [NEW] `scripts/continuous_sync/sync_companies.py`
Script Python chạy trên CLI, thực hiện các bước sau:
1. **Load DB State**: Truy vấn bảng `companies` trên Supabase, lấy về danh sách tất cả các bản ghi, tạo Map `[legacy_id] -> DatabaseRecord`.
2. **Read CSVs**: Đọc `customers.csv` và `companies.csv` bằng thư viện có sẵn `utils.csv_reader`.
3. **Diff Engine**:
   - Duyệt qua từng dòng CSV, tính toán `legacy_id`.
   - Nếu `legacy_id` KHÔNG có trong Map -> Đánh dấu trạng thái **[INSERT]** (Thêm mới).
   - Nếu `legacy_id` CÓ trong Map -> So sánh từng field (Tên, Code, Type...).
     - Nếu giống nhau 100% -> Đánh dấu **[UNCHANGED]** (Bỏ qua).
     - Nếu có khác biệt -> Đánh dấu **[UPDATE]** (Cập nhật), lưu lại cụ thể `Old Value -> New Value`.
4. **Report Output**: Sinh ra file `sync_report_companies.txt` tổng hợp số lượng Insert, Update, Unchanged và chi tiết các dòng bị thay đổi.
5. **Apply Logic**: Nếu chạy với `--apply`, sẽ gom các bản ghi [INSERT] và [UPDATE] thành một danh sách và gọi lệnh `.upsert(data, on_conflict='company_id')`.

## Verification Plan
1. **Test 1 - Dry Run Ban Đầu**: Chạy script trên data hiện tại. Vì Web chưa sửa gì nhiều so với Access, hầu hết sẽ rơi vào [UNCHANGED].
2. **Test 2 - Phát hiện thay đổi**: Cố tình sửa 1 dòng trong `customers.csv` (VD: Đổi tên công ty), và thêm 1 dòng mới tinh. Chạy lại script. Đảm bảo Report báo chính xác 1 dòng UPDATE và 1 dòng INSERT.
3. **Test 3 - Không vỡ khóa ngoại**: Đảm bảo UUID của dòng bị thay đổi vẫn giữ nguyên, không làm đứt gãy các bảng phụ thuộc (VD: `orders.company_id`).

## Open Questions
- Với `companies`, Access có 2 file là `customers.csv` và `companies.csv`. Nếu 2 file này có chung 1 thực thể (VD: cùng 1 công ty nhưng tồn tại ở cả 2 file), chúng ta vẫn sẽ ưu tiên `customers.csv` như code seeding cũ chứ?
