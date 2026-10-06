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
const SAMPLE_JOB_ID = '6ebc33ea-fa5b-4c70-9291-fdb4d8b1709a' // SMK-227D

const routesToTest = [
  {
    name: '1. Jobs List',
    path: '/equipment/jobs',
    screenshot: 'pilot_route_1_equipment_jobs.png',
    expectSelector: 'tbody tr',
    description: 'Danh sách Job gia công khuôn (Bảng 50 records)'
  },
  {
    name: '2. Job Detail & Steps',
    path: `/equipment/jobs/${SAMPLE_JOB_ID}`,
    screenshot: 'pilot_route_2_equipment_job_detail.png',
    expectSelector: 'h1, h2, .tab-nav',
    description: 'Chi tiết Job SMK-227D và danh sách Steps'
  },
  {
    name: '3. Equipment Schedule & Gantt',
    path: '/equipment/schedule',
    screenshot: 'pilot_route_3_equipment_schedule.png',
    expectSelector: 'button, .card-flat',
    description: 'Lập lịch gia công & Excel Grid / Gantt'
  },
  {
    name: '4. New Worklog (Nippo Form)',
    path: '/worklogs/new',
    screenshot: 'pilot_route_4_worklogs_new.png',
    expectSelector: 'form, input[type="date"], select, button',
    description: 'Form nhập nhật ký công việc Nippo'
  },
  {
    name: '5. Worklogs List',
    path: '/worklogs',
    screenshot: 'pilot_route_5_worklogs_list.png',
    expectSelector: 'table, .data-table, input, select',
    description: 'Danh sách nhật ký công việc đã nhập'
  },
  {
    name: '6. Daily Worklog A4 Report',
    path: '/reports/daily-worklog',
    screenshot: 'pilot_route_6_reports_daily_worklog.png',
    expectSelector: 'select, input[type="date"], button',
    description: 'Báo cáo phiếu in Nippo A4 chuẩn Nhật'
  }
]

async function runAuthenticatedBrowserRecon() {
  console.log('=== AUTHENTICATING FOR BROWSER RECONNAISSANCE ===')
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

  // Inject exact SSR cookie chunks into browser context
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

  console.log('\n=== TESTING 6 PILOT ROUTES (READ-ONLY, AUTHENTICATED) ===\n')

  const results = []

  for (const item of routesToTest) {
    console.log(`Testing Route: ${item.name} -> ${item.path}`)
    const page = await context.newPage()
    const consoleLogs = []
    const consoleErrors = []
    const networkFailures = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      } else {
        consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
      }
    })

    page.on('response', resp => {
      if (resp.status() >= 400) {
        networkFailures.push({ url: resp.url(), status: resp.status() })
      }
    })

    const startTime = Date.now()
    try {
      const resp = await page.goto(`${BASE_URL}${item.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      })

      const statusCode = resp ? resp.status() : 'N/A'
      
      // Wait for UI and data to settle
      await page.waitForTimeout(3000)

      const pageTitle = await page.title().catch(() => 'N/A')

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, item.screenshot)
      await page.screenshot({ path: screenshotPath, fullPage: false })

      // Sample key elements
      const elementStats = await page.evaluate(() => {
        return {
          tablesCount: document.querySelectorAll('table, .data-table').length,
          tableRowsCount: document.querySelectorAll('tbody tr').length,
          inputsCount: document.querySelectorAll('input, select, textarea').length,
          buttonsCount: document.querySelectorAll('button').length,
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean).slice(0, 5),
          firstRowSnippet: document.querySelector('tbody tr') ? document.querySelector('tbody tr').innerText.replace(/\n+/g, ' | ').slice(0, 100) : null
        }
      })

      const durationMs = Date.now() - startTime

      results.push({
        name: item.name,
        path: item.path,
        description: item.description,
        statusCode,
        pageTitle,
        headings: elementStats.headings,
        tablesCount: elementStats.tablesCount,
        tableRowsCount: elementStats.tableRowsCount,
        inputsCount: elementStats.inputsCount,
        buttonsCount: elementStats.buttonsCount,
        firstRowSnippet: elementStats.firstRowSnippet,
        durationMs,
        consoleErrorsCount: consoleErrors.length,
        consoleErrors: consoleErrors.slice(0, 5),
        networkFailuresCount: networkFailures.length,
        networkFailures: networkFailures.slice(0, 5),
        screenshot: item.screenshot,
        status: (statusCode === 200 && consoleErrors.length === 0) ? 'PASS' : 'WARN'
      })

      console.log(`  -> Status: ${statusCode}, Rows: ${elementStats.tableRowsCount}, Inputs: ${elementStats.inputsCount}, Errors: ${consoleErrors.length}, Time: ${durationMs}ms`)
    } catch (err) {
      console.error(`  -> FAILED: ${err.message}`)
      results.push({
        name: item.name,
        path: item.path,
        description: item.description,
        statusCode: 'ERROR',
        error: err.message,
        status: 'FAIL'
      })
    } finally {
      await page.close()
    }
  }

  await browser.close()

  console.log('\n=== AUTHENTICATED BROWSER RECONNAISSANCE SUMMARY ===')
  console.log(JSON.stringify(results, null, 2))

  const summaryFile = path.resolve('scripts/browser_verification_summary.json')
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2), 'utf8')
  console.log(`\nDetailed summary written to: ${summaryFile}`)
}

runAuthenticatedBrowserRecon().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
