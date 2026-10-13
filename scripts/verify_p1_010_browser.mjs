import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { createChunks } from '@supabase/ssr';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)[1].trim();
const serviceKey = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m)[1].trim();
const anonKey = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$/m)[1].trim();

async function main() {
  console.log('='.repeat(70));
  console.log('BROWSER & PDF VERIFICATION: WO-P1-010 (PANASONIC PALLET RETURN & INVENTORY)');
  console.log('='.repeat(70));

  // 1. Acquire Auth Session
  console.log('1. Acquiring auth session...');
  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: 'admin@ysd-pack.co.jp'
  });
  if (linkErr) throw linkErr;

  const userClient = createClient(supabaseUrl, anonKey);
  const { data: sessionData, error: sessionErr } = await userClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email'
  });
  if (sessionErr) throw sessionErr;

  const session = sessionData.session;
  const projectId = 'iirezrszalmecsslbruo';
  const chunks = createChunks(`sb-${projectId}-auth-token`, JSON.stringify(session));

  // 2. Select loan record
  const { data: loanList } = await adminClient
    .from('equipment_loans')
    .select('loan_id, loan_code, equipment_id, condition_notes, to_company_id')
    .limit(1);

  if (!loanList || loanList.length === 0) {
    throw new Error('No equipment_loans record found in DB.');
  }

  const sampleLoan = loanList[0];
  const loanId = sampleLoan.loan_id;
  console.log(`Using loan record: ${sampleLoan.loan_code} (${loanId})`);

  // Update sampleLoan with Panasonic metadata to test PDF rendering
  const testMeta = {
    return_type: 'PANASONIC_PALLET_RETURN',
    pallet_spec: '1,100 × 1,100 mm (JIS規格)',
    total_height_mm: 650,
    total_weight_kg: 185.5,
    qr_serial_tag: 'PNS-MOLD-2024-0081',
    qr_verified: true,
    crane_truck_required: true,
    checklist: {
      mold_drawings: true,
      spare_parts: true,
      original_loan_doc: true,
      stretch_film_wrapped: true
    },
    return_date: new Date().toISOString().slice(0, 10),
    dispatcher_name: 'YSD 出庫担当 (遠藤)',
    transporter_name: 'ヤマト運輸 / クレーン車',
    receiver_name: 'パナソニック株式会社 白河工場',
    seal_type: 'BOTH',
    notes: 'クレーン吊り上げ対応、白河工場第2搬入口',
    updated_at: new Date().toISOString()
  };

  const panasonicTag = `<!-- PANASONIC_RETURN_META:${JSON.stringify(testMeta)} -->`;
  const existingNotes = sampleLoan.condition_notes || '';
  const newNotes = existingNotes.includes('PANASONIC_RETURN_META:')
    ? existingNotes
    : `${panasonicTag}\n\n${existingNotes}`;

  await adminClient
    .from('equipment_loans')
    .update({ condition_notes: newNotes })
    .eq('loan_id', loanId);

  // 3. Test PDF API endpoint
  console.log('2. Testing PDF API endpoint...');
  const cookieHeader = chunks.map(c => `${c.name}=${c.value}`).join('; ');
  const pdfRes = await fetch(`http://localhost:3000/api/equipment/loans/${loanId}/pdf?type=RETURN_TO_CUSTOMER`, {
    headers: {
      Cookie: cookieHeader
    }
  });

  if (!pdfRes.ok) {
    throw new Error(`PDF API failed with status ${pdfRes.status}: ${await pdfRes.text()}`);
  }

  const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
  const reportDir = path.join(process.cwd(), 'docs/reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const samplePdfPath = path.join(reportDir, 'wo_p1_010_panasonic_pallet_return_sample.pdf');
  fs.writeFileSync(samplePdfPath, pdfBuffer);
  console.log(`✅ Generated Sample PDF: ${samplePdfPath} (${pdfBuffer.length.toLocaleString()} bytes)`);

  // 4. Launch Playwright
  console.log('3. Launching Chromium for UI modal verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ja-JP'
  });

  const cookies = chunks.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  }));
  await context.addCookies(cookies);

  const page = await context.newPage();
  const targetUrl = `http://localhost:3000/equipment/loans/${loanId}`;
  console.log(`4. Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  await page.waitForSelector('h1', { timeout: 15000 });
  console.log('Page Title:', await page.title());

  // Locate Panasonic Return Button
  const panasonicBtn = page.locator('[data-testid="panasonic-return-btn"]');
  await panasonicBtn.waitFor({ state: 'visible', timeout: 10000 });
  const btnText = (await panasonicBtn.innerText()).trim().replace(/\n/g, ' ');
  console.log(`✅ Found Panasonic Return button: '${btnText}'`);

  // Click to open Modal
  console.log('5. Opening Panasonic Pallet Return Modal...');
  await panasonicBtn.click();
  await page.waitForTimeout(500);

  // Verify Modal
  const modal = page.locator('[data-testid="panasonic-return-modal"]');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Modal is visible');

  // Capture Screenshot with Modal open
  const screenshotDir = path.join(process.cwd(), 'docs/reports/screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });
  const screenshotPath = path.join(screenshotDir, 'wo_p1_010_panasonic_return_ui.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`✅ Captured Screenshot: ${screenshotPath}`);

  await browser.close();
  console.log('='.repeat(70));
  console.log('BROWSER & PDF VERIFICATION COMPLETE: ALL CHECKS PASSED ✅');
  console.log('='.repeat(70));
}

main().catch(err => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});
