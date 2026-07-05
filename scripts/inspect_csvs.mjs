import fs from 'fs'

// These CSVs may be Shift-JIS or UTF-8 with BOM
const files = ['racks.csv', 'racklayers.csv', 'employees.csv', 'destinations.csv']

for (const f of files) {
    const path = `source_data/csv-access-data/${f}`
    try {
        const content = fs.readFileSync(path, 'utf8')
        const lines = content.split('\n').filter(l => l.trim())
        console.log(`\n══════════════════════════════`)
        console.log(`  ${f} — ${lines.length} rows (incl. header)`)
        console.log(`══════════════════════════════`)
        // Print header + first 5 data rows
        for (let i = 0; i < Math.min(6, lines.length); i++) {
            console.log(`  [${i}] ${lines[i].substring(0, 120)}`)
        }
        // Print last row
        if (lines.length > 6) {
            console.log(`  ... (${lines.length - 6} more rows)`)
            console.log(`  [${lines.length-1}] ${lines[lines.length-1].substring(0, 120)}`)
        }
    } catch (e) {
        console.log(`❌ ${f}: ${e.message}`)
    }
}
