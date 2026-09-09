ALTER TABLE plastic_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_receipt_roll ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_adjustment_log ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'plastic_receipt' AND policyname = 'plastic_receipt_auth_all'
    ) THEN
        CREATE POLICY "plastic_receipt_auth_all" ON plastic_receipt FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'plastic_receipt_roll' AND policyname = 'plastic_receipt_roll_auth_all'
    ) THEN
        CREATE POLICY "plastic_receipt_roll_auth_all" ON plastic_receipt_roll FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'plastic_adjustment_log' AND policyname = 'plastic_adj_auth_all'
    ) THEN
        CREATE POLICY "plastic_adjYauth_all" ON plastic_adjustment_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;