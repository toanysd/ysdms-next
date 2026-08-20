'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface InvoiceLineItemInput {
  description: string
  quantity: number
  unit_price: number
  order_line_id?: string | null
}

export interface CreateInvoicePayload {
  company_id: string
  order_id?: string | null
  shipment_id?: string | null
  invoice_date?: string
  due_date: string
  currency?: string
  notes?: string | null
  tax_rate?: number // default 0.10
  lines?: InvoiceLineItemInput[]
}

export interface AddPaymentPayload {
  payment_date: string
  amount: number
  payment_method?: 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'OTHER'
  reference_no?: string | null
  notes?: string | null
}

export interface InvoiceFilterParams {
  company_id?: string
  status?: string
  dateRange?: {
    from?: string
    to?: string
  }
  search?: string
  page?: number
  pageSize?: number
}

// 1. Generate Next Invoice Number: INV-YYYYMM-NNN
export async function generateNextInvoiceNumber(): Promise<string> {
  const supabase = await createClient()
  const now = new Date()
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const prefix = `INV-${yearMonth}-`

  const { data, error } = await (supabase as any)
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `${prefix}%`)
    .order('invoice_number', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) {
    return `${prefix}001`
  }

  const latestNo = data[0].invoice_number
  const suffix = latestNo.replace(prefix, '')
  const nextNum = parseInt(suffix, 10) + 1
  return `${prefix}${String(nextNum).padStart(3, '0')}`
}

// 2. Get Invoices List with Filters
export async function getInvoices(filters?: InvoiceFilterParams) {
  try {
    const supabase = await createClient()
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = (supabase as any)
      .from('invoices')
      .select(`
        invoice_id,
        invoice_number,
        order_id,
        shipment_id,
        company_id,
        invoice_date,
        due_date,
        total_amount,
        tax_amount,
        net_amount,
        paid_amount,
        remaining_amount,
        status,
        currency,
        notes,
        created_at,
        companies (
          company_id,
          company_name,
          company_code
        ),
        orders (
          order_id,
          order_no
        ),
        shipments (
          shipment_id,
          delivery_note_no
        )
      `, { count: 'exact' })
      .order('invoice_date', { ascending: false })
      .range(from, to)

    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id)
    }

    if (filters?.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateRange?.from) {
      query = query.gte('invoice_date', filters.dateRange.from)
    }

    if (filters?.dateRange?.to) {
      query = query.lte('invoice_date', filters.dateRange.to)
    }

    if (filters?.search) {
      query = query.or(`invoice_number.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  } catch (err) {
    console.error('[getInvoices] Error:', err)
    return { success: false, error: (err as Error).message, data: [], count: 0 }
  }
}

// 3. Get Invoice By ID
export async function getInvoiceById(invoiceId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await (supabase as any)
      .from('invoices')
      .select(`
        *,
        companies (
          company_id,
          company_name,
          company_code,
          address,
          phone,
          fax
        ),
        orders (
          order_id,
          order_no,
          order_date
        ),
        shipments (
          shipment_id,
          delivery_note_no,
          ship_date
        ),
        invoice_lines (
          line_id,
          description,
          quantity,
          unit_price,
          line_amount,
          sort_order,
          order_line_id
        ),
        invoice_payments (
          payment_id,
          payment_date,
          amount,
          payment_method,
          reference_no,
          notes,
          created_at
        )
      `)
      .eq('invoice_id', invoiceId)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (err) {
    console.error('[getInvoiceById] Error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// 4. Create Invoice (with Auto Lines population from Order or Manual Input)
export async function createInvoice(payload: CreateInvoicePayload) {
  try {
    const supabase = await createClient()

    // 4.1. Auto Generate Invoice Number
    const invoiceNumber = await generateNextInvoiceNumber()

    // 4.2. Determine Lines
    let linesToInsert: InvoiceLineItemInput[] = payload.lines || []

    // If no lines provided but order_id is given, fetch from order_lines
    if (linesToInsert.length === 0 && payload.order_id) {
      const { data: orderLines } = await (supabase as any)
        .from('order_lines')
        .select(`
          line_id,
          quantity,
          products (
            product_name,
            product_code
          )
        `)
        .eq('order_id', payload.order_id)

      if (orderLines && orderLines.length > 0) {
        linesToInsert = orderLines.map((ol: any) => ({
          description: ol.products?.product_name || ol.products?.product_code || 'Sản phẩm theo đơn',
          quantity: Number(ol.quantity) || 1,
          unit_price: 0,
          order_line_id: ol.line_id,
        }))
      }
    }

    // Default fallback if still empty
    if (linesToInsert.length === 0) {
      linesToInsert = [{
        description: 'Chi phí hàng hóa / Dịch vụ gia công',
        quantity: 1,
        unit_price: 0,
      }]
    }

    // 4.3. Calculate totals
    const totalAmount = linesToInsert.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)
    const taxRate = payload.tax_rate ?? 0.10
    const taxAmount = Math.round(totalAmount * taxRate)
    const netAmount = totalAmount + taxAmount

    // 4.4. Insert Invoice Header
    const { data: newInvoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        company_id: payload.company_id,
        order_id: payload.order_id || null,
        shipment_id: payload.shipment_id || null,
        invoice_date: payload.invoice_date || new Date().toISOString().split('T')[0],
        due_date: payload.due_date,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        paid_amount: 0,
        status: 'ISSUED',
        currency: payload.currency || 'JPY',
        notes: payload.notes || null,
      })
      .select('invoice_id, invoice_number')
      .single()

    if (invoiceError || !newInvoice) {
      throw new Error(`Failed to create invoice header: ${invoiceError?.message}`)
    }

    // 4.5. Insert Invoice Lines
    const linesData = linesToInsert.map((item, idx) => ({
      invoice_id: newInvoice.invoice_id,
      order_line_id: item.order_line_id || null,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      sort_order: idx + 1,
    }))

    const { error: linesError } = await (supabase as any)
      .from('invoice_lines')
      .insert(linesData)

    if (linesError) {
      console.warn('Warning inserting invoice lines:', linesError.message)
    }

    revalidatePath('/orders/invoices')
    revalidatePath('/orders/debt')

    return {
      success: true,
      invoice_id: newInvoice.invoice_id,
      invoice_number: newInvoice.invoice_number,
    }
  } catch (err) {
    console.error('[createInvoice] Error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// 5. Update Invoice Status
export async function updateInvoiceStatus(invoiceId: string, status: string) {
  try {
    const supabase = await createClient()

    const { error } = await (supabase as any)
      .from('invoices')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId)

    if (error) throw error

    revalidatePath('/orders/invoices')
    revalidatePath('/orders/debt')

    return { success: true }
  } catch (err) {
    console.error('[updateInvoiceStatus] Error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// 6. Add Payment to Invoice
export async function addPayment(invoiceId: string, payload: AddPaymentPayload) {
  try {
    const supabase = await createClient()

    // 6.1. Insert Payment Record
    const { error: paymentError } = await (supabase as any)
      .from('invoice_payments')
      .insert({
        invoice_id: invoiceId,
        payment_date: payload.payment_date || new Date().toISOString().split('T')[0],
        amount: Number(payload.amount),
        payment_method: payload.payment_method || 'BANK_TRANSFER',
        reference_no: payload.reference_no || null,
        notes: payload.notes || null,
      })

    if (paymentError) throw paymentError

    // 6.2. Fetch all payments for this invoice to sync paid_amount & status (Fallback in case DB trigger isn't executed)
    const { data: payments } = await (supabase as any)
      .from('invoice_payments')
      .select('amount')
      .eq('invoice_id', invoiceId)

    const totalPaid = (payments || []).reduce((acc: number, p: any) => acc + Number(p.amount), 0)

    const { data: inv } = await (supabase as any)
      .from('invoices')
      .select('total_amount, tax_amount, status')
      .eq('invoice_id', invoiceId)
      .single()

    if (inv) {
      const netAmount = Number(inv.total_amount) + Number(inv.tax_amount)
      let newStatus = inv.status
      if (inv.status !== 'CANCELLED') {
        if (totalPaid >= netAmount && netAmount > 0) {
          newStatus = 'PAID'
        } else if (totalPaid > 0) {
          newStatus = 'PARTIALLY_PAID'
        }
      }

      await (supabase as any)
        .from('invoices')
        .update({
          paid_amount: totalPaid,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId)
    }

    revalidatePath('/orders/invoices')
    revalidatePath('/orders/debt')

    return { success: true }
  } catch (err) {
    console.error('[addPayment] Error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// 7. Get Customer Debt Summary (from View or Calculated aggregation)
export async function getCustomerDebtSummary(search?: string) {
  try {
    const supabase = await createClient()

    // Query all companies and aggregate invoice totals
    let compQuery = (supabase as any)
      .from('companies')
      .select(`
        company_id,
        company_name,
        company_code,
        invoices (
          invoice_id,
          total_amount,
          tax_amount,
          paid_amount,
          due_date,
          status
        )
      `)
      .order('company_name', { ascending: true })

    if (search) {
      compQuery = compQuery.or(`company_name.ilike.%${search}%,company_code.ilike.%${search}%`)
    }

    const { data, error } = await compQuery

    if (error) throw error

    const todayStr = new Date().toISOString().split('T')[0]

    const summaries = (data || []).map((c: any) => {
      const activeInvoices = (c.invoices || []).filter((i: any) => i.status !== 'CANCELLED')
      const totalInvoices = activeInvoices.length
      const totalBilled = activeInvoices.reduce((sum: number, i: any) => sum + (Number(i.total_amount) + Number(i.tax_amount)), 0)
      const totalPaid = activeInvoices.reduce((sum: number, i: any) => sum + Number(i.paid_amount), 0)
      const totalRemaining = totalBilled - totalPaid
      const overdueCount = activeInvoices.filter((i: any) => i.due_date < todayStr && (Number(i.total_amount) + Number(i.tax_amount) - Number(i.paid_amount)) > 0).length

      return {
        company_id: c.company_id,
        company_name: c.company_name,
        company_code: c.company_code,
        total_invoices: totalInvoices,
        total_billed: totalBilled,
        total_paid: totalPaid,
        total_remaining: totalRemaining,
        overdue_count: overdueCount,
      }
    }).filter((s: any) => s.total_invoices > 0 || !search) // Keep companies with invoices or all if no search

    return {
      success: true,
      data: summaries,
    }
  } catch (err) {
    console.error('[getCustomerDebtSummary] Error:', err)
    return { success: false, error: (err as Error).message, data: [] }
  }
}
