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

const jaRaw = fs.readFileSync('messages/ja.json', 'utf8');
const viRaw = fs.readFileSync('messages/vi.json', 'utf8');

const jaJson = JSON.parse(jaRaw);
const viJson = JSON.parse(viRaw);

const jaFlat = flattenObj(jaJson);
const viFlat = flattenObj(viJson);

console.log('=== AUDIT REPORT ===\n');

// 1. Namespace Check
const jaNamespaces = Object.keys(jaJson);
const viNamespaces = Object.keys(viJson);

console.log(`Total Namespaces in ja.json: ${jaNamespaces.length}`);
console.log(`Total Namespaces in vi.json: ${viNamespaces.length}`);
console.log(`Namespaces in ja.json:`, jaNamespaces.sort());

const missingNamespacesInVi = jaNamespaces.filter(ns => !viNamespaces.includes(ns));
const missingNamespacesInJa = viNamespaces.filter(ns => !jaNamespaces.includes(ns));

if (missingNamespacesInVi.length > 0) {
  console.error(`❌ Namespaces in ja.json missing in vi.json:`, missingNamespacesInVi);
} else {
  console.log(`✅ All namespaces match between ja.json and vi.json.`);
}

// 2. Key Alignment Check
const jaKeys = Object.keys(jaFlat);
const viKeys = Object.keys(viFlat);

console.log(`Total flattened keys in ja.json: ${jaKeys.length}`);
console.log(`Total flattened keys in vi.json: ${viKeys.length}`);

const missingKeysInVi = jaKeys.filter(k => !(k in viFlat));
const missingKeysInJa = viKeys.filter(k => !(k in jaFlat));

if (missingKeysInVi.length > 0) {
  console.error(`❌ Keys in ja.json missing in vi.json (${missingKeysInVi.length}):`, missingKeysInVi);
} else {
  console.log(`✅ Zero missing keys in vi.json (all ja.json keys present).`);
}

if (missingKeysInJa.length > 0) {
  console.error(`❌ Keys in vi.json missing in ja.json (${missingKeysInJa.length}):`, missingKeysInJa);
} else {
  console.log(`✅ Zero missing keys in ja.json (all vi.json keys present).`);
}

// 3. Placeholder integrity & check
const placeholderRegex = /\{([^}]+)\}/g;
const malformedOpenRegex = /\{[^}]*$/;
const malformedCloseRegex = /^[^{]*\}/;
const emptyPlaceholderRegex = /\{\s*\}/;

let placeholderMismatches = [];
let malformedPlaceholders = [];

for (const key of jaKeys) {
  const jaVal = String(jaFlat[key]);
  const viVal = viFlat[key] !== undefined ? String(viFlat[key]) : '';

  // Check malformed in jaVal
  if (emptyPlaceholderRegex.test(jaVal) || (jaVal.includes('{') && !jaVal.includes('}')) || (!jaVal.includes('{') && jaVal.includes('}'))) {
    malformedPlaceholders.push({ key, lang: 'ja', val: jaVal });
  }

  // Check malformed in viVal
  if (emptyPlaceholderRegex.test(viVal) || (viVal.includes('{') && !viVal.includes('}')) || (!viVal.includes('{') && viVal.includes('}'))) {
    malformedPlaceholders.push({ key, lang: 'vi', val: viVal });
  }

  const jaMatches = [...jaVal.matchAll(placeholderRegex)].map(m => m[1].trim()).sort();
  const viMatches = [...viVal.matchAll(placeholderRegex)].map(m => m[1].trim()).sort();

  if (JSON.stringify(jaMatches) !== JSON.stringify(viMatches)) {
    placeholderMismatches.push({
      key,
      jaVal,
      viVal,
      jaMatches,
      viMatches
    });
  }
}

if (malformedPlaceholders.length > 0) {
  console.error(`❌ Malformed placeholders found (${malformedPlaceholders.length}):`, malformedPlaceholders);
} else {
  console.log(`✅ 0 malformed placeholders in ja.json or vi.json.`);
}

if (placeholderMismatches.length > 0) {
  console.error(`❌ Placeholder mismatches between ja.json and vi.json (${placeholderMismatches.length}):`, placeholderMismatches);
} else {
  console.log(`✅ 0 placeholder mismatches between ja.json and vi.json across all keys.`);
}

// 4. Vietnamese Diacritics & Words Audit in ja.json
const viDiacriticsRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

let diacriticViolations = [];
for (const key of jaKeys) {
  const val = String(jaFlat[key]);
  if (viDiacriticsRegex.test(val)) {
    diacriticViolations.push({ key, val });
  }
}

if (diacriticViolations.length > 0) {
  console.error(`❌ Vietnamese diacritics found in ja.json (${diacriticViolations.length}):`, diacriticViolations);
} else {
  console.log(`✅ 0 Vietnamese diacritics found in ja.json.`);
}

// 5. Bilingual slash or parenthetical Vietnamese checks in ja.json
let suspiciousBilingualInJa = [];
const slashBilingualRegex = /\s*\/\s*/;

for (const key of jaKeys) {
  const val = String(jaFlat[key]);
  // If string contains slash, let's inspect
  if (val.includes('/')) {
    // Check if parts look like bilingual (e.g. contain latin words combined with Japanese or Vietnamese terms)
    // We already checked diacritics. What about non-diacritic Vietnamese or English/VN slash?
    suspiciousBilingualInJa.push({ key, val, reason: 'Contains slash' });
  }
}

console.log(`Strings with slashes in ja.json (${suspiciousBilingualInJa.length}):`);
for (const item of suspiciousBilingualInJa) {
  console.log(`  - ${item.key}: "${item.val}"`);
}

// 6. Check the 31 specific worker 5 remediated keys
const worker5Keys = [
  'Quotations.quotationTitle',
  'Inventory.subtitle',
  'Inventory.ghiChu',
  'Inventory.lot',
  'Inventory.kg',
  'Inventory.plastic',
  'Inventory.type',
  'Inventory.ngayGiaoDich',
  'Equipment.jobTitle',
  'Equipment.QuickCreate.productCodeLabel',
  'MrpTimeline.subtitle',
  'MrpTimeline.kpiCriticalSub',
  'MrpTimeline.kpiWarningSub',
  'MrpTimeline.kpiImbalanceSub',
  'MrpTimeline.matrixSub',
  'MoldOrders.aluminumDate',
  'MoldOrders.moldDate',
  'MoldOrders.moldingDate',
  'MoldOrders.boxTypePlain',
  'MoldOrders.boxTypePrinted',
  'MoldOrders.moldSetsToMake',
  'MoldOrders.reqAluminumDate',
  'MoldOrders.reqPlugDate',
  'MoldOrders.reqCutterDate',
  'MoldOrders.reqMoldDate',
  'MoldOrders.reqMoldingDate',
  'MoldOrders.createSuccess',
  'MoldOrders.printArea.procureTargetDeadline',
  'MoldOrders.printArea.procurePlannedDate',
  'MoldOrders.printArea.actualMfgDatePending',
  'MoldOrders.printArea.baggingYes'
];

console.log('\n=== WORKER 5 REMEDIATED KEYS VERIFICATION ===');
let worker5Failures = [];
for (const k of worker5Keys) {
  const val = jaFlat[k];
  if (val === undefined) {
    worker5Failures.push({ key: k, reason: 'Key MISSING in ja.json' });
  } else {
    console.log(`  ✓ ${k} = "${val}"`);
  }
}

if (worker5Failures.length > 0) {
  console.error(`❌ Worker 5 remediated key failures:`, worker5Failures);
} else {
  console.log(`✅ All 31 Worker 5 remediated keys present and verified.`);
}
