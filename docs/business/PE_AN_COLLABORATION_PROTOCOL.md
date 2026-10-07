# PE ↔ AN COLLABORATION PROTOCOL — SSOT
## Quy tắc phối hợp đa mô hình: Perplexity (PE) ↔ Antigravity (AN) ↔ Minh Chủ (THOAN)

> **Phiên bản:** 2.0 | **Ngày ban hành:** 2026-10-07  
> **Phạm vi:** Áp dụng cho mọi dự án sử dụng mô hình PE-AN-THOAN  
> **Mục tiêu:** Chuẩn hóa kênh trao đổi, đảm bảo chất lượng, chống sai sót, tự học liên tục.

---

## 1. BỐI CẢNH & VAI TRÒ

### 1.1. Tam giác tự trị
- **THOAN (Minh Chủ / Product Owner):** Quyết định cuối cùng, duyệt RED TIER (DDL/migration/Production write), phê duyệt kiến trúc lớn.
- **PE (Perplexity Pro):** Kiến trúc sư trưởng & Kiểm toán viên đối lập. Thẩm định, phản biện, duyệt hoặc yêu cầu sửa. KHÔNG tự tuyên bố hoàn tất khi chưa có bằng chứng độc lập.
- **AN (Antigravity):** Kỹ sư thi công. Viết code, chạy test, commit, push. KHÔNG tự quyết chuyển giai đoạn hay ghi Production khi chưa có lệnh.

### 1.2. Nguyên tắc cốt lõi
- **Single Source of Truth (SSOT):** Mọi quyết định/nghiệp vụ phải có 1 nguồn sự thật duy nhất, có dẫn chứng.
- **Human-in-the-Loop:** THOAN giữ cổng quyết định lớn; PE giữ cổng kỹ thuật; AN thi công.
- **Evidence-Based:** Không tuyên bố hoàn tất nếu chưa có bằng chứng thật (code, log, commit SHA, test result).

---

## 2. KÊNH TRAO ĐỔI HỒ SƠ (READ CHANNELS)

### 2.1. Bảng so sánh 4 kênh
| Kênh | Phạm vi | Cách thức | Trạng thái |
|---|---|---|---|
| **A — Chat Paste** | File ≤ ~500 dòng / ≤50KB | AN paste toàn văn vào chat trong 1 code block | **CHUẨN** cho file ngắn |
| **B — Project Files Upload** | File > ~500 dòng | THOAN upload lên Perplexity Project; PE đọc qua `file_explore` | **CHUẨN** (dự phòng) |
| **C — Supabase SQL Bridge** | File dài bất kỳ | AN publish vào `pe_review_artifacts`; PE đọc qua `execute_sql` | **CHUẨN CHÍNH** (khuyến nghị) |
| **D — URL ngoài (jsDelivr/GitHub/Storage)** | Không khuyến nghị | `fetch_url` của PE bị chặn WAF | **LOẠI** |

### 2.2. Kênh C — PE Bridge Table (Khuyến nghị số 1)
**Kiến trúc:**
```sql
CREATE TABLE IF NOT EXISTS public.pe_review_artifacts (
    artifact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_name TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    content_md TEXT NOT NULL,
    byte_size INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pe_review_artifacts_name_ver_uniq UNIQUE (artifact_name, version)
);
-- RLS: Public SELECT (PE đọc), Service Role write (AN ghi)
```

**Quy trình vận hành:**
1. AN hoàn thành tài liệu/code → chạy `publish_pe_artifact.py` để nạp vào `content_md`.
2. AN thông báo tên artifact + version cho PE.
3. PE chạy `SELECT content_md FROM pe_review_artifacts WHERE artifact_name = '...' ORDER BY version DESC LIMIT 1;`
4. PE đọc toàn văn trong context, ra phê duyệt/khắc phục.

**Ưu điểm:**
- Không cần THOAN upload/copy.
- Không bị WAF chặn (SQL result trả thẳng vào context).
- Chính xác 100% (text thuần, không OCR).
- Lưu vết version, dễ audit.

**Ràng buộc bảo mật:**
- Chỉ chứa tài liệu/spec/code review, KHÔNG chứa dữ liệu khách hàng nhạy cảm/token.
- RLS: Public chỉ SELECT, Service Role mới được write.

### 2.3. Kênh A — Chat Paste (dự phòng file ngắn)
- AN paste toàn văn vào 1 khối code block markdown ở cuối phản hồi.
- PE đọc trực tiếp, duyệt ngay.
- Ưu điểm: Nhanh, không cần DB.
- Hạn chế: Làm phình chat nếu file dài.

### 2.4. Kênh B — Project Files Upload (dự phòng khẩn cấp)
- THOAN tải file mới lên Perplexity Project.
- PE dùng `file_explore` đọc toàn văn.
- Hạn chế: Phụ thuộc thao tác thủ công của THOAN.

### 2.5. Kênh LOẠI — URL ngoài
- jsDelivr CDN, GitHub raw/.patch/.diff, Supabase Storage URL: **TẤT CẢ bị `fetch_url` của PE chặn** (đã thử nghiệm 2026-10-07).
- GitHub connector `get_file_contents`: Chỉ trả metadata/SHA, không giải mã text.
- **Quy tắc:** Không dùng các kênh này làm điều kiện duyệt nội dung.

---

## 3. YÊU CẦU KẾT NỐI & HẠ TẦNG

### 3.1. Kết nối Supabase (cho Kênh C)
- PE: MCP `execute_sql` với `project_id` (VD: `iirezrszalmecsslbruo`).
- AN: Kết nối trực tiếp qua `DATABASE_URL` / `psycopg2` từ máy cục bộ.
- Bảng bridge phải tách biệt 100% khỏi bảng nghiệp vụ (không FK chéo).

### 3.2. Kết nối GitHub (đối chiếu metadata)
- PE: MCP `get_commit` / `get_file_contents` — CHỈ dùng để xác minh SHA, danh sách file, không đọc nội dung.
- AN: Git CLI local (`git rev-parse HEAD`, `git log origin/main -1`).

### 3.3. Yêu cầu chất lượng hạ tầng
- Migration DDL phải có RLS rõ ràng (Public read-only, Service Role write).
- Bảng bridge phải có UNIQUE constraint (name, version) để tránh trùng lặp.
- Mọi artifact phải có `byte_size` + `char_count` để đối soát toàn vẹn.

---

## 4. YÊU CẦU CHẤT LƯỢNG & CHỐNG SAI SÓT

### 4.1. Nguyên tắc kiểm chứng độc lập
- **PE chỉ duyệt nội dung PE TỰ đọc được** qua 1 trong các kênh chuẩn (A/B/C).
- **"AN test HTTP 200" ≠ "PE đọc được"** — mọi kênh mới phải PE pilot bằng `fetch_url`/`execute_sql` trước khi chuẩn hóa.
- Mọi phê duyệt phải ghi rõ kênh đã đọc: `[chat-paste]` / `[file_explore]` / `[supabase-sql-bridge]` / `[chưa đọc]`.

### 4.2. Quy tắc chống sai sót (từ bài học thực tế)
1. **Không tự bịa commit SHA** — luôn copy từ `git rev-parse HEAD`.
2. **Không khẳng định schema nếu chưa query** — mọi khẳng định về cột/bảng phải có kết quả truy vấn thật.
3. **Không lạm dụng "100%"** nếu chưa nêu rõ phạm vi kiểm tra.
4. **Không suy diễn nghiệp vụ** nếu email/tài liệu không rõ — ghi "CẦN THOAN XÁC NHẬN".
5. **Không tin log AN mù quáng** — PE phải tự verify ít nhất 1 điểm chốt (SQL/GitHub metadata).
6. **Không dùng URL ngoài làm điều kiện duyệt** — đã chứng minh bị chặn.

### 4.3. Quy tắc tự học (Sổ Bài Học)
- Mỗi sai sót (của PE/AN/THOAN) phải ghi vào `docs/SO_BAI_HOC.md` theo mẫu: `Ngày | Sự việc | Nguyên nhân gốc | Bằng chứng | Quy tắc đề xuất | Trạng thái`
- PE nhận diện & chuẩn hóa; quy tắc nhỏ AN ghi, PE xác nhận; quy tắc lớn THOAN duyệt.
- Định kỳ 3-5 phiên: rà soát, gộp trùng, bỏ quy tắc lỗi thời.

---

## 5. QUY TRÌNH LÀM VIỆC CHUẨN (WORKFLOW)

### 5.1. Vòng lặp chuẩn PE ↔ AN
1. PE ra chỉ thị (Directive #NNN) với mục tiêu + constraint rõ ràng.
2. AN phân tích, hỏi lại nếu cần, thực thi.
3. AN chạy quality gates (`tsc`, `i18n`, test).
4. AN commit với message chuẩn: `feat/fix/refactor/docs(scope): mô tả`.
5. AN publish artifact (nếu có tài liệu) lên Kênh C.
6. PE đọc qua SQL, thẩm định, ra quyết định duyệt/yêu cầu sửa.
7. THOAN duyệt các quyết định lớn (RED TIER).

### 5.2. Phân cấp Autonomy Tier
- **GREEN:** Read-only discovery, không đụng code/schema.
- **YELLOW:** Code + test local, không đụng Production.
- **RED:** DDL/migration/Production write — bắt buộc THOAN duyệt.

### 5.3. Artifact Bundle bắt buộc
Mọi WO hoàn thành phải kèm:
- `git_rev_parse_head` (SHA thật).
- `git_status` (clean/dirty).
- Test logs (tsc, i18n, unit, e2e).
- Browser screenshots (nếu có UI).
- Link artifact Kênh C (nếu có tài liệu).

---

## 6. BẢO MẬT & RÀNG BUỘC

### 6.1. Bảo mật dữ liệu
- Không commit token/secret vào Git.
- Bucket/table bridge chỉ chứa tài liệu spec, không chứa PII khách hàng.
- RLS bắt buộc cho mọi bảng mới.

### 6.2. Ràng buộc RED TIER
- Mọi DDL/INSERT vào Production phải có:
  1. PE thẩm định kế hoạch.
  2. THOAN duyệt rõ ràng.
  3. Rollback plan sẵn sàng.
  4. Post-migration verification plan.

---

## 7. PHỤ LỤC: CHECKLIST NHANH CHO MỖI PHIÊN
- [ ] PE đã xác định kênh đọc (A/B/C)?
- [ ] AN đã paste/upload/publish đúng kênh?
- [ ] PE đã ghi rõ kênh đã đọc trong phê duyệt?
- [ ] Commit SHA đã được PE đối chiếu độc lập?
- [ ] Quality gates đã chạy (tsc/i18n/test)?
- [ ] Artifact đã publish lên Kênh C (nếu có tài liệu)?
- [ ] Sổ Bài Học đã cập nhật (nếu có sai sót)?

---

## 8. LỊCH SỬ PHIÊN BẢN
- **v1.0 (2026-10-07):** Ban hành ban đầu, 3 kênh A/B/C.
- **v2.0 (2026-10-07):** Nâng cấp Kênh C thành chuẩn chính (Supabase SQL Bridge), bổ sung quy tắc chống sai sót, tự học, security.
