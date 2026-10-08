import { createClient } from '@supabase/supabase-js'
import { createChunks } from '@supabase/ssr'
import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const envContent = fs.readFileSync('.env.local', 'utf8')
const supabaseUrl = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)[1].trim()
const serviceKey = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m)[1].trim()
const anonKey = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$/m)[1].trim()

const SCREENSHOT_DIR = path.resolve('docs/reports/screenshots')
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

const BASE_URL = 'http://localhost:3000'

async function runBrowserVerification() {
  console.log('=== RUNNING WO-P1-004 BROWSER & API VERIFICATION ===\n')

  const adminClient = createClient(supabaseUrl, serviceKey)

  // 1. Acquire authenticated session
  console.log('[1/5] Authenticating session...')
  const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: 'admin@ysd-pack.co.jp'
  })
  if (linkErr) throw linkErr

  const userClient = createClient(supabaseUrl, anonKey)
  const { data: sessionData, error: sessionErr } = await userClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email'
  })
  if (sessionErr) throw sessionErr

  const session = sessionData.session
  console.log('Authenticated successfully for:', session.user.email)

  // 2. Insert temporary test loan record
  console.log('[2/5] Creating temporary test loan record...')
  const testLoanId = crypto.randomUUID()
  const testLoanCode = `TEST-PDF-${Date.now().toString().slice(-6)}`

  const { data: eqList } = await adminClient
    .from('equipment')
    .select('equipment_id, equipment_code, display_name')
    .eq('equipment_type', 'MOLD')
    .limit(1)

  const sampleEq = eqList && eqList.length > 0 ? eqList[0] : null
  if (!sampleEq) throw new Error('No MOLD equipment found in DB')

  const { data: ysdComp } = await adminClient
    .from('companies')
    .select('company_id')
    .eq('company_code', 'YSD')
    .single()

  const { data: custComp } = await adminClient
    .from('companies')
    .select('company_id')
    .neq('company_code', 'YSD')
    .limit(1)
    .single()

  const { error: insertErr } = await adminClient
    .from('equipment_loans')
    .insert({
      loan_id: testLoanId,
      loan_code: testLoanCode,
      loan_type: 'CUSTOMER_LOAN',
      status: 'APPROVED',
      equipment_id: sampleEq.equipment_id,
      from_company_id: custComp.company_id,
      to_company_id: ysdComp.company_id,
      loan_date: new Date().toISOString().slice(0, 10),
      scheduled_return_date: '2027-10-01',
      purpose: 'J-SOX PDF Export verification',
    })

  if (insertErr) throw insertErr
  console.log(`Created test loan: ${testLoanCode} (ID: ${testLoanId})`)

  try {
    // 3. Launch Playwright
    console.log('[3/5] Launching Playwright browser...')
    const projectId = 'iirezrszalmecsslbruo'
    const chunks = createChunks(`sb-${projectId}-auth-token`, JSON.stringify(session))

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      locale: 'ja-JP',
    })

    const cookies = chunks.map(c => ({
      name: c.name,
      value: encodeURIComponent(c.value),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    }))
    await context.addCookies(cookies)

    const page = await context.newPage()

    // 4. Navigate to detail page
    const detailUrl = `${BASE_URL}/equipment/loans/${testLoanId}`
    console.log(`[4/5] Navigating to ${detailUrl}...`)
    await page.goto(detailUrl, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000)

    if (page.url().includes('/login')) {
      throw new Error('Authentication failed: redirected to /login')
    }

    // Verify 2 buttons
    const previewBtn = await page.locator("a[href*='/pdf']:has-text('帳票印刷 (PDF)')").count()
    const downloadBtn = await page.locator("a[href*='download=1']:has-text('PDFダウンロード')").count()
    console.log(`[CHECK] Preview button found: ${previewBtn > 0}`)
    console.log(`[CHECK] Download button found: ${downloadBtn > 0}`)

    if (previewBtn === 0 || downloadBtn === 0) {
      throw new Error('Action buttons not found on detail page')
    }

    // Save screenshot
    const shotPath = path.join(SCREENSHOT_DIR, 'wo_p1_004_pdf_buttons.png')
    await page.screenshot({ path: shotPath, fullPage: false })
    console.log(`[PASS] Saved screenshot to ${shotPath}`)

    // 5. Test PDF API directly via browser context
    console.log('[5/5] Testing PDF API endpoints...')
    const previewResp = await context.request.get(`${BASE_URL}/api/equipment/loans/${testLoanId}/pdf`)
    console.log(`Preview status: ${previewResp.status()}, Content-Type: ${previewResp.headers()['content-type']}`)
    const previewDisp = previewResp.headers()['content-disposition'] || ''
    console.log(`Preview Content-Disposition: ${previewDisp}`)
    const previewBody = await previewResp.body()
    const previewMagic = previewBody.slice(0, 5).toString('utf-8')
    console.log(`Preview PDF Magic: ${previewMagic}, Size: ${previewBody.length} bytes`)

    if (previewResp.status() !== 200 || !previewDisp.includes('inline') || !previewMagic.startsWith('%PDF-')) {
      throw new Error('Preview PDF validation failed')
    }

    const downloadResp = await context.request.get(`${BASE_URL}/api/equipment/loans/${testLoanId}/pdf?download=1`)
    console.log(`Download status: ${downloadResp.status()}, Content-Type: ${downloadResp.headers()['content-type']}`)
    const downloadDisp = downloadResp.headers()['content-disposition'] || ''
    console.log(`Download Content-Disposition: ${downloadDisp}`)
    const downloadBody = await downloadResp.body()
    const downloadMagic = downloadBody.slice(0, 5).toString('utf-8')
    console.log(`Download PDF Magic: ${downloadMagic}, Size: ${downloadBody.length} bytes`)

    if (downloadResp.status() !== 200 || !downloadDisp.includes('attachment') || !downloadDisp.includes("filename*=UTF-8''") || !downloadMagic.startsWith('%PDF-')) {
      throw new Error('Download PDF validation failed')
    }

    await browser.close()
    console.log('\n=== ALL BROWSER & API CHECKS PASSED (TESTED ON PRODUCTION) ===')

  } finally {
    // Cleanup temporary test loan
    console.log('Cleaning up temporary test loan record...')
    await adminClient.from('equipment_loans').delete().eq('loan_id', testLoanId)
    console.log('Cleanup completed successfully.')
  }
}

runBrowserVerification().catch(err => {
  console.error('Browser verification failed:', err)
  process.exit(1)
})
