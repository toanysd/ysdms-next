import fs from 'fs';

const tsContent = fs.readFileSync('src/types/database.types.ts', 'utf8');

// Find the Tables interface/type. Usually it's like:
// export interface Database {
//   public: {
//     Tables: {
//       [tableName: string]: {
//         Row: { ... },
//         Insert: { ... },
//         Update: { ... },
//         Relationships: [...]
//       }
//     }
//   }
// }

const schema = {};
const tableRegex = /\s+([a-zA-Z0-9_]+):\s*\{\n\s+Row:\s*\{([^}]+)\}/g;
let match;
while ((match = tableRegex.exec(tsContent)) !== null) {
  const tableName = match[1];
  const columnsStr = match[2];
  
  const columns = [];
  const colRegex = /([a-zA-Z0-9_]+)\??:\s*(.+)/g;
  let colMatch;
  while ((colMatch = colRegex.exec(columnsStr)) !== null) {
    columns.push({ name: colMatch[1], type: colMatch[2].trim() });
  }
  
  schema[tableName] = columns;
}

fs.writeFileSync('scripts/schema_extracted.json', JSON.stringify(schema, null, 2));
console.log(`Successfully extracted ${Object.keys(schema).length} tables.`);
