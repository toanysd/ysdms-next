'use server';

// ==============================================================================
// Equipment Loans & Return Workflow Engine — Server Actions
// Milestone 18: ADR-009 & Migration 098
// ==============================================================================

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  LoanFilterParams,
  LoanListResult,
  EquipmentLoanItem,
  LoanKpiSummary,
  CreateLoanInput,
  ApproveLoanInput,
  RejectLoanInput,
  DispatchLoanInput,
  CompleteReturnInput,
  SsotCustomerPartner,
  AnnualAuditRecord,
  DormantMoldRecord,
  StorageFeePartnerSummary,
} from './types';
import { SSOT_11_CUSTOMERS, STANDARD_MOLD_STORAGE_RATE_JPY } from './types';

/**
 * 1. Get paginated and filtered list of equipment loans from v_equipment_loans_summary
 */
export async function getEquipmentLoans(
  params: LoanFilterParams = {}
): Promise<LoanListResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 50));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('v_equipment_loans_summary')
    .select('*', { count: 'exact' });

  // Filter: Search keyword
  if (params.search && params.search.trim()) {
    const s = params.search.trim();
    query = query.or(
      `loan_code.ilike.%${s}%,equipment_code.ilike.%${s}%,equipment_name.ilike.%${s}%,to_company_name.ilike.%${s}%,from_company_name.ilike.%${s}%,contact_person.ilike.%${s}%,purpose.ilike.%${s}%`
    );
  }

  // Filter: Stream Tab (3 business streams per MOLD_CUSTODY_BUSINESS_SPEC v1.0)
  if (params.stream_tab && params.stream_tab !== 'ALL') {
    query = query.eq('loan_type', params.stream_tab);
  } else if (params.loan_type && params.loan_type !== 'ALL') {
    query = query.eq('loan_type', params.loan_type);
  }

  // Filter: Customer / Partner (via verified static UUIDs - RULE-DATA-02)
  if (params.customer_code && params.customer_code !== 'ALL') {
    const matchedPartner = SSOT_11_CUSTOMERS.find(
      (p) => p.id === params.customer_code || p.code === params.customer_code
    );
    if (matchedPartner && matchedPartner.companyIds.length > 0) {
      const idsStr = matchedPartner.companyIds.join(',');
      query = query.or(`to_company_id.in.(${idsStr}),from_company_id.in.(${idsStr})`);
    } else {
      query = query.or(
        `to_company_code.eq.${params.customer_code},from_company_code.eq.${params.customer_code}`
      );
    }
  }

  // Filter: Status
  if (params.status && params.status !== 'ALL') {
    if (params.status === 'ACTIVE') {
      query = query.in('status', ['PENDING_APPROVAL', 'APPROVED', 'IN_TRANSIT']);
    } else {
      query = query.eq('status', params.status);
    }
  }

  // Filter: Overdue flag
  if (params.is_overdue === true) {
    query = query.eq('is_overdue', true);
  }

  // Filter: Dormant 3Y flag (Package 3 / WO-P1-002)
  if (params.is_dormant_3y === true) {
    const dormantData = await getDormantMoldsData(params.customer_code);
    const dormantEqIds = dormantData.records
      .filter((r) => r.is_dormant_3y)
      .map((r) => r.equipment_id);
    if (dormantEqIds.length > 0) {
      query = query.in('equipment_id', dormantEqIds);
    } else {
      query = query.eq('equipment_id', '00000000-0000-0000-0000-000000000000');
    }
  }

  // Sorting: Rule 7.1 — Newest first
  query = query
    .order('loan_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching equipment loans:', error);
    throw new Error(`Failed to fetch equipment loans: ${error.message}`);
  }

  const loanItems = (data || []) as unknown as EquipmentLoanItem[];

  // Annotate dormant flag for items on this page (evidence-based from jobs history)
  if (loanItems.length > 0) {
    const eqIds = Array.from(new Set(loanItems.map((i) => i.equipment_id).filter(Boolean)));
    if (eqIds.length > 0) {
      const now = new Date();
      const cutoff3y = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
      const cutoffStr = cutoff3y.toISOString().slice(0, 10);

      const { data: jobRows } = await supabase
        .from('jobs')
        .select('equipment_id, start_date, ship_date, deadline')
        .in('equipment_id', eqIds);

      const jobMap = new Map<string, string>();
      (jobRows || []).forEach((j: any) => {
        const dates = [j.ship_date, j.deadline, j.start_date]
          .filter(Boolean)
          .map((d: string) => d.slice(0, 10));
        if (dates.length > 0) {
          const maxD = dates.sort().reverse()[0];
          const curr = jobMap.get(j.equipment_id);
          if (!curr || maxD > curr) jobMap.set(j.equipment_id, maxD);
        }
      });

      loanItems.forEach((item) => {
        const lastJob = jobMap.get(item.equipment_id);
        item.is_dormant_3y = Boolean(lastJob && lastJob <= cutoffStr);
      });
    }
  }

  return {
    data: loanItems,
    totalRecords: count || 0,
    page,
    pageSize,
  };
}

/**
 * 2. Get single loan detail with complete joined information
 */
export async function getEquipmentLoanDetail(
  loanId: string
): Promise<EquipmentLoanItem | null> {
  if (!loanId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('v_equipment_loans_summary')
    .select('*')
    .eq('loan_id', loanId)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching loan detail for ${loanId}:`, error);
    throw new Error(`Failed to fetch loan detail: ${error.message}`);
  }

  return data ? ((data as unknown) as EquipmentLoanItem) : null;
}

/**
 * 3. Get KPI summary for equipment loans dashboard
 * Key Metric: custodyCount = Số lượng khuôn khách hàng gửi YSD giữ hộ đang active
 */
export async function getEquipmentLoanKpis(): Promise<LoanKpiSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_equipment_loans_summary')
    .select('loan_type, status, is_overdue, actual_return_date, equipment_id');

  if (error) {
    console.error('Error fetching loan KPIs:', error);
    return {
      total: 0,
      custodyCount: 0,
      pendingApproval: 0,
      inTransit: 0,
      overdue: 0,
      completedThisMonth: 0,
    };
  }

  const now = new Date();
  const firstDayOfMonthStr = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const custodyEquipments = new Set<string>();
  let pendingApproval = 0;
  let inTransit = 0;
  let overdue = 0;
  let completedThisMonth = 0;

  for (const item of data || []) {
    if (item.status === 'PENDING_APPROVAL') pendingApproval++;
    if (item.status === 'IN_TRANSIT') inTransit++;
    if (item.is_overdue) overdue++;

    // Custody calculation: CUSTOMER_LOAN currently in effect (APPROVED or IN_TRANSIT)
    if (
      item.loan_type === 'CUSTOMER_LOAN' &&
      (item.status === 'APPROVED' || item.status === 'IN_TRANSIT') &&
      item.equipment_id
    ) {
      custodyEquipments.add(item.equipment_id);
    }

    if (
      item.status === 'RETURNED' &&
      item.actual_return_date &&
      item.actual_return_date >= firstDayOfMonthStr
    ) {
      completedThisMonth++;
    }
  }

  // Package 3 / WO-P1-002: Dormant molds count
  let dormantCount = 0;
  try {
    const dormantSummary = await getDormantMoldsData();
    dormantCount = dormantSummary.dormantMoldsCount;
  } catch (err) {
    console.error('Error fetching dormant molds count for KPIs:', err);
  }

  return {
    total: data?.length || 0,
    custodyCount: custodyEquipments.size,
    pendingApproval,
    inTransit,
    overdue,
    dormantCount,
    completedThisMonth,
  };
}

/**
 * 4. Create new equipment loan proposal
 * Auto generates loan_code (LN-YYYYMMDD-NNN) via database trigger
 * Automatically assigns from/to according to ADR-009 physical flow
 */
export async function createEquipmentLoan(
  input: CreateLoanInput
): Promise<{ success: boolean; data?: EquipmentLoanItem; error?: string }> {
  try {
    const supabase = await createClient();

    // Validation: scheduled_return_date is mandatory unless loan_type is RETURN_TO_CUSTOMER
    if (input.loan_type !== 'RETURN_TO_CUSTOMER' && !input.scheduled_return_date) {
      return {
        success: false,
        error:
          'Hạn hoàn trả dự kiến (scheduled_return_date) là bắt buộc đối với phiếu Mượn/Giữ hộ (CUSTOMER_LOAN) và Gia công ngoài (OUTSOURCE_PROCESSING).',
      };
    }

    if (!input.equipment_id) {
      return { success: false, error: 'Chưa chọn thiết bị / khuôn.' };
    }

    // Check if equipment is currently in an active loan
    const { data: activeLoans, error: activeErr } = await supabase
      .from('equipment_loans')
      .select('loan_id, loan_code, status')
      .eq('equipment_id', input.equipment_id)
      .in('status', ['PENDING_APPROVAL', 'APPROVED', 'IN_TRANSIT']);

    if (activeErr) {
      console.error('Error checking active loans:', activeErr);
    } else if (activeLoans && activeLoans.length > 0) {
      return {
        success: false,
        error: `Thiết bị này đang có phiếu hoạt động (${activeLoans[0].loan_code} - ${activeLoans[0].status}). Vui lòng hoàn tất hoặc hủy phiếu trước khi tạo phiếu mới.`,
      };
    }

    // Lookup YSD company
    const { data: ysdCompany } = await supabase
      .from('companies')
      .select('company_id')
      .eq('company_code', 'YSD')
      .maybeSingle();

    const ysdId = ysdCompany?.company_id;

    // Lookup equipment owner company
    const { data: eqData } = await supabase
      .from('equipment')
      .select('company_id, keeper_company_id')
      .eq('equipment_id', input.equipment_id)
      .single();

    let fromCompanyId = input.from_company_id;
    let toCompanyId = input.to_company_id;

    if (input.loan_type === 'CUSTOMER_LOAN') {
      // Khách hàng -> YSD
      toCompanyId = ysdId || input.to_company_id;
      if (!fromCompanyId) {
        fromCompanyId = eqData?.company_id || null;
      }
      if (!fromCompanyId) {
        return { success: false, error: 'Chưa xác định được Khách hàng sở hữu khuôn.' };
      }
    } else if (input.loan_type === 'RETURN_TO_CUSTOMER') {
      // YSD -> Khách hàng
      fromCompanyId = ysdId || null;
      if (!toCompanyId) {
        toCompanyId = eqData?.company_id || '';
      }
      if (!toCompanyId) {
        return { success: false, error: 'Chưa xác định được Khách hàng tiếp nhận hoàn trả.' };
      }
    } else if (input.loan_type === 'OUTSOURCE_PROCESSING') {
      // YSD -> Vendor
      fromCompanyId = ysdId || null;
      if (!toCompanyId) {
        return { success: false, error: 'Chưa chọn Xưởng gia công / Vendor đối tác.' };
      }
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('equipment_loans')
      .insert({
        equipment_id: input.equipment_id,
        loan_type: input.loan_type,
        to_company_id: toCompanyId,
        from_company_id: fromCompanyId || null,
        loan_date: input.loan_date || new Date().toISOString().slice(0, 10),
        scheduled_return_date: input.scheduled_return_date || null,
        requested_by: input.requested_by || null,
        destination_address: input.destination_address || null,
        contact_person: input.contact_person || null,
        contact_phone: input.contact_phone || null,
        purpose: input.purpose || null,
        condition_on_loan: input.condition_on_loan || null,
        condition_notes: input.condition_notes || null,
        photo_overall_url: input.photo_overall_url || null,
        photo_nameplate_url: input.photo_nameplate_url || null,
        status: 'PENDING_APPROVAL',
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Error inserting equipment loan:', insertErr);
      return { success: false, error: insertErr.message };
    }

    revalidatePath('/equipment/loans');
    revalidatePath('/equipment/molds');

    // Fetch full item from view
    const detail = await getEquipmentLoanDetail(inserted.loan_id);

    return { success: true, data: detail || undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * 5. Approve equipment loan proposal
 */
export async function approveEquipmentLoan(
  input: ApproveLoanInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify current status
    const { data: loan, error: fetchErr } = await supabase
      .from('equipment_loans')
      .select('status, loan_code')
      .eq('loan_id', input.loan_id)
      .single();

    if (fetchErr || !loan) {
      return { success: false, error: 'Không tìm thấy phiếu mượn/trả.' };
    }

    if (loan.status !== 'PENDING_APPROVAL') {
      return {
        success: false,
        error: `Không thể phê duyệt phiếu ở trạng thái: ${loan.status}`,
      };
    }

    const { error: updateErr } = await supabase
      .from('equipment_loans')
      .update({
        status: 'APPROVED',
        approved_by: input.approved_by,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq('loan_id', input.loan_id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath('/equipment/loans');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * 6. Reject equipment loan proposal
 */
export async function rejectEquipmentLoan(
  input: RejectLoanInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify current status
    const { data: loan, error: fetchErr } = await supabase
      .from('equipment_loans')
      .select('status, loan_code')
      .eq('loan_id', input.loan_id)
      .single();

    if (fetchErr || !loan) {
      return { success: false, error: 'Không tìm thấy phiếu mượn/trả.' };
    }

    if (loan.status !== 'PENDING_APPROVAL') {
      return {
        success: false,
        error: `Không thể từ chối phiếu ở trạng thái: ${loan.status}`,
      };
    }

    const { error: updateErr } = await supabase
      .from('equipment_loans')
      .update({
        status: 'REJECTED',
        approved_by: input.approved_by,
        approved_at: new Date().toISOString(),
        rejection_reason: input.rejection_reason || 'Từ chối yêu cầu',
        updated_at: new Date().toISOString(),
      })
      .eq('loan_id', input.loan_id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath('/equipment/loans');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * 7. Dispatch equipment loan (Xuất kho -> IN_TRANSIT)
 * Calls atomic PostgreSQL RPC fn_dispatch_equipment_loan per ADR-009
 */
export async function dispatchEquipmentLoan(
  input: DispatchLoanInput
): Promise<{ success: boolean; loan_code?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('fn_dispatch_equipment_loan', {
      p_loan_id: input.loan_id,
      p_employee_id: input.employee_id,
      p_notes: input.notes || undefined,
    });

    if (error) {
      console.error('RPC fn_dispatch_equipment_loan failed:', error);
      return { success: false, error: error.message };
    }

    const res = data as { success?: boolean; loan_code?: string; error?: string };
    if (!res?.success) {
      return { success: false, error: res?.error || 'Lỗi xuất kho không xác định' };
    }

    revalidatePath('/equipment/loans');
    revalidatePath('/equipment/molds');
    revalidatePath('/equipment/locations');
    revalidatePath('/equipment/lifecycle');

    return { success: true, loan_code: res.loan_code };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * 8. Complete equipment loan return (Hoàn tất bàn giao / Nhập hoàn trả -> RETURNED)
 * Calls atomic PostgreSQL RPC fn_complete_equipment_loan_return per ADR-009
 */
export async function completeEquipmentLoanReturn(
  input: CompleteReturnInput
): Promise<{ success: boolean; loan_code?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
      'fn_complete_equipment_loan_return',
      {
        p_loan_id: input.loan_id,
        p_employee_id: input.employee_id,
        p_new_rack_layer_id: input.new_rack_layer_id || undefined,
        p_condition_on_return: input.condition_on_return || undefined,
        p_notes: input.notes || undefined,
      }
    );

    if (error) {
      console.error('RPC fn_complete_equipment_loan_return failed:', error);
      return { success: false, error: error.message };
    }

    const res = data as { success?: boolean; loan_code?: string; error?: string };
    if (!res?.success) {
      return {
        success: false,
        error: res?.error || 'Lỗi hoàn trả không xác định',
      };
    }

    revalidatePath('/equipment/loans');
    revalidatePath('/equipment/molds');
    revalidatePath('/equipment/locations');
    revalidatePath('/equipment/lifecycle');

    return { success: true, loan_code: res.loan_code };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * 9. Fetch equipment candidates for loan proposal modal
 */
export async function getEquipmentCandidates(search?: string): Promise<
  {
    equipment_id: string;
    equipment_code: string;
    display_name: string;
    equipment_type: string;
    owner_company_id: string | null;
    owner_company_name: string | null;
  }[]
> {
  const supabase = await createClient();
  let query = supabase
    .from('equipment')
    .select('equipment_id, equipment_code, display_name, equipment_type, company_id, companies!equipment_company_id_fkey(company_name)')
    .in('equipment_type', ['MOLD', 'CUTTER_SEPARATE', 'CUTTER_INLINE'])
    .order('equipment_code')
    .limit(30);

  if (search && search.trim()) {
    const s = search.trim();
    query = query.or(`equipment_code.ilike.%${s}%,display_name.ilike.%${s}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching equipment candidates:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    equipment_id: item.equipment_id,
    equipment_code: item.equipment_code,
    display_name: item.display_name,
    equipment_type: item.equipment_type,
    owner_company_id: item.company_id,
    owner_company_name: item.companies?.company_name || null,
  }));
}

/**
 * 10. Fetch companies list (Customer or Supplier/Vendor)
 */
export async function getCompaniesForLoan(): Promise<
  {
    company_id: string;
    company_code: string;
    company_name: string;
    is_ysd: boolean;
  }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name')
    .order('company_code');

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return (data || []).map((c) => ({
    company_id: c.company_id,
    company_code: c.company_code,
    company_name: c.company_name,
    is_ysd: c.company_code === 'YSD',
  }));
}

/**
 * 11. Fetch employees list for loan actions
 */
export async function getEmployeesForLoan(): Promise<
  {
    employee_id: string;
    employee_code: string | null;
    employee_name: string;
  }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id, employee_code, employee_name')
    .order('employee_name');

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  return (data || []).map((e) => ({
    employee_id: e.employee_id,
    employee_code: e.employee_code,
    employee_name: e.employee_name,
  }));
}

/**
 * 12. Fetch rack layers for returning equipment to storage
 */
export async function getRackLayersForReturn(): Promise<
  {
    id: string;
    layer_code: string;
    rack_code: string;
    rack_name: string | null;
  }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('rack_layers')
    .select('id, layer_code, racks(rack_code, rack_name)')
    .order('layer_code');

  if (error) {
    console.error('Error fetching rack layers:', error);
    return [];
  }

  return (data || []).map((rl: any) => ({
    id: rl.id,
    layer_code: rl.layer_code,
    rack_code: rl.racks?.rack_code || '---',
    rack_name: rl.racks?.rack_name || null,
  }));
}

/**
 * 13. Get Annual Audit List (年次棚卸リスト) for SSOT 11 Customers
 * Milestone 18 / Sprint P1: MOLD_CUSTODY_BUSINESS_SPEC v1.0
 */
export async function getAnnualAuditData(
  partnerId?: string,
  year: number = new Date().getFullYear()
): Promise<{
  partner: SsotCustomerPartner | null;
  data: AnnualAuditRecord[];
  totalCount: number;
}> {
  const supabase = await createClient();

  const matchedPartner =
    partnerId && partnerId !== 'ALL'
      ? SSOT_11_CUSTOMERS.find((p) => p.id === partnerId || p.code === partnerId) || null
      : null;

  // Determine target company UUIDs
  let targetCompanyIds: string[] = [];
  if (matchedPartner) {
    targetCompanyIds = matchedPartner.companyIds;
  } else {
    // All 11 SSOT partners
    targetCompanyIds = SSOT_11_CUSTOMERS.flatMap((p) => p.companyIds);
  }

  if (targetCompanyIds.length === 0) {
    return {
      partner: matchedPartner,
      data: [],
      totalCount: 0,
    };
  }

  // 1. Primary Query: Physical equipment joined with design_revisions and products (SSOT)
  const { data: eqRows, error: eqErr } = await supabase
    .from('equipment')
    .select(`
      equipment_id,
      equipment_code,
      display_name,
      equipment_type,
      physical_stamp,
      notes,
      current_rack_layer_id,
      rack_layers:current_rack_layer_id(layer_code, racks:rack_id(rack_code)),
      design_revisions!equipment_design_revision_id_fkey!inner(
        customer_equipment_no,
        products!design_revisions_product_id_fkey!inner(
          company_id,
          product_code,
          product_name,
          companies!products_company_id_fkey(company_name, company_code)
        )
      )
    `)
    .in('design_revisions.products.company_id', targetCompanyIds)
    .order('equipment_code', { ascending: true });

  if (eqErr) {
    console.error('Error querying physical equipment for annual audit:', eqErr);
    return {
      partner: matchedPartner,
      data: [],
      totalCount: 0,
    };
  }

  // 2. Check if any active loan records exist in equipment_loans for these equipment items
  const eqIds = (eqRows || []).map((e: any) => e.equipment_id);
  const activeLoansMap = new Map<string, any>();
  if (eqIds.length > 0) {
    const batchSize = 500;
    for (let i = 0; i < eqIds.length; i += batchSize) {
      const slice = eqIds.slice(i, i + batchSize);
      const { data: loanRows } = await supabase
        .from('v_equipment_loans_summary')
        .select('*')
        .in('equipment_id', slice)
        .in('status', ['PENDING_APPROVAL', 'APPROVED', 'IN_TRANSIT']);
      (loanRows || []).forEach((l: any) => {
        if (l.equipment_id) activeLoansMap.set(l.equipment_id, l);
      });
    }
  }

  // 3. Map to AnnualAuditRecord
  const records: AnnualAuditRecord[] = (eqRows || []).map((eq: any) => {
    const rev = eq.design_revisions;
    const prod = rev?.products;
    const comp = prod?.companies;
    const activeLoan = activeLoansMap.get(eq.equipment_id);

    // Determine rack location string from actual rack_layers (RULE-DATA-01/02: no fake fallback)
    const rackCode = eq.rack_layers?.racks?.rack_code;
    const layerCode = eq.rack_layers?.layer_code;
    let locationStr: string | null = null;
    if (rackCode && layerCode) {
      locationStr = `${rackCode}-${layerCode}`;
    } else if (layerCode) {
      locationStr = layerCode;
    }

    let custody_status: AnnualAuditRecord['custody_status'] = 'CUSTODY_ACTIVE';
    let custody_status_label = '預託中 (Custody)';
    let loanDate: string | null = null;

    if (activeLoan) {
      loanDate = activeLoan.loan_date || null;
      if (activeLoan.loan_type === 'OUTSOURCE_PROCESSING') {
        custody_status = 'LOAN_OUT';
        custody_status_label = '外注加工中 (Outsourced)';
      } else if (activeLoan.loan_type === 'RETURN_TO_CUSTOMER') {
        custody_status = 'RETURNED';
        custody_status_label = '客先返却手続中 (Return in Progress)';
      }
    }

    return {
      id: eq.equipment_id,
      equipment_id: eq.equipment_id,
      equipment_code: eq.equipment_code || '---',
      equipment_name: eq.display_name || prod?.product_name || '—',
      equipment_type: eq.equipment_type || 'MOLD',
      customer_asset_no: rev?.customer_equipment_no || eq.physical_stamp || eq.equipment_code,
      customer_name: matchedPartner?.nameJA || comp?.company_name || '—',
      current_rack_location: locationStr,
      custody_status,
      custody_status_label,
      loan_date: loanDate,
      last_audit_date: null,
      condition_summary: activeLoan?.condition_notes || eq.notes || null,
      photo_overall_url: activeLoan?.photo_overall_url || null,
      photo_nameplate_url: activeLoan?.photo_nameplate_url || null,
    };
  });

  return {
    partner: matchedPartner,
    data: records,
    totalCount: records.length,
  };
}

/**
 * 14. Get 3-Year Dormant Molds & Storage Fee Calculation Data
 * Package 3 / WO-P1-002: SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Topic 3 & Fujikura Model)
 * Evidence-Based: Calculates last_used_date from actual jobs, order_lines, orders, entry_date
 */
export async function getDormantMoldsData(
  partnerId?: string,
  unitRate: number = STANDARD_MOLD_STORAGE_RATE_JPY
): Promise<StorageFeePartnerSummary> {
  const supabase = await createClient();

  const matchedPartner =
    partnerId && partnerId !== 'ALL'
      ? SSOT_11_CUSTOMERS.find((p) => p.id === partnerId || p.code === partnerId) || null
      : null;

  let targetCompanyIds: string[] = [];
  if (matchedPartner) {
    targetCompanyIds = matchedPartner.companyIds;
  } else {
    targetCompanyIds = SSOT_11_CUSTOMERS.flatMap((p) => p.companyIds);
  }

  if (targetCompanyIds.length === 0) {
    return {
      partner: matchedPartner,
      totalMoldsCount: 0,
      dormantMoldsCount: 0,
      activeMoldsCount: 0,
      totalAccumulatedFeeJpy: 0,
      standardMonthlyRate: unitRate,
      records: [],
    };
  }

  // 1. Fetch physical equipment for the target partner(s)
  const { data: eqRows, error: eqErr } = await supabase
    .from('equipment')
    .select(`
      equipment_id,
      equipment_code,
      display_name,
      equipment_type,
      physical_stamp,
      notes,
      entry_date,
      manufacturing_date,
      created_at,
      current_rack_layer_id,
      rack_layers:current_rack_layer_id(layer_code, racks:rack_id(rack_code)),
      design_revisions!equipment_design_revision_id_fkey!inner(
        customer_equipment_no,
        product_id,
        products!design_revisions_product_id_fkey!inner(
          company_id,
          product_code,
          product_name,
          companies!products_company_id_fkey(company_name, company_code)
        )
      )
    `)
    .in('design_revisions.products.company_id', targetCompanyIds)
    .order('equipment_code', { ascending: true });

  if (eqErr || !eqRows) {
    console.error('Error fetching equipment for dormant molds:', eqErr);
    return {
      partner: matchedPartner,
      totalMoldsCount: 0,
      dormantMoldsCount: 0,
      activeMoldsCount: 0,
      totalAccumulatedFeeJpy: 0,
      standardMonthlyRate: unitRate,
      records: [],
    };
  }

  // 2. Fetch jobs linked to these equipment IDs
  const eqIds = eqRows.map((e: any) => e.equipment_id);
  const jobsMap = new Map<string, string>();
  if (eqIds.length > 0) {
    const batchSize = 400;
    for (let i = 0; i < eqIds.length; i += batchSize) {
      const slice = eqIds.slice(i, i + batchSize);
      const { data: jobRows } = await supabase
        .from('jobs')
        .select('equipment_id, start_date, deadline, ship_date, completed_date')
        .in('equipment_id', slice);

      (jobRows || []).forEach((j: any) => {
        const dates = [j.ship_date, j.completed_date, j.deadline, j.start_date]
          .filter(Boolean)
          .map((d: string) => d.slice(0, 10));
        if (dates.length > 0) {
          const maxD = dates.sort().reverse()[0];
          const curr = jobsMap.get(j.equipment_id);
          if (!curr || maxD > curr) {
            jobsMap.set(j.equipment_id, maxD);
          }
        }
      });
    }
  }

  // 3. Fetch order_lines linked to these product IDs
  const prodIds = Array.from(
    new Set(eqRows.map((e: any) => e.design_revisions?.product_id).filter(Boolean))
  );
  const orderLinesMap = new Map<string, string>();
  if (prodIds.length > 0) {
    const batchSize = 400;
    for (let i = 0; i < prodIds.length; i += batchSize) {
      const slice = prodIds.slice(i, i + batchSize);
      const { data: olRows } = await supabase
        .from('order_lines')
        .select('product_id, due_date, ship_date')
        .in('product_id', slice);

      (olRows || []).forEach((ol: any) => {
        const dates = [ol.ship_date, ol.due_date]
          .filter(Boolean)
          .map((d: string) => d.slice(0, 10));
        if (dates.length > 0) {
          const maxD = dates.sort().reverse()[0];
          const curr = orderLinesMap.get(ol.product_id);
          if (!curr || maxD > curr) {
            orderLinesMap.set(ol.product_id, maxD);
          }
        }
      });
    }
  }

  // 4. Calculate last_used_date, dormant status, and storage fees
  const now = new Date();
  let dormantCount = 0;
  let totalFee = 0;

  const records: DormantMoldRecord[] = eqRows.map((eq: any) => {
    const rev = eq.design_revisions;
    const prod = rev?.products;
    const comp = prod?.companies;
    const prodId = rev?.product_id;

    const jobDate = jobsMap.get(eq.equipment_id);
    const orderDate = prodId ? orderLinesMap.get(prodId) : null;
    const entryDate =
      eq.entry_date?.slice(0, 10) ||
      eq.manufacturing_date?.slice(0, 10) ||
      null;

    let lastUsedDate: string | null = null;
    let source: DormantMoldRecord['last_used_source'] = 'NONE';

    if (jobDate) {
      lastUsedDate = jobDate;
      source = 'JOB';
    }
    if (orderDate && (!lastUsedDate || orderDate > lastUsedDate)) {
      lastUsedDate = orderDate;
      source = 'ORDER';
    }
    if (!lastUsedDate && entryDate) {
      lastUsedDate = entryDate;
      source = 'ENTRY';
    }

    let isDormant = false;
    let daysInactive = 0;
    let monthsDormant = 0;
    let moldFee = 0;

    if (lastUsedDate) {
      const lastDt = new Date(lastUsedDate);
      if (!isNaN(lastDt.getTime())) {
        const diffMs = now.getTime() - lastDt.getTime();
        daysInactive = Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
        monthsDormant = Math.max(0, Math.round(daysInactive / 30.4375));
        if (daysInactive >= 3 * 365) {
          isDormant = true;
          dormantCount++;
          moldFee = monthsDormant * unitRate;
          totalFee += moldFee;
        }
      }
    }

    const rackCode = eq.rack_layers?.racks?.rack_code;
    const layerCode = eq.rack_layers?.layer_code;
    let locationStr: string | null = null;
    if (rackCode && layerCode) {
      locationStr = `${rackCode}-${layerCode}`;
    } else if (layerCode) {
      locationStr = layerCode;
    }

    return {
      id: eq.equipment_id,
      equipment_id: eq.equipment_id,
      equipment_code: eq.equipment_code || '---',
      equipment_name: eq.display_name || prod?.product_name || '—',
      equipment_type: eq.equipment_type || 'MOLD',
      customer_asset_no: rev?.customer_equipment_no || eq.physical_stamp || eq.equipment_code,
      customer_name: matchedPartner?.nameJA || comp?.company_name || '—',
      customer_code: matchedPartner?.code || comp?.company_code || '—',
      current_rack_location: locationStr,
      last_used_date: lastUsedDate,
      last_used_source: source,
      is_dormant_3y: isDormant,
      days_inactive: daysInactive,
      months_dormant: monthsDormant,
      monthly_rate_jpy: unitRate,
      total_storage_fee_jpy: moldFee,
      condition_notes: eq.notes || null,
    };
  });

  return {
    partner: matchedPartner,
    totalMoldsCount: records.length,
    dormantMoldsCount: dormantCount,
    activeMoldsCount: records.length - dormantCount,
    totalAccumulatedFeeJpy: totalFee,
    standardMonthlyRate: unitRate,
    records,
  };
}

/**
 * 15. Upload Loan Photo (Mobile Camera Quick-Capture)
 * Package 4 / WO-P1-003: SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Topic 4)
 * Uploads photo with measuring tape (overall) or placard (nameplate) to 'equipment-photos' bucket
 */
export async function uploadLoanPhoto(
  loanId: string,
  photoType: 'overall' | 'nameplate',
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!loanId) return { success: false, error: 'Thiếu loanId (Missing loanId)' };
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'Không tìm thấy file tải lên (No file found in formData)' };

    const supabase = await createClient();

    // Verify loan exists
    const { data: loanRow, error: loanErr } = await supabase
      .from('equipment_loans')
      .select('loan_id, loan_code, equipment_id')
      .eq('loan_id', loanId)
      .maybeSingle();

    if (loanErr || !loanRow) {
      return { success: false, error: `Không tìm thấy phiếu mượn ${loanId}` };
    }

    const fileExt = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const fileName = `${photoType}_${Date.now()}.${fileExt}`;
    const storagePath = `loans/${loanId}/${fileName}`;

    // Upload to Supabase Storage bucket 'equipment-photos'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await supabase.storage
      .from('equipment-photos')
      .upload(storagePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.error('Failed to upload image to equipment-photos:', uploadErr);
      return { success: false, error: `Upload thất bại: ${uploadErr.message}` };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('equipment-photos')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Update equipment_loans record
    const updateData =
      photoType === 'overall'
        ? { photo_overall_url: publicUrl, updated_at: new Date().toISOString() }
        : { photo_nameplate_url: publicUrl, updated_at: new Date().toISOString() };

    const { error: updateErr } = await supabase
      .from('equipment_loans')
      .update(updateData)
      .eq('loan_id', loanId);

    if (updateErr) {
      console.error('Failed to update loan photo URL:', updateErr);
      return { success: false, error: `Cập nhật DB thất bại: ${updateErr.message}` };
    }

    revalidatePath(`/equipment/loans/${loanId}`);
    revalidatePath('/equipment/loans');

    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('Exception in uploadLoanPhoto:', err);
    return { success: false, error: err.message || 'Lỗi hệ thống khi tải ảnh' };
  }
}

/**
 * 16. Delete Loan Photo
 */
export async function deleteLoanPhoto(
  loanId: string,
  photoType: 'overall' | 'nameplate'
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!loanId) return { success: false, error: 'Thiếu loanId' };

    const supabase = await createClient();
    const updateData =
      photoType === 'overall'
        ? { photo_overall_url: null, updated_at: new Date().toISOString() }
        : { photo_nameplate_url: null, updated_at: new Date().toISOString() };

    const { error: updateErr } = await supabase
      .from('equipment_loans')
      .update(updateData)
      .eq('loan_id', loanId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath(`/equipment/loans/${loanId}`);
    revalidatePath('/equipment/loans');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}




