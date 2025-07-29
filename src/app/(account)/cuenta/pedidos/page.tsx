import { OrdersList } from '@/components/client/orders-list'

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>
      <OrdersList />
    </div>
  )
}