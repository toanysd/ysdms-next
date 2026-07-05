/**
 * 05_improve_codes.mjs — Cải thiện các code generic CO*
 * Bổ sung bảng map: Katakana/Kanji → viết tắt Latin có nghĩa
 *
 * node temp_ai/05_improve_codes.mjs            (preview)
 * node temp_ai/05_improve_codes.mjs --apply
 */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'
const APPLY = process.argv.includes('--apply')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const envLines = fs.readFileSync(path.join(__dirname,'..', '.env.local'), 'utf8').replace(/\r\n/g,'\n').split('\n')
const env = {}; let cur = null
for (const l of envLines) { if (/^[A-Z_]+=/.test(l)) { const i=l.indexOf('='); cur=l.slice(0,i); env[cur]=l.slice(i+1) } }
const URL = env['NEXT_PUBLIC_SUPABASE_URL']?.trim()
const KEY = env['SUPABASE_SERVICE_ROLE_KEY']?.trim()
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }
async function dbFetch(p, opts={}) { const r = await fetch(`${URL}/rest/v1${p}`, {headers:H,...opts}); return r.json() }

// ── Bảng map mở rộng Katakana/Kanji → code viết tắt Latin ────────────────────
const NAME_MAP = [
  // Patterns từ tên trong DB (theo thứ tự ưu tiên)
  [/ホーユー|ホユー/,           'HYU'],
  [/タンゴ/,                   'TNG'],
  [/テルモ/,                   'TRM'],
  [/ニプロ/,                   'NPR'],
  [/メイワ/,                   'MIW'],
  [/ロジスパック/,              'LSP'],
  [/山津/,                     'YMZ'],
  [/東和紙工|東和合成/,         'TWG'],
  [/メタルプラス|ﾒﾀﾙﾌﾟﾗｽ/,     'MTP'],
  [/ムトウ|武藤/,               'MTO'],
  [/プラテクノ|ﾌﾟﾗﾃｸﾉ/,        'PTK'],
  [/レグルス/,                  'RGS'],
  [/村野/,                     'MRN'],
  [/北港商事/,                  'HKS'],
  [/三菱電機/,                  'MTB'],
  [/明治合成|明治/,             'MJI'],
  [/東洋技研|東洋/,             'TYG'],
  [/美鈴紙業/,                  'MSZ'],
  [/八代電機/,                  'YSH'],
  [/和光精機/,                  'WKS'],
  [/高久産業/,                  'TKS'],
  [/ユウエツ|勇越/,             'YET'],
  [/テクノ大西/,               'TKN'],
  [/北信エンジニアリング|北信ｴﾝｼﾞﾆｱﾘﾝｸﾞ/, 'HSE'],
  [/日本ビジネスロジスティクス|日本ﾋﾞｼﾞﾈｽﾛｼﾞｽﾃｨｸｽ/, 'NBL'],
  [/日本ザンパック|日本ｻﾞﾝﾊﾟｯｸ/, 'NZP'],
  [/ハイパックス|ﾊｲﾊﾟｯｸｽ/,      'HPS'],
  [/MARUWA/i,                  'MRW'],
  [/アドバネクス|ｱﾄﾞﾊﾞﾈｸｽ/,    'ADV'],
  [/トープラテクノ|ﾄｰﾌﾟﾗﾃｸﾉ/, 'TPT'],
  [/菊池製作所|菊池/,          'KKC'],
  [/日東電機/,                 'NTD'],
  [/ベスコ|ﾍﾞｽｺ/,              'BES'],
  [/ワンリーフ|ﾜﾝﾘｰﾌ/,         'WLF'],
  [/ミヤカワ|宮川/,             'MYK'],
  [/ナガセ/,                   'NGS'],
  [/BMI/i,                     'BMI'],
  [/いろは機工/,               'IRH'],
  [/リコーインダストリアル|リコー/, 'RCO'],
  [/ティーアールディ|TRD/i,    'TRD'],
  [/松永精密/,                 'MTS'],
  [/ミモテック/,                'MMT'],
  [/山十産業/,                 'YMJ'],
  [/東和電気/,                 'TWD'],
  [/（株）モルテック|モルテック/, 'MLT'],
  [/日本ミクロン/,              'NMC'],
  [/遠州/,                     'ENS'],
  [/丸大/,                     'MRD'],
  [/東和紙工/,                 'TWS'],
  [/プラスセイコー|ﾌﾟﾗｽｾｲｺｰ/,  'PLS'],
  [/林テレンプ/,               'HYS'],
  [/雄信/,                     'YSN'],
]

async function fetchAll() {
  const all = []; let offset = 0
  while (true) {
    const b = await dbFetch(`/companies?select=company_id,company_code,company_name,notes&order=company_id&limit=1000&offset=${offset}`)
    if (!Array.isArray(b) || b.length === 0) break
    all.push(...b); if (b.length < 1000) break; offset += 1000
  }
  return all
}

console.log('\n📦 Tải dữ liệu...')
const all = await fetchAll()
const existingCodes = new Set(all.map(c => c.company_code).filter(Boolean))
const coGeneric = all.filter(c => /^CO[0-9A-Z]{2}-\d{3}$/.test(c.company_code||''))
console.log(`  Tổng: ${all.length} | Generic CO* cần cải thiện: ${coGeneric.length}`)

const usedNew = new Set()
function betterCode(name, existCodes) {
  if (!name) return null
  for (const [pattern, code] of NAME_MAP) {
    if (pattern.test(name)) {
      // Tìm variant chưa dùng
      if (!existCodes.has(code) && !usedNew.has(code)) { usedNew.add(code); return code }
      let s=1, c2
      do { c2=`${code}-${String(s).padStart(3,'0')}`; s++ } while (existCodes.has(c2)||usedNew.has(c2))
      usedNew.add(c2); return c2
    }
  }
  return null // không tìm được code tốt hơn
}

const toFix = []
for (const rec of coGeneric) {
  const better = betterCode(rec.company_name, existingCodes)
  if (better) toFix.push({ rec, newCode: better })
}

console.log(`\n📋 Có thể cải thiện: ${toFix.length} / ${coGeneric.length}`)
toFix.slice(0,20).forEach(({rec, newCode}) =>
  console.log(`  ${rec.company_code.padEnd(12)} → ${newCode.padEnd(10)} | ${rec.company_name?.slice(0,25)}`)
)
const remaining = coGeneric.length - toFix.length
if (remaining > 0) console.log(`  ⚠ Còn ${remaining} records không có map → giữ nguyên CO* (OK - ngắn gọn)`)

if (!APPLY) { console.log('\n⚠️  Preview. Thêm --apply để cập nhật.\n'); process.exit(0) }

let fixed = 0, errors = 0
for (const {rec, newCode} of toFix) {
  existingCodes.add(newCode)
  const res = await dbFetch(`/companies?company_id=eq.${rec.company_id}`, {
    method: 'PATCH',
    body: JSON.stringify({ company_code: newCode, notes: `[CODE_IMPROVED] From: ${rec.company_code}` })
  })
  if (Array.isArray(res) && !res[0]?.error) fixed++
  else errors++
}
console.log(`\n✅ Đã cải thiện: ${fixed} | Lỗi: ${errors}\n`)
