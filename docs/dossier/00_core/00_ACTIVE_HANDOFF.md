# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-17 19:11:00 JST`
- **Work Order đã đóng (`CLOSED`):**
  - `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` — **Phần UI CLOSED & VERIFIED BY PE** tại `fc02bd7bceed8f21decb2abec0440df1979f1fa2` (Directive `f4aa3c7f`).
  - `WO-EQUIP-OPS-WAVE3-WIRING` (**CLOSED** tại `1e935e019accafc76f6549ceab86e8dd4dc58e53`), `WO-AI-EXTRACTION-AUDIT` (**CLOSED** tại `b28131774d5bfe2e501d13f0a65ec912a2852e62`), `WO-DATA-AUDIT-SUMMARY` (**CLOSED**), `WO-MOLD-SYNC-WAVE3` (**CLOSED**), `WO-MOLD-SYNC-WAVE2` (**CLOSED**), `WO-MOLD-SYNC-WAVE1` (**CLOSED**), `WO-CONTEXT-PALACE` (**CLOSED**).
- **Work Order hiện hành:** `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` (Phần Backfill — Theo Chỉ thị PE `f4aa3c7f`) — **ĐÃ NỘP PAYLOAD CỔNG 1 v2 (BỎ `ELSE 'MOLD'`), CHỜ PE DUYỆT GO CỔNG 2**.

## 1. Trạng Thái `WO-SCHEDULE-DATA-AND-UI-ALIGNMENT` (`docs/audit_logs/2026-10-17_WO-SCHEDULE-DATA-AND-UI-ALIGNMENT.json`)
1. **Phần A — Căn chỉnh UI `/equipment/schedule` (`CLOSED` — PE nghiệm thu tại `fc02bd7bceed8f21decb2abec0440df1979f1fa2`):**
   - Đã áp dụng `COALESCE(mold_deadline, deadline)` và ẩn `JOB-INTERNAL-SHOP` khỏi biểu đồ Gantt khuôn.
2. **Phần B — Payload Backfill Cổng 1 v2 (`BEGIN...ROLLBACK` PASS, `0` DB mutations, đã bỏ `ELSE 'MOLD'` theo `RULE-DATA-01`):**
   - `public.jobs.company_id`: `+1,131` dòng (`101` $\rightarrow$ `1,232/1,232`, `0` NULL).
   - `public.jobs.job_type_id`: `+28` dòng (`1,204` $\rightarrow$ `1,232/1,232`, `0` NULL).
   - `public.work_orders`: `+1,203` dòng được bổ sung (`company_id`: `99` $\rightarrow$ `1,230/1,230`; `deadline`: `28` $\rightarrow$ `1,135/1,230`; `start_date`: `27` $\rightarrow$ `799/1,230`).
   - `public.job_steps.track`: `+2,506` dòng (`5` $\rightarrow$ `2,511/2,512`); **`1` dòng `EXCLUDED` giữ `track = NULL`** (`step_id = cd2d3225-f63a-4374-aa60-5760818d96ac`, `legacy_id = 'LEGACY-STEP-1672'`, `job_code = 'TE24264091'`, `step_name = 'Legacy Step'`, `item_type_id = NULL`).
3. **Điểm dừng hiện tại:** Chờ **PE** duyệt **GO Cổng 2** đối với Payload v2 để thực thi (`COMMIT`) trên Production.
