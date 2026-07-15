import { createClient } from '@supabase/supabase-js'
import * as xlsx from 'xlsx'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDeliverySites() {
  console.log('Reading Excel file...')
  const filePath = 'source_data/生産指示書/A. 納入先一覧表.xlsx'
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[1] // The second sheet contains the list
  const sheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json<any>(sheet, { header: 1, defval: null })

  // Skip header row
  const rows = data.slice(1)

  const sites = new Map<string, any>()
  let count = 0

  console.log(`Found ${rows.length} rows in Excel. Processing...`)

  const { data: defaultCompany } = await supabase.from('companies').select('company_id').limit(1).single()
  const defaultCompanyId = defaultCompany?.company_id

  if (!defaultCompanyId) {
    console.error('No companies found in database. Cannot insert delivery sites.')
    process.exit(1)
  }

  for (const row of rows) {
    let siteCode = row[0]?.toString()?.trim()
    if (!siteCode) continue

    // Deal with 888 and 999
    const isPlaceholder = siteCode === '888' || siteCode === '999'

    // Clean up text
    const cleanText = (val: any) => {
      if (!val || val === '*') return null
      return String(val).trim()
    }

    const siteName = cleanText(row[1]) || (isPlaceholder ? 'Placeholder' : 'Unknown')
    const address = cleanText(row[2])
    const requesterName = cleanText(row[3])
    const contactPerson = cleanText(row[4])
    const phone = cleanText(row[5])
    const fax = cleanText(row[6])

    // Deduplicate by siteCode
    if (!sites.has(siteCode)) {
      sites.set(siteCode, {
        company_id: defaultCompanyId,
        site_code: siteCode,
        site_name: siteName,
        site_address: address,
        requester_name: requesterName,
        contact_person: contactPerson,
        site_tel: phone,
        site_fax: fax,
        is_placeholder: isPlaceholder
      })
    }
  }

  const sitesArray = Array.from(sites.values())
  console.log(`Prepared ${sitesArray.length} unique delivery sites to insert.`)

  const { data: existingData } = await supabase.from('delivery_sites').select('site_code')
  const existingCodes = new Set(existingData?.map(d => d.site_code) || [])
  
  const newSites = sitesArray.filter(s => !existingCodes.has(s.site_code))
  console.log(`Found ${newSites.length} new delivery sites to insert.`)

  const batchSize = 200
  for (let i = 0; i < newSites.length; i += batchSize) {
    const batch = newSites.slice(i, i + batchSize)
    const { error } = await supabase
      .from('delivery_sites')
      .insert(batch)

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message)
    } else {
      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} records)`)
      count += batch.length
    }
  }

  console.log(`Seed completed! Inserted/Upserted ${count} records.`)
}

seedDeliverySites().catch(console.error)
