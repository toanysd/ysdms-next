// ============================================================
// YSDMS-NEXT | TypeScript Types — Orders Module
// Auto-snapshot từ migration: create_orders_module
// ============================================================

export type OrderStatus =
    | 'draft'
    | 'pending'
    | 'confirmed'
    | 'sent'
    | 'in_production'
    | 'shipped'
    | 'delivered'
    | 'cancelled'

export type OrderType = 'molding' | 'outsource' | 'prototype'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// ── orders (master) ─────────────────────────────────────────
export interface Order {
    id: string
    slip_no: string | null          // 伝票/LOT No. — ví dụ: "263090"
    order_date: string              // ISO date "YYYY-MM-DD"
    order_type: OrderType
    status: OrderStatus
    customer_id: string             // FK → customers.id
    delivery_site_code: string | null  // 納品先コード — ví dụ: "KSP3"
    delivery_address: string | null
    requester_code: string | null   // 依頼元 — ví dụ: "KBY01"
    handler_name: string | null     // 担当者 — ví dụ: "桜井"
    internal_notes: string | null   // 注意事項
    approval_status: ApprovalStatus
    approved_by: string | null
    approved_at: string | null
    created_by: string | null
    created_at: string
    updated_at: string
}

export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'>
export type OrderUpdate = Partial<OrderInsert>

// ── order_items (detail lines) ───────────────────────────────
export interface OrderItem {
    id: string
    order_id: string                // FK → orders.id
    line_no: number                 // số thứ tự dòng
    product_id: string | null       // FK → product_master.id
    product_pn_raw: string | null   // P/N text thực tế trong đơn
    mold_id: string | null          // FK → mold_base.id (nếu có chi phí khuôn)
    request_no: string | null       // 要求No. — ví dụ: "1441923"
    quantity: number                // 数量 tổng
    packing_qty: number | null      // 入数/箱 — ví dụ: 250
    packing_boxes: number | null    // 箱数 — ví dụ: 2
    delivery_date: string | null    // 納期 (ngày đầu)
    delivery_date_end: string | null // 納期 (ngày cuối nếu range)
    unit_price: number | null
    currency: string                // mặc định 'JPY'
    process_notes: string | null    // 別抜き・面取り・袋詰め・全数検査...
    created_at: string
    updated_at: string
}

export type OrderItemInsert = Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>
export type OrderItemUpdate = Partial<OrderItemInsert>

// ── order_status_history ─────────────────────────────────────
export interface OrderStatusHistory {
    id: string
    order_id: string
    from_status: OrderStatus | null
    to_status: OrderStatus
    changed_by: string | null
    note: string | null
    changed_at: string
}

// ── View helpers (với JOIN) ───────────────────────────────────
export interface OrderWithCustomer extends Order {
    customer: {
        id: string
        customer_code: string
        name_jp: string
        name_short: string | null
    }
}

export interface OrderItemWithProduct extends OrderItem {
    product_master: {
        id: string
        pn: string
        product_name: string | null
    } | null
    mold_base: {
        id: string
        mold_code: string
    } | null
}

export interface OrderFull extends OrderWithCustomer {
    order_items: OrderItemWithProduct[]
    order_status_history: OrderStatusHistory[]
}
