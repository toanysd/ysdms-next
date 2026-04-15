// ============================================
// YSDMS-NEXT | TypeScript Types — Dashboard Module
// API Contract provided by Perplexity
// ============================================

export type PlasticStock = {
    id: string                    // uuid
    plastic_id: string            // uuid (= id)
    current_kg: number            // numeric — tồn kho hiện tại
    min_threshold_kg: number | null // numeric — ngưỡng reorder
    last_updated: string | null   // timestamptz
}

export type InventorySnapshot = {
    plastic_id: string            // uuid
    plastic_code: string          // text — mã nhựa
    family: string                // text — loại nhựa (PS, ABS, PP...)
    grade: string | null          // text
    color: string | null          // text
    thickness_mm: number | null   // numeric
    width_mm: number | null       // numeric
    reorder_point_kg: number | null // numeric
    current_stock_kg: number      // numeric — TỒN THỰC TẾ
    total_in_kg: number           // numeric
    total_out_kg: number          // numeric
    txn_count: number             // bigint
    last_txn_time: string | null  // timestamptz
    is_low_stock: boolean         // boolean ← dùng cho badge cảnh báo
}

export type OrderSummary = {
    id: string                    // uuid
    slip_no: string               // text — số phiếu
    order_date: string            // date
    status: string                // 'draft'|'confirmed'|'pending'|'in_production'|'shipped'|'cancelled'|'delivered'
    order_type: string            // text
    approval_status: string       // text
    customer_id: string           // uuid
    customer_name: string | null  // text — tên KH hiển thị
    customer_code: string | null  // text
    order_month: string           // date (YYYY-MM-01)
    order_week: string            // date
    line_count: number            // bigint
    total_qty: number             // bigint
    total_amount: number          // numeric
    created_at: string            // timestamptz
    updated_at: string            // timestamptz
}

export type DashboardKPI = {
    total_stock_kg: number        // SUM(current_stock_kg)
    low_stock_count: number       // COUNT WHERE is_low_stock = true
    orders_pending: number        // COUNT WHERE status = 'pending' | 'confirmed'
    orders_shipped: number        // COUNT WHERE status = 'shipped'
    orders_this_month: number     // COUNT WHERE order_month = current month
}
