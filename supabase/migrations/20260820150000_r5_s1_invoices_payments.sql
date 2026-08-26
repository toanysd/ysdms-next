
-- 1.1 Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  invoice_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number    TEXT NOT NULL UNIQUE,
  order_id          UUID REFERENCES public.orders(order_id) ON DELETE SET NULL,
  shipment_id       UUID REFERENCES public.shipments(shipment_id) ON DELETE SET NULL,
  company_id        UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE RESTRICT,
  invoice_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date          DATE NOT NULL,
  total_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_amount        NUMERIC(12,2) GENERATED ALWAYS AS (total_amount + tax_amount) STORED,
  paid_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  remaining_amount  NUMERIC(12,2) GENERATED ALWAYS AS (total_amount + tax_amount - paid_amount) STORED,
  status            TEXT NOT NULL DEFAULT 'DRAFT'
                    CHECK (status IN ('DRAFT','ISSUED','PARTIALLY_PAID','PAID','CANCELLED')),
  currency          TEXT NOT NULL DEFAULT 'JPY',
  notes             TEXT,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Invoice Lines Table
CREATE TABLE IF NOT EXISTS public.invoice_lines (
  line_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id        UUID NOT NULL REFERENCES public.invoices(invoice_id) ON DELETE CASCADE,
  order_line_id     UUID REFERENCES public.order_lines(line_id) ON DELETE SET NULL,
  description       TEXT NOT NULL,
  quantity          NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price        NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_amount       NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Invoice Payments Table
CREATE TABLE IF NOT EXISTS public.invoice_payments (
  payment_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id        UUID NOT NULL REFERENCES public.invoices(invoice_id) ON DELETE CASCADE,
  payment_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  amount            NUMERIC(12,2) NOT NULL,
  payment_method    TEXT DEFAULT 'BANK_TRANSFER'
                    CHECK (payment_method IN ('BANK_TRANSFER','CASH','CHECK','OTHER')),
  reference_no      TEXT,
  notes             TEXT,
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Trigger to Auto Update invoices.paid_amount & invoices.status
CREATE OR REPLACE FUNCTION public.fn_sync_invoice_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_invoice_id UUID;
  v_total_paid NUMERIC(12,2);
  v_net_amount NUMERIC(12,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_invoice_id := OLD.invoice_id;
  ELSE
    v_invoice_id := NEW.invoice_id;
  END IF;

  -- Calculate sum of payments for this invoice
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_paid
  FROM public.invoice_payments
  WHERE invoice_id = v_invoice_id;

  -- Get invoice net_amount (or total_amount + tax_amount)
  SELECT (total_amount + tax_amount)
  INTO v_net_amount
  FROM public.invoices
  WHERE invoice_id = v_invoice_id;

  -- Update invoice paid_amount and status
  UPDATE public.invoices
  SET
    paid_amount = v_total_paid,
    status = CASE
      WHEN status = 'CANCELLED' THEN 'CANCELLED'
      WHEN v_total_paid >= v_net_amount AND v_net_amount > 0 THEN 'PAID'
      WHEN v_total_paid > 0 THEN 'PARTIALLY_PAID'
      ELSE status
    END,
    updated_at = NOW()
  WHERE invoice_id = v_invoice_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_invoice_payment ON public.invoice_payments;
CREATE TRIGGER trg_sync_invoice_payment
AFTER INSERT OR UPDATE OR DELETE ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_invoice_payment();

-- 1.5 View Customer Debt Summary
CREATE OR REPLACE VIEW public.v_customer_debt_summary AS
SELECT
  c.company_id,
  c.company_name,
  c.company_code,
  COUNT(i.invoice_id) AS total_invoices,
  COALESCE(SUM(i.net_amount), 0) AS total_billed,
  COALESCE(SUM(i.paid_amount), 0) AS total_paid,
  COALESCE(SUM(i.remaining_amount), 0) AS total_remaining,
  COUNT(CASE WHEN i.due_date < CURRENT_DATE AND i.remaining_amount > 0 THEN 1 END) AS overdue_count
FROM public.companies c
LEFT JOIN public.invoices i ON i.company_id = c.company_id AND i.status != 'CANCELLED'
GROUP BY c.company_id, c.company_name, c.company_code;

-- 1.6 Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date) WHERE status != 'PAID';
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON public.invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice_id ON public.invoice_lines(invoice_id);

-- 1.7 RLS Policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for authenticated users on invoices" ON public.invoices;
CREATE POLICY "Enable all access for authenticated users on invoices" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users on invoice_lines" ON public.invoice_lines;
CREATE POLICY "Enable all access for authenticated users on invoice_lines" ON public.invoice_lines FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users on invoice_payments" ON public.invoice_payments;
CREATE POLICY "Enable all access for authenticated users on invoice_payments" ON public.invoice_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
