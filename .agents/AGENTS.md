# .agents/AGENTS.md — Stub Tham Chiếu (Consolidated to Root AGENTS.md)

> **Nguồn sự thật duy nhất (SSOT) cho toàn bộ quy tắc AI Agent & Developer của dự án YSDMS NextGen đã được hợp nhất tại file gốc:**
> 👉 [`d:\AntiGravity_Workspace\apps\ysdms-nextgen\AGENTS.md`](../AGENTS.md)

## Tóm tắt Điều hướng Nhanh (Tránh trùng lặp & cắt cụt `<user_rules>`)
1. **QUY TẮC 0:** Mọi phản hồi bắt đầu và kết thúc bằng `TRẢ LỜI TỪ AN` + Timestamp JST; khối báo cáo gửi PE đặt trong 1 code block duy nhất ở cuối phản hồi; payload qua `public.pe_an_messages` tối đa **150 dòng**; chỉ `git push` khi có chỉ thị/phê duyệt từ Minh Chủ THOAN hoặc PE.
2. **RULE-DATA-01 & RULE-DATA-02:** Không fallback dữ liệu kỹ thuật; SSOT vật liệu/cutline từ `design_revisions`, thiết bị từ `equipment`; mọi kết luận về schema phải kiểm chứng qua `information_schema.tables` / `information_schema.columns` thực tế kèm `NOW()`.
3. **RULE-PROC-01 & RULE-PROC-02:** Tuân thủ 3 pha (`PLANNING` / `EXECUTION` / `COMPLETION`); lệnh gửi `public.pe_an_messages` chỉ được gọi ở **TOOL CALL CUỐI CÙNG** của lượt làm việc; kết thúc phiên phải trình PE thẩm định trước.
4. **Chi tiết đầy đủ:** Xem [`AGENTS.md`](../AGENTS.md) và Sổ Bài Học [`docs/SO_BAI_HOC.md`](../docs/SO_BAI_HOC.md).
