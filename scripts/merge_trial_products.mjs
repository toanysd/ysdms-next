/**
 * merge_trial_products.mjs
 * Migration: Merge trial products (試作) into parent mass production products
 * 
 * Usage:
 *   node scripts/merge_trial_products.mjs --dry-run   # Preview changes
 *   node scripts/merge_trial_products.mjs              # Execute migration
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// ── Read .env.local ──
const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])
const DRY_RUN = process.argv.includes('--dry-run')

// ── Helper: fetch ALL rows with pagination (Supabase 1000-row limit) ──
async function fetchAll(table, select, filters = {}) {
  let allData = []
  let from = 0
  const PAGE = 1000
  while (true) {
    let query = supabase.from(table).select(select)
    for (const [key, val] of Object.entries(filters)) {
      if (key === 'neq') query = query.neq(val[0], val[1])
      else if (key === 'eq') query = query.eq(val[0], val[1])
    }
    const { data, error } = await query.range(from, from + PAGE - 1)
    if (error) { console.error(`Error fetching ${table}:`, error); break }
    if (!data || data.length === 0) break
    allData = allData.concat(data)
    if (data.length < PAGE) break
    from += PAGE
  }
  return allData
}

// ── Helper: strip D indicator for design_revision parent matching ──
// SMK218DR3 → SMK218R3, MTM001D → MTM001
function extractBaseMassCode(code) {
  if (!code) return ''
  const trimmed = code.trim().toUpperCase().replace(/[\s\-_]/g, '')
  let base = trimmed.replace(/(?<=\d)D(?=R\d+)/, '') // DR3 → R3
  base = base.replace(/(?<=R\d+)D$/, '')               // R3D → R3
  base = base.replace(/(?<=\d)D$/, '')                  // 218D → 218
  return base
}

// ── Helper: extract base product code for PRODUCT merge matching ──
// Strips D and everything after: D, D4, DR3, D4R3 → finds parent product
// PRD-MTM-001D → PRDMTM001, PRD-MTM-001D4 → PRDMTM001, PRD-SMK-210D → PRDSMK210
function extractBaseProductCode(code) {
  if (!code) return ''
  const trimmed = code.trim().toUpperCase().replace(/[\s\-_]/g, '')
  // Strip trailing D + optional digits + optional R+digits
  return trimmed.replace(/D\d*(?:R\d+)?$/, '')
}

// ── Helper: detect if product_code is a trial/prototype product ──
function isTrialProductCode(code) {
  if (!code) return false
  const clean = code.trim().toUpperCase().replace(/[\s\-_]/g, '')

  // Exclude dimensional/frame-size codes containing NxN pattern (e.g. 210X160, 310X210)
  if (/\d+X\d+/i.test(clean)) return false

  // Remove PRD prefix for analysis
  const noPrd = clean.replace(/^PRD/, '')

  // Must have alphabetic prefix (2+ letters) followed by digits, then D suffix
  // Valid: SMK210D, MTM001D4, JAE001DR3, KSE018D7, DIC037DR6
  // Invalid: 6D, 85D (no alpha prefix), TE2 (no D suffix)
  const match = noPrd.match(/^([A-Z]{2,})(\d+)(D\d*(?:R\d+)?)$/)
  return !!match
}

async function main() {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  Merge Trial Products (試作) Migration`)
  console.log(`  Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '⚡ LIVE EXECUTION'}`)
  console.log(`${'='.repeat(60)}\n`)

  // ── Step 1: Fetch ALL products with pagination ──
  const allProducts = await fetchAll('products', 'product_id, product_code, product_name_internal, product_status, company_id', { neq: ['product_status', 'MERGED'] })
  console.log(`📦 Total products fetched: ${allProducts.length}`)

  // ── Step 2: Identify trial products ──
  const trialProducts = allProducts.filter(p => isTrialProductCode(p.product_code))
  console.log(`🧪 Trial products detected: ${trialProducts.length}`)

  if (trialProducts.length === 0) {
    console.log('\n✅ No trial products to merge. Done.')
    return
  }

  // ── Step 3: Build lookup map (compact code → product) ──
  const productByCompactCode = {}
  allProducts.forEach(p => {
    const compact = (p.product_code || '').toUpperCase().replace(/[\s\-_]/g, '')
    productByCompactCode[compact] = p
  })

  let merged = 0
  let skipped = 0
  let noParent = 0
  const results = []
  const orphans = [] // Trial products with no parent

  for (const trial of trialProducts) {
    const trialCompact = (trial.product_code || '').toUpperCase().replace(/[\s\-_]/g, '')
    const baseCode = extractBaseProductCode(trialCompact)
    const parent = productByCompactCode[baseCode]

    if (!parent) {
      orphans.push(trial.product_code)
      noParent++
      continue
    }

    if (parent.product_id === trial.product_id) {
      skipped++
      continue
    }

    console.log(`\n  ✅ MERGE: "${trial.product_code}" → "${parent.product_code}"`)

    // ── 3a. Move design_revisions ──
    const { data: revs } = await supabase
      .from('design_revisions')
      .select('revision_id, design_code, design_category')
      .eq('product_id', trial.product_id)

    const revCount = (revs || []).length
    if (revCount > 0) {
      console.log(`     📐 design_revisions: ${revCount}`)
      for (const r of revs) {
        console.log(`        └─ ${r.design_code || r.revision_id.slice(0, 8)}`)
      }
    }

    if (!DRY_RUN && revs && revs.length > 0) {
      for (const rev of revs) {
        await supabase
          .from('design_revisions')
          .update({
            product_id: parent.product_id,
            design_category: rev.design_category || 'PROTOTYPE_POCKET'
          })
          .eq('revision_id', rev.revision_id)
      }
    }

    // ── 3b. Move order_lines ──
    let orderLineCount = 0
    try {
      const { data: orderLines } = await supabase
        .from('order_lines')
        .select('line_id')
        .eq('product_id', trial.product_id)
      orderLineCount = (orderLines || []).length
      if (orderLineCount > 0) {
        console.log(`     📋 order_lines: ${orderLineCount}`)
        if (!DRY_RUN) {
          for (const ol of orderLines) {
            await supabase.from('order_lines').update({ product_id: parent.product_id }).eq('line_id', ol.line_id)
          }
        }
      }
    } catch (e) { /* order_lines may not have product_id */ }

    // ── 3c. Soft-delete trial product ──
    if (!DRY_RUN) {
      await supabase
        .from('products')
        .update({
          product_status: 'MERGED',
          notes: `[Migration ${new Date().toISOString().slice(0, 10)}] Merged into ${parent.product_code} (${parent.product_id})`
        })
        .eq('product_id', trial.product_id)
    }

    results.push({
      trial: trial.product_code,
      parent: parent.product_code,
      revs: revCount,
      orders: orderLineCount,
    })
    merged++
  }

  // ── Step 4: Fix parent_design_id linkages ──
  if (!DRY_RUN && merged > 0) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log('🔗 Fixing parent_design_id linkages...')

    const allRevs = await fetchAll('design_revisions', 'revision_id, design_code, design_category, parent_design_id, product_id')

    const revsByProduct = {}
    allRevs.forEach(r => {
      if (!revsByProduct[r.product_id]) revsByProduct[r.product_id] = []
      revsByProduct[r.product_id].push(r)
    })

    let fixedLinks = 0
    for (const prodId of Object.keys(revsByProduct)) {
      const list = revsByProduct[prodId]
      const isProtoRev = (r) => r.design_category === 'PROTOTYPE_POCKET' || /D/i.test((r.design_code || '').replace(/^[A-Z]+[-_]?\d+/, ''))
      const protos = list.filter(isProtoRev)
      const masses = list.filter(r => !isProtoRev(r))

      for (const p of protos) {
        const pBase = extractBaseMassCode(p.design_code)
        const matchedMass = masses.find(m => extractBaseMassCode(m.design_code) === pBase)
        if (matchedMass && p.parent_design_id !== matchedMass.revision_id) {
          const { error } = await supabase
            .from('design_revisions')
            .update({ parent_design_id: matchedMass.revision_id })
            .eq('revision_id', p.revision_id)
          if (!error) {
            fixedLinks++
            console.log(`   🔗 ${p.design_code} → parent: ${matchedMass.design_code}`)
          }
        }
      }
    }
    console.log(`   Fixed ${fixedLinks} parent_design_id linkages`)
  }

  // ── Summary ──
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  SUMMARY`)
  console.log(`${'='.repeat(60)}`)
  console.log(`  ✅ Merged:    ${merged}`)
  console.log(`  ⚠️  No parent: ${noParent} (trial-only, kept as standalone)`)
  console.log(`  ⏭️  Skipped:  ${skipped}`)
  console.log(`  📦 Total:     ${trialProducts.length}`)

  if (results.length > 0) {
    console.log('\n  Merge Details:')
    console.table(results)
  }

  if (orphans.length > 0) {
    console.log(`\n  ⚠️  Orphan trial products (no parent found — kept as-is, UI shows "試作のみ"):`)
    orphans.forEach(o => console.log(`     ${o}`))
  }

  if (DRY_RUN) {
    console.log(`\n  ℹ️  DRY RUN — no data changed. Run without --dry-run to execute.`)
  }

  console.log('')
}

main().catch(console.error)
