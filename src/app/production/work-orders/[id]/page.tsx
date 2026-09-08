export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getWorkOrderDetail, getWorkOrderEquipmentSet, getWorkOrderWorklogs } from '../actions'
import { WorkOrderDetailContent } from './_components/WorkOrderDetailContent'

export default async function WorkOrderDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const { data: wo, error } = await getWorkOrderDetail(params.id)

  if (error || !wo) {
    notFound()
  }

  const { data: equipmentSet } = await getWorkOrderEquipmentSet(params.id)

  const jobIds = (wo.jobs || []).map((j: any) => j.job_id)
  const worklogs = jobIds.length > 0 ? await getWorkOrderWorklogs(jobIds) : []

  return (
    <WorkOrderDetailContent
      wo={wo}
      equipmentSet={equipmentSet}
      worklogs={worklogs}
    />
  )
}
