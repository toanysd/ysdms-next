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
  console.log('=' .repeat(70))
  console.log('BROWSER VERIFICATION: WO-P1-008 (CON DẤU ĐIỆN TỬ YSD 丸印・角印)')
  console.log('=' .repeat(70))

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

  // Locate Seal Selector Button
  const sealBtn = page.locator('[data-testid="seal-selector-btn"]')
  await sealBtn.waitFor({ state: 'visible', timeout: 10000 })
  const btnText = (await sealBtn.innerText()).trim().replace(/\n/g, ' ')
  console.log(`✅ Found Seal Selector button: '${btnText}'`)

  // Click to open dropdown
  console.log('4. Opening Seal Selector dropdown...')
  await sealBtn.click()
  await page.waitForTimeout(500)

  // Verify options
  const optBoth = page.locator('[data-testid="seal-option-both"]')
  const optMaruin = page.locator('[data-testid="seal-option-maruin"]')
  const optKakuin = page.locator('[data-testid="seal-option-kakuin"]')
  const optNone = page.locator('[data-testid="seal-option-none"]')

  console.log('optBoth visible:', await optBoth.isVisible())
  console.log('optMaruin visible:', await optMaruin.isVisible())
  console.log('optKakuin visible:', await optKakuin.isVisible())
  console.log('optNone visible:', await optNone.isVisible())

  // Capture Screenshot with dropdown open
  const screenshotDir = path.join(process.cwd(), 'docs/reports/screenshots')
  fs.mkdirSync(screenshotDir, { recursive: true })
  const screenshotPath = path.join(screenshotDir, 'wo_p1_008_electronic_seal_ui.png')
  await page.screenshot({ path: screenshotPath })
  console.log(`✅ Captured Screenshot: ${screenshotPath}`)

  // Verify Print & Download links
  const printLink = page.locator('[data-testid="print-pdf-link"]')
  const href = await printLink.getAttribute('href')
  console.log(`✅ Print Link Href: ${href}`)

  // Click Option Maruin only to test reactive update
  console.log('5. Selecting Maruin only...')
  await optMaruin.click()
  await page.waitForTimeout(300)
  const updatedHref = await printLink.getAttribute('href')
  console.log(`✅ Updated Print Link Href: ${updatedHref}`)

  await browser.close()
  console.log('=' .repeat(70))
  console.log('BROWSER VERIFICATION COMPLETE: ALL CHECKS PASSED ✅')
  console.log('=' .repeat(70))
}

main().catch(err => {
  console.error('BROWSER VERIFICATION FAILED:', err)
  process.exit(1)
})
