# Sổ Bài Học Kinh Nghiệm (Lessons Learned) — YSDMS NextGen

Tài liệu ghi nhận các sự cố kỹ thuật, lỗi cú pháp, sai sót quy trình và bài học kinh nghiệm trong quá trình phát triển, kiểm toán và di chuyển dữ liệu hệ thống YSDMS NextGen.

---

## Mục lục
1. [L001 - Lỗi cú pháp json_build_object trong truy vấn Preflight Verification](#l001---lỗi-cú-pháp-json_build_object-trong-truy-vấn-preflight-verification)

---

## L001 - Lỗi cú pháp json_build_object trong truy vấn Preflight Verification

- **Thời gian ghi nhận:** 2026-10-06 17:36 JST
- **Phân loại:** Quy trình / SQL syntax / preflight verification
- **Thành phần ảnh hưởng:** Scripts kiểm tra Preflight cho Work Log Pilot trên Supabase PostgreSQL
- **Mô tả sự cố:**
  - Trong quá trình xây dựng truy vấn Preflight read-only nhằm kiểm tra đồng thời nhiều điều kiện ràng buộc (`job_exists`, `step_exists`, `employee_exists`, `processing_code_exists`, `existing_job_worklogs`, `baseline_count`), truy vấn ban đầu khi sử dụng hàm `json_build_object` của PostgreSQL gặp lỗi cú pháp do lồng ghép subquery vô hướng (scalar subqueries) hoặc đóng mở ngoặc/dấu phẩy không đúng vị trí.
- **Nguyên nhân gốc rễ (Root Cause):**
  - Cú pháp `json_build_object('key', (SELECT ...))` đòi hỏi mọi scalar subquery phải được bọc trong cặp ngoặc đơn `(...)` độc lập và các cặp key-value phải phân tách đúng quy chuẩn PostgreSQL. Khi viết truy vấn dài trong một lệnh duy nhất, việc thiếu ngoặc hoặc ép kiểu trực tiếp dẫn đến lỗi `syntax error at or near...`.
- **Giải pháp & Khắc phục:**
  1. Tách bạch các scalar subquery trong `SELECT` trước khi wrap vào JSON, hoặc sử dụng cấu trúc `SELECT ... FROM (SELECT ...) AS sub` rõ ràng.
  2. Kiểm tra cú pháp bằng dry-run hoặc kiểm tra trực tiếp qua pg client / Supabase SQL Editor ở chế độ read-only trước khi đưa vào tài liệu nghiệm thu.
  3. Cả PE và AN đã chuẩn hóa cú pháp preflight thành công với kết quả trả về JSON hợp lệ 100%.
- **Bài học rút ra (Takeaway):**
  - Đối với các truy vấn Preflight/Postflight quan trọng, ưu tiên viết dạng bảng phẳng `SELECT (SELECT ...) AS col1, (SELECT ...) AS col2` hoặc script Node.js / TypeScript đã có linter và kiểu dữ liệu rõ ràng, tránh phụ thuộc vào các câu lệnh SQL chuỗi dài không qua validate tĩnh.
