# Technical Debt Register
_Last updated: 2026-09-02_

## Security
- [x] TD-001: 11 tables missing RLS (Milestone 5)
- [x] TD-002: 5 views need SECURITY INVOKER (Milestone 5)
- [ ] TD-003: database.types.ts manual patch for rpc_start_job
       → Fix: resolve Supabase CLI encoding issue on Windows

## Schema
- [ ] TD-004: jobs.mold_work_order_id — legacy column, all null, candidate for DROP
       → Verify: no code references before dropping

## Deferred Features  
- [ ] TD-005: work_logs.quantity_ng — NG stored in notes text field
       → Fix: add proper column when QC module starts
- [ ] TD-006: Gantt planned_start — jobs created without start_date,
       bars render as point-in-time at deadline
       → Fix: populate start_date in rpc_confirm_work_order
