import { OrderFormClient } from '@/components/order/OrderFormClient'

export const metadata = {
    title: 'Lập Phiếu Đơn Hàng | YSDMS NextGen',
}

export default async function NewOrderPage() {
    return (
        <OrderFormClient />
    )
}
