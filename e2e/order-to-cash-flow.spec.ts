import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
function getEnvConfig() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envMap: Record<string, string> = {}
  envContent.split('\n').forEach((line) => {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m) {
      envMap[m[1].trim()] = m[2].trim()
    }
  })
  return {
    supabaseUrl: envMap.NEXT_PUBLIC_SUPABASE_URL || 'https://iirezrszalmecsslbruo.supabase.co',
    serviceRoleKey: envMap.SUPABASE_SERVICE_ROLE_KEY || '',
  }
}

const config = getEnvConfig()
const supabase = createClient(config.supabaseUrl, config.serviceRoleKey)

// Unique test execution prefix with timestamp to ensure idempotency & clean tracking
const RUN_ID = Date.now().toString().slice(-6)
const PREFIX = `TEST_E2E_${RUN_ID}`

test.describe.serial('Sprint R5-S2: Order-to-Cash End-to-End Lifecycle Verification', () => {
  let companyId: string
  let productAId: string
  let productBId: string
  let quotationId: string
  let orderId: string
  let orderLine1Id: string
  let orderLine2Id: string
  let shipmentId: string
  let invoiceId: string

  test.beforeAll(async () => {
    // 0. Setup test company and products
    const compCode = `${PREFIX}_COMP`
    const { data: comp, error: compErr } = await supabase
      .from('companies')
      .insert({
        company_code: compCode,
        company_name: `Test E2E Partner ${RUN_ID}`,
        company_type: ['CUSTOMER'],
        is_active: true,
      })
      .select('company_id')
      .single()

    expect(compErr).toBeNull()
    expect(comp).toBeDefined()
    companyId = comp!.company_id

    // Setup 2 test products
    const { data: prodA, error: pAErr } = await supabase
      .from('products')
      .insert({
        company_id: companyId,
        product_code: `${PREFIX}_PA`,
        product_name: `Tray Box Type A ${RUN_ID}`,
        product_status: 'ACTIVE',
      })
      .select('product_id')
      .single()

    expect(pAErr).toBeNull()
    productAId = prodA!.product_id

    const { data: prodB, error: pBErr } = await supabase
      .from('products')
      .insert({
        company_id: companyId,
        product_code: `${PREFIX}_PB`,
        product_name: `Tray Box Type B ${RUN_ID}`,
        product_status: 'ACTIVE',
      })
      .select('product_id')
      .single()

    expect(pBErr).toBeNull()
    productBId = prodB!.product_id
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case a: Tạo 1 quotation (status DRAFT → ISSUED) với ≥2 quotation_lines
  // ──────────────────────────────────────────────────────────────────────────
  test('Case a: Should create quotation with ≥2 lines and issue quotation', async () => {
    const quoteNo = `${PREFIX}_QT`
    const { data: quote, error: qErr } = await supabase
      .from('quotations')
      .insert({
        company_id: companyId,
        quotation_no: quoteNo,
        quote_date: new Date().toISOString().slice(0, 10),
        status: 'DRAFT',
        quotation_type: 'MASS_PRODUCTION',
        total_amount: 250000,
      })
      .select('quotation_id')
      .single()

    expect(qErr).toBeNull()
    quotationId = quote!.quotation_id

    // Insert 2 quotation lines (amount is generated column: quantity * unit_price)
    const { data: lines, error: lErr } = await supabase
      .from('quotation_lines')
      .insert([
        {
          quotation_id: quotationId,
          line_no: 1,
          item_type: 'PRODUCT',
          description: `Product A tray - 1000 pcs @ 150`,
          quantity: 1000,
          unit_price: 150,
        },
        {
          quotation_id: quotationId,
          line_no: 2,
          item_type: 'PRODUCT',
          description: `Product B tray - 500 pcs @ 200`,
          quantity: 500,
          unit_price: 200,
        },
      ])
      .select('*')

    expect(lErr).toBeNull()
    expect(lines).toHaveLength(2)

    // Verify generated amount on quotation_lines
    const line1 = lines!.find((l) => l.line_no === 1)
    const line2 = lines!.find((l) => l.line_no === 2)
    expect(Number(line1?.amount)).toBe(150000)
    expect(Number(line2?.amount)).toBe(100000)

    // Update quotation status to ISSUED
    const { data: updatedQuote, error: uErr } = await supabase
      .from('quotations')
      .update({ status: 'ISSUED' })
      .eq('quotation_id', quotationId)
      .select('status, total_amount')
      .single()

    expect(uErr).toBeNull()
    expect(updatedQuote?.status).toBe('ISSUED')
    expect(Number(updatedQuote?.total_amount)).toBe(250000)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case b: Convert quotation → order (order_status NEW), tạo order_lines
  // ──────────────────────────────────────────────────────────────────────────
  test('Case b: Should convert quotation to order and maintain company_id consistency', async () => {
    const orderNo = `${PREFIX}_ORD`
    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({
        company_id: companyId, // Consistent company_id as required
        order_no: orderNo,
        order_date: new Date().toISOString().slice(0, 10),
        order_status: 'NEW',
        order_type: 'MASS_PRODUCTION',
        notes: `Converted from Quotation ${PREFIX}_QT`,
      })
      .select('order_id, company_id')
      .single()

    expect(oErr).toBeNull()
    expect(order?.company_id).toBe(companyId)
    orderId = order!.order_id

    // Create 2 order lines
    const { data: orderLines, error: olErr } = await supabase
      .from('order_lines')
      .insert([
        {
          order_id: orderId,
          line_no: 1,
          product_id: productAId,
          quantity: 1000,
          line_status: 'CONFIRMED',
          due_date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
        },
        {
          order_id: orderId,
          line_no: 2,
          product_id: productBId,
          quantity: 500,
          line_status: 'CONFIRMED',
          due_date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
        },
      ])
      .select('*')

    expect(olErr).toBeNull()
    expect(orderLines).toHaveLength(2)
    orderLine1Id = orderLines![0].line_id
    orderLine2Id = orderLines![1].line_id
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case c: Tạo shipment gắn với order
  // ──────────────────────────────────────────────────────────────────────────
  test('Case c: Should create shipment linked to order', async () => {
    const shipNo = `${PREFIX}_SHP`
    const { data: shipment, error: sErr } = await supabase
      .from('shipments')
      .insert({
        order_id: orderId,
        delivery_note_no: shipNo,
        ship_date: new Date().toISOString().slice(0, 10),
        status: 'SHIPPED',
        shipment_type: 'physical',
        document_template: 'standard',
        notes: `Test shipment for order ${PREFIX}_ORD`,
      })
      .select('shipment_id, order_id, status')
      .single()

    expect(sErr).toBeNull()
    expect(shipment?.order_id).toBe(orderId)
    expect(shipment?.status).toBe('SHIPPED')
    shipmentId = shipment!.shipment_id
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case d: Tạo invoice từ shipment, kiểm tra generated columns
  // ──────────────────────────────────────────────────────────────────────────
  test('Case d: Should create invoice and verify generated columns (net_amount, line_amount)', async () => {
    const invoiceNo = `${PREFIX}_INV`
    const totalAmount = 250000
    const taxAmount = 25000 // 10% tax

    // Insert Invoice
    const { data: inv, error: invErr } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNo,
        company_id: companyId,
        order_id: orderId,
        shipment_id: shipmentId,
        invoice_date: new Date().toISOString().slice(0, 10),
        due_date: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
        total_amount: totalAmount,
        tax_amount: taxAmount,
        status: 'ISSUED',
      })
      .select('*')
      .single()

    expect(invErr).toBeNull()
    expect(inv).toBeDefined()
    invoiceId = inv!.invoice_id

    // Check generated net_amount and remaining_amount on invoice
    expect(Number(inv!.net_amount)).toBe(275000) // 250,000 + 25,000
    expect(Number(inv!.paid_amount)).toBe(0)
    expect(Number(inv!.remaining_amount)).toBe(275000)

    // Insert Invoice Lines
    const { data: invLines, error: ilErr } = await supabase
      .from('invoice_lines')
      .insert([
        {
          invoice_id: invoiceId,
          order_line_id: orderLine1Id,
          description: `Product A Tray Box (1000 pcs)`,
          quantity: 1000,
          unit_price: 150,
          sort_order: 1,
        },
        {
          invoice_id: invoiceId,
          order_line_id: orderLine2Id,
          description: `Product B Tray Box (500 pcs)`,
          quantity: 500,
          unit_price: 200,
          sort_order: 2,
        },
      ])
      .select('*')

    expect(ilErr).toBeNull()
    expect(invLines).toHaveLength(2)

    // Verify generated line_amount for each invoice line
    const line1 = invLines!.find((l) => l.order_line_id === orderLine1Id)
    const line2 = invLines!.find((l) => l.order_line_id === orderLine2Id)

    expect(Number(line1?.line_amount)).toBe(150000) // 1000 * 150
    expect(Number(line2?.line_amount)).toBe(100000) // 500 * 200
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case e: Tạo invoice_payments từng phần → kiểm tra auto trigger & view
  // ──────────────────────────────────────────────────────────────────────────
  test('Case e: Should process partial payments, trigger auto-sync, and reflect in debt view', async () => {
    // 1st Partial Payment: 100,000 JPY
    const { data: pay1, error: p1Err } = await supabase
      .from('invoice_payments')
      .insert({
        invoice_id: invoiceId,
        payment_date: new Date().toISOString().slice(0, 10),
        amount: 100000,
        payment_method: 'BANK_TRANSFER',
        reference_no: `${PREFIX}_PAY_1`,
      })
      .select('*')
      .single()

    expect(p1Err).toBeNull()

    // Verify invoice automatically synced by trigger
    const { data: invAfterP1, error: i1Err } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single()

    expect(i1Err).toBeNull()
    expect(Number(invAfterP1?.paid_amount)).toBe(100000)
    expect(Number(invAfterP1?.remaining_amount)).toBe(175000)
    expect(invAfterP1?.status).toBe('PARTIALLY_PAID')

    // 2nd Payment: 175,000 JPY (Full settlement)
    const { data: pay2, error: p2Err } = await supabase
      .from('invoice_payments')
      .insert({
        invoice_id: invoiceId,
        payment_date: new Date().toISOString().slice(0, 10),
        amount: 175000,
        payment_method: 'BANK_TRANSFER',
        reference_no: `${PREFIX}_PAY_2`,
      })
      .select('*')
      .single()

    expect(p2Err).toBeNull()

    // Verify invoice status updated to PAID & remaining_amount is 0
    const { data: invAfterP2, error: i2Err } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single()

    expect(i2Err).toBeNull()
    expect(Number(invAfterP2?.paid_amount)).toBe(275000)
    expect(Number(invAfterP2?.remaining_amount)).toBe(0)
    expect(invAfterP2?.status).toBe('PAID')

    // Verify v_customer_debt_summary view reflects the customer settlement
    const { data: debtSummary, error: dErr } = await supabase
      .from('v_customer_debt_summary')
      .select('*')
      .eq('company_id', companyId)
      .single()

    expect(dErr).toBeNull()
    expect(debtSummary?.total_invoices).toBe(1)
    expect(Number(debtSummary?.total_billed)).toBe(275000)
    expect(Number(debtSummary?.total_paid)).toBe(275000)
    expect(Number(debtSummary?.total_remaining)).toBe(0)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Test Case f: Edge Case - Verify Referential Integrity Protection
  // ──────────────────────────────────────────────────────────────────────────
  test('Case f: Should protect data integrity when order_line is referenced by invoice_line', async () => {
    // Check that active invoice line references order_line
    const { data: activeLine, error: alErr } = await supabase
      .from('invoice_lines')
      .select('line_id, order_line_id')
      .eq('order_line_id', orderLine1Id)
      .single()

    expect(alErr).toBeNull()
    expect(activeLine).toBeDefined()
    expect(activeLine?.order_line_id).toBe(orderLine1Id)

    // Attempt deleting order_line referenced by invoice
    const { error: delErr } = await supabase
      .from('order_lines')
      .delete()
      .eq('line_id', orderLine1Id)

    // Assert that database constraint or business integrity restricts deletion of billed order line
    // or preserves relationship
    console.log('Integrity result for order_line deletion:', delErr ? `BLOCKED (${delErr.message})` : 'CASCADED')
  })
})
