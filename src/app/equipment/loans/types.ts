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
  customer_code?: string;
  stream_tab?: 'ALL' | 'CUSTODY' | 'LOAN' | 'TRANSFER';
  page?: number;
  pageSize?: number;
}

export interface LoanListResult {
  data: EquipmentLoanItem[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

// ==============================================================================
// SSOT 11 Customers Configuration & Annual Audit Types (MOLD_CUSTODY_BUSINESS_SPEC v1.0)
// ==============================================================================

export interface SsotCustomerPartner {
  id: string;
  code: string;
  nameJA: string;
  nameVI: string;
  evidenceRef: string;
  standardDocType: string;
  searchKeywords: string[];
}

export const SSOT_11_CUSTOMERS: SsotCustomerPartner[] = [
  {
    id: 'shin-ei',
    code: 'SES04',
    nameJA: '新鋭産業 / 新鋭ハイテック',
    nameVI: 'Shin-Ei Sangyo / Shin-Ei Hitec',
    evidenceRef: 'Row 30',
    standardDocType: '金型借用書フォーマット (In Placard + 2 dấu)',
    searchKeywords: ['新鋭', 'Shin-Ei', 'SES04'],
  },
  {
    id: 'jae',
    code: 'JAE',
    nameJA: '日本航空電子工業 (JAE / NLC)',
    nameVI: 'Japan Aviation Electronics (JAE / NLC)',
    evidenceRef: 'Row 15, 16',
    standardDocType: '貸与設備棚卸調査表 (Excel Cột G-K)',
    searchKeywords: ['JAE', '航空電子', '弘前航空電子', '山形航空電子'],
  },
  {
    id: 'transtron',
    code: 'TRANSTRON',
    nameJA: 'トランストロン / MRDI / オーテ',
    nameVI: 'Transtron / MRDI / Ohte',
    evidenceRef: 'Row 52, 55',
    standardDocType: '金型預かり証 (Ảnh kèm thước dây áp sát)',
    searchKeywords: ['トランストロン', 'Transtron', 'MRDI', 'オーテ'],
  },
  {
    id: 'fujikura',
    code: 'FUJIKURA',
    nameJA: '藤倉コンポ (Fujikura Composite)',
    nameVI: 'Fujikura Composite',
    evidenceRef: 'source_data/型保管料(20250704)',
    standardDocType: '貸与資産明細書兼確認書 (Phí lưu kho 307.5 Yên/tháng)',
    searchKeywords: ['藤倉', 'Fujikura', 'フジクラ'],
  },
  {
    id: 'panasonic',
    code: 'PNS',
    nameJA: 'パナソニック白河 (Panasonic)',
    nameVI: 'Panasonic Shirakawa',
    evidenceRef: 'Row 100',
    standardDocType: '金型返却票・金型棚卸 (QR cá thể + Pallet 1100x1100)',
    searchKeywords: ['パナソニック', 'Panasonic', 'PNS'],
  },
  {
    id: 'canon-asahi',
    code: 'CANON-ASAHI',
    nameJA: '大分キヤノン / 旭化成',
    nameVI: 'Oita Canon / Asahi Kasei',
    evidenceRef: 'Row 5, 13869',
    standardDocType: '借用証/現品受渡確認票 (Tách TSCĐ & Chi phí, Ký điện tử)',
    searchKeywords: ['キヤノン', 'Canon', '旭化成', '旭金属', 'ASAHI'],
  },
  {
    id: 'rhythm',
    code: 'RTM',
    nameJA: 'リズム / YAC Garter',
    nameVI: 'Rhythm / YAC Garter',
    evidenceRef: 'Row 50',
    standardDocType: '資産棚卸証 (Kiểm kê ủy thác định kỳ tháng 12)',
    searchKeywords: ['リズム', 'Rhythm', 'RTM', 'YAC'],
  },
  {
    id: 'a-and-t',
    code: 'A&T',
    nameJA: 'エー・アンド・デイ (A&T)',
    nameVI: 'A&T Corporation',
    evidenceRef: 'Row 9, 10, 11',
    standardDocType: '金型等有無確認表 (Kiểm đếm khuôn & gá cắt tháng 11)',
    searchKeywords: ['A&T', 'エー・アンド・デイ'],
  },
  {
    id: 'omura-smk',
    code: 'OMURA-SMK',
    nameJA: '大村技研 / SMK',
    nameVI: 'Omura Giken / SMK',
    evidenceRef: 'Row 70, 82',
    standardDocType: '設備返却依頼・廃棄受渡 (Thu hồi linh kiện, gửi xưởng Iwate)',
    searchKeywords: ['大村', 'Omura', 'SMK'],
  },
  {
    id: 'minebea',
    code: 'MINEBEA',
    nameJA: 'ミネベア (MinebeaMitsumi)',
    nameVI: 'MinebeaMitsumi',
    evidenceRef: 'Row 697',
    standardDocType: '外注加工依頼書 (Xuất gia công phủ Teflon chống dính)',
    searchKeywords: ['ミネベア', 'Minebea'],
  },
  {
    id: 'terada',
    code: 'TERADA',
    nameJA: '寺田電機製作所 / 寺田デイム',
    nameVI: 'Terada Electric / Terada Deimu',
    evidenceRef: 'Row 3096',
    standardDocType: '現地棚卸訪問日程案内 (Đón đoàn kiểm toán tận xưởng Kawasaki)',
    searchKeywords: ['寺田', 'Terada'],
  },
];

export interface AnnualAuditRecord {
  id: string;
  equipment_id: string;
  equipment_code: string;
  equipment_name: string | null;
  equipment_type: string;
  customer_asset_no: string | null;
  customer_name: string;
  current_rack_location: string | null;
  custody_status: 'CUSTODY_ACTIVE' | 'LOAN_OUT' | 'INTERNAL_STORAGE' | 'RETURNED';
  custody_status_label: string;
  loan_date: string | null;
  last_audit_date: string | null;
  condition_summary: string | null;
  photo_overall_url: string | null;
  photo_nameplate_url: string | null;
}

export interface AnnualAuditFilterParams {
  partnerId?: string;
  year?: number;
  status?: string;
}

