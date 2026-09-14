-- ============================================================================
-- Migration: 20260911000002_m28b_work_order_progress_view.sql
-- Tên định danh chỉ thị: m28b_work_order_progress_view.sql
-- Mục đích: Định nghĩa View v_work_order_progress tổng hợp tiến độ và giờ công 4 tầng
-- Kiến trúc: JOIN 4 tầng work_orders (T1) -> jobs (T2) -> job_steps (T3) -> work_logs (T4)
-- Milestone: M28 - Giai đoạn B (Chỉ thị Step 1)
-- Trạng thái: Sẵn sàng cho PE thẩm định (CHƯA APPLY lên DB)
-- ============================================================================

CREATE OR REPLACE VIEW public.v_work_order_progress AS
WITH job_step_stats AS (
    SELECT 
        j.work_order_id AS wo_id,
        COUNT(DISTINCT j.job_id) AS total_jobs,
        COUNT(DISTINCT CASE WHEN j.job_status = 'COMPLETED' THEN j.job_id END) AS completed_jobs,
        COUNT(DISTINCT js.step_id) AS total_steps,
        COUNT(DISTINCT CASE WHEN js.step_status = 'COMPLETED' THEN js.step_id END) AS completed_steps,
        COALESCE(SUM(js.planned_hours), 0) AS sum_planned_hours
    FROM public.jobs j
    LEFT JOIN public.job_steps js ON js.job_id = j.job_id
    WHERE j.work_order_id IS NOT NULL
    GROUP BY j.work_order_id
),
work_log_stats AS (
    SELECT 
        j.work_order_id AS wo_id,
        COALESCE(SUM(wl.hours_spent), 0) AS sum_actual_hours
    FROM public.jobs j
    JOIN public.work_logs wl ON wl.job_id = j.job_id
    WHERE j.work_order_id IS NOT NULL
    GROUP BY j.work_order_id
)
SELECT 
    wo.wo_id,
    wo.wo_code,
    wo.wo_name,
    wo.wo_type,
    wo.wo_status,
    wo.start_date,
    wo.deadline,
    wo.completed_at,
    wo.priority,
    wo.company_id,
    wo.product_id,
    wo.order_id,
    o.order_no,
    COALESCE(jss.total_jobs, 0)::INTEGER AS total_jobs,
    COALESCE(jss.completed_jobs, 0)::INTEGER AS completed_jobs,
    COALESCE(jss.total_steps, 0)::INTEGER AS total_steps,
    COALESCE(jss.completed_steps, 0)::INTEGER AS completed_steps,
    ROUND(COALESCE(jss.sum_planned_hours, 0)::NUMERIC, 2) AS sum_planned_hours,
    ROUND(COALESCE(wls.sum_actual_hours, 0)::NUMERIC, 2) AS sum_actual_hours,
    ROUND((COALESCE(wls.sum_actual_hours, 0) - COALESCE(jss.sum_planned_hours, 0))::NUMERIC, 2) AS variance_hours,
    CASE 
        WHEN wo.wo_status = 'COMPLETED' THEN 100.0
        WHEN COALESCE(jss.total_steps, 0) > 0 THEN 
            ROUND((jss.completed_steps::NUMERIC / jss.total_steps::NUMERIC) * 100.0, 1)
        WHEN COALESCE(jss.total_jobs, 0) > 0 THEN 
            ROUND((jss.completed_jobs::NUMERIC / jss.total_jobs::NUMERIC) * 100.0, 1)
        ELSE 0.0
    END AS progress_percent,
    (wo.deadline IS NOT NULL AND wo.deadline < NOW() AND wo.wo_status NOT IN ('COMPLETED', 'CANCELLED')) AS is_overdue
FROM public.work_orders wo
LEFT JOIN job_step_stats jss ON jss.wo_id = wo.wo_id
LEFT JOIN work_log_stats wls ON wls.wo_id = wo.wo_id
LEFT JOIN public.orders o ON o.order_id = wo.order_id;

-- Phân quyền truy cập view cho authenticated và service_role
GRANT SELECT ON public.v_work_order_progress TO authenticated;
GRANT SELECT ON public.v_work_order_progress TO service_role;

COMMENT ON VIEW public.v_work_order_progress IS 'View tổng hợp tiến độ và so sánh giờ công kế hoạch vs thực tế 4 tầng của Lệnh sản xuất (Work Orders)';
