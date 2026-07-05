export interface MonthlyRow {
  month_label:        string;
  total_qty:          number;
  working_days:       number;
  active_molds:       number;
  avg_qty_per_day:    number; // Need to parse on frontend if returned as string
  mold_map_rate_pct:  number; // Need to parse on frontend if returned as string
  trial_shot_items:   number;
}

export interface MoldPerfRow {
  mold_id:          string;
  mold_code:        string;
  customer_prefix:  string;
  total_qty:        number;
  total_items:      number;
  active_days:      number;
  avg_qty_per_day:  number; // parse to number
  first_seen:       string;
  last_seen:        string;
  trial_shot_count: number;
}

export interface DailyRow {
  order_date:       string;
  mold_code:        string;
  product_code:     string | null;
  product_pn_raw:   string;
  total_qty:        number;
  item_count:       number;
  has_trial_shot:   boolean;
  trial_shot_count: number;
}

export interface DashboardKPI {
  total_stock_kg: number;
  low_stock_count: number;
  orders_pending: number;
  orders_shipped: number;
  orders_this_month?: number;
}

export interface InventorySnapshot {
  plastic_id: string;
  plastic_code?: string;
  family?: string;
  color?: string;
  grade?: string;
  thickness_mm?: number;
  width_mm?: number;
  total_in_kg?: number;
  total_out_kg?: number;
  txn_count?: number;
  last_txn_time?: string;
  reorder_point_kg?: number;
  current_stock_kg: number;
  is_low_stock: boolean;
}

export interface OrderSummary {
  id: string;
  status: string;
  order_month?: string;
  slip_no?: string;
  order_date?: string;
  customer_name?: string;
  customer_code?: string;
  customer_id?: string;
  order_type?: string;
  line_count?: number;
  total_qty?: number;
  total_amount?: number;
  approval_status?: string;
  created_at?: string;
}
