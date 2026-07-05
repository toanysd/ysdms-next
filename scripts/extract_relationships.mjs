import fs from 'fs';

const tsContent = fs.readFileSync('src/types/database.types.ts', 'utf8');

const tableRegex = /\s{6}([a-zA-Z0-9_]+):\s*\{\s*Row:\s*\{[\s\S]*?\}\s*Insert:\s*\{[\s\S]*?\}\s*Update:\s*\{[\s\S]*?\}\s*(?:Relationships:\s*\[([\s\S]*?)\])?\s*\}/g;

let match;
const relationships = {};

while ((match = tableRegex.exec(tsContent)) !== null) {
  const tableName = match[1];
  const relStr = match[2] || '';
  
  const rels = [];
  const relRegex = /foreignKeyName:\s*"([^"]+)"\s*columns:\s*\[([^\]]+)\]\s*isOneToOne:\s*(true|false)\s*referencedRelation:\s*"([^"]+)"\s*referencedColumns:\s*\[([^\]]+)\]/g;
  
  let relMatch;
  while ((relMatch = relRegex.exec(relStr)) !== null) {
    rels.push({
      fkName: relMatch[1],
      columns: relMatch[2].replace(/"/g, '').trim(),
      referencedRelation: relMatch[4],
      referencedColumns: relMatch[5].replace(/"/g, '').trim()
    });
  }
  
  if (rels.length > 0) {
    relationships[tableName] = rels;
  }
}

fs.writeFileSync('scripts/relationships.json', JSON.stringify(relationships, null, 2));
console.log(`Extracted relationships for ${Object.keys(relationships).length} tables.`);
