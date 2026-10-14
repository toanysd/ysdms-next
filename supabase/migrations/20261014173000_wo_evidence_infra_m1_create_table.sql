-- supabase/migrations/20261014173000_wo_evidence_infra_m1_create_table.sql
BEGIN;

CREATE TABLE IF NOT EXISTS public.pe_evidence_items (
  evidence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.pe_an_messages(message_id) ON DELETE SET NULL,
  work_order text NOT NULL,
  evidence_type text NOT NULL CHECK (
    evidence_type IN (
      'TSC', 'I18N', 'BROWSER', 'GIT_GREP', 'SQL_AUDIT', 'SCREENSHOT'
    )
  ),
  status text NOT NULL CHECK (
    status IN ('PASS', 'FAIL', 'BLOCKED')
  ),
  commit_sha text,
  file_path text,
  url text,
  command text,
  result_summary text,
  result_json jsonb,
  screenshot_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pe_evidence_items_wo_created
  ON public.pe_evidence_items (work_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pe_evidence_items_msg_id
  ON public.pe_evidence_items (message_id);

ALTER TABLE public.pe_evidence_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.pe_evidence_items FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.pe_evidence_items TO authenticated, service_role;
GRANT INSERT ON TABLE public.pe_evidence_items TO service_role;

CREATE POLICY pe_evidence_items_select_authenticated
  ON public.pe_evidence_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY pe_evidence_items_insert_service_role
  ON public.pe_evidence_items
  FOR INSERT
  TO service_role
  WITH CHECK (true);

COMMIT;
