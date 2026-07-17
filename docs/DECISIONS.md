# DECISIONS.md — Nhật ký quyết định kiến trúc & nghiệp vụ
> Mọi quyết định quan trọng phải được ghi vào đây để tránh làm đi làm lại.

---

## Cách đọc
- **Status:** `✅ Confirmed` | `🔄 Under Review` | `❌ Rejected` | `⏳ Pending`
- **Impact:** Schema thay đổi? Code thay đổi? Cả hai?

---

## [DEC-001] Kiến trúc Schema — Tooling Hierarchy
- **Ngày:** 2026-06-12
- **Người quyết định:** Anh Thoan + AN
- **Nội dung:** Giữ cấu trúc 4 bảng core: `mold_masters → design_revisions → mold_revisions → physical_molds`
- **Lý do:** Tối ưu từ 6 bảng phức tạp xuống 4 bảng, phù hợp với quan hệ thực tế trong Access DB
- **Status:** ✅ Confirmed
- **Impact:** Schema fixed — không thay đổi hierarchy này nữa

---

## [DEC-002] Tên bảng `physical_molds` — Giữ nguyên
- **Ngày:** 2026-07-01
- **Người quyết định:** AN (theo khuyến nghị)
- **Nội dung:** Không đổi tên `physical_molds` thành `mold_physicals` hay `mold_instances`
- **Lý do:** Đúng ngữ pháp, đã ổn định, đổi tên tốn chi phí cập nhật 20+ file frontend >> lợi ích thẩm mỹ
- **Status:** ✅ Confirmed
- **Impact:** None

---

## [DEC-003] DROP 8 bảng `omni_*`
- **Ngày:** 2026-07-01
- **Người quyết định:** AN (phân tích) — chờ Anh Thoan confirm
- **Nội dung:** 8 bảng `omni_custom_cards`, `omni_fsrs_cards`, `omni_master_grammar`, `omni_master_kanji`, `omni_master_shadowing`, `omni_master_vocab`, `omni_profiles`, `omni_streaks` là rác từ app học tiếng Nhật
- **Lý do:** Không có FK đến bảng YSDMS, không có code nào reference trong `src/`
- **Status:** ⏳ Pending — chưa thực hiện DROP
- **Impact:** Cần migration để DROP, sau đó regenerate `database.types.ts`

---

## [DEC-004] Bảo mật — Rotate Supabase Service-Role Key
- **Ngày:** 2026-07-15
- **Người quyết định:** PE (phát hiện) + AN (xác nhận)
- **Nội dung:** Service-role key đã xuất hiện trong transcript log cũ của AN (file local). Cần rotate key ngay.
- **Hướng dẫn thực hiện:**
  1. Vào [Supabase Dashboard](https://supabase.com/dashboard) → chọn project ysdms-next
  2. **Settings** → **API** → mục **Project API keys**
  3. Click **"Reveal"** bên cạnh `service_role` → click **"Regenerate"** (nút nhỏ hoặc icon 🔄)
  4. Copy key mới → cập nhật `.env.local` trên máy dev
  5. Nếu deploy Vercel: vào Vercel → Project Settings → Environment Variables → cập nhật `SUPABASE_SERVICE_ROLE_KEY`
  - **Lưu ý:** Key cũ tự động vô hiệu sau khi regenerate. KHÔNG commit key mới vào bất kỳ file nào.
  - **Nếu không thấy nút Regenerate:** Thử Settings → General → Reset database password (có thể ở đây tùy version Dashboard)
- **Status:** ⏳ Pending — Anh Thoan cần thực hiện
- **Impact:** AN cần cập nhật `.env.local` sau khi Anh Thoan rotate xong

---

## [DEC-005] V5 Seed Script — Import dữ liệu còn thiếu
- **Ngày:** 2026-07-01 (phát hiện) | 2026-07-15 (quyết định)
- **Người quyết định:** Anh Thoan
- **Nội dung:** AN sẽ viết `generate_seed_v5_master.py` bổ sung đầy đủ các file CSV bị thiếu:
  - `cuttermaster.csv → cutter_masters`
  - `cutters.csv → cutters`
  - `moldcutter.csv → mold_design_cutters`
  - `processingdeadline.csv → job_steps`
  - `worklog.csv → work_logs`
  - Fix semantic: `JobQuantity` KHÔNG map vào `estimated_hours`
  - Bổ sung 31 cột Jobs bị thiếu (deadline, start_date, physical_mold_id...)
- **Lưu ý:** Chạy V5 seed sẽ cần TRUNCATE các bảng trước. Dữ liệu nhập thủ công (nếu có) sẽ bị mất.
- **Câu hỏi chưa trả lời:** `JobQuantity` trong Access = số lượng gì? (khuôn? sản phẩm?) → Anh Thoan cần xác nhận
- **Status:** ⏳ Pending
- **Impact:** DB data — cần backup trước khi chạy

---

## [DEC-006] Luồng nghiệp vụ chính — Confirmed
- **Ngày:** 2026-07-15
- **Người quyết định:** Anh Thoan
- **Nội dung:** Luồng chuẩn sau Báo giá:
  ```
  Báo giá → PO từ KH → Chỉ thị SX (指示書) → Job gia công → Work logs → QC → Đóng gói → Phiếu giao hàng
  ```
  **KHÔNG thể nhảy thẳng từ Báo giá → Phiếu giao hàng.**
- **Sprint 1 ưu tiên:** Module Chỉ thị SX (BP-32) trước Phiếu giao hàng
- **Status:** ✅ Confirmed
- **Impact:** Định hướng roadmap Sprint 1~2

---

## [DEC-007] Phân công vai trò PE ↔ AN
- **Ngày:** 2026-07-15
- **Người quyết định:** Anh Thoan
- **Nội dung:**
  - **PE (Perplexity):** Đọc GitHub/docs, viết spec, kiểm tra tính nhất quán, trả lời câu hỏi nghiệp vụ
  - **AN (Antigravity):** Đọc file thực tế từ server, viết code, chạy migration, push GitHub
  - **Anh Thoan:** Xác nhận nghiệp vụ thực tế, duyệt spec, test trên localhost/Vercel
- **Nguyên tắc:** AN chỉ implement khi có spec đã duyệt. PE đọc `PROJECT_STATUS.md` đầu mỗi phiên.
- **Status:** ✅ Confirmed
- **Impact:** Quy trình làm việc — áp dụng ngay

---

## [DEC-008] Quick Entry Worklog — Cho phép tạo Job/Khuôn tạm
- **Ngày:** 2026-07-17
- **Người quyết định:** Anh Thoan
- **Nội dung:**
  - Cho phép tạo `jobs` mà KHÔNG cần `physical_mold_id` (nullable trên schema)
  - Cho phép tạo `physical_molds` mà KHÔNG cần `mold_revision_id` (nullable trên schema)
  - Nhân viên khuôn có thể ghi worklog ngay cả khi khuôn mới chưa có đầy đủ thông tin
  - Admin/quản lý sẽ bổ sung link `mold_revision_id`, `design_revision_id` sau
  - Nút "tạo job nhanh" đặt trực tiếp trong WorklogForm (khi search không có kết quả)
- **Phương án đã chọn:** A — Giữ `mold_revisions`, Quick Entry bỏ qua, admin bổ sung sau
- **Status:** ✅ Confirmed
- **Impact:** Frontend Sprint 5 — không cần migration SQL mới

---

## [DEC-009] Tương lai — Thêm `design_revision_id` trực tiếp vào `physical_molds`
- **Ngày:** 2026-07-17
- **Người quyết định:** Anh Thoan (xác nhận hướng đúng)
- **Nội dung:**
  - Thêm cột `design_revision_id` FK vào `physical_molds` (link trực tiếp, không qua `mold_revisions`)
  - `mold_revisions` sẽ deprecated dần (giữ cho backward compat)
  - 90% khuôn cùng phiên bản thiết kế → `mold_revisions` là pass-through thừa
  - Migrate 4,500 records hiện có từ `mold_revision_id → design_revision_id`
- **Status:** ⏳ Planned — Sprint 7+ (sau khi refactor khuôn toàn diện)
- **Impact:** Schema migration + data migration + UI update
