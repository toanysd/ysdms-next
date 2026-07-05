import fs from 'fs';
import path from 'path';

// --- CẤU HÌNH ĐƯỜNG DẪN (TÙY CHỈNH TẠI ĐÂY) ---
// Ngài có thể đổi tên thư mục trong dấu ngoặc kép bên dưới
const DEFAULT_ACCESS_DIR = 'source_data/csv-access-data';
const DEFAULT_WEB_DIR = 'source_data/csv-web-data';
const DEFAULT_OUTPUT_DIR = 'source_data/csv-merged_output';

// Lấy đường dẫn từ tham số dòng lệnh (nếu có truyền vào), nếu không sẽ dùng mặc định
const ACCESS_DIR = path.resolve(process.cwd(), process.argv[2] || DEFAULT_ACCESS_DIR);
const WEB_DIR = path.resolve(process.cwd(), process.argv[3] || DEFAULT_WEB_DIR);
const OUTPUT_DIR = path.resolve(process.cwd(), process.argv[4] || DEFAULT_OUTPUT_DIR);

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Hàm đọc CSV siêu tốc cơ bản (có xử lý ngoặc kép)
function parseCSV(content) {
    const contentClean = content.replace(/^\uFEFF/, '');
    const lines = contentClean.split(/\r?\n/).filter(l => l.trim() !== '');
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
            headers.forEach((h, idx) => { rowObj[h.trim()] = parsed[idx] !== undefined ? parsed[idx].trim() : ''; });
            rows.push(rowObj);
        }
    }
    return { headers, rows };
}

// Hàm ghi CSV
function writeCSV(filePath, headers, rows) {
    const escape = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val);
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += headers.map(h => escape(row[h])).join(',') + '\n';
    });
    fs.writeFileSync(filePath, csvContent, 'utf8');
}

async function mergeData() {
    console.log("🚀 KHỞI ĐỘNG SMART CSV MERGER 🚀");

    // 1. TẢI DATACHANGEHISTORY (Nguồn thay đổi Master từ Web)
    const historyPath = path.join(WEB_DIR, 'datachangehistory.csv');
    let changes = [];
    if (fs.existsSync(historyPath)) {
        const histData = parseCSV(fs.readFileSync(historyPath, 'utf8'));
        changes = histData.rows;
        console.log(`✅ Đã nạp ${changes.length} record thay đổi từ datachangehistory.csv`);
    } else {
        console.log(`⚠️ Không tìm thấy datachangehistory.csv trong thư mục.`);
    }

    // 2. PATCH BẢNG MOLDS VÀ CUTTERS
    const patchTable = (tableName, idField) => {
        const filePath = path.join(ACCESS_DIR, `${tableName}.csv`);
        if (!fs.existsSync(filePath)) return;
        
        const data = parseCSV(fs.readFileSync(filePath, 'utf8'));
        let patchCount = 0;

        // Tìm các thay đổi áp dụng cho bảng này
        const tableChanges = changes.filter(c => c.TableName === tableName);
        
        // Sắp xếp thay đổi theo thời gian (cũ -> mới) để ghi đè đúng thứ tự
        tableChanges.sort((a, b) => new Date(a.ChangedAt) - new Date(b.ChangedAt));

        // Build index để tra cứu dòng siêu tốc
        const rowMap = new Map();
        data.rows.forEach(r => rowMap.set(r[idField], r));

        tableChanges.forEach(change => {
            const row = rowMap.get(change.RecordID);
            if (row) {
                // LUẬT: KHÔNG ghi đè giá trị rỗng nếu Access đang có giá trị (Tránh mất data)
                const isNewValueEmpty = change.NewValue === '' || change.NewValue === null;
                const isAccessValueHasData = row[change.FieldName] !== '' && row[change.FieldName] !== null;
                
                if (isNewValueEmpty && isAccessValueHasData && change.ChangeSource !== 'explicit_delete') {
                    // Bỏ qua không patch
                } else {
                    row[change.FieldName] = change.NewValue;
                    patchCount++;
                }
            }
        });

        // Xuất file đã patch
        writeCSV(path.join(OUTPUT_DIR, `${tableName}.csv`), data.headers, data.rows);
        console.log(`🛠 Đã patch thành công ${patchCount} ô dữ liệu vào bảng ${tableName}.csv`);
    };

    patchTable('molds', 'MoldID');
    patchTable('tblCutter', 'CutterID'); // Access có thể xuất ra tblCutter.csv hoặc cutters.csv tùy cấu hình
    patchTable('cutters', 'CutterID');

    // 3. MERGE CÁC BẢNG LOG (Gộp dòng của Access và Web)
    const mergeLogTables = (fileName, idField) => {
        const accessPath = path.join(ACCESS_DIR, fileName);
        // Ưu tiên đọc file web từ thư mục web_data, nếu ko có thì tìm trong access dir (trường hợp user dồn chung)
        const webPath = fs.existsSync(path.join(WEB_DIR, fileName)) ? path.join(WEB_DIR, fileName) : path.join(ACCESS_DIR, `web_${fileName}`);
        
        if (!fs.existsSync(accessPath)) return;
        
        const accessData = parseCSV(fs.readFileSync(accessPath, 'utf8'));
        const headers = accessData.headers;
        const rowMap = new Map();
        
        // Nạp data Access
        accessData.rows.forEach(r => rowMap.set(r[idField], r));

        // Nạp data Web (Ghi đè hoặc thêm mới)
        let webNewCount = 0;
        if (fs.existsSync(webPath)) {
            const webData = parseCSV(fs.readFileSync(webPath, 'utf8'));
            webData.rows.forEach(r => {
                if (!rowMap.has(r[idField])) {
                    webNewCount++;
                }
                // Web luôn đúng với log, nên ghi đè/thêm vào map
                rowMap.set(r[idField], r);
            });
        }

        const mergedRows = Array.from(rowMap.values());
        writeCSV(path.join(OUTPUT_DIR, fileName), headers, mergedRows);
        console.log(`🔗 Gộp ${fileName}: Đã thêm ${webNewCount} dòng mới từ Web. Tổng số dòng: ${mergedRows.length}`);
    };

    mergeLogTables('locationlog.csv', 'LocationLogID');
    mergeLogTables('statuslogs.csv', 'StatusLogID');
    mergeLogTables('teflonlog.csv', 'TeflonLogID');
    mergeLogTables('shiplog.csv', 'ShipLogID');

    // Copy các file không cần merge (Master data giữ nguyên từ Access)
    const filesToCopy = [
        'moldmaster.csv', 'molddesign.csv', 'moldrevision.csv', 'tray.csv', 
        'companies.csv', 'customers.csv', 'worklog.csv', 'jobs.csv', 
        'employees.csv', 'racks.csv', 'racklayers.csv', 'itemtype.csv',
        'plastic_master.csv', 'processingdeadline.csv', 'processingstatus.csv'
    ];
    let copyCount = 0;
    filesToCopy.forEach(f => {
        const src = path.join(ACCESS_DIR, f);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(OUTPUT_DIR, f));
            copyCount++;
        }
    });
    console.log(`📂 Đã copy thẳng ${copyCount} bảng Master Data từ Access sang Output.`);

    console.log(`\n🎉 HOÀN THÀNH! Dữ liệu đã được gộp hoàn chỉnh và an toàn tại thư mục: source_data/merged_output/`);
}

mergeData();
