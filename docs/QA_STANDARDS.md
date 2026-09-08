# QA STANDARDS & QUALITY GATES (PE & AN COORDINATION)

> **Mục đích:** Quy chuẩn nghiệm thu bắt buộc cho mọi Milestone và Sprint giữa AN (Executing Agent) và PE (Project Engineer).

---

## 1. QUALITY GATES TIÊU CHUẨN

Mỗi Milestone / Sprint hoàn thành bắt buộc phải vượt qua các chốt kiểm soát chất lượng sau:

| Chốt kiểm soát | Nội dung kiểm tra | Lệnh thực hiện / Tiêu chuẩn | Người xác minh |
|---|---|---|:---:|
| **QG-1: Type Integrity** | Toàn bộ dự án không có lỗi TypeScript | `npx tsc --noEmit` = 0 errors | AN |
| **QG-2: i18n Completeness** | Toàn bộ keys đa ngôn ngữ được khai báo đầy đủ trên ja.json và vi.json | `node scripts/check_translations.mjs` = 0 missing keys | AN |
| **QG-3: Security & Secret Scan** | Không có thông tin nhạy cảm, API keys, connection strings hardcode trong scripts hoặc code | Rà soát script & source code | AN |
| **QG-4: Architecture Integrity** | Tuân thủ schema SSOT, không fallback dữ liệu kỹ thuật sai nguồn | Tuân thủ `RULE-DATA-01`, `RULE-DATA-02`, ADR liên quan | AN & PE |
| **QG-X: PE Live DB Verification** | **PE trực tiếp query Live DB qua MCP / SQL Editor trước khi approve**, không phụ thuộc vào báo cáo trung gian của AN | Kiểm toán dữ liệu thực trên production qua các câu lệnh SQL độc lập | **PE (Bắt buộc)** |

---

## 2. QUY TẮC BẢO MẬT & RLS VỚI SERVER ACTIONS

- Mọi thao tác cascade liên bảng ngầm (như `processStepCompletionEngine` cập nhật cascade `job_steps` → `jobs` → `work_orders`) **bắt buộc sử dụng Service Role client** (`createServerSupabaseClient()`) để bypass RLS, tránh tình trạng cascade bị chặn âm thầm (silently failed).
- Client-side queries và form nhập liệu của người dùng tiếp tục tuân thủ RLS qua authenticated session token.

---

## 3. QUY TRÌNH CLEANUP DỮ LIỆU KIỂM TOÁN (TEST ENTITIES)

- Dữ liệu phục vụ kiểm toán hoặc dry-run trên production phải được dọn dẹp (cleanup) sạch sẽ ngay sau khi hoàn thành kiểm toán.
- Tuyệt đối không để lại các bản ghi test tạm bợ trong production database.
