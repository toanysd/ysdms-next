'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────

export type QuotationStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'CONVERTED' | 'REJECTED' | 'EXPIRED'

export interface ConvertQuotationResult {
  success: boolean
  message?: string
  orderId?: string
  orderNo?: string
  linesConverted?: number
}

export interface UpdateQuotationStatusResult {
  success: boolean
  message?: string
  status?: QuotationStatus
}

export interface QuotationLineDetail {
  line_id: string
  line_no: number
  item_type: string
  model_code: string | null
  description: string | null
  quantity: number
  quantity_text: string | null
  unit_price: number
  amount: number
  notes: string | null
  product_id: string | null
  design_revision_id: string | null
  products?: {
    product_id: string
    product_code: string
    product_name: string | null
    product_name_internal: string | null
  } | null
  design_revisions?: {
    revision_id: string
    design_code: string | null
    plastic_type_designed: string | null
  } | null
}

export interface QuotationDetail {
  quotation_id: string
  quotation_no: string
  revision_no: number
  quote_date: string
  valid_until: string | null
  total_amount: number | null
  status: QuotationStatus
  notes: string | null
  customer_contact_name: string | null
  delivery_destination: string | null
  converted_order_id: string | null
  converted_at: string | null
  company_id: string
  companies: {
    company_id: string
    company_name: string
    company_code: string
    tel?: string | null
    address?: string | null
  } | null
  prepared_by: string | null
  employees?: {
    employee_id: string
    employee_name: string
  } | null
  orders?: {
    order_id: string
    order_no: string
    order_status: string
  } | null
  lines: QuotationLineDetail[]
}

export interface GetQuotationDetailResult {
  success: boolean
  message?: string
  data?: QuotationDetail
}

// ── Action 1: convertQuotationToOrderAction ────────────────────────────

/**
 * Chuyển đổi Báo giá (APPROVED) sang Đơn hàng chính thức trong 1 transaction an toàn.
 * Gọi atomic PostgreSQL function fn_convert_quotation_to_order bằng Service Role client.
 */
export async function convertQuotationToOrderAction(
  quotationId: string
): Promise<ConvertQuotationResult> {
  if (!quotationId || typeof quotationId !== 'string') {
    return { success: false, message: 'ID báo giá không hợp lệ' }
  }

  try {
    // 1. Lấy thông tin user hiện tại nếu có
    let userId: string | null = null
    try {
      const userClient = await createClient()
      const { data: { user } } = await userClient.auth.getUser()
      userId = user?.id || null
    } catch {
      // An toàn bỏ qua nếu không có auth cookie/session
    }

    // 2. Dùng Service Role Client để thực thi RPC cấp cao (ghi đồng thời orders, order_lines, quotations)
    const serviceClient = createServerSupabaseClient() as SupabaseClient
    const { data, error } = await serviceClient.rpc('fn_convert_quotation_to_order', {
      p_quotation_id: quotationId,
      p_user_id: userId,
    })

    if (error) {
      const errMsg = error.message || ''

      // Xử lý Error Boundary cho các trường hợp nghiệp vụ đặc thù
      if (errMsg.includes('đã được chuyển đổi') || errMsg.includes('already converted')) {
        return {
          success: false,
          message: 'Báo giá này đã được chuyển đổi thành đơn hàng trước đó.',
        }
      }
      if (errMsg.includes('APPROVED')) {
        return {
          success: false,
          message: 'Chỉ báo giá ở trạng thái APPROVED (Đã duyệt) mới được phép chuyển thành đơn hàng.',
        }
      }

      return {
        success: false,
        message: errMsg || 'Lỗi trong quá trình chuyển đổi báo giá thành đơn hàng.',
      }
    }

    if (!data || !data.success) {
      return {
        success: false,
        message: data?.message || 'Không thể tạo đơn hàng từ báo giá.',
      }
    }

    // 3. Revalidate cache đường dẫn liên quan
    revalidatePath('/orders/quotations')
    revalidatePath(`/orders/quotations/${quotationId}`)
    revalidatePath('/orders')

    return {
      success: true,
      orderId: data.order_id,
      orderNo: data.order_no,
      linesConverted: data.lines_converted,
      message: `Đã chuyển đổi thành công sang Đơn hàng ${data.order_no}`,
    }
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : 'Lỗi hệ thống không xác định'
    console.error('[convertQuotationToOrderAction] Exception:', err)
    return { success: false, message: errorText }
  }
}

// ── Action 2: updateQuotationStatusAction ──────────────────────────────

/**
 * Cập nhật trạng thái Báo giá có kiểm tra chiều tiến nghiệp vụ (Status Guards).
 */
export async function updateQuotationStatusAction(
  quotationId: string,
  newStatus: QuotationStatus
): Promise<UpdateQuotationStatusResult> {
  if (!quotationId || typeof quotationId !== 'string') {
    return { success: false, message: 'ID báo giá không hợp lệ' }
  }

  const validStatuses: QuotationStatus[] = ['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED']
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      message: `Trạng thái '${newStatus}' không được phép gán thủ công qua thao tác này.`,
    }
  }

  try {
    const serviceClient = createServerSupabaseClient() as SupabaseClient

    // 1. Kiểm tra trạng thái hiện tại
    const { data: current, error: fetchErr } = await serviceClient
      .from('quotations')
      .select('quotation_id, status, quotation_no, converted_order_id')
      .eq('quotation_id', quotationId)
      .single()

    if (fetchErr || !current) {
      return { success: false, message: 'Không tìm thấy thông tin báo giá' }
    }

    // Guard 1: CONVERTED là terminal state — tuyệt đối không cho phép đổi lùi
    if (current.status === 'CONVERTED') {
      return {
        success: false,
        message: 'Báo giá đã chuyển đổi thành đơn hàng (CONVERTED), trạng thái đã bị khóa.',
      }
    }

    // Guard 2: Không cho phép lùi từ APPROVED về DRAFT (chỉ tiến hoặc từ chối)
    if (current.status === 'APPROVED' && newStatus === 'DRAFT') {
      return {
        success: false,
        message: 'Báo giá đã được phê duyệt (APPROVED), không thể hạ về bản nháp (DRAFT).',
      }
    }

    // 2. Cập nhật trạng thái
    const { error: updateErr } = await serviceClient
      .from('quotations')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('quotation_id', quotationId)

    if (updateErr) {
      return { success: false, message: updateErr.message }
    }

    // 3. Revalidate cache
    revalidatePath('/orders/quotations')
    revalidatePath(`/orders/quotations/${quotationId}`)

    return {
      success: true,
      status: newStatus,
      message: `Đã chuyển trạng thái báo giá sang ${newStatus}`,
    }
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : 'Lỗi hệ thống không xác định'
    console.error('[updateQuotationStatusAction] Exception:', err)
    return { success: false, message: errorText }
  }
}

// ── Action 3: getQuotationDetailAction ──────────────────────────────────

/**
 * Lấy toàn bộ thông tin chi tiết Báo giá kèm các dòng mặt hàng, khách hàng,
 * nhân viên phụ trách và đơn hàng liên kết (nếu đã chuyển đổi).
 */
export async function getQuotationDetailAction(
  quotationId: string
): Promise<GetQuotationDetailResult> {
  if (!quotationId || typeof quotationId !== 'string') {
    return { success: false, message: 'ID báo giá không hợp lệ' }
  }

  try {
    const serviceClient = createServerSupabaseClient() as SupabaseClient

    // 1. Fetch Header với các bảng quan hệ
    const { data: quote, error: qErr } = await serviceClient
      .from('quotations')
      .select(`
        quotation_id, quotation_no, revision_no, quote_date, valid_until,
        total_amount, status, notes, customer_contact_name, delivery_destination,
        converted_order_id, converted_at, company_id, prepared_by,
        companies:companies!quotations_company_id_fkey (
          company_id, company_name, company_code, tel, address
        ),
        employees:employees!quotations_prepared_by_fkey (
          employee_id, employee_name
        ),
        orders:orders!quotations_converted_order_id_fkey (
          order_id, order_no, order_status
        )
      `)
      .eq('quotation_id', quotationId)
      .single()

    if (qErr || !quote) {
      return { success: false, message: qErr?.message || 'Báo giá không tồn tại' }
    }

    // 2. Fetch Lines với sản phẩm và bản vẽ CAD
    const { data: lines, error: lErr } = await serviceClient
      .from('quotation_lines')
      .select(`
        line_id, line_no, item_type, model_code, description,
        quantity, quantity_text, unit_price, amount, notes,
        product_id, design_revision_id,
        products:products!quotation_lines_product_id_fkey (
          product_id, product_code, product_name, product_name_internal
        ),
        design_revisions:design_revisions!quotation_lines_design_revision_id_fkey (
          revision_id, design_code, plastic_type_designed
        )
      `)
      .eq('quotation_id', quotationId)
      .order('line_no', { ascending: true })

    if (lErr) {
      console.warn('[getQuotationDetailAction] Lines fetch warning:', lErr)
    }

    const detail: QuotationDetail = {
      ...(quote as unknown as Omit<QuotationDetail, 'lines'>),
      lines: ((lines || []) as unknown as QuotationLineDetail[]).map((l) => ({
        ...l,
        quantity: Number(l.quantity) || 1,
        unit_price: Number(l.unit_price) || 0,
        amount: Number(l.amount) || 0,
      })),
    }

    return { success: true, data: detail }
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : 'Lỗi hệ thống không xác định'
    console.error('[getQuotationDetailAction] Exception:', err)
    return { success: false, message: errorText }
  }
}
