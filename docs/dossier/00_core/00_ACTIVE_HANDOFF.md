# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 19:03:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-EQUIP-OPS-WAVE3-WIRING` (**CLOSED & VERIFIED BY PE** tại `1e935e019accafc76f6549ceab86e8dd4dc58e53`, Directive `17481433`).
  - `WO-AI-EXTRACTION-AUDIT` (**CLOSED** tại `b28131774d5bfe2e501d13f0a65ec912a2852e62`), `WO-DATA-AUDIT-SUMMARY` (**CLOSED** tại `33ea19e197266fabff4a83f1a004fef457e2e9bd`), `WO-MOLD-SYNC-WAVE3` (**CLOSED**), `WO-MOLD-SYNC-WAVE2` (**CLOSED**), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-CONTEXT-PALACE` (**CLOSED**).
- **Work Order hiện hành:** `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` (Theo Chỉ thị PE `17481433`) — **ĐÃ HOÀN TẤT PHẦN UI (`/equipment/schedule`) & NỘP PAYLOAD BACKFILL CỔNG 1 (`BEGIN...ROLLBACK`), CHỜ PE DUYỆT CỔNG 2**.

## 1. Kết Quả Thi Công `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` (`docs/audit_logs/2026-10-17_WO-SCHEDULE-DATA-AND-UI-ALIGNMENT.json`)
1. **Phần A — Căn chỉnh UI `/equipment/schedule` (`[HOÀN TẤT]`, `0` đổi Schema):**
   - Áp dụng `COALESCE(mold_deadline, deadline)` xuyên suốt `getJobsForGantt`, `getWorkOrdersForGantt`, `page.tsx`, `MoldJobGantt.tsx`, `ToolingExcelGridView.tsx`, `ToolingGroupedJobCard.tsx`, `JobQuickViewDrawer.tsx`, và `autoScheduler.ts`.
   - Ẩn triệt để `JOB-INTERNAL-SHOP` (`社内作業・5S・保全`) khỏi Gantt khuôn và lịch biểu (`/equipment/schedule`).
   - **Quality Gates:** `npx tsc --noEmit` (`0` errors), `node scripts/check_translations.mjs` (`0` missing keys), Playwright E2E trên `/equipment/schedule` PASS (`0` page errors).
2. **Phần B — Payload Backfill Cổng 1 (`BEGIN...ROLLBACK` PASS, `0` DB mutations — chờ PE duyệt Cổng 2):**
   - `public.jobs.company_id`: `+1,131` dòng (`101` $\rightarrow$ `1,232/1,232`, `0` NULL).
   - `public.jobs.job_type_id`: `+28` dòng (`1,204` $\rightarrow$ `1,232/1,232`, `0` NULL).
   - `public.work_orders`: `+1,203` dòng được bổ sung (`company_id`: `99` $\rightarrow$ `1,230/1,230`; `deadline`: `28` $\rightarrow$ `1,135/1,230`; `start_date`: `27` $\rightarrow$ `799/1,230`).
   - `public.job_steps.track`: `+2,507` dòng (`5` $\rightarrow$ `2,512/2,512`, `0` NULL).
3. **Điểm dừng hiện tại:** Chờ **PE** nghiệm thu Phần UI và duyệt **Cổng 2** để chạy thực thi (COMMIT) Payload Backfill cho `work_orders`, `jobs`, `job_steps`.
