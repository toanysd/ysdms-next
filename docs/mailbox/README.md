# Agent Mailbox Specification (PE ⟷ AN)

Cơ chế giao tiếp trung chuyển bất đối xứng qua Git giữa **Perplexity Engine (PE)** và **Antigravity (AN)**.

---

## 1. Nguyên Tắc Cốt Lõi

1. **Bất đối xứng (Single-Writer Pattern)**:
   - `OUTBOX_PE.md`: **Chỉ PE có quyền ghi** (Append-only). AN chỉ đọc (`READ-ONLY`).
   - `OUTBOX_AN.md`: **Chỉ AN có quyền ghi** (Append-only). PE chỉ đọc (`READ-ONLY`).
   - Không bao giờ xảy ra tình trạng cả hai agent cùng sửa một file $\rightarrow$ **Loại trừ 100% rủi ro Git Merge Conflict**.

2. **Kích hoạt theo lượt (On-demand Wake-up)**:
   - Cả PE và AN là các agent on-demand (chạy theo lượt tương tác của người dùng).
   - Anh Thoan chỉ cần đóng vai trò "người phát lệnh" với cú pháp siêu ngắn:
     - Đánh thức AN: `AN, kiểm tra hộp thư` hoặc `AN, xử lý thư PE-xxx`
     - Đánh thức PE: `PE, đọc hộp thư` hoặc `PE, kiểm tra thư AN-xxx`

3. **Kênh kép (Dual-Channel Output)**:
   - Agent vừa ghi vào Outbox trên Git, vừa xuất bản tóm tắt đóng khối 1-click copy trên Chat UI.
   - Anh Thoan hoàn toàn chủ động: có thể chỉ gõ lệnh ngắn, hoặc copy nguyên khối nếu muốn kiểm tra chéo ngay.

4. **Định danh thông điệp (Message Tracking)**:
   - Mã định danh tăng dần: `PE-001`, `PE-002`... và `AN-001`, `AN-002`...
   - Mọi thông điệp phản hồi bắt buộc có trường `In-Reply-To: <Message_ID>`.

5. **Lưu trữ & Xoay vòng (Archive / Log Rotation)**:
   - Khi file outbox vượt quá ~150KB hoặc khi đóng một Milestone lớn, chuyển file cũ vào `docs/mailbox/archive/YYYY-MM-DD_Milestone_XX/` và khởi tạo file mới.

---

## 2. Cấu Trúc Entry Chuẩn

```markdown
## [ID] YYYY-MM-DD HH:mm JST — Tiêu đề thông điệp

- **From**: PE / AN
- **To**: AN / PE
- **Status**: REQUEST | IN_PROGRESS | DONE | BLOCKED | INFO
- **In-Reply-To**: (ID của thông điệp đang trả lời, ví dụ: PE-001 hoặc N/A)
- **Git Commit Ref**: (Commit SHA liên quan nếu có)
- **Supabase Status**: (Trạng thái DB liên quan nếu có)

### Nội dung chi tiết
...
```
