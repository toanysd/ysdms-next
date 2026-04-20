-- Tầng 6: Production Execution (Nhật ký Vận hành Sản xuất)

CREATE TABLE IF NOT EXISTS public.production_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    machine_id UUID NOT NULL REFERENCES public.machine_master(id),
    cutter_id UUID REFERENCES public.cutter_master(id),
    mold_physical_id UUID REFERENCES public.mold_physical(id),
    
    operator_name TEXT,                  -- Tên công nhân / Ca kíp chạy máy
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    
    produced_qty INTEGER NOT NULL DEFAULT 0, -- Số lượng thành phẩm sau khi ca chạy kết thúc
    scrap_qty INTEGER NOT NULL DEFAULT 0,    -- Số lượng phế phẩm
    
    status TEXT DEFAULT 'IN_PROGRESS',   -- IN_PROGRESS, COMPLETED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX hỗ trợ tối ưu query
CREATE INDEX IF NOT EXISTS idx_production_log_order_item ON public.production_log(order_item_id);
CREATE INDEX IF NOT EXISTS idx_production_log_machine ON public.production_log(machine_id);
CREATE INDEX IF NOT EXISTS idx_production_log_status ON public.production_log(status);

-- Bổ sung quyền RLS cho hệ thống (Giai đoạn cho phép service_role_all)
ALTER TABLE public.production_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_role_all_production_log
ON public.production_log
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
