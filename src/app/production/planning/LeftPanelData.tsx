import { getPendingOrderItemsForPlanning } from '@/app/actions/production'
import PendingOrderList from './PendingOrderList'

export default async function LeftPanelData() {
    const items = await getPendingOrderItemsForPlanning()

    return <PendingOrderList initialItems={items} />
}
