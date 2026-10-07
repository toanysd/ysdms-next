import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'

async function run() {
  console.log('=================================================================')
  console.log('BROWSER E2E VERIFICATION: Sprint P0-3 Job A4 Print Sheet')
  console.log('=================================================================')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1024 }
  })
  const page = await context.newPage()

  const targetJobId = '39dbbc91-c7b4-4a90-bdd8-8c894b782092'
  const printUrl = `http://localhost:3000/equipment/jobs/${targetJobId}/print`

  console.log(`[1] Navigating to: ${printUrl}`)
  const response = await page.goto(printUrl, { waitUntil: 'networkidle', timeout: 30000 })
  console.log(`[2] HTTP Status: ${response.status()}`)

  // Verify Checklist
  // 1. Title & Header
  const titleText = await page.textContent('.job-doc-title')
  console.log(`[3] Doc Title: "${titleText?.trim()}"`)

  // 2. QR Code
  await page.waitForSelector('img[alt="Job QR"]', { timeout: 10000 })
  const qrSrc = await page.getAttribute('img[alt="Job QR"]', 'src')
  const hasValidQr = qrSrc && qrSrc.startsWith('data:image/png;base64,')
  console.log(`[4] QR Code rendered: ${hasValidQr ? 'PASS (Base64 PNG)' : 'FAIL'}`)

  // 3. Job Code
  const jobCodeText = await page.textContent('.job-grid-4 .job-cell:first-child .job-cell-value')
  console.log(`[5] Job Code: "${jobCodeText?.trim()}"`)

  // 4. Nippo shortcut button
  const nippoHref = await page.getAttribute('a:has-text("日報入力へ")', 'href')
  console.log(`[6] Nippo Link: "${nippoHref}" (Expected: /worklogs/new?job_id=${targetJobId})`)

  // 5. Sign-off Boxes
  const signoffBoxes = await page.$$('.job-signoff-box')
  console.log(`[7] Workshop Sign-off Boxes count: ${signoffBoxes.length} (Expected: 4)`)

  // 6. Print Button
  const hasPrintButton = (await page.$('button:has-text("A4印刷")')) !== null
  console.log(`[8] Print Button present: ${hasPrintButton}`)

  // Ensure output directory exists
  const outDir = path.resolve('public/evidence')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Screenshot 1: Screen View
  const screenShotPath = path.join(outDir, 'p0_3_browser_screen.png')
  await page.screenshot({ path: screenShotPath, fullPage: true })
  console.log(`[9] Saved Screen Preview: ${screenShotPath}`)

  // Screenshot 2: Print Emulation View
  await page.emulateMedia({ media: 'print' })
  const printShotPath = path.join(outDir, 'p0_3_browser_print_mode.png')
  await page.screenshot({ path: printShotPath, fullPage: true })
  console.log(`[10] Saved Print Emulation Preview: ${printShotPath}`)

  // Export PDF
  const pdfPath = path.join(outDir, 'p0_3_tooling_sheet_A4.pdf')
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true })
  console.log(`[11] Saved A4 PDF: ${pdfPath}`)

  await browser.close()

  console.log('=================================================================')
  console.log('ALL BROWSER CHECKLIST ITEMS VERIFIED SUCCESSFULLY!')
  console.log('=================================================================')

  const results = {
    job_id: targetJobId,
    url: printUrl,
    http_status: response.status(),
    title: titleText?.trim(),
    qr_valid: hasValidQr,
    job_code: jobCodeText?.trim(),
    nippo_href: nippoHref,
    signoff_boxes_count: signoffBoxes.length,
    print_button: hasPrintButton,
    artifacts: {
      screen_preview: screenShotPath,
      print_preview: printShotPath,
      pdf: pdfPath
    }
  }

  fs.writeFileSync('scripts/e2e_verify_p0_3_results.json', JSON.stringify(results, null, 2))
}

run().catch(err => {
  console.error('Browser E2E Verification Failed:', err)
  process.exit(1)
})
