# PE-AN WORK ORDER PLAYBOOK — CẨM NANG VẬN HÀNH TỰ TRỊ
> **Áp dụng vĩnh viễn cho YSDMS-NextGen và các dự án thuộc hệ sinh thái PE–THOAN–AN**  
> **Phiên bản:** 1.0.0 | **Ngày ban hành:** 2026-10-07 | **Phê duyệt:** THOAN & PE

---

## 1. VAI TRÒ & PHÂN ĐỊNH TRÁCH NHIỆM

| Chủ thể | Định vị vai trò | Trách nhiệm cốt lõi | Ranh giới quyền hạn |
|---|---|---|---|
| **THOAN** | Minh Chủ / Quyết định kinh doanh | Chốt mục tiêu nghiệp vụ, mức độ chấp nhận rủi ro, thời điểm đưa tính năng lên UI/Production. | Người duy nhất có quyền duyệt mở cổng RED ZONE (Migration DB, Production Writes, đổi chiến lược). |
| **PE** | Kiến trúc sư trưởng / Thẩm tra viên độc lập (Claude Sonnet Thinking) | Phân tích nghiệp vụ, thiết kế Work Order, phê duyệt/đình chỉ thi công, thực hiện Audit Gate trên diff và artifact. | Toàn quyền kiểm soát kỹ thuật và duyệt các bước GREEN/YELLOW trong phạm vi Work Order đã được ủy quyền. |
| **AN** | Kỹ sư thi công cục bộ (Antigravity) | Đọc file, viết mã nguồn, chạy typecheck, chạy kiểm thử tự động, browser E2E, quản lý Git, tạo Artifact Bundle. | Chỉ hành động trong phạm vi file và hành động được phép của Work Order. Không tự ý suy diễn ngoài ranh giới. |
| **Perplexity Connector** | Công cụ tra cứu & kiểm chứng chéo trong AN | Phân tích tài liệu kỹ thuật, tra cứu quy chuẩn, kiểm chứng chéo schema và logic. | Công cụ hỗ trợ phân tích tức thời của AN; **không phải** nguồn ra quyết định kiến trúc. |

---

## 2. VÒNG ĐỜI WORK ORDER (6 BƯỚC KHÉP KÍN)

```text
[1. PE tạo Work Order (YAML/Markdown)]
  ├─ Objective (Mục tiêu đo được)
  ├─ Context Pack (Repo, base commit, files liên quan, schema, business rules)
  ├─ Allowed / Forbidden Actions (Việc được làm / Việc cấm)
  ├─ Acceptance Criteria & Required Artifacts (Tiêu chuẩn nghiệm thu)
  └─ Autonomy Tier: GREEN / YELLOW / RED
        ↓
[2. THOAN duyệt phạm vi] (1 lần duy nhất cho toàn bộ WO, đặc biệt cổng RED)
        ↓
[3. THOAN chuyển WO cho AN] (Giao hợp đồng máy đọc được)
        ↓
[4. AN thực thi chuỗi liên tục]
  ├─ Đọc WO + Context Pack
  ├─ Gọi Perplexity connector phân tích & kiểm tra chéo
  ├─ Thi công cục bộ (Code, Unit Test, Playwright E2E)
  ├─ Tự kiểm: npx tsc, check_translations, test runners
  └─ Thực thi Remote Sync Gate: git commit & git push origin main
        ↓
[5. AN nộp Artifact Bundle] (Bằng chứng số: SHA remote, log test, JSON, screenshots)
        ↓
[6. PE Audit Gate độc lập]
  ├─ Đọc diff các file nhạy cảm (middleware, server action, auth)
  ├─ Xác minh commit có thật trên GitHub remote
  ├─ Xác nhận kết quả Secret Scan (không rò rỉ key/token/cookie)
  └─ Kết luận: Đóng WO thành công HOẶC Phát hành WO-fix phạm vi hẹp
```

---

## 3. PHÂN TẦNG TỰ TRỊ (AUTONOMY TIERS)

Mọi thao tác kỹ thuật bắt buộc phải phân loại theo 3 tầng rủi ro:

### 🟢 GREEN TIER (Rủi ro = 0 — Tự động 100%)
- Đọc mã nguồn, đọc tài liệu, kiểm tra schema read-only.
- Chạy kiểm tra TypeScript (`npx tsc --noEmit`).
- Chạy kiểm tra đa ngôn ngữ (`node scripts/check_translations.mjs`).
- Chạy unit tests, integration tests, Playwright browser test cục bộ.
- Soạn thảo tài liệu, phân tích gap, viết dự thảo Work Order.
- **Quyền hạn AN:** Tự thực hiện trọn vẹn, không cần xin phép từng bước.

### 🟡 YELLOW TIER (Rủi ro trung bình — Thực thi trong Hợp đồng WO)
- Chỉnh sửa giao diện UI, tạo route, viết client/server components.
- Viết Server Actions, viết logic nghiệp vụ trong phạm vi file đã khai báo.
- Viết test suites mới, kịch bản E2E Playwright.
- Tạo Git commit và push lên GitHub remote sau khi toàn bộ test passed.
- **Quyền hạn AN:** Tự chạy chuỗi liên tục từ đầu đến cuối trong 1 phiên làm việc.
- **Kiểm soát PE:** Thẩm tra độc lập qua **Artifact Bundle** và **Audit Gate**.

### 🔴 RED TIER (Rủi ro cao — Khóa cứng, cần phê duyệt riêng)
- Áp dụng Database Migration lên Supabase Production.
- Ghi dữ liệu kiểm thử (INSERT / UPDATE / DELETE) vào Supabase Production.
- Thay đổi cấu trúc bảo mật hoặc sửa đổi Row Level Security (RLS) Policy.
- Xóa hoặc archive dữ liệu người dùng.
- Thay đổi luồng nghiệp vụ cốt lõi hoặc mở rộng module ngoài phạm vi đã duyệt.
- **Quyền hạn AN:** **BLOCKED TUYỆT ĐỐI**. Khi chạm ranh giới RED, AN phải dừng ngay lập tức, báo cáo và chờ Work Order RED riêng do Minh Chủ THOAN trực tiếp phê duyệt.

---

## 4. QUY TẮC CỔNG ĐỒNG BỘ TỪ XA (REMOTE SYNC GATE)

> **Bài học kinh nghiệm rút ra từ sự cố Sprint P0-3 (Commit local-only):**  
> Tuyệt đối không bao giờ tin vào lời khai bằng văn bản nếu commit chưa có mặt trên GitHub remote.

1. **Cấm báo cáo Commit ảo:** AN không được phép gửi Commit SHA trong báo cáo nghiệm thu khi commit đó chưa được `git push` thành công lên GitHub remote.
2. **Kiểm tra trạng thái bắt buộc:** Trước khi nộp Artifact Bundle, lệnh `git status` bắt buộc phải trả về:
   ```text
   On branch main
   Your branch is up to date with 'origin/main'.
   nothing to commit, working tree clean
   ```
3. **Quy ước trạng thái khi chưa push:** Nếu vì bất kỳ lý do mạng hoặc credential mà chưa push được, AN bắt buộc phải ghi rõ:
   `"Trạng thái: Code Written — local only, chưa đẩy lên remote"`.

---

## 5. DANH MỤC ARTIFACT BUNDLE BẮT BUỘC (8 THÀNH PHẦN)

Mỗi lần nghiệm thu Work Order, AN bắt buộc phải đóng gói đủ 8 thành phần sau vào 1 khối code block duy nhất:
1. **Full Remote Commit SHA:** Kết quả từ `git rev-parse HEAD`.
2. **Git Status Clean:** Minh chứng working tree sạch và đã up to date với remote `main`.
3. **Log TypeScript:** Kết quả từ `npx tsc --noEmit` (0 errors).
4. **Log i18n Translation:** Kết quả từ `node scripts/check_translations.mjs` (0 missing keys).
5. **Log Test Suite:** Báo cáo pass/fail từ toàn bộ unit test và integration test liên quan.
6. **Bằng chứng E2E Trình duyệt:** File JSON kết quả có cấu trúc và đường dẫn ảnh chụp màn hình/PDF.
7. **Danh sách File Diff:** Thống kê `git diff --stat` minh chứng không sửa ngoài phạm vi cho phép.
8. **Báo cáo Secret Scan:** Xác nhận không có JWT token, cookie, service role key nào bị commit.

---

## 6. QUY TRÌNH AUDIT GATE CỦA PE

Áp dụng bắt buộc đối với mọi Work Order tầng YELLOW có can thiệp đến middleware, quyền truy cập (auth), hoặc luồng ghi dữ liệu:
1. **Kiểm tra Diff vùng nhạy cảm:** PE trực tiếp đọc diff của 2–3 file cốt lõi (ví dụ: `src/middleware.ts`, `src/app/.../_actions/...`).
2. **Xác minh Remote Commit:** PE gọi connector độc lập xác minh SHA commit và danh sách file thay đổi trên GitHub remote `toanysd/ysdms-next`.
3. **Xác nhận Secret Scan:** Đảm bảo mã nguồn và artifact không chứa credential nhạy cảm.
4. **Quyết định đóng WO:** Nếu đạt cả 3 tiêu chuẩn trên, PE tuyên bố đóng Work Order và cấp Work Order tiếp theo. Nếu phát hiện vi phạm, PE phát hành `WO-fix` hẹp.

---

## 7. QUY TẮC PHÂN LOẠI TEST (BEHAVIORAL VS STRUCTURAL)

Để tránh hiện tượng "báo cáo điểm ảo" (overstating pass rates), mọi test case trong test suite bắt buộc phải phân loại rõ ràng:
- **Kiểm thử Hành vi Thật (Behavioral / Runtime Tests):** Thực thi mã thật, chạy qua logic điều kiện, xử lý ngoại lệ, xác thực payload, gửi HTTP request hoặc tương tác DOM Playwright thật.
- **Kiểm tra Cấu trúc / Hợp đồng Mã (Structural / Static Contract Tests):** Kiểm tra sự tồn tại của file, kiểm tra biểu thức chính quy (regex), kiểm tra cú pháp AST hoặc sự hiện diện của biến môi trường.
- **Bắt buộc:** Tỷ lệ test case hành vi thực tế phải chiếm tối thiểu 40% trong tổng số test cases của mỗi Work Order.

---

## 8. SỔ TAY BÀI HỌC KINH NGHIỆM (LESSONS LEARNED LOG)

| Mã sự cố | Bối cảnh | Sai sót cốt lõi | Biện pháp ngăn chặn vĩnh viễn |
|---|---|---|---|
| **LL-001** | Nghiệm thu P0-3 | Báo cáo SHA commit đã hoàn thành trong khi commit mới chỉ nằm ở Git local do Windows Credential Manager bị treo. | Thiết lập **Remote Sync Gate**: Bắt buộc lệnh `git push` thành công và `git status` báo `up to date with origin/main` mới được nộp báo cáo. |
| **LL-002** | Middleware P0-3 | Dùng pattern kiểm tra `.includes('/print/')` quá lỏng lẻo, tạo nguy cơ bypass auth cho các trang in báo giá/hóa đơn sau này. | Thiết lập **Strict RFC 4122 Regex**: Chỉ whitelist chính xác định dạng UUID của phiếu chỉ thị gia công khuôn `/equipment/jobs/{uuid}/print`. |
| **LL-003** | Server Action Worklog | Luồng ghi Nippo dùng `createServerSupabaseClient` (Service Role bypass RLS) và không kiểm tra `step_id` có thuộc đúng `job_id`. | Loại bỏ hoàn toàn service-role trong luồng ghi người dùng; bổ sung logic truy vấn kiểm tra toàn vẹn quan hệ cha-con trước khi ghi. |

---

## 9. QUY CHUẨN MẪU WORK ORDER (YAML TEMPLATE)

```yaml
work_order_id: WO-XXX-001
created_by: PE
approved_scope_by: THOAN
autonomy_tier: YELLOW # [GREEN | YELLOW | RED]
objective: >
  Mô tả mục tiêu kỹ thuật đo lường được trong 1-2 câu.
context_pack:
  repo: toanysd/ysdms-next
  base_commit: <full_40_char_sha>
  relevant_files:
    - path/to/file1.ts
    - path/to/file2.tsx
  business_rules:
    - RULE-DATA-01 (Không fallback dữ liệu kỹ thuật)
    - RULE-DATA-02 (Schema Compliance - Không bịa dữ liệu)
allowed_actions:
  - read_files
  - edit_ui_and_actions_in_scope
  - run_tsc
  - run_i18n_check
  - run_unit_tests
  - run_playwright_local
  - commit_code
  - push_code
forbidden_actions:
  - apply_migration (RED)
  - write_supabase_production (RED)
  - use_service_role_for_writes (RED)
  - change_rls (RED)
  - delete_data (RED)
  - expand_scope (RED)
acceptance_criteria:
  - tsc_zero_errors
  - i18n_zero_missing_keys
  - unit_tests_passed
  - browser_e2e_passed
  - remote_commit_verified
  - secret_scan_clean
  - zero_production_writes
required_artifacts:
  - git_rev_parse_head
  - git_status
  - test_logs
  - browser_screenshots
  - e2e_results_json
  - file_diff_stat
  - secret_scan_report
red_zone:
  - schema_change
  - production_write
  - rls_change
  - scope_expansion
```

---
*Cẩm nang này là nguồn sự thật duy nhất (SSOT) cho mọi hoạt động phối hợp tự trị giữa PE, THOAN và AN.*
