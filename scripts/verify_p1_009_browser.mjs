import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { createChunks } from '@supabase/ssr'
import fs from 'fs'
import path from 'path'

const envContent = fs.readFileSync('.env.local', 'utf8')
const supabaseUrl = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)[1].trim()
const serviceKey = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m)[1].trim()
const anonKey = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$/m)[1].trim()

async function main() {
  console.log('='.repeat(70))
  console.log('BROWSER VERIFICATION: WO-P1-009 (MINEBEA OUTSOURCE PROCESSING REQUEST)')
  console.log('='.repeat(70))

  // 1. Acquire Auth Session
  console.log('1. Acquiring auth session...')
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
  const projectId = 'iirezrszalmecsslbruo'
  const chunks = createChunks(`sb-${projectId}-auth-token`, JSON.stringify(session))

  // 2. Launch Playwright
  console.log('2. Launching Chromium...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ja-JP'
  })

  // Set cookies
  const cookies = chunks.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  }))
  await context.addCookies(cookies)

  const page = await context.newPage()

  const loanId = '573370f0-f677-4475-abd1-fe697add6a9a'
  const targetUrl = `http://localhost:3000/equipment/loans/${loanId}`
  console.log(`3. Navigating to ${targetUrl}...`)
  await page.goto(targetUrl, { waitUntil: 'networkidle' })

  // Wait for heading
  await page.waitForSelector('h1', { timeout: 15000 })
  console.log('Page Title:', await page.title())

  // Locate Outsource Processing Button
  const outsourceBtn = page.locator('[data-testid="outsource-processing-btn"]')
  await outsourceBtn.waitFor({ state: 'visible', timeout: 10000 })
  const btnText = (await outsourceBtn.innerText()).trim().replace(/\n/g, ' ')
  console.log(`✅ Found Outsource Processing button: '${btnText}'`)

  // Click to open Modal
  console.log('4. Opening Outsource Processing Modal...')
  await outsourceBtn.click()
  await page.waitForTimeout(500)

  // Verify Modal
  const modal = page.locator('[data-testid="outsource-processing-modal"]')
  await modal.waitFor({ state: 'visible', timeout: 5000 })
  console.log('✅ Modal is visible')

  // Verify form elements
  const processingSelect = modal.locator('select').first()
  console.log('Processing select visible:', await processingSelect.isVisible())

  // Capture Screenshot with Modal open
  const screenshotDir = path.join(process.cwd(), 'docs/reports/screenshots')
  fs.mkdirSync(screenshotDir, { recursive: true })
  const screenshotPath = path.join(screenshotDir, 'wo_p1_009_outsource_processing_ui.png')
  await page.screenshot({ path: screenshotPath })
  console.log(`✅ Captured Screenshot: ${screenshotPath}`)

  await browser.close()
  console.log('='.repeat(70))
  console.log('BROWSER VERIFICATION COMPLETE: ALL CHECKS PASSED ✅')
  console.log('='.repeat(70))
}

main().catch(err => {
  console.error('Browser verification failed:', err)
  process.exit(1)
})
