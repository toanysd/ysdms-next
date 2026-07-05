import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function patchRackLayers() {
    console.log('═══════════════════════════════════════════')
    console.log('  PATCHING RACK LAYERS FK — Phase 5A')
    console.log('═══════════════════════════════════════════\n')

    // 1. Get Racks Map
    const { data: racks } = await supabase.from('racks').select('id, code')
    const rackMap = {}
    racks.forEach(r => rackMap[r.code] = r.id)
    console.log(`Loaded ${racks.length} racks from DB`)

    // 2. Get Rack Layers Map
    const { data: layers } = await supabase.from('rack_layers').select('*')
    const layerMap = {}
    layers.forEach(l => layerMap[l.code] = l)
    console.log(`Loaded ${layers.length} rack layers from DB`)

    // 3. Read CSV
    const csv = fs.readFileSync('source_data/csv-access-data/racklayers.csv', 'utf8')
    const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('RackLayerID'))
    
    const updates = []
    
    for (const line of lines) {
        const parts = line.split(',')
        if (parts.length >= 4) {
            const layerCode = parts[0].replace(/^\uFEFF/, '').trim()
            const rackCode = parts[1].trim()
            const layerIndex = parseInt(parts[2].trim()) || 1
            const label = parts[3].trim()

            const originalLayer = layerMap[layerCode]
            const rackId = rackMap[rackCode]

            if (originalLayer && rackId) {
                updates.push({
                    ...originalLayer, // include code, description, created_at, id
                    rack_id: rackId,
                    layer_index: layerIndex,
                    label: label || null
                })
            }
        }
    }

    console.log(`Prepared ${updates.length} updates for rack_layers. Batching...`)

    // Batch update
    let success = 0
    let failed = 0
    const BATCH_SIZE = 50

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE)
        const { error } = await supabase.from('rack_layers').upsert(batch, { onConflict: 'id' })
        if (error) {
            console.log(`❌ Batch ${i} failed:`, error.message)
            failed += batch.length
        } else {
            success += batch.length
        }
        process.stdout.write(`\rProgress: ${success + failed}/${updates.length}`)
    }

    console.log('\n\n═══════════════════════════════════════════')
    console.log(`  COMPLETE: ${success} updated, ${failed} failed`)
    console.log('═══════════════════════════════════════════')
}

patchRackLayers()
