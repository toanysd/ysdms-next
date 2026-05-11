import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function understandCascade() {
  console.log('═══════════════════════════════════════════')
  console.log('  ROOT CAUSE: KSE- (id 443) has revision!')
  console.log('═══════════════════════════════════════════\n')

  // Base KSE- has revision KSE- (id 00000000-2222-...-443)
  // But our "orphan" detection said this base has NO revision!
  // That means our detection logic was WRONG.
  
  // Wait — our detection got mold_base_id from revisions.
  // KSE- base id = 00000000-1111-0000-0000-000000000443
  // KSE- revision mold_base_id = 00000000-1111-0000-0000-000000000443
  // → They MATCH. So this base HAS a revision. Why did our filter miss it?
  
  // Answer: Supabase pagination! We only fetched 4559 revisions but there might be more.
  // OR: the Set comparison failed on UUID format.
  
  // Let me verify:
  const { data: revs } = await supabase
    .from('mold_design_revision')
    .select('mold_base_id')
    .eq('mold_base_id', '00000000-1111-0000-0000-000000000443')
  console.log('Direct query for 443:', revs)

  // Count ALL revisions
  const { count: totalRevs } = await supabase
    .from('mold_design_revision')
    .select('*', { count: 'exact', head: true })
  console.log('Total revisions:', totalRevs)

  // Check: did our .select('mold_base_id') actually return ALL 4559?
  const { data: allRevIds } = await supabase
    .from('mold_design_revision')
    .select('mold_base_id')
  console.log('Fetched rev ids count:', allRevIds?.length)
  // If this is < 4559, we have a pagination problem!
  
  // Supabase default limit is 1000. We need to paginate!
  let allRevsPaginated = []
  let offset = 0
  while (true) {
    const { data } = await supabase
      .from('mold_design_revision')
      .select('mold_base_id')
      .range(offset, offset + 999)
    if (!data || data.length === 0) break
    allRevsPaginated = allRevsPaginated.concat(data)
    offset += 1000
  }
  console.log('Paginated rev ids count:', allRevsPaginated.length)
  
  const baseIdsWithRev = new Set(allRevsPaginated.map(r => r.mold_base_id))
  console.log('Unique base_ids with revision:', baseIdsWithRev.size)
  console.log('Contains 443?', baseIdsWithRev.has('00000000-1111-0000-0000-000000000443'))
}

understandCascade()
