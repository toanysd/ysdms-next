// ============================================================
// YSDMS-NEXT | TypeScript Types — Tray Inventory Module
// ============================================================

export type InventoryTxnType = 'IN' | 'OUT' | 'ADJUST'

export interface TrayInventoryTxn {
    id: string
    txn_type: InventoryTxnType
    product_id: string              // FK → product_master.id
    order_item_id: string | null    // FK → order_items.id
    production_log_id: string | null // FK → production_log.id
    quantity: number                // absolute quantity (always positive recommended)
    lot_no: string | null
    txn_date: string                // YYYY-MM-DD
    operator_name: string | null
    notes: string | null
    created_at: string
}

export type TrayInventoryTxnInsert = Omit<TrayInventoryTxn, 'id' | 'created_at'>
export type TrayInventoryTxnUpdate = Partial<TrayInventoryTxnInsert>

// View: tray_stock_summary
export interface TrayStockSummary {
    product_id: string
    product_code: string
    product_name: string
    customer_part_number: string | null
    customer_code: string | null
    total_in: number
    total_out: number
    total_adjust: number
    current_stock: number
}
