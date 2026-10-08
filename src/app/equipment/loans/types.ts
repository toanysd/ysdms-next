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
  is_dormant_3y?: boolean;
}

export interface LoanKpiSummary {
  total: number;
  custodyCount: number;
  pendingApproval: number;
  inTransit: number;
  overdue: number;
  dormantCount?: number;
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
  is_dormant_3y?: boolean;
  customer_code?: string;
  stream_tab?: 'ALL' | 'CUSTOMER_LOAN' | 'RETURN_TO_CUSTOMER' | 'OUTSOURCE_PROCESSING' | 'DORMANT_3Y';
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
  companyCodes: string[];
  companyIds: string[];
  searchKeywords: string[];
}

export const SSOT_11_CUSTOMERS: SsotCustomerPartner[] = [
  {
    id: 'shin-ei',
    code: 'SHT',
    nameJA: '新鋭ハイテック (シンエイ)',
    nameVI: 'Shin-Ei Hitec',
    evidenceRef: 'Row 30 (toanysdmail.xlsx)',
    standardDocType: '金型借用書フォーマット (In Placard + 2 dấu)',
    companyCodes: ['SHT', 'SHE', 'SHT-004', 'SES04'],
    companyIds: [
      '011b1a81-bcfd-49a0-ab35-5dbe08ab789e',
      'efa96dda-5002-49e5-8670-4c1018598a71',
      'fb5fdf21-14e0-4916-9d31-fe7d18687fd4',
      '22811ed4-3031-44dd-b637-eea8d6dfdfe8',
    ],
    searchKeywords: ['新鋭', 'シンエイ', 'Shin-Ei', 'SHT'],
  },
  {
    id: 'jae',
    code: 'JAE',
    nameJA: '日本航空電子工業 (JAE / NLC)',
    nameVI: 'Japan Aviation Electronics (JAE / NLC)',
    evidenceRef: 'Row 15, 16 (toanysdmail.xlsx)',
    standardDocType: '貸与設備棚卸調査表 (Excel Cột G-K)',
    companyCodes: ['JAE', 'HAE', 'YAE', 'YKD', 'NLC'],
    companyIds: [
      '5551651a-6ff6-4ba8-bef4-af2b61e8632a',
      'a38885ae-7d7e-469f-9c69-d01a7a9c1574',
      '8c59a995-3562-4d92-90b0-4f4653f53639',
      '30f9390b-1c25-4e9d-a794-22520bbd6745',
      'c8df3525-2c86-4389-84d5-cbe91beec046',
    ],
    searchKeywords: ['JAE', '航空電子', '弘前航空電子', '山形航空電子', 'NLC'],
  },
  {
    id: 'transtron',
    code: 'OOT',
    nameJA: 'トランストロン / 丸大 / 大手',
    nameVI: 'Transtron / MRDI / Ohte',
    evidenceRef: 'Row 52, 55 (toanysdmail.xlsx)',
    standardDocType: '金型預かり証 (Ảnh kèm thước dây áp sát)',
    companyCodes: ['OOT', 'MRD', 'MARUDAI'],
    companyIds: [
      '2d2db667-3edf-4662-9659-f41fe6d3d2b1',
      '94023311-73e9-4e8c-bd8a-cefbb2fb8a64',
      'c8b6d3c0-e1af-46e4-8aca-ad41d95f5fd6',
    ],
    searchKeywords: ['トランストロン', 'Transtron', '丸大', 'MRD', '大手', 'OOT'],
  },
  {
    id: 'fujikura',
    code: 'FJK',
    nameJA: '藤倉コンポ / 青森フジクラ',
    nameVI: 'Fujikura Composite',
    evidenceRef: 'source_data/型保管料(20250704)',
    standardDocType: '貸与資産明細書兼確認書 (Phí lưu kho 307.5 Yên/tháng)',
    companyCodes: ['FJK', 'FJD', 'FJD3', 'FJK7', 'COT-001-2'],
    companyIds: [
      'b82f6f09-fc19-419c-ad7a-10432aa9ccb4',
      '9a01af8b-cbac-41e0-92ac-08e353c2a76e',
      'af7ab2f7-4080-4f2c-981f-a32853cf8a21',
      '3cabfbda-55a5-4868-bf8a-9175dbf6294e',
      '047c0639-23c2-4da2-bd88-a65d586b8d9d',
    ],
    searchKeywords: ['藤倉', 'Fujikura', 'フジクラ', 'FJK'],
  },
  {
    id: 'panasonic',
    code: 'PNS',
    nameJA: 'パナソニック白河 / アドバネクス',
    nameVI: 'Panasonic Shirakawa / Advanex',
    evidenceRef: 'Row 100 (toanysdmail.xlsx)',
    standardDocType: '金型返却票・金型棚卸 (QR cá thể + Pallet 1100x1100)',
    companyCodes: ['PNS', 'ADV', 'SNK', 'PNS03', 'PNS4'],
    companyIds: [
      'f8e174bf-fc8f-45b2-ae53-bc8915692bbc',
      'bad9e1de-542f-4bc3-9aa1-c682bde93b5d',
      'c6df7010-a681-4b4b-81e8-8f3bd3458bc3',
      '6ec82694-ab03-4b40-b0b6-d28ed5adc4ce',
      '4f7d7197-a991-43c2-a61b-22f98fd21ec4',
    ],
    searchKeywords: ['パナソニック', 'Panasonic', 'PNS', '白河', 'アドバネクス'],
  },
  {
    id: 'canon-asahi',
    code: 'ASH',
    nameJA: '大分キヤノン / 朝日プラスチック',
    nameVI: 'Oita Canon / Asahi Plastic',
    evidenceRef: 'Row 5, 13869 (toanysdmail.xlsx)',
    standardDocType: '借用証/現品受渡確認票 (Tách TSCĐ & Chi phí, Ký điện tử)',
    companyCodes: ['ASH', 'CANON', 'AHP', 'TSA'],
    companyIds: [
      '0ea1a54f-c0d9-49a3-8159-a3397c2e2338',
      '633a3c69-ea1a-46d7-88e0-b03578909d6b',
      'ea09189f-1e25-4c4d-8c6a-0684a2b63804',
      'ccf301b0-277d-41ec-9b11-b87c1a7b2729',
    ],
    searchKeywords: ['キヤノン', 'Canon', '朝日', '旭化成', 'ASH'],
  },
  {
    id: 'rhythm',
    code: 'DIC',
    nameJA: 'リズム / ワイエイシイガーター / 大一',
    nameVI: 'Rhythm / YAC Garter / Daiichi',
    evidenceRef: 'Row 50 (toanysdmail.xlsx)',
    standardDocType: '資産棚卸証 (Kiểm kê ủy thác định kỳ tháng 12)',
    companyCodes: ['DIC', 'DIC-001B', 'RTM', 'YAC'],
    companyIds: [
      '46779df5-53c5-4184-95af-8b137d275b1b',
      'f4b30d8d-3db2-42fe-b032-e9e0311cba5d',
      '9a3a4985-aa15-4067-a4f8-f6ad15138ba6',
      'e901ab2b-292f-433a-b5b4-149127bf6694',
    ],
    searchKeywords: ['リズム', 'Rhythm', 'RTM', 'YAC', 'ワイエイシイ', '大一', 'DIC'],
  },
  {
    id: 'a-and-t',
    code: 'AAT',
    nameJA: 'エイアンドティー (A&T)',
    nameVI: 'A&T Corporation',
    evidenceRef: 'Row 9, 10, 11 (toanysdmail.xlsx)',
    standardDocType: '金型等有無確認表 (Kiểm đếm khuôn & gá cắt tháng 11)',
    companyCodes: ['AAT', 'AAT-001-B'],
    companyIds: [
      '0d660e4d-180d-40b6-a970-b0a66e0286a2',
      'd2d72a20-231f-45b7-a018-90f173fd445c',
    ],
    searchKeywords: ['A&T', 'エイアンドティー', 'AAT'],
  },
  {
    id: 'omura-smk',
    code: 'SMK',
    nameJA: '大村技研 / SMK',
    nameVI: 'Omura Giken / SMK',
    evidenceRef: 'Row 70, 82 (toanysdmail.xlsx)',
    standardDocType: '設備返却依頼・廃棄受渡 (Thu hồi linh kiện, gửi xưởng Iwate)',
    companyCodes: ['SMK', 'OOM', 'IBR01', '2307445-1'],
    companyIds: [
      '2af154c3-4f7a-405b-9502-8f121eada865',
      '088f9623-9b39-4a76-88f2-9eeba45339d2',
      'de3609d8-fe15-4ede-a16f-250d75aa3327',
      '444c523f-6f9d-4dfa-9500-fc6273da921c',
    ],
    searchKeywords: ['大村', 'Omura', 'SMK', '茨城SMK'],
  },
  {
    id: 'minebea',
    code: 'MCT',
    nameJA: 'ミネベア (MinebeaMitsumi)',
    nameVI: 'MinebeaMitsumi',
    evidenceRef: 'Row 697 (toanysdmail.xlsx)',
    standardDocType: '外注加工依頼書 (Xuất gia công phủ Teflon chống dính)',
    companyCodes: ['MCT', 'MCT-001'],
    companyIds: [
      '53f9b4e8-260b-47d4-80b0-e5f2d02685ca',
      'a1523d58-0f28-4d96-b2c6-6d86673b8cec',
    ],
    searchKeywords: ['ミネベア', 'Minebea', 'MCT'],
  },
  {
    id: 'terada-deimu',
    code: 'DIM',
    nameJA: '寺田デイム / 大妙',
    nameVI: 'Terada Deimu / Daimyo',
    evidenceRef: 'Row 3096 (toanysdmail.xlsx)',
    standardDocType: '現地棚卸訪問日程案内 (Đón đoàn kiểm toán tận xưởng Kawasaki)',
    companyCodes: ['DIM', 'DIM2'],
    companyIds: [
      '74e54cb1-b756-4dfa-b273-27e7ec1319d2',
      'fa18b0fe-62de-4c02-adbc-c527033d1364',
    ],
    searchKeywords: ['寺田', 'デイム', '大妙', 'DIM', 'Terada'],
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

// ==============================================================================
// Package 3: 3-Year Dormant Molds & Storage Fee Engine Types (WO-P1-002)
// SSOT: MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Topic 3 & Fujikura Model)
// ==============================================================================

export const STANDARD_MOLD_STORAGE_RATE_JPY = 307.5; // JPY/mold/month (Fujikura SSOT standard)

export interface DormantMoldRecord {
  id: string;
  equipment_id: string;
  equipment_code: string;
  equipment_name: string | null;
  equipment_type: string;
  customer_asset_no: string | null;
  customer_name: string;
  customer_code: string;
  current_rack_location: string | null;
  last_used_date: string | null;
  last_used_source: 'JOB' | 'ORDER' | 'ENTRY' | 'NONE';
  is_dormant_3y: boolean;
  days_inactive: number;
  months_dormant: number;
  monthly_rate_jpy: number;
  total_storage_fee_jpy: number;
  condition_notes: string | null;
}

export interface StorageFeePartnerSummary {
  partner: SsotCustomerPartner | null;
  totalMoldsCount: number;
  dormantMoldsCount: number;
  activeMoldsCount: number;
  totalAccumulatedFeeJpy: number;
  standardMonthlyRate: number;
  records: DormantMoldRecord[];
}


