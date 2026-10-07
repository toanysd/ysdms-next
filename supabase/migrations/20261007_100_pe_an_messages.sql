-- Migration 100: Create pe_an_messages for bidirectional PE <-> AN communication
-- Approved by Minh Chủ THOAN and designed by PE (Claude Sonnet Thinking)

CREATE TABLE IF NOT EXISTS public.pe_an_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('PE', 'AN', 'THOAN')),
    message_type TEXT NOT NULL CHECK (message_type IN ('DIRECTIVE', 'ANALYSIS', 'QUESTION', 'APPROVAL', 'REPORT')),
    content_md TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'READ', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Public read-only for PE execute_sql, Service Role write for AN
ALTER TABLE public.pe_an_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pe_an_messages' AND policyname = 'pe_an_messages_select'
    ) THEN
        CREATE POLICY "pe_an_messages_select" ON public.pe_an_messages FOR SELECT TO public USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pe_an_messages' AND policyname = 'pe_an_messages_write'
    ) THEN
        CREATE POLICY "pe_an_messages_write" ON public.pe_an_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;
