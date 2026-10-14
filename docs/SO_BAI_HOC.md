# Sổ Bài Học Kinh Nghiệm (Lessons Learned) — YSDMS NextGen

Tài liệu ghi nhận các sự cố kỹ thuật, lỗi cú pháp, sai sót quy trình và bài học kinh nghiệm trong quá trình phát triển, kiểm toán và di chuyển dữ liệu hệ thống YSDMS NextGen.

---

## Mục lục
1. [L001 - Lỗi cú pháp json_build_object trong truy vấn Preflight Verification](#l001---lỗi-cú-pháp-json_build_object-trong-truy-vấn-preflight-verification)
2. [L002 - Lỗi thiếu dấu phẩy trong JSON scalar postflight](#l002---lỗi-thiếu-dấu-phẩy-trong-json-scalar-postflight)
3. [L003 - PE truy vấn sai entity_type khiến STEP/WORK_LOG bị báo 0](#l003---pe-truy-vấn-sai-entity_type-khiến-stepwork_log-bị-báo-0)
4. [L004 - Commit SHA local chưa push lên remote GitHub nhưng được báo làm bằng chứng kiểm chứng độc lập](#l004---commit-sha-local-chưa-push-lên-remote-github-nhưng-được-báo-làm-bằng-chứng-kiểm-chứng-độc-lập)
5. [L005 - Sai lệch Commit SHA do không trích xuất trực tiếp bằng lệnh git rev-parse HEAD](#l005---sai-lệch-commit-sha-do-không-trích-xuất-trực-tiếp-bằng-lệnh-git-rev-parse-head)
6. [L006 - Mâu thuẫn quy tắc git push trong .agents/AGENTS.md và vi phạm giới hạn Compact Payload 150 dòng](#l006---mâu-thuẫn-quy-tắc-git-push-trong-agentsagentsmd-và-vi-phạm-giới-hạn-compact-payload-150-dòng)
7. [L007 - Truy vấn bảng/cột/constraint phỏng đoán chưa đối chiếu information_schema.tables, information_schema.columns và trigger/constraint](#l007---truy-vấn-bảngcộtconstraint-phỏng-đoán-chưa-đối-chiếu-information_schematables-information_schemacolumns-và-triggerconstraint)

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

---

## L005 - Sai lệch Commit SHA do không trích xuất trực tiếp bằng lệnh git rev-parse HEAD

- **Thời gian ghi nhận:** 2026-10-08 08:20 JST
- **Phân loại:** Quy trình / Git verification / Chống sai lệch mã băm (Hash Integrity)
- **Trạng thái:** Resolved (Đã thiết lập quy tắc bắt buộc chạy `git rev-parse HEAD`)
- **Bảng tóm tắt theo mẫu bắt buộc:**
  | Ngày | Tiêu đề | Nguyên nhân | Biểu hiện | Giải pháp khắc phục | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-08 | Sai lệch Commit SHA trong báo cáo thẩm định | Nhập tay hoặc copy nhầm chuỗi hash trước khi lệnh git tạo commit hoàn tất | Báo cáo ghi SHA `62bb66b262...` trong khi remote commit thật là `62bb66bc93...` (chỉ trùng 7 ký tự đầu) | Bắt buộc chạy `git rev-parse HEAD` qua terminal và copy nguyên văn 40 ký tự vào báo cáo | Resolved |

- **Mô tả sự cố:**
  - Khi gửi REPORT thẩm định WO-P1-001 cho PE, chuỗi Commit SHA trong báo cáo ghi `62bb66b2628464303dca8d81ddba0a911eb9c9b3`, trong khi commit thực tế trên origin/main là `62bb66bc933963c37a5dca345d1efac2ebbcbea7`. Cả hai chỉ trùng 7 ký tự đầu `62bb66b`. Khi PE kiểm toán độc lập trên GitHub, chuỗi SHA báo cáo trả về `Not Found`.
- **Nguyên nhân gốc rễ (Root Cause):**
  - Do thao tác gán nhãn SHA thủ công hoặc copy từ draft/temp hash trước khi git hoàn tất quá trình đóng gói commit cuối cùng, không kiểm tra lại bằng lệnh `git rev-parse HEAD`.
- **Giải pháp & Hành động khắc phục:**
  1. Ban hành quy tắc sắt: Tuyệt đối KHÔNG gõ tay, đoán hoặc copy tạm chuỗi SHA.
  2. BẮT BUỘC chạy lệnh: `git rev-parse HEAD` ngay sau khi `git commit` thành công để lấy chính xác 40 ký tự hex trực tiếp từ output của Git engine.
  3. Kiểm tra đối chiếu với `git log -1 --format="%H"` trước khi paste vào văn bản báo cáo hoặc gửi qua Kênh C/pe_an_messages.
- **Bài học rút ra (Takeaway):**
  - Hash integrity là nguyên tắc sống còn trong kiểm toán phần mềm phân tán. 1 ký tự sai lệch là toàn bộ chuỗi chứng thực độc lập bị vô hiệu hóa.

---

## L006 - Mâu thuẫn quy tắc git push trong .agents/AGENTS.md và vi phạm giới hạn Compact Payload 150 dòng

- **Thời gian ghi nhận:** 2026-10-14 10:18 JST
- **Phân loại:** Quy trình / Quản trị quy tắc AI (`AGENTS.md`) & Giao thức Realtime Bridge
- **Trạng thái:** Resolved (Đã hợp nhất `AGENTS.md` $\le 12\text{ KB}$, thay `.agents/AGENTS.md` bằng stub tham chiếu)
- **Bảng tóm tắt theo mẫu 6 cột bắt buộc:**
  | Ngày | Sự việc | Nguyên nhân gốc | Bằng chứng | Quy tắc đề xuất | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-14 | Mâu thuẫn quy tắc `git push` tại `.agents/AGENTS.md:31-33` và gửi payload >150 dòng qua `pe_an_messages` | Tồn tại 2 file `AGENTS.md` (21.2 KB) và `.agents/AGENTS.md` (30.7 KB, bị cắt cụt 6,714 bytes); khi bổ sung quy tắc vào `.agents/AGENTS.md` đã ghi chồng 2 dòng trái ngược nhau và AN nối cả 5 file (489 dòng) vào `content_md` | `.agents/AGENTS.md:31` ghi *"BẮT BUỘC TỰ ĐỘNG git push"* cho tài liệu, nhưng `:33` ngay dưới ghi *"Lưu ý: Chỉ khi nào có yêu cầu mới thực hiện đẩy lên github"*; `pe_an_messages` message `f7d41e27-...` chứa nối gộp 5 file `.md` | Hợp nhất thành 1 file `AGENTS.md` duy nhất ($\le 12\text{ KB}$), `.agents/AGENTS.md` chỉ giữ stub tham chiếu; chỉ `git push` khi có chỉ thị phê duyệt từ THOAN/PE; gói tin `pe_an_messages` bắt buộc $\le 150$ dòng | Resolved |

---

## L007 - Truy vấn bảng/cột/constraint phỏng đoán chưa đối chiếu `information_schema.tables`, `information_schema.columns` và `trigger/constraint` (RULE-DATA-02)

- **Thời gian ghi nhận:** 2026-10-14 12:12 JST (Bổ sung hoàn thiện: 2026-10-14 12:24 JST)
- **Phân loại:** Tuân thủ Schema (`RULE-DATA-02`) & Bằng chứng Kiểm toán DB
- **Trạng thái:** Resolved (Đã bổ sung bước truy vấn `information_schema.tables`, `information_schema.columns`, `pg_constraint` / `pg_trigger` trước khi chạy audit/backfill và lưu log SQL thực tế vào artifact)
- **Bảng tóm tắt theo mẫu 6 cột bắt buộc:**
  | Ngày | Sự việc | Nguyên nhân gốc | Bằng chứng | Quy tắc đề xuất | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-14 | Dùng tên bảng/cột/constraint chưa kiểm chứng trong script audit (`c.short_name`, `s.shipment_no`, `s.backfill_status`, `s.status`, `profiles.email`, `business_cases.company_id`) và nêu cột trong báo cáo không kèm log `information_schema` | Viết SQL dựa trên trí nhớ/giả định thay vì truy vấn `information_schema.tables`, `information_schema.columns` và `trigger/constraint` (`pg_trigger`, `pg_constraint`) trước khi chạy; không lưu file log SQL thực tế | Lỗi PostgreSQL `code: '42703'` (`column does not exist`) khi chạy script audit; chỉ thị kiểm toán của PE lúc `2026-10-14 12:06 JST` và `12:16 JST` | Trước mọi truy vấn SQL audit/backfill hoặc khi lập đặc tả Work Order, bắt buộc truy vấn `information_schema.tables`, `information_schema.columns`, và `trigger/constraint` (`pg_trigger`, `pg_constraint`) kèm `NOW()`, đồng thời lưu log SQL đã chạy vào artifact hoặc tài liệu audit | Resolved |

---

## L008 - Gửi bằng chứng kiểm thử dưới dạng đường dẫn local (`C:/Users/...`) hoặc chỉ ghi chữ "PASS" khiến PE phân loại "chưa xác minh" (RULE-PROC-03)

- **Thời gian ghi nhận:** 2026-10-14 17:16 JST
- **Phân loại:** Chuẩn hóa Bằng chứng Nghiệm thu (`RULE-PROC-03` — Evidence Pack)
- **Trạng thái:** Resolved (Đã thiết lập `docs/audit_logs/YYYY-MM-DD_<work_order>.json` + `docs/audit_logs/screenshots/` trên GitHub và đệ trình DDL `public.pe_evidence_items`)
- **Bảng tóm tắt theo mẫu 6 cột bắt buộc:**
  | Ngày | Sự việc | Nguyên nhân gốc | Bằng chứng | Quy tắc đề xuất | Trạng thái |
  |---|---|---|---|---|---|
  | 2026-10-14 | PE ghi nhận nhiều mục *"chưa xác minh"* ở báo cáo Batch Commit 2 & Commit 3 (`WO-MOLD-UNIFY`) dù AN đã chạy `tsc`, `i18n`, `git grep` và chụp ảnh Playwright | AN lưu file JSON kiểm thử và ảnh chụp màn hình trong thư mục local (`C:/Users/.../.gemini/antigravity/brain/...`) mà PE không thể truy cập trực tiếp, đồng thời bản tóm tắt chỉ ghi `"PASS"` thay vì kèm log nguyên văn hoặc file JSON trên GitHub/Supabase | Chỉ thị & đánh giá của Minh Chủ THOAN và PE lúc `2026-10-14 16:52 JST`: PE đọc được GitHub (`get_commit`, `get_file_contents`) và Supabase SQL nhưng không đọc được đường dẫn local `C:/Users/...` | **“Không có Evidence Pack thì không có nghiệm thu” (`RULE-PROC-03`)**: Mọi báo cáo nghiệm thu phải commit `docs/audit_logs/YYYY-MM-DD_<work_order>.json` (gồm `TSC`, `I18N`, `GIT_GREP`, `BROWSER`, `SQL_AUDIT`, `SCREENSHOT`) + ảnh chụp tại `docs/audit_logs/screenshots/` lên GitHub và/hoặc ghi vào `public.pe_evidence_items` trên Supabase | Resolved |
