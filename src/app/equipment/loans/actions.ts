'use server';

// ==============================================================================
// Equipment Loans & Return Workflow Engine — Server Actions
// Milestone 18 Sprint 1: Chỉ thị #026
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
} from './types';

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
      `loan_code.ilike.%${s}%,equipment_code.ilike.%${s}%,equipment_name.ilike.%${s}%,to_company_name.ilike.%${s}%,contact_person.ilike.%${s}%,purpose.ilike.%${s}%`
    );
  }

  // Filter: Loan Type
  if (params.loan_type && params.loan_type !== 'ALL') {
    query = query.eq('loan_type', params.loan_type);
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

  return {
    data: (data || []) as unknown as EquipmentLoanItem[],
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
 */
export async function getEquipmentLoanKpis(): Promise<LoanKpiSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_equipment_loans_summary')
    .select('status, is_overdue, actual_return_date');

  if (error) {
    console.error('Error fetching loan KPIs:', error);
    return {
      total: 0,
      pendingApproval: 0,
      inTransit: 0,
      overdue: 0,
      returnedThisMonth: 0,
    };
  }

  const now = new Date();
  const firstDayOfMonthStr = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  let pendingApproval = 0;
  let inTransit = 0;
  let overdue = 0;
  let returnedThisMonth = 0;

  for (const item of data || []) {
    if (item.status === 'PENDING_APPROVAL') pendingApproval++;
    if (item.status === 'IN_TRANSIT') inTransit++;
    if (item.is_overdue) overdue++;
    if (
      item.status === 'RETURNED' &&
      item.actual_return_date &&
      item.actual_return_date >= firstDayOfMonthStr
    ) {
      returnedThisMonth++;
    }
  }

  return {
    total: data?.length || 0,
    pendingApproval,
    inTransit,
    overdue,
    returnedThisMonth,
  };
}

/**
 * 4. Create new equipment loan proposal
 * Auto generates loan_code (LN-YYYYMMDD-NNN) via database trigger
 */
export async function createEquipmentLoan(
  input: CreateLoanInput
): Promise<{ success: boolean; data?: EquipmentLoanItem; error?: string }> {
  try {
    const supabase = await createClient();

    // Validation PE Adjustment #2: BORROW & REPAIR_OUT require scheduled_return_date
    if (input.loan_type !== 'RETURN' && !input.scheduled_return_date) {
      return {
        success: false,
        error:
          'Hạn hoàn trả dự kiến (scheduled_return_date) là bắt buộc đối với phiếu Cho mượn (BORROW) và Sửa ngoài (REPAIR_OUT).',
      };
    }

    if (!input.equipment_id) {
      return { success: false, error: 'Chưa chọn thiết bị / khuôn.' };
    }
    if (!input.to_company_id) {
      return { success: false, error: 'Chưa chọn đối tác / công ty tiếp nhận.' };
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

    // Determine from_company_id (default to YSD if not specified)
    let fromCompanyId = input.from_company_id;
    if (!fromCompanyId) {
      const { data: ysdCompany } = await supabase
        .from('companies')
        .select('company_id')
        .eq('company_code', 'YSD')
        .maybeSingle();
      if (ysdCompany) {
        fromCompanyId = ysdCompany.company_id;
      }
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('equipment_loans')
      .insert({
        equipment_id: input.equipment_id,
        loan_type: input.loan_type,
        to_company_id: input.to_company_id,
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
 * Calls atomic PostgreSQL RPC fn_dispatch_equipment_loan to guarantee:
 * - equipment_loans.status = 'IN_TRANSIT'
 * - equipment.keeper_company_id = to_company_id
 * - equipment_ship_logs insert
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
 * 8. Complete equipment loan return (Hoàn trả nhập kho -> RETURNED)
 * Calls atomic PostgreSQL RPC fn_complete_equipment_loan_return to guarantee:
 * - equipment_loans.status = 'RETURNED'
 * - actual_return_date = CURRENT_DATE
 * - equipment.keeper_company_id = YSD (or from_company_id)
 * - equipment.current_rack_layer_id updated if new_rack_layer_id provided
 * - asset_location_logs insert if moved to new shelf
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
        error: res?.error || 'Lỗi hoàn trả nhập kho không xác định',
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
