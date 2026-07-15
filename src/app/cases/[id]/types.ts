export type UserRole = 'sales' | 'engineering' | 'manager' | 'admin';

export type TechnicalReviewStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'superseded';

export type MoldOption = 'reuse' | 'modify' | 'remake' | 'new';
export type CuttingDieOption = 'reuse' | 'new' | 'none';

export interface TechnicalReview {
  id: string;
  case_id: string;
  version: number;
  approval_status: TechnicalReviewStatus;

  // Product
  product_id?: string | null;
  design_revision_id?: string | null;
  material_spec?: string | null;
  thickness_mm?: number | null;
  special_requirements?: string | null;

  // Mold
  mold_option?: MoldOption | null;
  mold_id?: string | null;
  pocket_count?: number | null;

  // Die & Machine
  cutting_die_option?: CuttingDieOption | null;
  cutting_die_id?: string | null;
  machine_id?: string | null;
  lead_time_days?: number | null;
  cycle_time_sec?: number | null;

  // Conclusion
  technical_constraints?: string | null;
  rejected_reason?: string | null;

  // Approval metadata
  approved_by?: string | null;
  approved_at?: string | null;
  requested_by?: string | null;
  reviewed_by?: string | null;

  // Legacy fields (still in schema)
  mold_decision_type?: string | null;
  machine_candidate?: string | null;
  mold_size_x?: number | null;
  mold_size_y?: number | null;
  cavity_count?: number | null;
  cut_method?: string | null;
  plug_required?: boolean;
  die_required?: boolean;
  result_status?: string | null;
  raw_text_snapshot?: string | null;
  extra_json?: Record<string, unknown> | null;

  created_at?: string;
  updated_at?: string;
}
export interface BusinessCase {
  case_id: string;
  case_code: string;
  title: string;
  status: string;
  customer_id?: string | null;
  product_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface QuotationLine {
  line_id?: string;
  quotation_id?: string;
  line_no: number;
  item_type: 'DESIGN_FEE' | 'PROTOTYPE' | 'MOLD' | 'PRODUCT' | 'OTHER';
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  notes?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quotation {
  quotation_id: string; // the PK is quotation_id
  case_id: string;
  company_id: string;
  quotation_no: string;
  version?: number;
  issued_date?: string | null; // using quote_date in DB actually?
  quote_date: string | null;
  valid_until: string | null;
  total_amount: number;
  tax_amount?: number;
  currency?: string;
  status: QuotationStatus;
  notes: string | null;
  prepared_by: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
  quotation_lines?: QuotationLine[];
}
