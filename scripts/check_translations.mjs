import fs from 'fs';
import path from 'path';

// Helper to flatten nested JSON objects
function flattenObj(obj, parent = '', res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;
    if (typeof obj[key] == 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

// Recursively find all TS/TSX files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function main() {
  const jaPath = path.join('messages', 'ja.json');
  const viPath = path.join('messages', 'vi.json');

  if (!fs.existsSync(jaPath) || !fs.existsSync(viPath)) {
    console.error('❌ Cannot find messages/ja.json or messages/vi.json');
    process.exit(1);
  }

  const jaKeys = Object.keys(flattenObj(JSON.parse(fs.readFileSync(jaPath, 'utf8'))));
  const viKeys = Object.keys(flattenObj(JSON.parse(fs.readFileSync(viPath, 'utf8'))));

  const allFiles = findFiles('src');
  let hasErrors = false;

  console.log('🔍 Scanning files for missing translation keys...');

  const tRegex = /\bt\(\s*['"`]([^'"`]+)['"`]/g;
  const useTranslationsRegex = /useTranslations\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Find namespaces used in the file
    const namespaces = [];
    let match;
    while ((match = useTranslationsRegex.exec(content)) !== null) {
      namespaces.push(match[1]);
    }

    if (namespaces.length === 0) continue; // No translations used in this file

    // For simplicity, if a file has multiple namespaces, we might have false positives if we just check one.
    // Usually it's one namespace per component. If there are multiple, we'll try to find the key in any of the namespace prefixes.
    // If we can't find it, we'll report it.
    
    let tMatch;
    while ((tMatch = tRegex.exec(content)) !== null) {
      const key = tMatch[1];
      
      let foundInJa = false;
      let foundInVi = false;

      for (const ns of namespaces) {
        const fullKey = `${ns}.${key}`;
        if (jaKeys.includes(fullKey)) foundInJa = true;
        if (viKeys.includes(fullKey)) foundInVi = true;
        
        // Sometimes useTranslations is used without namespace, e.g. useTranslations()
        if (ns === '') {
           if (jaKeys.includes(key)) foundInJa = true;
           if (viKeys.includes(key)) foundInVi = true;
        }
      }

      if (!foundInJa || !foundInVi) {
        const missingLang = (!foundInJa && !foundInVi) ? 'JA & VI' : (!foundInJa ? 'JA' : 'VI');
        console.log(`⚠️ Missing in ${missingLang}: Namespace=[${namespaces.join(', ')}] Key='${key}' -> Expected: '${namespaces[0]}.${key}' | File: ${file}`);
        hasErrors = true;
      }
    }
  }

  if (!hasErrors) {
    console.log('✅ All translation keys are properly defined in both ja.json and vi.json');
  } else {
    console.log('\n❌ Please add the missing keys to messages/ja.json and messages/vi.json');
    // process.exit(1); // Don't exit with error code yet so it doesn't break builds, or maybe do if we want strict enforcement.
  }
}

main();
