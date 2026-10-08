import { chromium } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { createChunks } from '@supabase/ssr'
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

async function run() {
  console.log('1. Authenticating for Browser Verification...')
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

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ja-JP'
  })
  await context.addCookies(chunks.map(c => ({
    name: c.name,
    value: encodeURIComponent(c.value),
    domain: 'localhost',
    path: '/'
  })))

  const page = await context.newPage()
  console.log('2. Navigating to http://localhost:3000/equipment/molds...')
  await page.goto('http://localhost:3000/equipment/molds', { waitUntil: 'networkidle' })

  // Find export button
  const exportBtn = page.locator('button:has-text("貸与設備棚卸調査表")')
  await exportBtn.waitFor({ state: 'visible', timeout: 15000 })
  console.log('✅ Found export button on molds page!')

  // Click to open modal
  await exportBtn.click()
  await page.waitForTimeout(500)

  // Switch scope to '取引先指定'
  const scopeCustomerBtn = page.locator('button:has-text("取引先指定")')
  await scopeCustomerBtn.click()
  await page.waitForTimeout(1000)

  // Screenshot modal
  const screenshotPath = path.join(SCREENSHOT_DIR, 'wo_p1_007_survey_export_modal.png')
  await page.screenshot({ path: screenshotPath })
  console.log('✅ Successfully captured screenshot to:', screenshotPath)

  await browser.close()
}

run().then(() => {
  console.log('🎉 Browser verification finished 100% successfully!')
}).catch(err => {
  console.error('❌ Browser verification error:', err)
  process.exit(1)
})
