import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Đọc pseudo-dotenv đơn giản vì Node JS có thể chưa cài gói dotenv
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env.local')

const envConfig = fs.readFileSync(envPath, 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        envKeys[match[1]] = match[2].trim()
    }
})

const supabaseUrl = envKeys['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envKeys['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE env vars!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function upload() {
    const jsonPath = path.join(__dirname, '../source_data/tray_data_trays_upsert.json')
    console.log('Reading data from', jsonPath)
    if (!fs.existsSync(jsonPath)) {
        console.error('Error: file JSON does not exist!')
        process.exit(1)
    }
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    const dataMap = new Map()
    rawData.forEach(r => {
        if (r.part_no) dataMap.set(r.part_no, r)
    })
    const data = Array.from(dataMap.values())
    console.log(`Loaded ${rawData.length} raw records, deduplicated to ${data.length}. Uploading chunks of 1000...`)

    const chunkSize = 1000
    let successCount = 0
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize)

        // Add timestamps and parse numerical fields safely
        const numericFields = ['thickness', 'outer_length', 'outer_width', 'height', 'cavity_rows', 'cavity_cols', 'cavity_count', 'pitch_l', 'pitch_w'];
        const dbRows = chunk.map(r => {
            let row = { ...r }
            for (const field of numericFields) {
                if (row[field] !== undefined && row[field] !== null) {
                    const originalStr = String(row[field]).trim();
                    const match = originalStr.match(/^[0-9.]+/);
                    row[field] = match ? parseFloat(match[0]) : null;
                    if (match && match[0] !== originalStr) {
                        const extraNote = `[${field}: ${originalStr}]`;
                        row.note = row.note ? `${row.note} | ${extraNote}` : extraNote;
                    }
                } else {
                    row[field] = null;
                }
            }

            // Map variables manually to product_master V2 Schema 
            let extraJson = {
                height: row.height,
                cavity_rows: row.cavity_rows,
                cavity_cols: row.cavity_cols,
                pitch_l: row.pitch_l,
                pitch_w: row.pitch_w
            };

            let remarksVal = row.note ? row.note : '';
            remarksVal += ' | Extended: ' + JSON.stringify(extraJson);

            // Tự động set name nếu thiếu vì code thì có constraint NOT NULL name
            let nameVal = row.part_name;
            if (!nameVal || nameVal === '') {
                nameVal = row.part_no;
            }

            return {
                code: row.part_no,
                customer_code: row.customer_code || null,
                name: nameVal,
                material: row.material,
                thickness: row.thickness,
                p_length: row.outer_length,
                p_width: row.outer_width,
                quantity_per_box: row.cavity_count,
                remarks: remarksVal,
                spec_ext: extraJson,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        })

        // push!
        const { data: result, error } = await supabase.from('product_master').upsert(dbRows, { onConflict: 'code' })
        if (error) {
            console.error(`Error on chunk ${i} - ${i + chunkSize}:`, error)
            process.exit(1)
        }
        successCount += chunk.length
        console.log(`Uploaded ${successCount} / ${data.length}`)
    }
    console.log('✅ All chunks uploaded effectively via API!')
}

upload().catch(console.error)
