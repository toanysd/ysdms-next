-- ==============================================================================
-- Migration 097: Equipment Loans and Return Workflow Engine (金型借用・返却管理)
-- Milestone 18 Sprint 1: Chỉ thị #026
-- ==============================================================================

-- 1. Create table equipment_loans
CREATE TABLE IF NOT EXISTS public.equipment_loans (
    loan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_code TEXT UNIQUE NOT NULL,
    loan_type TEXT NOT NULL CHECK (loan_type IN ('BORROW', 'RETURN', 'REPAIR_OUT')),
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RETURNED', 'CANCELLED')),
    equipment_id UUID NOT NULL REFERENCES public.equipment(equipment_id) ON DELETE RESTRICT,
    from_company_id UUID REFERENCES public.companies(company_id) ON DELETE RESTRICT,
    to_company_id UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE RESTRICT,
    requested_by UUID REFERENCES public.employees(employee_id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.employees(employee_id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_return_date DATE,
    actual_return_date DATE,
    returned_received_by UUID REFERENCES public.employees(employee_id) ON DELETE SET NULL,
    destination_address TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    purpose TEXT,
    condition_on_loan TEXT,
    condition_on_return TEXT,
    condition_notes TEXT,
    qr_doc_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- PE Adjustment #2: Phiếu BORROW và REPAIR_OUT bắt buộc có scheduled_return_date; chỉ RETURN được NULL
    CONSTRAINT chk_scheduled_return_date CHECK (scheduled_return_date IS NOT NULL OR loan_type = 'RETURN')
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_loans_equipment_id ON public.equipment_loans(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_loans_to_company_id ON public.equipment_loans(to_company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_loans_status ON public.equipment_loans(status);
CREATE INDEX IF NOT EXISTS idx_equipment_loans_scheduled_return_date ON public.equipment_loans(scheduled_return_date);
CREATE INDEX IF NOT EXISTS idx_equipment_loans_loan_type ON public.equipment_loans(loan_type);

-- 3. PE Adjustment #1: Function & Trigger to auto-generate loan_code per-day (LN-YYYYMMDD-001)
CREATE OR REPLACE FUNCTION public.fn_generate_equipment_loan_code(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_date_str TEXT;
    v_next_val INT;
    v_code TEXT;
BEGIN
    v_date_str := to_char(COALESCE(p_date, CURRENT_DATE), 'YYYYMMDD');
    
    -- Count existing records on date + 1
    SELECT COALESCE(COUNT(*), 0) + 1
    INTO v_next_val
    FROM public.equipment_loans
    WHERE loan_date = COALESCE(p_date, CURRENT_DATE);
    
    v_code := 'LN-' || v_date_str || '-' || lpad(v_next_val::text, 3, '0');
    
    -- Prevent collision in concurrent situations
    WHILE EXISTS (SELECT 1 FROM public.equipment_loans WHERE loan_code = v_code) LOOP
        v_next_val := v_next_val + 1;
        v_code := 'LN-' || v_date_str || '-' || lpad(v_next_val::text, 3, '0');
    END LOOP;
    
    RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_fn_set_equipment_loan_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.loan_code IS NULL OR NEW.loan_code = '' THEN
        NEW.loan_code := public.fn_generate_equipment_loan_code(COALESCE(NEW.loan_date, CURRENT_DATE));
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_equipment_loan_code ON public.equipment_loans;
CREATE TRIGGER trg_set_equipment_loan_code
BEFORE INSERT ON public.equipment_loans
FOR EACH ROW
EXECUTE FUNCTION public.trg_fn_set_equipment_loan_code();

-- 4. Server SQL View v_equipment_loans_summary with Overdue Calculation
CREATE OR REPLACE VIEW public.v_equipment_loans_summary AS
SELECT
    el.loan_id,
    el.loan_code,
    el.loan_type,
    el.status,
    el.loan_date,
    el.scheduled_return_date,
    el.actual_return_date,
    el.purpose,
    el.condition_on_loan,
    el.condition_on_return,
    el.condition_notes,
    el.qr_doc_code,
    el.destination_address,
    el.contact_person,
    el.contact_phone,
    el.approved_at,
    el.rejection_reason,
    el.created_at,
    el.updated_at,
    -- Real-time Overdue Calculation
    CASE 
        WHEN el.status IN ('APPROVED', 'IN_TRANSIT') 
             AND el.scheduled_return_date IS NOT NULL 
             AND el.scheduled_return_date < CURRENT_DATE 
        THEN (CURRENT_DATE - el.scheduled_return_date)::INTEGER 
        ELSE 0 
    END AS days_overdue,
    CASE 
        WHEN el.status IN ('APPROVED', 'IN_TRANSIT') 
             AND el.scheduled_return_date IS NOT NULL 
             AND el.scheduled_return_date < CURRENT_DATE 
        THEN true 
        ELSE false 
    END AS is_overdue,
    -- Equipment SSOT Info
    eq.equipment_id,
    eq.equipment_code,
    eq.display_name AS equipment_name,
    eq.equipment_type,
    eq.current_rack_layer_id,
    eq.keeper_company_id AS equipment_current_keeper_id,
    -- To Company (Borrower / Receiver)
    c_to.company_id AS to_company_id,
    c_to.company_code AS to_company_code,
    c_to.company_name AS to_company_name,
    -- From Company (Lender / Returner)
    c_from.company_id AS from_company_id,
    c_from.company_code AS from_company_code,
    c_from.company_name AS from_company_name,
    -- Requested By Employee
    e_req.employee_id AS requested_by_id,
    e_req.employee_name AS requested_by_name,
    -- Approved By Employee
    e_app.employee_id AS approved_by_id,
    e_app.employee_name AS approved_by_name,
    -- Returned Received By Employee
    e_rec.employee_id AS returned_received_by_id,
    e_rec.employee_name AS returned_received_by_name
FROM public.equipment_loans el
JOIN public.equipment eq ON el.equipment_id = eq.equipment_id
JOIN public.companies c_to ON el.to_company_id = c_to.company_id
LEFT JOIN public.companies c_from ON el.from_company_id = c_from.company_id
LEFT JOIN public.employees e_req ON el.requested_by = e_req.employee_id
LEFT JOIN public.employees e_app ON el.approved_by = e_app.employee_id
LEFT JOIN public.employees e_rec ON el.returned_received_by = e_rec.employee_id;

-- 5. Atomic RPC Function: Dispatch Equipment Loan (Xuất kho - In Transit)
-- Wraps in 1 atomic transaction: update equipment_loans, update equipment keeper, insert equipment_ship_logs
CREATE OR REPLACE FUNCTION public.fn_dispatch_equipment_loan(
    p_loan_id UUID,
    p_employee_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_loan RECORD;
    v_log_notes TEXT;
BEGIN
    -- 1. Fetch loan
    SELECT * INTO v_loan
    FROM public.equipment_loans
    WHERE loan_id = p_loan_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Phiếu mượn không tồn tại');
    END IF;

    IF v_loan.status <> 'APPROVED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ phiếu đã được phê duyệt (APPROVED) mới có thể xuất kho');
    END IF;

    -- 2. Update loan status to IN_TRANSIT
    UPDATE public.equipment_loans
    SET status = 'IN_TRANSIT',
        updated_at = now()
    WHERE loan_id = p_loan_id;

    -- 3. Update equipment keeper company
    UPDATE public.equipment
    SET keeper_company_id = v_loan.to_company_id
    WHERE equipment_id = v_loan.equipment_id;

    -- 4. Insert into equipment_ship_logs (Backward compatibility)
    v_log_notes := '[' || v_loan.loan_code || ' - ' || v_loan.loan_type || '] ' || COALESCE(p_notes, v_loan.purpose, 'Xuất khuôn ra ngoài xưởng');
    
    INSERT INTO public.equipment_ship_logs (
        equipment_id,
        from_company_id,
        to_company_id,
        employee_id,
        ship_date,
        ship_item_name,
        notes
    ) VALUES (
        v_loan.equipment_id,
        v_loan.from_company_id,
        v_loan.to_company_id,
        p_employee_id,
        CURRENT_DATE,
        v_loan.loan_code,
        v_log_notes
    );

    RETURN jsonb_build_object('success', true, 'loan_code', v_loan.loan_code);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 6. Atomic RPC Function: Complete Equipment Loan Return (Nhập kho hoàn trả)
CREATE OR REPLACE FUNCTION public.fn_complete_equipment_loan_return(
    p_loan_id UUID,
    p_employee_id UUID,
    p_new_rack_layer_id UUID DEFAULT NULL,
    p_condition_on_return TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_loan RECORD;
    v_old_layer_id UUID;
    v_target_keeper_id UUID;
BEGIN
    -- 1. Fetch loan
    SELECT * INTO v_loan
    FROM public.equipment_loans
    WHERE loan_id = p_loan_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Phiếu mượn không tồn tại');
    END IF;

    IF v_loan.status NOT IN ('APPROVED', 'IN_TRANSIT') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trạng thái phiếu không hợp lệ để nhận hoàn trả');
    END IF;

    -- Determine receiver company (from_company_id if set, or keep current)
    v_target_keeper_id := COALESCE(v_loan.from_company_id, (SELECT company_id FROM public.companies WHERE company_code = 'YSD' LIMIT 1));

    -- 2. Update loan record
    UPDATE public.equipment_loans
    SET status = 'RETURNED',
        actual_return_date = CURRENT_DATE,
        returned_received_by = p_employee_id,
        condition_on_return = COALESCE(p_condition_on_return, condition_on_return),
        condition_notes = CASE WHEN p_notes IS NOT NULL THEN COALESCE(condition_notes, '') || E'\n[Hoàn trả] ' || p_notes ELSE condition_notes END,
        updated_at = now()
    WHERE loan_id = p_loan_id;

    -- 3. Get old layer and update equipment
    SELECT current_rack_layer_id INTO v_old_layer_id
    FROM public.equipment
    WHERE equipment_id = v_loan.equipment_id;

    UPDATE public.equipment
    SET keeper_company_id = v_target_keeper_id,
        current_rack_layer_id = COALESCE(p_new_rack_layer_id, current_rack_layer_id)
    WHERE equipment_id = v_loan.equipment_id;

    -- 4. If new shelf layer provided, log to asset_location_logs
    IF p_new_rack_layer_id IS NOT NULL AND p_new_rack_layer_id IS DISTINCT FROM v_old_layer_id THEN
        INSERT INTO public.asset_location_logs (
            asset_id,
            old_rack_layer_id,
            new_rack_layer_id,
            moved_by,
            moved_at,
            notes
        ) VALUES (
            v_loan.equipment_id,
            v_old_layer_id,
            p_new_rack_layer_id,
            p_employee_id,
            now(),
            '[' || v_loan.loan_code || ' - Hoàn trả] Nhập kho cất vào kệ'
        );
    END IF;

    RETURN jsonb_build_object('success', true, 'loan_code', v_loan.loan_code);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 7. Enable RLS and create open policies for authenticated / app
ALTER TABLE public.equipment_loans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read equipment_loans" ON public.equipment_loans;
CREATE POLICY "Allow public read equipment_loans"
ON public.equipment_loans FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow all insert equipment_loans" ON public.equipment_loans;
CREATE POLICY "Allow all insert equipment_loans"
ON public.equipment_loans FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update equipment_loans" ON public.equipment_loans;
CREATE POLICY "Allow all update equipment_loans"
ON public.equipment_loans FOR UPDATE
USING (true);
