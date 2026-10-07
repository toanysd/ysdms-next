# Sổ Bài Học Kinh Nghiệm (Lessons Learned) — YSDMS NextGen

Tài liệu ghi nhận các sự cố kỹ thuật, lỗi cú pháp, sai sót quy trình và bài học kinh nghiệm trong quá trình phát triển, kiểm toán và di chuyển dữ liệu hệ thống YSDMS NextGen.

---

## Mục lục
1. [L001 - Lỗi cú pháp json_build_object trong truy vấn Preflight Verification](#l001---lỗi-cú-pháp-json_build_object-trong-truy-vấn-preflight-verification)
2. [L002 - Lỗi thiếu dấu phẩy trong JSON scalar postflight](#l002---lỗi-thiếu-dấu-phẩy-trong-json-scalar-postflight)
3. [L003 - PE truy vấn sai entity_type khiến STEP/WORK_LOG bị báo 0](#l003---pe-truy-vấn-sai-entity_type-khiến-stepwork_log-bị-báo-0)
4. [L004 - Commit SHA local chưa push lên remote GitHub nhưng được báo làm bằng chứng kiểm chứng độc lập](#l004---commit-sha-local-chưa-push-lên-remote-github-nhưng-được-báo-làm-bằng-chứng-kiểm-chứng-độc-lập)

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

---

## L002 - Lỗi thiếu dấu phẩy trong JSON scalar postflight

- **Thời gian ghi nhận:** 2026-10-06 17:42 JST
- **Phân loại:** Quy trình / SQL syntax / postflight verification
- **Trạng thái:** Resolved (Đã có helper chuẩn hóa)
- **Bảng tóm tắt:**
  | Mã | Tiêu đề | Nguyên nhân | Biểu hiện | Giải pháp khắc phục | Trạng thái |
  |---|---|---|---|---|---|
  | **L002** | Lỗi thiếu dấu phẩy trong JSON scalar postflight | Truy vấn dài viết thủ công | Supabase syntax error tại `step_status_after` | Tạo query từ danh sách key/value có kiểm tra cú pháp trước khi chạy, chuẩn hóa helper tạo scalar audit | Resolved |
- **Mô tả sự cố:**
  - Khi PE thực hiện truy vấn Postflight độc lập trên Supabase Production để nghiệm thu bản ghi Pilot Work Log, truy vấn chuỗi dài dạng `json_build_object('k1', (SELECT ...), 'k2', (SELECT ...))` bị thiếu dấu phẩy giữa key `step_status_after` và scalar subquery kế tiếp, dẫn đến lỗi cú pháp PostgreSQL khi parse JSON object.
- **Nguyên nhân gốc rễ (Root Cause):**
  - Viết thủ công các câu truy vấn JSON scalar dài trong môi trường prompt/CLI mà không có công cụ tự động kiểm tra cú pháp (linter/formatter) trước khi thực thi. Việc ghép chuỗi đa dòng nhiều tham số dễ gây sót dấu phân cách.
- **Giải pháp & Hành động khắc phục:**
  1. Đã xây dựng helper module `scripts/generate_scalar_audit.mjs` nhận mảng các cặp `[key, sql_expression]` và tự động sinh câu truy vấn SQL chuẩn cú pháp với đầy đủ dấu phẩy và ngoặc đơn bảo đảm không lỗi cú pháp.
  2. Tuyệt đối không viết thủ công các query JSON dài trực tiếp vào console hoặc prompt khi chưa qua script kiểm tra tĩnh.
  3. AN và PE đã đối chiếu độc lập và hoàn tất nghiệm thu chính xác với kết quả trả về đầy đủ 10 trường dữ liệu postflight.

---

## L003 - PE truy vấn sai entity_type khiến STEP/WORK_LOG bị báo 0

- **Thời gian ghi nhận:** 2026-10-06 19:30 JST (Giải trình & nghiệm thu: 2026-10-07 10:37 JST)
- **Phân loại:** Quy trình / Schema-audit query / Đối chiếu enum
- **Trạng thái:** Resolved (PE đã nghiệm thu độc lập sau khi đối chiếu đúng enum)
- **Bảng tóm tắt theo mẫu bắt buộc:**
  | Ngày | Tiêu đề | Nguyên nhân | Biểu hiện | Giải pháp khắc phục | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-06 | PE truy vấn sai entity_type khiến STEP/WORK_LOG bị báo 0 | Không đối chiếu enum thực tế trước khi viết audit query | Query PE dùng job_step/work_log; Production dùng STEP/WORK_LOG | Trước mọi audit phải SELECT DISTINCT giá trị enum thực tế rồi mới filter | Open |

- **Mô tả sự cố:**
  - Trong quá trình kiểm toán độc lập sau khi nạp bảng `staging_access_delta_b1`, PE chạy truy vấn lọc số dòng `entity_type = 'job_step'` và `entity_type = 'work_log'`. Cả hai truy vấn đều trả về `0` dòng, dẫn đến nghi vấn dữ liệu 6 Step và 5 Work Log bị thiếu hoặc nạp sai thực thể.
- **Nguyên nhân gốc rễ (Root Cause):**
  - Không đối chiếu giá trị thực tế của trường trước khi viết câu truy vấn kiểm toán. Trong khi Staging B1 lưu `entity_type` theo quy ước ENUM in hoa (`'STEP'` và `'WORK_LOG'`), truy vấn kiểm toán lại dùng chuỗi thường (`'job_step'` và `'work_log'`). Do PostgreSQL phân biệt chữ hoa chữ thường (`Case-Sensitive`), điều kiện so sánh chuỗi không khớp.
- **Giải pháp & Khắc phục:**
  1. AN thực hiện kiểm toán chỉ-đọc xuất `SELECT entity_type, source_table, count(*)` và `SELECT DISTINCT entity_type`, chứng minh đầy đủ 6 dòng `STEP` và 5 dòng `WORK_LOG`.
  2. PE cập nhật truy vấn độc lập sang `entity_type = 'STEP'` và `entity_type = 'WORK_LOG'`, nghiệm thu độc lập đạt 100% (6 STEP, 5 WORK_LOG, 11 staging rows, baseline Production bất biến).
  3. Không thực hiện lệnh `UPDATE` staging chỉ để đổi casing.
- **Bài học rút ra (Takeaway):**
  - Trước mọi phiên kiểm toán độc lập trên bất kỳ cột enum/phân loại nào, bắt buộc phải chạy `SELECT DISTINCT <column>` để xác nhận tập giá trị thực tế trước khi đặt điều kiện `WHERE`.

---

## L004 - Commit SHA local chưa push lên remote GitHub nhưng được báo làm bằng chứng kiểm chứng độc lập

- **Thời gian ghi nhận:** 2026-10-07 10:43 JST
- **Phân loại:** Quy trình / Git packaging / Đồng bộ hồ sơ liên tác nhân
- **Trạng thái:** Resolved (Được Thoan phê duyệt push và đối chiếu remote)
- **Bảng tóm tắt theo mẫu bắt buộc:**
  | Ngày | Tiêu đề | Nguyên nhân | Biểu hiện | Giải pháp khắc phục | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-07 | Commit SHA local chưa push lên remote GitHub | Tuân thủ rule cấm tự push khi chưa có yêu cầu nhưng báo SHA như thể đã public | GitHub trả về "No commit found for SHA" khi PE kiểm tra độc lập | Ghi rõ trạng thái local-only/remote-not-verified, chỉ push khi Thoan duyệt và xác minh ls-remote | Resolved |

- **Mô tả sự cố:**
  - Sau khi hoàn thành dry-run B1, AN thực hiện commit cục bộ `8c19997...` chứa tài liệu báo cáo và payload. Do tuân thủ quy tắc "KHÔNG tự động git push mã nguồn trừ khi có YÊU CẦU TRỰC TIẾP từ người dùng", commit chưa được đẩy lên GitHub. Tuy nhiên, trong báo cáo bàn giao gửi PE, AN đã cung cấp full commit SHA mà không nêu rõ cờ `local-only`, dẫn đến việc PE kiểm tra trên GitHub nhận kết quả "No commit found for SHA".
- **Nguyên nhân gốc rễ (Root Cause):**
  - Thiếu quy ước phân biệt minh thị giữa commit SHA cục bộ (`local-only`) và commit SHA đã public trên remote (`remote-verified`).
- **Giải pháp & Khắc phục:**
  1. Minh Chủ Thoan chính thức phê duyệt cho phép đẩy commit lên `origin main`.
  2. Bổ sung kiểm tra chéo bằng `git ls-remote origin refs/heads/main` để lấy đúng SHA remote sau khi push.
  3. Mọi báo cáo bàn giao sau này nếu commit chưa push PHẢI ghi rõ: `local-only / remote-not-verified`.
- **Bài học rút ra (Takeaway):**
  - Mọi bằng chứng SHA gửi cho bên thứ ba hoặc kiểm toán viên độc lập phải đi kèm trạng thái xác thực trên GitHub (Remote URL hoặc cờ local-only).
