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
