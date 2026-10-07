-- ============================================================================
-- PROPOSAL: RPC create_fast_tooling_job (Sprint P0-2)
-- Status: PROPOSAL — Pending review and approval from THOAN & PE (NOT APPLIED)
-- Author: AN (Antigravity)
-- Date: 2026-10-07
-- Purpose: Atomic, ACID-compliant multi-table fast creation of Tooling Job:
--          Product -> Design Revision -> Equipment (Mold/Cutter) -> Job -> Step 1
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_fast_tooling_job(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    -- Inputs
    v_product_code text;
    v_clean_code text;
    v_clean_code_compact text;
    v_product_name_internal text;
    v_company_id uuid;
    
    v_reuse_revision boolean;
    v_selected_revision_id uuid;
    v_cutline_length numeric;
    v_cutline_width numeric;
    v_corner_r text;
    v_chamfer_c text;
    v_cavity_count integer;
    v_plastic_type_designed text;
    
    v_rack_layer_id uuid;
    v_attach_cutter boolean;
    v_cutter_code text;
    
    v_job_name text;
    v_mold_deadline date;
    v_ship_date date;
    v_assigned_to uuid;
    
    -- Generated IDs & Codes
    v_product_id uuid;
    v_revision_id uuid;
    v_design_code text;
    v_last_rev_num integer;
    
    v_mold_id uuid;
    v_mold_code text;
    v_cutter_id uuid;
    v_assignment_id uuid;
    
    v_job_id uuid;
    v_job_code text;
    v_base_job_code text;
    v_step_id uuid;
    
    v_date_str text;
    v_retry_count integer := 0;
    v_job_inserted boolean := false;
BEGIN
    -- 0. Parse Payload
    v_product_code := trim(p_payload->>'product_code');
    IF v_product_code IS NULL OR v_product_code = '' THEN
        RAISE EXCEPTION 'product_code is required';
    END IF;
    v_clean_code := upper(v_product_code);
    v_clean_code_compact := replace(v_clean_code, '-', '');
    
    v_product_name_internal := nullif(trim(p_payload->>'product_name_internal'), '');
    v_company_id := (p_payload->>'company_id')::uuid;
    IF v_company_id IS NULL THEN
        RAISE EXCEPTION 'company_id is required';
    END IF;

    -- Concurrency Safety: Advisory xact lock on product code to serialize revision & job numbering
    PERFORM pg_advisory_xact_lock(hashtext('fast_tooling_' || v_clean_code_compact));

    -- =========================================================================
    -- UC-1: Resolve or Create Product
    -- =========================================================================
    SELECT product_id INTO v_product_id
    FROM public.products
    WHERE product_code = v_clean_code
    LIMIT 1;

    IF v_product_id IS NULL THEN
        INSERT INTO public.products (
            product_code,
            product_name_internal,
            company_id,
            product_lifecycle_status
        ) VALUES (
            v_clean_code,
            coalesce(v_product_name_internal, v_clean_code),
            v_company_id,
            'ACTIVE'
        )
        RETURNING product_id INTO v_product_id;
    END IF;

    -- =========================================================================
    -- UC-2: Resolve or Create Design Revision
    -- =========================================================================
    v_reuse_revision := coalesce((p_payload->>'reuse_revision')::boolean, false);
    v_selected_revision_id := (p_payload->>'selected_revision_id')::uuid;

    IF v_reuse_revision AND v_selected_revision_id IS NOT NULL THEN
        -- Verify that the selected revision belongs to this product
        SELECT revision_id, design_code INTO v_revision_id, v_design_code
        FROM public.design_revisions
        WHERE revision_id = v_selected_revision_id AND product_id = v_product_id;
        
        IF v_revision_id IS NULL THEN
            RAISE EXCEPTION 'Selected revision does not belong to product %', v_clean_code;
        END IF;
    ELSE
        -- Create New Revision (Deterministic naming: {code}-R1, {code}-R2...)
        SELECT coalesce(max(
            case when design_code ~ '-R[0-9]+$' 
                 then substring(design_code from '-R([0-9]+)$')::integer 
                 else 0 end
        ), 0) INTO v_last_rev_num
        FROM public.design_revisions
        WHERE product_id = v_product_id;

        v_design_code := v_clean_code || '-R' || (v_last_rev_num + 1);

        v_cutline_length := nullif(p_payload->>'cutline_length', '')::numeric;
        v_cutline_width  := nullif(p_payload->>'cutline_width', '')::numeric;
        v_corner_r       := nullif(trim(p_payload->>'corner_r'), '');
        v_chamfer_c      := nullif(trim(p_payload->>'chamfer_c'), '');
        v_cavity_count   := nullif(p_payload->>'cavity_count', '')::integer;
        v_plastic_type_designed := nullif(trim(p_payload->>'plastic_type_designed'), '');

        INSERT INTO public.design_revisions (
            product_id,
            company_id,
            design_code,
            revision_number,
            cutline_length,
            cutline_width,
            corner_r,
            chamfer_c,
            cavity_count,
            plastic_type_designed,
            status
        ) VALUES (
            v_product_id,
            v_company_id,
            v_design_code,
            v_last_rev_num + 1,
            v_cutline_length,
            v_cutline_width,
            v_corner_r,
            v_chamfer_c,
            v_cavity_count,
            v_plastic_type_designed,
            'ACTIVE'
        )
        RETURNING revision_id INTO v_revision_id;
    END IF;

    -- =========================================================================
    -- UC-3: Resolve or Create Equipment (MOLD required, CUTTER optional)
    -- =========================================================================
    v_rack_layer_id := (p_payload->>'rack_layer_id')::uuid;
    v_mold_code := v_clean_code;

    -- Check if equipment_code exists
    SELECT equipment_id INTO v_mold_id
    FROM public.equipment
    WHERE equipment_code = v_mold_code
    LIMIT 1;

    IF v_mold_id IS NULL THEN
        INSERT INTO public.equipment (
            equipment_code,
            display_name,
            equipment_type,
            design_revision_id,
            company_id,
            current_rack_layer_id,
            device_status,
            usage_status
        ) VALUES (
            v_mold_code,
            v_mold_code,
            'MOLD',
            v_revision_id,
            v_company_id,
            v_rack_layer_id,
            'NORMAL',
            'ACTIVE'
        )
        RETURNING equipment_id INTO v_mold_id;
    ELSE
        -- Update location if specified
        IF v_rack_layer_id IS NOT NULL THEN
            UPDATE public.equipment 
            SET current_rack_layer_id = v_rack_layer_id,
                design_revision_id = coalesce(v_revision_id, design_revision_id)
            WHERE equipment_id = v_mold_id;
        END IF;
    END IF;

    -- Optional CUTTER
    v_attach_cutter := coalesce((p_payload->>'attach_cutter')::boolean, false);
    v_cutter_code := nullif(trim(p_payload->>'cutter_code'), '');

    IF v_attach_cutter AND v_cutter_code IS NOT NULL THEN
        SELECT equipment_id INTO v_cutter_id
        FROM public.equipment
        WHERE equipment_code = v_cutter_code
        LIMIT 1;

        IF v_cutter_id IS NULL THEN
            INSERT INTO public.equipment (
                equipment_code,
                display_name,
                equipment_type,
                design_revision_id,
                company_id,
                device_status,
                usage_status
            ) VALUES (
                v_cutter_code,
                v_cutter_code,
                'CUTTER_SEPARATE',
                v_revision_id,
                v_company_id,
                'NORMAL',
                'ACTIVE'
            )
            RETURNING equipment_id INTO v_cutter_id;
        END IF;

        -- Equipment assignment (SET_MEMBER)
        INSERT INTO public.equipment_assignments (
            primary_equipment_id,
            related_equipment_id,
            relationship_type,
            is_default
        ) VALUES (
            v_mold_id,
            v_cutter_id,
            'SET_MEMBER',
            true
        )
        ON CONFLICT (primary_equipment_id, related_equipment_id) DO NOTHING
        RETURNING assignment_id INTO v_assignment_id;
    END IF;

    -- =========================================================================
    -- UC-4: Create Job & Step 1
    -- =========================================================================
    v_job_name := trim(p_payload->>'job_name');
    IF v_job_name IS NULL OR v_job_name = '' THEN
        v_job_name := v_clean_code || ' 金型製作・改修';
    END IF;
    
    v_mold_deadline := nullif(p_payload->>'mold_deadline', '')::date;
    v_ship_date := nullif(p_payload->>'ship_date', '')::date;
    v_assigned_to := (p_payload->>'assigned_to')::uuid;

    v_date_str := to_char(current_date, 'YYYYMMDD');
    v_base_job_code := 'JOB-' || v_clean_code_compact || '-' || v_date_str;
    v_job_code := v_base_job_code;

    -- Bounded retry loop (1 to 20) with unique conflict resolution
    FOR v_retry_count IN 1..20 LOOP
        BEGIN
            INSERT INTO public.jobs (
                job_code,
                job_name,
                product_id,
                design_revision_id,
                equipment_id,
                company_id,
                job_status,
                mold_deadline,
                ship_date,
                overall_progress,
                priority,
                start_date
            ) VALUES (
                v_job_code,
                v_job_name,
                v_product_id,
                v_revision_id,
                v_mold_id,
                v_company_id,
                'PENDING',
                v_mold_deadline,
                v_ship_date,
                0,
                5,
                current_date
            )
            RETURNING job_id INTO v_job_id;

            v_job_inserted := true;
            EXIT; -- Success, exit loop
        EXCEPTION WHEN unique_violation THEN
            -- Unique constraint collision on job_code, increment sequence suffix (-02, -03...)
            v_job_code := v_base_job_code || '-' || lpad((v_retry_count + 1)::text, 2, '0');
        END;
    END LOOP;

    IF NOT v_job_inserted THEN
        RAISE EXCEPTION 'Failed to allocate unique job_code after 20 attempts for base code %', v_base_job_code;
    END IF;

    -- Create Step 1 (作業) with step_status = 'PENDING'
    INSERT INTO public.job_steps (
        job_id,
        step_no,
        step_name,
        step_status,
        assigned_to,
        deadline
    ) VALUES (
        v_job_id,
        1,
        '作業',
        'PENDING',
        v_assigned_to,
        v_mold_deadline
    )
    RETURNING step_id INTO v_step_id;

    -- Return JSON result
    RETURN jsonb_build_object(
        'success', true,
        'product_id', v_product_id,
        'product_code', v_clean_code,
        'revision_id', v_revision_id,
        'design_code', v_design_code,
        'mold_id', v_mold_id,
        'cutter_id', v_cutter_id,
        'job_id', v_job_id,
        'job_code', v_job_code,
        'step_id', v_step_id
    );
END;
$$;
