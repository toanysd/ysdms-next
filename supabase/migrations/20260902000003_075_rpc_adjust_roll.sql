-- Migration 075: RPC for atomic plastic roll adjustment

CREATE OR REPLACE FUNCTION public.rpc_adjust_roll(
    p_roll_id UUID,
    p_delta NUMERIC,
    p_reason TEXT,
    p_type TEXT,
    p_operator TEXT
) RETURNS jsonb AS $$
DECLARE
    v_current_length NUMERIC;
    v_new_length NUMERIC;
    v_status TEXT;
BEGIN
    -- Lock the row for update
    SELECT current_length_m INTO v_current_length
    FROM plastic_receipt_roll
    WHERE id = p_roll_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Roll not found';
    END IF;

    v_new_length := v_current_length + p_delta;
    IF v_new_length < 0 THEN
        RAISE EXCEPTION 'Length cannot be negative (current: %, delta: %)', v_current_length, p_delta;
    END IF;

    IF v_new_length = 0 THEN
        v_status := 'empty';
    ELSE
        IF p_delta > 0 AND (SELECT status FROM plastic_receipt_roll WHERE id = p_roll_id) = 'empty' THEN
            v_status := 'in_stock';
        ELSE
            SELECT status INTO v_status FROM plastic_receipt_roll WHERE id = p_roll_id;
        END IF;
    END IF;

    -- Update roll
    UPDATE plastic_receipt_roll
    SET current_length_m = v_new_length, status = v_status
    WHERE id = p_roll_id;

    -- Insert log
    INSERT INTO plastic_adjustment_log (
        roll_id, 
        change_length_m, 
        note, 
        action_type, 
        operator_name
    ) VALUES (
        p_roll_id, 
        p_delta, 
        p_reason, 
        p_type, 
        p_operator
    );

    RETURN jsonb_build_object('success', true, 'new_length', v_new_length, 'status', v_status);
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

REVOKE EXECUTE ON FUNCTION public.rpc_adjust_roll(uuid, numeric, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.rpc_adjust_roll(uuid, numeric, text, text, text) TO authenticated;
