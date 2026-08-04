import fs from 'fs';
import path from 'path';

// Regex for Vietnamese diacritics
const vnDiacriticsRegex = /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]/;

// Regex for Japanese characters (Hiragana, Katakana, Kanji)
const jpRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

// Regex for hardcoded classes
const classRegex = /className=["'`].*?\b(ja|vi|label-ja|label-vi)\b.*?["'`]/;

// Recursively find all TS/TSX files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file === 'actions' || file === 'api') continue;
      findFiles(filePath, fileList);
    } else if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && !file.endsWith('actions.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function main() {
  const allFiles = findFiles('src');
  let hasHardcoded = false;

  console.log('🔍 Scanning files for hardcoded bilingual text...');

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    let inCommentBlock = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Remove block comments /* ... */ and line comments // ...
      let codeLine = line.replace(/\/\*[\s\S]*?\*\//g, '');
      const slashIdx = codeLine.indexOf('//');
      if (slashIdx !== -1) {
        codeLine = codeLine.substring(0, slashIdx);
      }
      const codeTrimmed = codeLine.trim();
      if (!codeTrimmed) return;

      let flagged = false;
      let reason = '';

      // 1. Check for legacy classes
      if (classRegex.test(codeLine)) {
        flagged = true;
        reason = 'Legacy CSS class (ja/vi/label-ja/label-vi)';
      } 
      // 2. Check for Vietnamese text NOT inside a translation function or import/export
      // Exclude lines with t(, console.log, Error, require, import
      else if (
        vnDiacriticsRegex.test(codeLine) && 
        !codeLine.includes('t(') && 
        !codeLine.includes('console.') && 
        !codeLine.includes('Error(') &&
        !codeLine.includes('import ') &&
        !codeLine.includes('export ') &&
        !codeTrimmed.startsWith('*') // JSDoc
      ) {
        // Specifically look for slash patterns "JP / VN" or "VN / JP"
        if (jpRegex.test(codeLine) && codeLine.includes('/')) {
          flagged = true;
          reason = 'Bilingual text with slash (JP / VN)';
        } else {
          flagged = true;
          reason = 'Raw Vietnamese text (might need translation)';
        }
      }

      if (flagged) {
        console.log(`\n⚠️ [${reason}] in ${file}:${lineNum}`);
        console.log(`   > ${trimmed}`);
        hasHardcoded = true;
      }
    });
  }

  if (!hasHardcoded) {
    console.log('\n✅ No hardcoded bilingual text found!');
  } else {
    console.log('\n❌ Please review the files above and replace hardcoded text with next-intl t()');
    process.exit(1);
  }
}

main();
