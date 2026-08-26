import { createClient } from '@/lib/supabase/server'
import OrphanResolutionTab from './_components/OrphanResolutionTab'
import { Database } from '@/types/database.types'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export const dynamic = 'force-dynamic'

export default async function DataSyncPage() {
  const supabase = createClient()
  
  // 1. Fetch DB state
  const { data: dbCompanies } = await supabase
    .from('companies')
    .select('company_id, is_active, is_manually_edited, company_name, company_code')

  const dbMap = new Map()
  dbCompanies?.forEach(c => dbMap.set(c.company_id, c))

  // 2. Read CSV Report
  const csvPath = path.join(process.cwd(), 'src/app/master/data-sync/source_data/company_classification_v4.csv')
  let csvData: any[] = []
  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8')
    csvData = parse(fileContent, { columns: true, skip_empty_lines: true })
  } catch (e) {
    console.error("Failed to read classification CSV", e)
  }

  // 3. Filter unresolved targets
  // An unresolved target is a company in the CSV whose DB state hasn't been fixed yet.
  // - Group 1 (Garbage): Still is_active = true
  // - Group 3 (Active Trans): Still is_manually_edited = false (not promoted to SSOT) and is_active = true
  // - Group 4 (Metadata/Inactive): Still is_active = true

  const unresolved = csvData.filter(row => {
    const dbC = dbMap.get(row.db_company_id)
    if (!dbC) return false // Deleted
    if (!dbC.is_active) return false // Already archived/remapped/hidden
    
    if (row.classification.startsWith("Group 3") && dbC.is_manually_edited) {
      return false // Already promoted to SSOT
    }
    
    return true
  }).map(row => ({
    ...row,
    db_company_code: dbMap.get(row.db_company_id)?.company_code || row.db_company_code,
    db_company_name: dbMap.get(row.db_company_id)?.company_name || row.db_company_name,
  }))

  // 4. Also fetch valid companies for the "Remap To" dropdown
  const { data: validCompanies } = await supabase
    .from('companies')
    .select('company_id, company_name, company_code')
    .eq('is_active', true)
    .order('company_code')

  return (
    <div className="flex flex-col h-full gap-[12px]">
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-[var(--border-color)]">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Data Sync Center (Cứu Hộ Dữ Liệu)</h1>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        <OrphanResolutionTab targets={unresolved} validCompanies={validCompanies || []} />
      </div>
    </div>
  )
}
