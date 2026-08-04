import fs from 'fs';
import path from 'path';

function flattenObj(obj, parent = '', res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

function verifySymmetry() {
  const jaPath = path.join('messages', 'ja.json');
  const viPath = path.join('messages', 'vi.json');

  if (!fs.existsSync(jaPath) || !fs.existsSync(viPath)) {
    console.error('❌ Cannot find messages/ja.json or messages/vi.json');
    process.exit(1);
  }

  const jaRaw = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
  const viRaw = JSON.parse(fs.readFileSync(viPath, 'utf8'));

  const jaFlat = flattenObj(jaRaw);
  const viFlat = flattenObj(viRaw);

  const jaKeys = Object.keys(jaFlat);
  const viKeys = Object.keys(viFlat);

  const jaKeySet = new Set(jaKeys);
  const viKeySet = new Set(viKeys);

  const missingInVi = jaKeys.filter(k => !viKeySet.has(k));
  const missingInJa = viKeys.filter(k => !jaKeySet.has(k));

  const emptyInJa = jaKeys.filter(k => typeof jaFlat[k] !== 'string' || jaFlat[k].trim() === '');
  const emptyInVi = viKeys.filter(k => typeof viFlat[k] !== 'string' || viFlat[k].trim() === '');

  console.log('==================================================');
  console.log('📊 DICTIONARY KEY SYMMETRY & INTEGRITY AUDIT');
  console.log('==================================================');
  console.log(`🇯🇵 Total JA Keys  : ${jaKeys.length}`);
  console.log(`🇻🇳 Total VI Keys  : ${viKeys.length}`);
  console.log(`❌ Missing in VI   : ${missingInVi.length}`);
  console.log(`❌ Missing in JA   : ${missingInJa.length}`);
  console.log(`⚠️ Empty values in JA: ${emptyInJa.length}`);
  console.log(`⚠️ Empty values in VI: ${emptyInVi.length}`);
  console.log('==================================================');

  let failed = false;

  if (missingInVi.length > 0) {
    console.error('\n🔴 Keys present in ja.json but MISSING in vi.json:');
    missingInVi.forEach(k => console.error(`  - ${k}`));
    failed = true;
  }

  if (missingInJa.length > 0) {
    console.error('\n🔴 Keys present in vi.json but MISSING in ja.json:');
    missingInJa.forEach(k => console.error(`  - ${k}`));
    failed = true;
  }

  if (emptyInJa.length > 0) {
    console.error('\n🔴 Empty/invalid values in ja.json:');
    emptyInJa.forEach(k => console.error(`  - ${k}: "${jaFlat[k]}"`));
    failed = true;
  }

  if (emptyInVi.length > 0) {
    console.error('\n🔴 Empty/invalid values in vi.json:');
    emptyInVi.forEach(k => console.error(`  - ${k}: "${viFlat[k]}"`));
    failed = true;
  }

  if (!failed && jaKeys.length === viKeys.length) {
    console.log(`✅ PERFECT KEY SYMMETRY! 100% matching across all ${jaKeys.length} keys with zero missing and zero empty values.`);
    process.exit(0);
  } else {
    console.error(`\n❌ KEY SYMMETRY AUDIT FAILED!`);
    process.exit(1);
  }
}

verifySymmetry();
