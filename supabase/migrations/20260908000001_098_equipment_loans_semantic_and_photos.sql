-- ==============================================================================
-- Migration 098: Equipment Loans Semantic Alignment, Photos & Audit Support
-- Milestone 18 Sprint 2: ADR-009 & Chỉ thị #026 Follow-up
-- ==============================================================================

-- 1. Update existing records in equipment_loans to new standardized loan_type
UPDATE public.equipment_loans
SET loan_type = 'CUSTOMER_LOAN'
WHERE loan_type = 'BORROW';

UPDATE public.equipment_loans
SET loan_type = 'RETURN_TO_CUSTOMER'
WHERE loan_type = 'RETURN';

UPDATE public.equipment_loans
SET loan_type = 'OUTSOURCE_PROCESSING'
WHERE loan_type = 'REPAIR_OUT';

-- 2. Drop old check constraints and establish new strict constraints
ALTER TABLE public.equipment_loans DROP CONSTRAINT IF EXISTS equipment_loans_loan_type_check;
ALTER TABLE public.equipment_loans ADD CONSTRAINT equipment_loans_loan_type_check 
    CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING'));

ALTER TABLE public.equipment_loans DROP CONSTRAINT IF EXISTS chk_scheduled_return_date;
ALTER TABLE public.equipment_loans ADD CONSTRAINT chk_scheduled_return_date 
    CHECK (scheduled_return_date IS NOT NULL OR loan_type = 'RETURN_TO_CUSTOMER');

-- 3. PE Adjustment #2: Add photo columns for Japanese Fixed Asset Accounting
ALTER TABLE public.equipment_loans ADD COLUMN IF NOT EXISTS photo_overall_url TEXT;
ALTER TABLE public.equipment_loans ADD COLUMN IF NOT EXISTS photo_nameplate_url TEXT;

-- 4. Recreate View v_equipment_loans_summary with new photo columns and has_valid_loan_document
DROP VIEW IF EXISTS public.v_equipment_loans_summary CASCADE;
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
    el.photo_overall_url,
    el.photo_nameplate_url,
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
    -- PE Adjustment #3: Annual Consignment Audit Flag (貸与設備棚卸調査 - 貸出書の有無)
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.equipment_loans el_sub
            WHERE el_sub.equipment_id = el.equipment_id 
              AND el_sub.loan_type = 'CUSTOMER_LOAN'
              AND el_sub.status IN ('APPROVED', 'IN_TRANSIT')
        ) THEN true 
        ELSE false 
    END AS has_valid_loan_document,
    -- Equipment SSOT Info
    eq.equipment_id,
    eq.equipment_code,
    eq.display_name AS equipment_name,
    eq.equipment_type,
    eq.current_rack_layer_id,
    eq.keeper_company_id AS equipment_current_keeper_id,
    eq.company_id AS equipment_owner_company_id,
    -- To Company (Receiver / YSD or Customer or Vendor)
    c_to.company_id AS to_company_id,
    c_to.company_code AS to_company_code,
    c_to.company_name AS to_company_name,
    -- From Company (Sender / Customer or YSD)
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

-- 5. Updated RPC Function: Dispatch Equipment Loan (Xuất kho - In Transit)
-- Strictly assigns keeper_company_id according to physical flow defined in ADR-009
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
    v_ysd_id UUID;
BEGIN
    -- 1. Fetch loan
    SELECT * INTO v_loan
    FROM public.equipment_loans
    WHERE loan_id = p_loan_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Phiếu mượn/trả không tồn tại');
    END IF;

    IF v_loan.status <> 'APPROVED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ phiếu đã được phê duyệt (APPROVED) mới có thể xuất kho');
    END IF;

    -- Fetch YSD company ID
    SELECT company_id INTO v_ysd_id FROM public.companies WHERE company_code = 'YSD' LIMIT 1;

    -- 2. Update loan status to IN_TRANSIT
    UPDATE public.equipment_loans
    SET status = 'IN_TRANSIT',
        updated_at = now()
    WHERE loan_id = p_loan_id;

    -- 3. Update equipment keeper company and rack layer according to ADR-009 physical flow
    IF v_loan.loan_type = 'CUSTOMER_LOAN' THEN
        -- Khách gửi khuôn vào YSD giữ hộ -> Keeper là YSD
        UPDATE public.equipment
        SET keeper_company_id = COALESCE(v_ysd_id, v_loan.to_company_id)
        WHERE equipment_id = v_loan.equipment_id;

    ELSIF v_loan.loan_type = 'RETURN_TO_CUSTOMER' THEN
        -- YSD hoàn trả khuôn về khách hàng -> Keeper là Khách hàng (to_company_id), rời khỏi giá kệ YSD
        UPDATE public.equipment
        SET keeper_company_id = v_loan.to_company_id,
            current_rack_layer_id = NULL
        WHERE equipment_id = v_loan.equipment_id;

    ELSIF v_loan.loan_type = 'OUTSOURCE_PROCESSING' THEN
        -- YSD gửi khuôn sang vendor ngoài mài/phủ teflon -> Tạm thời keeper là Vendor
        UPDATE public.equipment
        SET keeper_company_id = v_loan.to_company_id
        WHERE equipment_id = v_loan.equipment_id;
    END IF;

    -- 4. Insert into equipment_ship_logs (Backward compatibility)
    v_log_notes := '[' || v_loan.loan_code || ' - ' || v_loan.loan_type || '] ' || COALESCE(p_notes, v_loan.purpose, 'Xuất chuyển giao khuôn');
    
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

-- 6. Updated RPC Function: Complete Equipment Loan Return (Nhập kho hoàn trả / Bàn giao xong)
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
    v_ysd_id UUID;
BEGIN
    -- 1. Fetch loan
    SELECT * INTO v_loan
    FROM public.equipment_loans
    WHERE loan_id = p_loan_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Phiếu mượn/trả không tồn tại');
    END IF;

    IF v_loan.status NOT IN ('APPROVED', 'IN_TRANSIT') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Trạng thái phiếu không hợp lệ để hoàn tất bàn giao');
    END IF;

    -- Fetch YSD company ID
    SELECT company_id INTO v_ysd_id FROM public.companies WHERE company_code = 'YSD' LIMIT 1;

    -- 2. Update loan record
    UPDATE public.equipment_loans
    SET status = 'RETURNED',
        actual_return_date = CURRENT_DATE,
        returned_received_by = p_employee_id,
        condition_on_return = COALESCE(p_condition_on_return, condition_on_return),
        condition_notes = CASE WHEN p_notes IS NOT NULL THEN COALESCE(condition_notes, '') || E'\n[Hoàn tất] ' || p_notes ELSE condition_notes END,
        updated_at = now()
    WHERE loan_id = p_loan_id;

    -- 3. Get old layer and update equipment based on loan_type
    SELECT current_rack_layer_id INTO v_old_layer_id
    FROM public.equipment
    WHERE equipment_id = v_loan.equipment_id;

    IF v_loan.loan_type IN ('CUSTOMER_LOAN', 'OUTSOURCE_PROCESSING') THEN
        -- Khuôn được giữ tại xưởng YSD hoặc nhập về lại từ vendor -> Keeper là YSD, cất vào tầng kệ
        UPDATE public.equipment
        SET keeper_company_id = COALESCE(v_ysd_id, (SELECT keeper_company_id FROM public.equipment WHERE equipment_id = v_loan.equipment_id)),
            current_rack_layer_id = COALESCE(p_new_rack_layer_id, current_rack_layer_id)
        WHERE equipment_id = v_loan.equipment_id;

        -- Log to asset_location_logs if moved to a new shelf layer
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
                '[' || v_loan.loan_code || ' - Hoàn trả/Lưu giữ] Nhập kho cất vào kệ'
            );
        END IF;

    ELSIF v_loan.loan_type = 'RETURN_TO_CUSTOMER' THEN
        -- Đã bàn giao hoàn trả thành công về khách hàng -> Keeper là Khách hàng, không còn ở kệ YSD
        UPDATE public.equipment
        SET keeper_company_id = v_loan.to_company_id,
            current_rack_layer_id = NULL
        WHERE equipment_id = v_loan.equipment_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'loan_code', v_loan.loan_code);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
