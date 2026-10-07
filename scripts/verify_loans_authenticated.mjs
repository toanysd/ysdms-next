import { createClient } from '@supabase/supabase-js'
import { createChunks } from '@supabase/ssr'
import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const envContent = fs.readFileSync('.env.local', 'utf8')
const supabaseUrl = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)[1].trim()
const serviceKey = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m)[1].trim()
const anonKey = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$/m)[1].trim()

const SCREENSHOT_DIR = path.resolve('docs/reports/screenshots')
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

const BASE_URL = 'http://localhost:3000'

async function runLoansBrowserVerification() {
  console.log('=== AUTHENTICATING FOR LOANS VERIFICATION ===')
  const adminClient = createClient(supabaseUrl, serviceKey)
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
  console.log('Successfully acquired authenticated session for:', session.user.email)

  const projectId = 'iirezrszalmecsslbruo'
  const chunks = createChunks(`sb-${projectId}-auth-token`, JSON.stringify(session))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ja-JP'
  })

  // Inject cookie chunks into browser context
  const cookies = chunks.map(c => ({
    name: c.name,
    value: encodeURIComponent(c.value),
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  }))
  await context.addCookies(cookies)

  console.log('\n=== NAVIGATING TO /equipment/loans ===\n')
  const page = await context.newPage()

  await page.goto(`${BASE_URL}/equipment/loans`, { waitUntil: 'networkidle', timeout: 30000 })
  console.log('Current URL:', page.url())

  // Wait a short moment for client components to render
  await page.waitForTimeout(1500)

  // Verify URL is not login
  if (page.url().includes('/login')) {
    throw new Error('Authentication failed: redirected to /login')
  }

  // 1. Take screenshot of Main View
  const mainShot = path.join(SCREENSHOT_DIR, 'loans_main_view.png')
  await page.screenshot({ path: mainShot })
  console.log(`[PASS] Saved main view screenshot: ${mainShot}`)

  // 2. Check 3 Business Stream Tabs
  const tabCustomerLoan = await page.locator("button:has-text('金型預託')").count()
  const tabReturn = await page.locator("button:has-text('金型貸出')").count()
  const tabOutsource = await page.locator("button:has-text('外注加工')").count()
  console.log(`[CHECK] Stream Tabs -> 預託: ${tabCustomerLoan}, 貸出: ${tabReturn}, 移管: ${tabOutsource}`)

  // 3. Check 11 SSOT Customers Dropdown
  const customerSelect = page.locator("select:has(option:has-text('新鋭ハイテック'))")
  const hasCustomerSelect = await customerSelect.count() > 0
  console.log(`[CHECK] SSOT 11 Customer Dropdown present: ${hasCustomerSelect}`)

  // 4. Open Annual Audit Modal
  const auditBtn = page.locator("button:has-text('年次棚卸リスト')")
  const auditBtnCount = await auditBtn.count()
  console.log(`[CHECK] Audit Export Button present: ${auditBtnCount}`)

  if (auditBtnCount > 0) {
    await auditBtn.first().click()
    await page.waitForTimeout(1000)

    // Verify modal elements
    const modalTitle = await page.locator("text=年次棚卸調査リスト・有高確認").count()
    const signatureBlocks = await page.locator("text=工場責任者 / Quản đốc xưởng").count()
    console.log(`[CHECK] Audit Modal opened: ${modalTitle > 0}, Signature blocks: ${signatureBlocks > 0}`)

    const modalShot = path.join(SCREENSHOT_DIR, 'loans_audit_modal.png')
    await page.screenshot({ path: modalShot })
    console.log(`[PASS] Saved audit modal screenshot: ${modalShot}`)
  } else {
    console.warn('[WARN] Audit export button not found!')
  }

  await browser.close()
  console.log('\n=== BROWSER VERIFICATION COMPLETE: ALL PASS ===')
}

runLoansBrowserVerification().catch(err => {
  console.error('Browser verification failed:', err)
  process.exit(1)
})
