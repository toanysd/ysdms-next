# INCIDENT REPORT: 2026-08-28 Data Loss & Recovery

## Bối cảnh sự cố
- **Thời điểm xảy ra:** Sáng ngày 2026-08-28
- **Tác động:** Mất toàn bộ dữ liệu giao dịch và master data trên môi trường Supabase, bao gồm các bảng cốt lõi: `design_revisions`, `equipment`, `work_orders`, `jobs`, `job_steps`, và `work_logs`.

## Nguyên nhân gốc rễ (Root Cause)
Sự cố xảy ra khi AI Agent thực hiện lệnh xoá sạch một bảng master để cập nhật lại dữ liệu (seed). Tuy nhiên, Agent đã lạm dụng lệnh:
```sql
TRUNCATE TABLE [table_name] CASCADE;
```
Bởi vì cấu trúc cơ sở dữ liệu V3 liên kết chặt chẽ qua các khóa ngoại (Foreign Keys) nhiều tầng (Cascade Integrity), cờ `CASCADE` đã gây ra hiệu ứng domino. Nó không chỉ xóa bảng mục tiêu mà còn **âm thầm xóa sạch mọi bản ghi ở tất cả các bảng con phụ thuộc**, dẫn đến việc toàn bộ hệ sinh thái dữ liệu bị quét sạch ngoài ý muốn của Agent.

## Timeline Khôi Phục (Recovery)
Sự cố ngay lập tức được PE phát hiện. Một phiên khôi phục khẩn cấp đã được thiết lập:
1. **Phân tích nguyên nhân:** PE chặn đứng các hành động ghi đè, và phân tích log để xác định nguyên nhân là lệnh `TRUNCATE CASCADE`.
2. **Stage A (Phục hồi Master Data):**
   - Import và hợp nhất `molds.csv` + `molddesign.csv`.
   - Viết script Python (REST API Bypass RLS) đẩy 4,622 `design_revisions` và 5,806 `equipment` lên Supabase.
   - Xử lý hoàn hảo mã trùng lặp bằng suffix `-2, -3`.
3. **Stage B (Phục hồi Transaction Data):**
   - Đọc và map 4 tầng: `jobs.csv` -> `processingdeadline.csv` -> `worklog.csv`.
   - Thiết lập các UNIQUE INDEX và sử dụng cơ chế kiểm tra Idempotency tuyệt đối không dùng fallback giả cho khoá ngoại.
   - Kết quả: Phục hồi 817 `work_orders` + 817 `jobs` + 1,524 `job_steps` + 5,296 `work_logs`. Mọi liên kết ForeignKey (Thiết bị, Nhân viên) đều chính xác.

## Quy tắc bắt buộc từ nay (Mandatory Rules)
Sự cố này để lại bài học quan trọng về quản lý vòng đời dữ liệu trên cơ sở dữ liệu ràng buộc cao. Bắt buộc mọi AI Agent và Developer tuân thủ nghiêm ngặt quy tắc sau từ nay về sau:

1. **Tuyệt đối CẤM sử dụng `TRUNCATE ... CASCADE`:**
   Không bao giờ được sử dụng lệnh này trên bất kỳ bảng nào có khóa ngoại được tham chiếu (Referenced Foreign Keys).

2. **Luôn sử dụng `DELETE` có điều kiện:**
   Nếu cần dọn dẹp hoặc cập nhật lại dữ liệu, hãy sử dụng lệnh `DELETE` với mệnh đề `WHERE` rõ ràng (Ví dụ: xóa các dòng thuộc về import lô cụ thể).

3. **Kiểm tra phụ thuộc (`pg_depend`):**
   Nếu thực sự phải tác động cấu trúc hoặc xóa lượng lớn dữ liệu, trước tiên BẮT BUỘC phải truy vấn các phụ thuộc để đánh giá mức độ ảnh hưởng (Radius of Impact).

4. **Tính Idempotent và Trung thực khi Import:**
   - Script import phải được thiết kế dạng upsert (`ON CONFLICT`) hoặc có filter chống trùng lặp.
   - **Tất cả các khoá ngoại (FK) không resolve được phải được đẩy vào exception log.** Tuyệt đối không được phép sinh dữ liệu giả (fallback fake ID/fake NULL) để vượt qua ràng buộc NOT NULL. Sự trung thực của dữ liệu quan trọng hơn tỷ lệ "thành công" giả tạo.

---
*Báo cáo được lập bởi Antigravity (AI Agent) dưới sự giám sát và phê duyệt của PE.*
