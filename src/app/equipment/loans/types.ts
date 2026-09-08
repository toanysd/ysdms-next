// ==============================================================================
// Equipment Loans & Return Workflow Engine Types
// Milestone 18: ADR-009 & Chỉ thị #026
// ==============================================================================

export type LoanType =
  | 'CUSTOMER_LOAN'
  | 'RETURN_TO_CUSTOMER'
  | 'OUTSOURCE_PROCESSING';

export type LoanStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_TRANSIT'
  | 'RETURNED'
  | 'CANCELLED';

export interface EquipmentLoanItem {
  loan_id: string;
  loan_code: string;
  loan_type: LoanType;
  status: LoanStatus;
  loan_date: string;
  scheduled_return_date: string | null;
  actual_return_date: string | null;
  purpose: string | null;
  condition_on_loan: string | null;
  condition_on_return: string | null;
  condition_notes: string | null;
  qr_doc_code: string | null;
  photo_overall_url: string | null;
  photo_nameplate_url: string | null;
  destination_address: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  days_overdue: number;
  is_overdue: boolean;
  has_valid_loan_document: boolean;
  equipment_id: string;
  equipment_code: string;
  equipment_name: string | null;
  equipment_type: string;
  current_rack_layer_id: string | null;
  equipment_current_keeper_id: string | null;
  equipment_owner_company_id: string | null;
  to_company_id: string;
  to_company_code: string | null;
  to_company_name: string;
  from_company_id: string | null;
  from_company_code: string | null;
  from_company_name: string | null;
  requested_by_id: string | null;
  requested_by_name: string | null;
  approved_by_id: string | null;
  approved_by_name: string | null;
  returned_received_by_id: string | null;
  returned_received_by_name: string | null;
}

export interface LoanKpiSummary {
  total: number;
  custodyCount: number;
  pendingApproval: number;
  inTransit: number;
  overdue: number;
  completedThisMonth: number;
}

export interface CreateLoanInput {
  equipment_id: string;
  loan_type: LoanType;
  to_company_id: string;
  from_company_id?: string | null;
  loan_date?: string;
  scheduled_return_date?: string | null;
  requested_by?: string | null;
  destination_address?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  purpose?: string | null;
  condition_on_loan?: string | null;
  condition_notes?: string | null;
  photo_overall_url?: string | null;
  photo_nameplate_url?: string | null;
}

export interface ApproveLoanInput {
  loan_id: string;
  approved_by: string;
}

export interface RejectLoanInput {
  loan_id: string;
  approved_by: string;
  rejection_reason: string;
}

export interface DispatchLoanInput {
  loan_id: string;
  employee_id: string;
  notes?: string;
}

export interface CompleteReturnInput {
  loan_id: string;
  employee_id: string;
  new_rack_layer_id?: string | null;
  condition_on_return?: string | null;
  notes?: string | null;
}

export interface LoanFilterParams {
  search?: string;
  loan_type?: LoanType | 'ALL';
  status?: LoanStatus | 'ALL' | 'ACTIVE';
  is_overdue?: boolean;
  page?: number;
  pageSize?: number;
}

export interface LoanListResult {
  data: EquipmentLoanItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
}
