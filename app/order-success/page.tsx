import { Suspense } from 'react'
import OrderSuccessContent from './order-success-content'

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Загрузка...</p>
      </div>
    </div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}