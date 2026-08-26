-- =========================================================================================
-- Migration: 20260820120000_r2b_atomic_rpc_and_guard_trigger.sql
-- Description: Thay thế cơ chế 2s window heuristic bằng Atomic RPC fn_transition_product_lifecycle
--              và Session Guard Flag 'app.bypass_lifecycle_trigger' trong Trigger DB.
-- =========================================================================================

-- 1. Hàm Atomic RPC fn_transition_product_lifecycle
CREATE OR REPLACE FUNCTION public.fn_transition_product_lifecycle(
    p_product_id UUID,
    p_to_status TEXT,
    p_trigger_event TEXT,
    p_reference_table TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_changed_by UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_from_status TEXT;
    v_log_id UUID;
    v_actor UUID;
BEGIN
    -- 1. Lấy trạng thái hiện tại (Lock row để đảm bảo tính tuần tự tuyệt đối)
    SELECT product_lifecycle_status INTO v_from_status
    FROM public.products
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sản phẩm với ID % không tồn tại trong hệ thống', p_product_id;
    END IF;

    -- 2. Validation bắt buộc lý do cho sự kiện can thiệp thủ công
    IF p_trigger_event = 'MANUAL_OVERRIDE' AND (p_reason IS NULL OR trim(p_reason) = '') THEN
        RAISE EXCEPTION 'Bắt buộc phải nhập lý do khi thay đổi trạng thái thủ công (MANUAL_OVERRIDE)';
    END IF;

    -- 3. Bật Session Flag cục bộ trong Transaction để báo cho Trigger DB bỏ qua
    PERFORM set_config('app.bypass_lifecycle_trigger', 'true', true);

    -- 4. Xác định người thực hiện (Ưu tiên tham số truyền vào -> sau đó tới auth.uid())
    BEGIN
        v_actor := COALESCE(p_changed_by, auth.uid());
    EXCEPTION WHEN OTHERS THEN
        v_actor := p_changed_by;
    END;

    -- 5. Ghi nhận Audit Log
    INSERT INTO public.product_lifecycle_logs (
        product_id,
        from_status,
        to_status,
        trigger_event,
        reference_table,
        reference_id,
        changed_by,
        reason,
        metadata
    ) VALUES (
        p_product_id,
        v_from_status,
        p_to_status,
        p_trigger_event,
        p_reference_table,
        p_reference_id,
        v_actor,
        p_reason,
        p_metadata
    ) RETURNING log_id INTO v_log_id;

    -- 6. Cập nhật bảng products
    UPDATE public.products
    SET 
        product_lifecycle_status = p_to_status,
        updated_at = now()
    WHERE product_id = p_product_id;

    RETURN v_log_id;
END;
$$;

-- Cấp quyền thực thi RPC
GRANT EXECUTE ON FUNCTION public.fn_transition_product_lifecycle(
    UUID, TEXT, TEXT, TEXT, UUID, TEXT, UUID, JSONB
) TO authenticated, service_role, anon;

-- 2. Trigger DB rút gọn thành Guard: Loại bỏ hoàn toàn cửa sổ thời gian 2 giây
CREATE OR REPLACE FUNCTION public.fn_trg_product_lifecycle_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_changed_by UUID := NULL;
    v_app_bypass TEXT;
BEGIN
    -- 1. Kiểm tra Session Flag: Nếu được gọi từ fn_transition_product_lifecycle -> BỎ QUA 100%
    BEGIN
        v_app_bypass := current_setting('app.bypass_lifecycle_trigger', true);
    EXCEPTION WHEN OTHERS THEN
        v_app_bypass := 'false';
    END;

    IF v_app_bypass = 'true' THEN
        RETURN NEW;
    END IF;

    -- 2. Nếu không có flag -> Đây là UPDATE direct từ SQL Editor / Migration / Script bên ngoài
    BEGIN
        v_changed_by := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_changed_by := NULL;
    END;

    -- 3. Tự động chèn log SYSTEM_UPDATE
    INSERT INTO public.product_lifecycle_logs (
        product_id,
        from_status,
        to_status,
        trigger_event,
        reference_table,
        reference_id,
        changed_by,
        reason
    ) VALUES (
        NEW.product_id,
        OLD.product_lifecycle_status,
        NEW.product_lifecycle_status,
        'SYSTEM_UPDATE',
        NULL,
        NULL,
        v_changed_by,
        'SYSTEM: Tự động ghi nhận thay đổi trực tiếp sang ' || COALESCE(NEW.product_lifecycle_status, 'NULL')
    );

    RETURN NEW;
END;
$$;
