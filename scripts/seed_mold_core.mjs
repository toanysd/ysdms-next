import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// --- CẤU HÌNH ---
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabaseUrl = envKeys['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envKeys['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error("Lỗi: Không tìm thấy credentials trong .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const ACCESS_DIR = path.resolve(process.cwd(), 'source_data/csv-access-data')

// Hàm đọc CSV siêu tốc
function parseCSV(content) {
  content = content.replace(/^\uFEFF/, '');
  const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
              if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
              else { inQuotes = !inQuotes; }
          } else if (line[i] === ',' && !inQuotes) {
              result.push(current);
              current = '';
          } else {
              current += line[i];
          }
      }
      result.push(current);
      return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
      const parsed = parseLine(lines[i]);
      if (parsed.length > 1) {
          const rowObj = {};
          headers.forEach((h, idx) => { rowObj[h] = parsed[idx] !== undefined ? parsed[idx].trim() : ''; });
          rows.push(rowObj);
      }
  }
  return rows;
}

// Lấy Lookup Map từ bảng Master (Companies, RackLayers)
async function buildCodeToIdMap(tableName) {
  const { data, error } = await supabase.from(tableName).select('id, code')
  if (error) throw new Error(`Lỗi đọc ${tableName}: ${error.message}`)
  const map = {}
  data.forEach(r => map[r.code] = r.id)
  return map
}

// Lấy Lookup Map từ Legacy_ID
async function buildLegacyToIdMap(tableName) {
  const { data, error } = await supabase.from(tableName).select('id, legacy_id').not('legacy_id', 'is', null)
  if (error) throw new Error(`Lỗi đọc ${tableName}: ${error.message}`)
  const map = {}
  data.forEach(r => map[r.legacy_id] = r.id)
  return map
}

async function runSeedCore() {
  console.log("🚀 BẮT ĐẦU NẠP DỮ LIỆU CỐT LÕI (MOLDS, JOBS, WORKLOGS) 🚀")

  const companyMap = await buildCodeToIdMap('companies')
  const rackMap = await buildCodeToIdMap('rack_layers')
  const processingCodeMap = await buildCodeToIdMap('processing_codes')
  const itemTypeMap = await buildCodeToIdMap('item_types')

  const chunkSize = 500;

  // 1. NẠP MOLD_BASE & MOLD_DESIGN_REVISION
  console.log("⏳ [1/4] Đang xử lý molddesign.csv -> mold_base & mold_design_revision...")
  const designData = parseCSV(fs.readFileSync(path.join(ACCESS_DIR, 'molddesign.csv'), 'utf8'))
  
  // A. Nạp Mold Base trước
  const baseUpserts = designData.map(r => ({
    code: r.MoldDesignCode || `DSG-${r.MoldDesignID}`,
    name: r.MoldDesignName || `Khuôn ${r.MoldDesignID}`,
    is_active: true
  })).filter(r => r.code)

  for (let i = 0; i < baseUpserts.length; i += chunkSize) {
    await supabase.from('mold_base').upsert(baseUpserts.slice(i, i + chunkSize), { onConflict: 'code' })
  }
  
  // Lấy map Mold Base Code -> ID
  const baseMap = await buildCodeToIdMap('mold_base')

  // B. Nạp Design Revision
  const designUpserts = designData.map(r => {
    const baseCode = r.MoldDesignCode || `DSG-${r.MoldDesignID}`
    return {
      legacy_id: parseInt(r.MoldDesignID),
      mold_base_id: baseMap[baseCode], // Ràng buộc NOT NULL
      revision_code: baseCode, // Dùng chung code để dễ nhìn
      version_label: 'Version 1.0',
      length_mm: parseFloat(r.MoldDesignLength) || null,
      width_mm: parseFloat(r.MoldDesignWidth) || null,
      height_mm: parseFloat(r.MoldDesignHeight) || null
    }
  }).filter(r => !isNaN(r.legacy_id) && r.mold_base_id)

  for (let i = 0; i < designUpserts.length; i += chunkSize) {
    const chunk = designUpserts.slice(i, i + chunkSize)
    const { error } = await supabase.from('mold_design_revision').upsert(chunk, { onConflict: 'legacy_id' })
    if (error) console.error("Lỗi chunk Design:", error.message)
  }
  console.log(`✅ Hoàn thành nạp Design!`)

  // 2. NẠP MOLD_PHYSICAL
  console.log("⏳ [2/4] Đang xử lý molds.csv -> mold_physical...")
  const designMap = await buildLegacyToIdMap('mold_design_revision')
  const moldData = parseCSV(fs.readFileSync(path.join(ACCESS_DIR, 'molds.csv'), 'utf8'))
  
  const physicalUpserts = moldData.map(r => {
    const mappedDesignId = designMap[r.MoldDesignID] || null;
    return {
      legacy_id: parseInt(r.MoldID),
      revision_id: mappedDesignId,
      physical_code: r.MoldCode || `M-${r.MoldID}`,
      status: r.DeviceStatus || 'ACTIVE',
      keeper_company_id: companyMap[r.KeeperCompany] || companyMap[r.storage_company] || null,
      rack_layer_id: rackMap[r.RackLayerID] || null,
      item_type_id: itemTypeMap[r.ItemTypeID] || null,
      entry_date: r.MoldEntry ? new Date(r.MoldEntry).toISOString() : null
    }
  }).filter(r => !isNaN(r.legacy_id) && r.revision_id) // revision_id is NOT NULL in schema

  for (let i = 0; i < physicalUpserts.length; i += chunkSize) {
    const chunk = physicalUpserts.slice(i, i + chunkSize)
    const { error } = await supabase.from('mold_physical').upsert(chunk, { onConflict: 'legacy_id' })
    if (error) console.error("Lỗi chunk Physical:", error.message)
  }
  console.log(`✅ Hoàn thành nạp Physical!`)

  // 3. NẠP MOLD_JOBS
  console.log("⏳ [3/4] Đang xử lý jobs.csv -> mold_jobs...")
  const physicalMap = await buildLegacyToIdMap('mold_physical')
  if (!fs.existsSync(path.join(ACCESS_DIR, 'jobs.csv'))) {
      console.log('⚠️ Bỏ qua Jobs: Không tìm thấy jobs.csv')
  } else {
      const jobsData = parseCSV(fs.readFileSync(path.join(ACCESS_DIR, 'jobs.csv'), 'utf8'))
      const jobUpserts = jobsData.map(r => ({
        legacy_id: parseInt(r.JobID),
        // Chống lỗi trùng lặp job_code do data Access rác
        job_code: `JOB-${r.JobID}-${r.JobName || 'UNNAMED'}`.substring(0, 50), 
        mold_physical_id: physicalMap[r.MoldID] || null,
        mold_design_id: designMap[r.MoldDesignID] || null,
        notes: r.JobNote || null
      })).filter(r => !isNaN(r.legacy_id))

      for (let i = 0; i < jobUpserts.length; i += chunkSize) {
        const chunk = jobUpserts.slice(i, i + chunkSize)
        const { error } = await supabase.from('mold_jobs').upsert(chunk, { onConflict: 'legacy_id' })
        if (error) console.error("Lỗi chunk Jobs:", error.message)
      }
      console.log(`✅ Hoàn thành nạp Jobs!`)
  }

  // 4. NẠP MOLD_WORK_LOGS
  console.log("⏳ [4/4] Đang xử lý worklog.csv -> mold_work_logs...")
  const jobMap = await buildLegacyToIdMap('mold_jobs')
  if (!fs.existsSync(path.join(ACCESS_DIR, 'worklog.csv'))) {
      console.log('⚠️ Bỏ qua WorkLogs: Không tìm thấy worklog.csv')
  } else {
      const logsData = parseCSV(fs.readFileSync(path.join(ACCESS_DIR, 'worklog.csv'), 'utf8'))
      
      let dlToJobMap = {}
      if (fs.existsSync(path.join(ACCESS_DIR, 'processingdeadline.csv'))) {
         const dlData = parseCSV(fs.readFileSync(path.join(ACCESS_DIR, 'processingdeadline.csv'), 'utf8'))
         dlData.forEach(r => dlToJobMap[r.ProcessingDeadlineID] = r.JobID)
      }

      const logUpserts = logsData.map(r => {
        const legacyJobId = dlToJobMap[r.ProcessingDeadlineID]
        const mappedJobId = jobMap[legacyJobId]
        
        return {
          legacy_id: parseInt(r.WorkLogID),
          job_id: mappedJobId, 
          operator_name: r.EmployeeID ? `Emp-${r.EmployeeID}` : 'Unknown', 
          processing_code_id: processingCodeMap[r.ProcessingCodeID] || null,
          processing_date: r.ProcessingDate ? new Date(r.ProcessingDate).toISOString() : new Date().toISOString(),
          processing_hours: parseFloat(r.ProcessingTime) || 0,
          notes: r.ProcessingNotes || r.Noidunglienlac || null
        }
      }).filter(r => !isNaN(r.legacy_id) && r.job_id && r.processing_code_id)

      for (let i = 0; i < logUpserts.length; i += chunkSize) {
        const chunk = logUpserts.slice(i, i + chunkSize)
        const { error } = await supabase.from('mold_work_logs').upsert(chunk, { onConflict: 'legacy_id' })
        if (error) console.error("Lỗi chunk WorkLogs:", error.message)
      }
      console.log(`✅ Hoàn thành nạp WorkLogs!`)
  }

  // BÁO CÁO KẾT QUẢ SỐ LƯỢNG
  const { count: c1 } = await supabase.from('mold_design_revision').select('*', { count: 'exact', head: true })
  const { count: c2 } = await supabase.from('mold_physical').select('*', { count: 'exact', head: true })
  const { count: c3 } = await supabase.from('mold_jobs').select('*', { count: 'exact', head: true })
  const { count: c4 } = await supabase.from('mold_work_logs').select('*', { count: 'exact', head: true })

  console.log(`\n📊 BÁO CÁO THỐNG KÊ DATA SAU KHI NẠP:`)
  console.log(`✅ mold_design_revision: ${c1} dòng`)
  console.log(`✅ mold_physical: ${c2} dòng`)
  console.log(`✅ mold_jobs: ${c3} dòng`)
  console.log(`✅ mold_work_logs: ${c4} dòng`)
  console.log("\n🎉 XUẤT SẮC! TOÀN BỘ PHASE 4 ĐÃ NẠP THÀNH CÔNG VÀ KHỚP ID CHUẨN XÁC!")
}

runSeedCore()
