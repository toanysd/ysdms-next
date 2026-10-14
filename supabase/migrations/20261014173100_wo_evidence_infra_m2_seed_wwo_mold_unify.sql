-- supabase/migrations/20261014173100_wo_evidence_infra_m2_seed_wwo_mold_unify.sql
BEGIN;

INSERT INTO public.pe_evidence_items (
  message_id,
  work_order,
  evidence_type,
  status,
  commit_sha,
  file_path,
  url,
  command,
  result_summary,
  result_json,
  screenshot_path
)
SELECT
  'b342c94e-60f5-4c59-ac0f-5796463b9b17'::uuid,
  'WO-MOLD-UNIFY',
  e.evidence_type,
  e.status,
  e.commit_sha,
  e.file_path,
  e.url,
  e.command,
  e.result_summary,
  e.result_json,
  e.screenshot_path
FROM jsonb_to_recordset('[
  {
    "evidence_type": "TSC",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "command": "npx tsc --noEmit --pretty false",
    "result_summary": "TSC_EXIT_CODE=0; 0 errors",
    "result_json": {"exit_code": 0}
  },
  {
    "evidence_type": "I18N",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "command": "node scripts/check_translations.mjs",
    "result_summary": "I18N_EXIT_CODE=0; 0 missing keys",
    "result_json": {"exit_code": 0}
  },
  {
    "evidence_type": "GIT_GREP",
    "status": "PASS",
    "commit_sha": "c2d00dc97c75d70bab80d293c4dde1cf9d952eec",
    "command": "git grep -n \"mold_design_cutters\" -- src/",
    "result_summary": "0 matches in read paths; legacy write block disabled; 2 generated type references remain",
    "result_json": {"read_path_matches": 0, "legacy_write_block_lines": 2, "generated_types_lines": 2}
  },
  {
    "evidence_type": "GIT_GREP",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "command": "git grep -n -E \"v_mold_health|v_maintenance_overdue|mold_maintenance_log|record_maintenance_and_reset\" -- src/app/actions/maintenance.ts src/app/maintenance/ src/app/equipment/lifecycle/",
    "result_summary": "0 matches",
    "result_json": {"matches": 0}
  },
  {
    "evidence_type": "BROWSER",
    "status": "PASS",
    "commit_sha": "c2d00dc97c75d70bab80d293c4dde1cf9d952eec",
    "url": "http://localhost:3000/product-center/5c9541ff-14bc-4031-8e2f-a84c51b21e1e",
    "command": "Playwright browser verification",
    "result_summary": "HTTP 200; SET 2/8; shared cutter visible; write controls disabled",
    "result_json": {
      "http_status": 200,
      "has_kpi_2_of_8": true,
      "has_cutter_in_overview": true,
      "has_shared_badge": true,
      "has_lock_notice": true,
      "disabled_toggle_count": 2
    },
    "screenshot_path": "docs/audit_logs/screenshots/wo_mold_unify/wo_mold_unify_commit2_product_center_overview_shared_cutter.png"
  },
  {
    "evidence_type": "BROWSER",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "url": "http://localhost:3000/maintenance",
    "command": "Playwright browser verification",
    "result_summary": "HTTP 200; no error; lifecycle total 6,497",
    "result_json": {"http_status": 200, "maint_no_error": true, "maint_has_6497": true},
    "screenshot_path": "docs/audit_logs/screenshots/wo_mold_unify/wo_mold_unify_commit3_maintenance_ok.png"
  },
  {
    "evidence_type": "BROWSER",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "url": "http://localhost:3000/maintenance/log",
    "command": "Playwright browser verification",
    "result_summary": "HTTP 200; no error",
    "result_json": {"http_status": 200, "maint_log_no_error": true},
    "screenshot_path": "docs/audit_logs/screenshots/wo_mold_unify/wo_mold_unify_commit3_maintenance_log_ok.png"
  },
  {
    "evidence_type": "BROWSER",
    "status": "PASS",
    "commit_sha": "9de2c64ca0137b52cc29f87445abd216013e10a5",
    "url": "http://localhost:3000/equipment/lifecycle",
    "command": "Playwright browser verification",
    "result_summary": "HTTP 200; KPI values include 6,497",
    "result_json": {
      "http_status": 200,
      "kpi_values": ["6,497", "0", "0", "6,497"],
      "lifecycle_kpi_has_6497": true
    },
    "screenshot_path": "docs/audit_logs/screenshots/wo_mold_unify/wo_mold_unify_commit3_lifecycle_kpi_6497.png"
  }
]'::jsonb) AS e(
  evidence_type text,
  status text,
  commit_sha text,
  file_path text,
  url text,
  command text,
  result_summary text,
  result_json jsonb,
  screenshot_path text
);

COMMIT;
