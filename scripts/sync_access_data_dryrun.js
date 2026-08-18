const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_DIR = path.join(__dirname, '..', 'source_data', 'csv-access-data');

// Helper to parse CSV lines safely
function parseCSV(filename) {
  const filePath = path.join(CSV_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^['"﻿]|['"]$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser supporting quotes
    const line = lines[i];
    const values = [];
    let cur = '';
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    values.push(cur.trim().replace(/^"|"$/g, ''));

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx] : null;
    });
    rows.push(row);
  }

  return rows;
}

async function analyzeAll() {
  console.log('====================================================');
  console.log('🔍 BẮT ĐẦU PHÂN TÍCH ĐỐI SOÁT DỮ LIỆU CSV ACCESS (DRY-RUN)');
  console.log('====================================================\n');

  const report = {
    analyzedAt: new Date().toISOString(),
    modules: {}
  };

  // 1. COMPANIES & CUSTOMERS
  console.log('1. Phân tích Khách hàng (companies.csv, customers.csv, traycustomer.csv)...');
  const companiesCSV = parseCSV('companies.csv');
  const customersCSV = parseCSV('customers.csv');
  const trayCustomersCSV = parseCSV('traycustomer.csv');

  const { data: dbCompanies } = await supabase.from('companies').select('company_id, company_code, company_name');
  const dbCompanyCodeSet = new Set((dbCompanies || []).map(c => c.company_code?.trim().toLowerCase()).filter(Boolean));
  const dbCompanyNameSet = new Set((dbCompanies || []).map(c => c.company_name?.trim().toLowerCase()).filter(Boolean));

  let compNew = 0, compExisting = 0;
  companiesCSV.forEach(c => {
    const code = c.CompanyCode?.trim().toLowerCase();
    const name = c.CompanyName?.trim().toLowerCase();
    if (code && dbCompanyCodeSet.has(code) || name && dbCompanyNameSet.has(name)) {
      compExisting++;
    } else {
      compNew++;
    }
  });

  report.modules.companies = {
    csvRows: companiesCSV.length,
    dbCurrentRows: dbCompanies?.length || 0,
    alreadyInDB: compExisting,
    newToInsert: compNew
  };
  console.log(`   ➔ Đã có trong DB: ${compExisting} | Cần thêm mới: ${compNew}`);

  // 2. PRODUCTS / TRAYS
  console.log('\n2. Phân tích Sản phẩm Khay (tray.csv)...');
  const traysCSV = parseCSV('tray.csv');
  const { data: dbProducts } = await supabase.from('products').select('product_id, product_code, product_name_internal');
  const dbProductCodeSet = new Set((dbProducts || []).map(p => p.product_code?.trim().toLowerCase()).filter(Boolean));
  const dbProductNameSet = new Set((dbProducts || []).map(p => p.product_name_internal?.trim().toLowerCase()).filter(Boolean));

  let prodNew = 0, prodExisting = 0;
  traysCSV.forEach(t => {
    const code = (t.TrayCode || t.MoldTrayName || '').trim().toLowerCase();
    if (code && (dbProductCodeSet.has(code) || dbProductNameSet.has(code))) {
      prodExisting++;
    } else {
      prodNew++;
    }
  });

  report.modules.products = {
    csvRows: traysCSV.length,
    dbCurrentRows: dbProducts?.length || 0,
    alreadyInDB: prodExisting,
    newToInsert: prodNew
  };
  console.log(`   ➔ Đã có trong DB: ${prodExisting} | Cần thêm mới: ${prodNew}`);

  // 3. EQUIPMENT: MOLDS & CUTTERS
  console.log('\n3. Phân tích Thiết bị Thống nhất (molds.csv, cutters.csv)...');
  const moldsCSV = parseCSV('molds.csv');
  const cuttersCSV = parseCSV('cutters.csv');
  const { data: dbEquip } = await supabase.from('equipment').select('equipment_id, equipment_code, display_name, equipment_type');
  
  const dbEquipCodeSet = new Set((dbEquip || []).map(e => e.equipment_code?.trim().toLowerCase()).filter(Boolean));
  const dbEquipNameSet = new Set((dbEquip || []).map(e => e.display_name?.trim().toLowerCase()).filter(Boolean));

  let moldNew = 0, moldExisting = 0;
  moldsCSV.forEach(m => {
    const code = (m.MoldCode || m.MoldName || '').trim().toLowerCase();
    if (code && (dbEquipCodeSet.has(code) || dbEquipNameSet.has(code))) {
      moldExisting++;
    } else {
      moldNew++;
    }
  });

  let cutterNew = 0, cutterExisting = 0;
  cuttersCSV.forEach(c => {
    const code = (c.CutterNo || c.CutterName || '').trim().toLowerCase();
    if (code && (dbEquipCodeSet.has(code) || dbEquipNameSet.has(code))) {
      cutterExisting++;
    } else {
      cutterNew++;
    }
  });

  report.modules.equipment = {
    moldsCsvRows: moldsCSV.length,
    moldsInDB: moldExisting,
    moldsNew: moldNew,
    cuttersCsvRows: cuttersCSV.length,
    cuttersInDB: cutterExisting,
    cuttersNew: cutterNew,
    totalDbEquipment: dbEquip?.length || 0
  };
  console.log(`   ➔ Khuôn: Đã có ${moldExisting} | Cần thêm ${moldNew}`);
  console.log(`   ➔ Dao cắt: Đã có ${cutterExisting} | Cần thêm ${cutterNew}`);

  // 4. JOBS, STEPS & WORKLOGS
  console.log('\n4. Phân tích Chỉ thị & Nhật ký (jobs.csv, processingdeadline.csv, worklog.csv)...');
  const jobsCSV = parseCSV('jobs.csv');
  const deadlinesCSV = parseCSV('processingdeadline.csv');
  const worklogsCSV = parseCSV('worklog.csv');

  const { data: dbJobs } = await supabase.from('jobs').select('job_id, job_code, job_name');
  const dbJobCodeSet = new Set((dbJobs || []).map(j => j.job_code?.trim().toLowerCase()).filter(Boolean));

  const { count: dbWorklogsCount } = await supabase.from('work_logs').select('*', { count: 'exact', head: true });

  let jobNew = 0, jobExisting = 0;
  jobsCSV.forEach(j => {
    const code = (j.JobNo || j.JobID || '').trim().toLowerCase();
    if (code && dbJobCodeSet.has(code)) {
      jobExisting++;
    } else {
      jobNew++;
    }
  });

  report.modules.jobsAndLogs = {
    jobsCsvRows: jobsCSV.length,
    jobsInDB: jobExisting,
    jobsNew: jobNew,
    deadlinesCsvRows: deadlinesCSV.length,
    worklogsCsvRows: worklogsCSV.length,
    worklogsInDB: dbWorklogsCount || 0
  };
  console.log(`   ➔ Job: Đã có ${jobExisting} | Cần thêm ${jobNew}`);
  console.log(`   ➔ Công đoạn (Deadlines CSV): ${deadlinesCSV.length} dòng`);
  console.log(`   ➔ Nhật ký (Worklogs CSV): ${worklogsCSV.length} dòng (Hiện trong DB có ${dbWorklogsCount} dòng)`);

  // 5. CONSUMABLES & PURCHASE ORDERS (VẬT TƯ TIÊU HAO & ĐẶT HÀNG)
  console.log('\n5. Phân tích Vật tư Tiêu hao & Đặt mua (vattutbl.csv, dathangvttbl.csv, vattusdtbl.csv)...');
  const vattuCSV = parseCSV('vattutbl.csv');
  const dathangCSV = parseCSV('dathangvttbl.csv');
  const vattusdCSV = parseCSV('vattusdtbl.csv');

  report.modules.consumables = {
    catalogItems: vattuCSV.length,
    purchaseOrders: dathangCSV.length,
    usageRecords: vattusdCSV.length,
    status: 'READY_TO_CREATE_TABLES_AND_MIGRATE'
  };
  console.log(`   ➔ Danh mục Vật tư tiêu hao (vattutbl): ${vattuCSV.length} mặt hàng`);
  console.log(`   ➔ Lịch sử Đặt mua vật tư (dathangvttbl): ${dathangCSV.length} đơn đặt hàng`);
  console.log(`   ➔ Nhật ký Tiêu hao thực tế (vattusdtbl): ${vattuCSV.length} bản ghi`);

  // 6. MOLD LOANS (GIẤY MƯỢN KHUÔN)
  console.log('\n6. Phân tích Giấy Mượn Khuôn (moldborrow.csv)...');
  const borrowCSV = parseCSV('moldborrow.csv');
  report.modules.moldLoans = {
    borrowRecords: borrowCSV.length,
    status: 'READY_TO_CREATE_TABLE_AND_MIGRATE'
  };
  console.log(`   ➔ Hồ sơ Mượn khuôn (moldborrow.csv): ${borrowCSV.length} bản ghi`);

  // Save report
  const reportPath = path.join(__dirname, '..', 'backups', 'access_sync_dryrun_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n====================================================');
  console.log(`✅ HOÀN TẤT PHÂN TÍCH DRY-RUN!`);
  console.log(`Báo cáo chi tiết được lưu tại: ${reportPath}`);
  console.log('====================================================');
}

analyzeAll().catch(err => {
  console.error('Analysis failed:', err);
  process.exit(1);
});
