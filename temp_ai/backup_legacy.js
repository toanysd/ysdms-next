const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://iirezrszalmecsslbruo.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);
const backupDir = "temp_ai/backup_legacy";
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

async function backupTable(tableName) {
    console.log(`Backing up ${tableName}...`);
    let offset = 0;
    const pageSize = 1000;
    let allData = [];
    while (true) {
        const { data, error } = await supabase.from(tableName).select('*').range(offset, offset + pageSize - 1);
        if (error) {
            console.error(error);
            break;
        }
        if (data.length === 0) break;
        allData = allData.concat(data);
        if (data.length < pageSize) break;
        offset += pageSize;
    }
    
    if (allData.length > 0) {
        fs.writeFileSync(`${backupDir}/${tableName}_backup.json`, JSON.stringify(allData, null, 2));
        console.log(`Backed up ${allData.length} rows to ${backupDir}/${tableName}_backup.json`);
    } else {
        console.log(`No data in ${tableName}`);
    }
}

async function main() {
    await backupTable('physical_molds');
    await backupTable('cutters');
}
main();

