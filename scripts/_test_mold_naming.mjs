import { isPrototypeDesignOrMold } from '../src/lib/utils/moldNaming.ts'

const testCases = [
  { item: { design_code: 'TDW001R3', design_category: 'MASS_PRODUCTION' }, expected: false, name: 'TDW001R3 with MASS_PRODUCTION DB category' },
  { item: { design_code: 'TDW001R3' }, expected: false, name: 'TDW001R3 fallback (Client TDW contains D)' },
  { item: { design_code: 'TDW001DR2' }, expected: true, name: 'TDW001DR2 fallback (D after sequence 001)' },
  { item: { design_code: 'TDW001DR3' }, expected: true, name: 'TDW001DR3 fallback (D after sequence 001)' },
  { item: { design_code: 'TDW-001D R2' }, expected: true, name: 'TDW-001D R2 fallback (D after hyphenated sequence)' },
  { item: { design_code: 'TDW001R2D' }, expected: true, name: 'TDW001R2D fallback (D at suffix end)' },
  { item: { design_code: 'DIC005R1' }, expected: false, name: 'DIC005R1 fallback (Client DIC contains D)' },
  { item: { design_code: 'JAE-363D' }, expected: true, name: 'JAE-363D fallback' },
  { item: { design_code: 'MCT-004D R1' }, expected: true, name: 'MCT-004D R1 fallback' },
  { item: { mold_type: '試作ポケット' }, expected: true, name: 'Explicit mold_type 試作ポケット' },
  { item: { mold_type: '正規' }, expected: false, name: 'Explicit mold_type 正規' }
]

let passed = 0
for (const tc of testCases) {
  const res = isPrototypeDesignOrMold(tc.item)
  if (res === tc.expected) {
    console.log(`✅ [PASS] ${tc.name} -> ${res}`)
    passed++
  } else {
    console.error(`❌ [FAIL] ${tc.name}: expected ${tc.expected}, got ${res}`)
  }
}

console.log(`\nResults: ${passed}/${testCases.length} tests passed.`)
if (passed !== testCases.length) process.exit(1)
