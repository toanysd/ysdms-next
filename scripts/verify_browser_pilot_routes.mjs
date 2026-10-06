import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'

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
    expectSelector: 'table, .data-table, input[type="text"], input[type="search"]',
    description: 'Danh sách Job gia công khuôn'
  },
  {
    name: '2. Job Detail & Steps',
    path: `/equipment/jobs/${SAMPLE_JOB_ID}`,
    screenshot: 'pilot_route_2_equipment_job_detail.png',
    expectSelector: 'h1, .tab-nav, [role="tab"], button',
    description: 'Chi tiết Job và danh sách Steps'
  },
  {
    name: '3. Equipment Schedule & Gantt',
    path: '/equipment/schedule',
    screenshot: 'pilot_route_3_equipment_schedule.png',
    expectSelector: 'button, .card-flat, [data-testid="schedule-view"], table',
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

async function runBrowserRecon() {
  console.log('=== STARTING BROWSER RECONNAISSANCE (100% READ-ONLY) ===\n')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ja-JP'
  })

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
      
      // Wait for UI to settle
      await page.waitForTimeout(2000)

      // Check key element presence
      const hasExpectedElement = await page.$(item.expectSelector).then(el => !!el).catch(() => false)
      const pageTitle = await page.title().catch(() => 'N/A')

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, item.screenshot)
      await page.screenshot({ path: screenshotPath, fullPage: false })

      // Read key text on page for verification
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300))

      const durationMs = Date.now() - startTime

      results.push({
        name: item.name,
        path: item.path,
        description: item.description,
        statusCode,
        pageTitle,
        hasExpectedElement,
        durationMs,
        consoleErrorsCount: consoleErrors.length,
        consoleErrors: consoleErrors.slice(0, 5),
        networkFailuresCount: networkFailures.length,
        networkFailures: networkFailures.slice(0, 5),
        screenshot: item.screenshot,
        sampleText: bodyText.replace(/\n+/g, ' ').trim().slice(0, 150),
        status: (statusCode === 200 && hasExpectedElement) ? 'PASS' : 'WARN'
      })

      console.log(`  -> Status: ${statusCode}, Elements Found: ${hasExpectedElement}, Errors: ${consoleErrors.length}, Time: ${durationMs}ms`)
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

  console.log('\n=== BROWSER RECONNAISSANCE SUMMARY ===')
  console.log(JSON.stringify(results, null, 2))

  const summaryFile = path.resolve('scripts/browser_verification_summary.json')
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2), 'utf8')
  console.log(`\nSummary saved to: ${summaryFile}`)
}

runBrowserRecon().catch(err => {
  console.error('Fatal error in browser recon:', err)
  process.exit(1)
})
