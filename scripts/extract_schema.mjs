import fs from 'fs';

const file = fs.readFileSync('src/types/database.types.ts', 'utf-8');
const lines = file.split('\n');

let inTables = false;
const tables = {};
let currentTable = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Tables: {')) {
        inTables = true;
        continue;
    }
    if (inTables && line.match(/^\s{6}\w+:\s*{/)) {
        currentTable = line.trim().replace(':', '').replace('{', '').trim();
        tables[currentTable] = [];
    } else if (inTables && currentTable && line.includes('Row: {')) {
        let j = i + 1;
        while (j < lines.length && !lines[j].includes('}')) {
            const colMatch = lines[j].match(/^\s{10}(\w+)\??:\s*(.*)/);
            if (colMatch) {
                tables[currentTable].push({ name: colMatch[1], type: colMatch[2].trim() });
            }
            j++;
        }
        currentTable = null; // Done with this table's Row
    }
    
    // Simplistic stop condition
    if (inTables && line.includes('Views: {')) {
        break;
    }
}

fs.writeFileSync('scripts/schema_extracted.json', JSON.stringify(tables, null, 2));
console.log(`Extracted ${Object.keys(tables).length} tables.`);
