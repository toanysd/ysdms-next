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
  // Loại bỏ BOM
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

async function seedTable(csvFile, tableName, mapFn) {
  const filePath = path.join(ACCESS_DIR, csvFile)
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Bỏ qua ${tableName}: Không tìm thấy file ${csvFile}`)
    return
  }

  const rawRows = parseCSV(fs.readFileSync(filePath, 'utf8'))
  const dataToUpsert = rawRows.map(mapFn).filter(r => r.code !== '') // Bỏ dòng rỗng ID

  if (dataToUpsert.length === 0) return;

  console.log(`⏳ Đang nạp ${dataToUpsert.length} record vào bảng ${tableName}...`)
  
  const { error } = await supabase.from(tableName).upsert(dataToUpsert, { onConflict: 'code' })
  
  if (error) {
    console.error(`❌ Lỗi nạp bảng ${tableName}:`, error.message)
  } else {
    console.log(`✅ Nạp thành công bảng ${tableName}!`)
  }
}

async function runSeed() {
  console.log("🚀 BẮT ĐẦU NẠP MASTER DATA KHUÔN LÊN SUPABASE 🚀")

  await seedTable('companies.csv', 'companies', row => ({
    code: row['CompanyID'],
    name: row['CompanyShortName'] || row['CompanyName'] || 'Unknown',
    address: row['CompanyAddress'] || null,
    phone: row['CompanyTEL'] || null,
    is_active: true
  }))

  await seedTable('racklayers.csv', 'rack_layers', row => ({
    code: row['RackLayerID'],
    description: row['RackLayerNotes'] || null
  }))

  await seedTable('itemtype.csv', 'item_types', row => ({
    code: row['ItemTypeID'],
    name: row['ItemTypeName'] || row['ItemType'] || 'Unknown'
  }))

  await seedTable('processingcode.csv', 'processing_codes', row => ({
    code: row['ProcessingCodeID'],
    name: row['ProcessingName'] || 'Unknown',
    description: row['Note'] || null
  }))

  console.log("🎉 HOÀN THÀNH PHASE 3: MASTER DATA ĐÃ ĐƯỢC CHUẨN BỊ!")
}

runSeed()
