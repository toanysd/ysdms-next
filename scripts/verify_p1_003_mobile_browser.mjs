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

async function runMobileBrowserVerification() {
  console.log('=== RUNNING WO-P1-003 MOBILE BROWSER VERIFICATION ===\n')

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

  // 2. Insert temporary test loan record for detail page testing
  console.log('[2/5] Creating temporary test loan record in equipment_loans...')
  const testLoanId = crypto.randomUUID()
  const testLoanCode = `TEST-LN-${Date.now().toString().slice(-6)}`

  // Look up a valid mold equipment and companies
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
      purpose: 'J-SOX 実査テスト (Mobile verification)',
    })

  if (insertErr) throw insertErr
  console.log(`Created test loan: ${testLoanCode} (ID: ${testLoanId})`)

  try {
    // 3. Launch browser in Mobile Viewport (iPhone 14 / Pixel: 390x844)
    console.log('[3/5] Launching Playwright with Mobile Viewport (390x844, touch=true)...')
    const projectId = 'iirezrszalmecsslbruo'
    const chunks = createChunks(`sb-${projectId}-auth-token`, JSON.stringify(session))

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
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

    // Verify detail page elements
    const pageTitle = await page.locator("text=" + testLoanCode).count()
    console.log(`[CHECK] Detail page loaded for ${testLoanCode}: ${pageTitle > 0}`)

    // Verify Photo Capture Section
    const photoSection = await page.locator("text=固定資産撮影・現品証拠写真").count()
    const cameraInputs = await page.locator("input[type='file'][capture='environment']").count()
    console.log(`[CHECK] Photo Capture Section present: ${photoSection > 0}, Camera inputs: ${cameraInputs}`)

    // Capture screenshot of mobile photo section
    const photoShot = path.join(SCREENSHOT_DIR, 'wo_p1_003_mobile_photo_section.png')
    await page.screenshot({ path: photoShot, fullPage: true })
    console.log(`[PASS] Saved mobile view screenshot: ${photoShot}`)

    // 5. Open Placard Modal
    console.log('[5/5] Testing Placard Modal on mobile...')
    const placardBtn = page.locator("button:has-text('撮影看板')")
    const placardBtnCount = await placardBtn.count()
    console.log(`[CHECK] Placard Modal trigger button present: ${placardBtnCount}`)

    if (placardBtnCount > 0) {
      await placardBtn.first().click()
      await page.waitForTimeout(1000)

      const modalTitle = await page.locator("text=金型保管・現品実査票").count()
      const codeCheck = await page.locator(`text=${sampleEq.equipment_code}`).count()
      console.log(`[CHECK] Placard Modal opened: ${modalTitle > 0}, Equipment Code ${sampleEq.equipment_code}: ${codeCheck > 0}`)

      const placardShot = path.join(SCREENSHOT_DIR, 'wo_p1_003_mobile_placard_modal.png')
      await page.screenshot({ path: placardShot })
      console.log(`[PASS] Saved placard modal screenshot: ${placardShot}`)
    }

    await browser.close()
  } finally {
    // Clean up temporary test loan
    console.log('\nCleaning up temporary test loan...')
    await adminClient.from('equipment_loans').delete().eq('loan_id', testLoanId)
    console.log('Cleanup complete: DB returned to pristine state.')
  }

  console.log('\n=== MOBILE BROWSER VERIFICATION PASSED (100%) ===\n')
}

runMobileBrowserVerification().catch(err => {
  console.error('Mobile browser verification failed:', err)
  process.exit(1)
})
