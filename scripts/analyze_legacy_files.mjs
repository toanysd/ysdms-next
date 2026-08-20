import fs from 'fs'
import path from 'path'

const files = [
  'src/app/actions/dashboard.ts',
  'src/app/actions/mold-job.ts',
  'src/app/actions/production.ts',
  'src/app/actions/quick-mold-job.ts',
  'src/app/api/production-instructions/[id]/pdf/route.ts',
  'src/app/dashboard/loading-board/_actions/board.ts',
  'src/app/dashboard/page.tsx',
  'src/app/engineering/designs/revisions/[id]/tabs/OverviewTab.tsx',
  'src/app/engineering/designs/revisions/[id]/page.tsx',
  'src/app/engineering/designs/[moldMasterId]/page.tsx',
  'src/app/equipment/aluminum/page.tsx',
  'src/app/equipment/cutting-dies/_components/CuttersClient.tsx',
  'src/app/equipment/cutting-dies/page.tsx',
  'src/app/equipment/dashboard/page.tsx',
  'src/app/equipment/jobs/quick-create/page.tsx',
  'src/app/equipment/jobs/[id]/tabs/EditStepModal.tsx',
  'src/app/equipment/jobs/[id]/tabs/OverviewTab.tsx',
  'src/app/equipment/jobs/[id]/JobDetailHeader.tsx',
  'src/app/equipment/jobs/[id]/page.tsx',
  'src/app/equipment/jobs/page.tsx',
  'src/app/equipment/molds/[id]/tabs/LocationTab.tsx',
  'src/app/equipment/molds/[id]/tabs/TransferTab.tsx',
  'src/app/equipment/_components/detail-modal/modules/CheckInOutModule.tsx',
  'src/app/equipment/_components/detail-modal/modules/LocationMoveModule.tsx',
  'src/app/equipment/_components/detail-modal/CutterDetailView.tsx',
  'src/app/equipment/_components/detail-modal/EquipmentDetailModal.tsx',
  'src/app/master/cutters/new/page.tsx',
  'src/app/master/cutters/page.tsx',
  'src/app/master/products/[id]/tabs/OverviewTab.tsx',
  'src/app/master/products/[id]/page.tsx',
  'src/app/product-center/[id]/_components/SectionEquipment.tsx',
  'src/app/product-center/[id]/_components/TabDesignsEquipment.tsx',
  'src/app/product-center/[id]/_components/TabOverview.tsx',
  'src/app/production/mold-orders/page.tsx',
  'src/app/production/molds/designs/_components/RelocateModal.tsx',
  'src/app/production/molds/_components/MoldDetailPanel.tsx',
  'src/app/production/molds/_components/UnifiedMoldDrawer.tsx',
  'src/app/production/molds/actions.ts',
  'src/app/production/molds/page.tsx',
  'src/app/production/track/[itemId]/page.tsx',
  'src/app/production/KanbanBoard-v8.5.2-1.tsx',
  'src/app/production-instructions/_components/ProductionInstructionPDF.tsx',
  'src/app/reports/daily-worklog/page.tsx',
  'src/app/page.tsx',
  'src/components/equipment/DesignJobsList.tsx',
  'src/components/equipment/DesignPhysicalMoldsList.tsx',
  'src/components/equipment/JobQuickViewDrawer.tsx',
  'src/components/equipment/MoldModal.tsx',
  'src/components/equipment/QuickLinkMoldModal.tsx',
  'src/components/equipment/RealtimeReferencePanel.tsx',
  'src/components/layout/Topbar.tsx',
  'src/components/worklogs/DailyWorklogQuickModal.tsx',
  'src/lib/actions/searchActions.ts',
  'src/lib/utils/moldNaming.ts',
  'src/lib/quotation-engine.ts',
  'src/types/database.types.ts'
]

console.log('=== AUDIT ANALYSIS OF 55 FILES ===')
const results = []

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.log(`[NOT FOUND] ${f}`)
    continue
  }
  const content = fs.readFileSync(f, 'utf8')
  const hasPhysicalMoldsQuery = content.includes(".from('physical_molds')") || content.includes('.from("physical_molds")')
  const hasCuttersQuery = content.includes(".from('cutters')") || content.includes('.from("cutters")')
  const mentionsPhysicalMolds = content.includes('physical_molds')
  const mentionsCutters = content.includes('cutters')
  
  results.push({
    file: f,
    hasPhysicalMoldsQuery,
    hasCuttersQuery,
    mentionsPhysicalMolds,
    mentionsCutters
  })
}

console.log('--- Direct Supabase Query to physical_molds or cutters ---')
results.filter(r => r.hasPhysicalMoldsQuery || r.hasCuttersQuery).forEach(r => {
  console.log(`[DB QUERY] ${r.file} -> physical_molds: ${r.hasPhysicalMoldsQuery}, cutters: ${r.hasCuttersQuery}`)
})

console.log('\n--- Text / Type / Relational Reference Only ---')
results.filter(r => !r.hasPhysicalMoldsQuery && !r.hasCuttersQuery).forEach(r => {
  console.log(`[TEXT/REF] ${r.file} (physical_molds: ${r.mentionsPhysicalMolds}, cutters: ${r.mentionsCutters})`)
})
