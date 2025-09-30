'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, CreditCard, ArrowLeft, Receipt, Package } from 'lucide-react'
import { getOrderFromStorage, clearOrderFromStorage, formatPrice, type OrderData } from '@/lib/order-utils'
import { useToastSuccess, useToastError } from '@/components/ui/ToastContainer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function OrderSuccessContent() {
  const router = useRouter()
  const toastSuccess = useToastSuccess()
  const toastError = useToastError()
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Попытаемся получить данные заказа из localStorage
    const storedOrder = getOrderFromStorage()
    if (storedOrder) {
      setOrderData(storedOrder)
    }
    setLoading(false)
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      
      // Используем наши toast уведомления
      toastSuccess(
        'Скопировано!', 
        'Номер карты скопирован в буфер обмена'
      )
    } catch (err) {
      console.error('Не удалось скопировать:', err)
      
      // Fallback для старых браузеров
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        toastSuccess('Скопировано!', 'Номер карты скопирован в буфер обмена')
      } catch (fallbackError) {
        toastError(
          'Ошибка копирования', 
          'Не удалось скопировать номер карты. Скопируйте вручную: ' + text
        )
      }
    }
  }

  const handleSendReceipt = () => {
    if (!orderData) {
      toastError('Ошибка', 'Данные заказа не найдены')
      return
    }

    try {
      const paymentUrl = `https://badovik.dedyn.io/checkout/order-pay/${orderData.id}/?pay_for_order=true&key=${orderData.key}`
      
      // Проверяем доступность Telegram WebApp API
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(paymentUrl)
        toastSuccess('Переход к оплате', 'Открываем страницу оплаты...')
      } else {
        window.open(paymentUrl, '_blank')
        toastSuccess('Ссылка открыта', 'Страница оплаты открыта в новой вкладке')
      }
    } catch (error) {
      toastError('Ошибка', 'Не удалось открыть страницу оплаты')
    }
  }

  const handleBackToHome = () => {
    // Очищаем данные заказа при уходе со страницы
    clearOrderFromStorage()
    toastSuccess('Возвращаемся', 'Переходим к каталогу товаров')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="telegram-app">
        <div className="telegram-content">
          <div className="text-center py-20">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Загружаем данные заказа...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="telegram-app">
        <div className="telegram-header">
          <button 
            onClick={handleBackToHome}
            className="telegram-back-btn"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="telegram-header-title">Ошибка</h1>
        </div>
        <div className="telegram-content">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-600 mb-6">Данные заказа не найдены</p>
            <p className="text-sm text-gray-500 mb-6">
              Возможно, данные заказа устарели или были очищены
            </p>
            <button 
              onClick={handleBackToHome}
              className="telegram-primary-btn"
            >
              Вернуться к покупкам
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="telegram-app">
      {/* Header */}
      <div className="telegram-header">
        <button 
          onClick={handleBackToHome}
          className="telegram-back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="telegram-header-title">Оплата заказа</h1>
        <div className="telegram-header-count">
          №{orderData.orderNumber}
        </div>
      </div>

      {/* Content */}
      <div className="telegram-content">
        {/* Success Card */}
        <div className="telegram-card telegram-success-card">
          <div className="telegram-success-icon">
            <CheckCircle size={32} />
          </div>
          <div className="telegram-success-content">
            <h2 className="telegram-success-title">
              Заказ успешно создан!
            </h2>
            <p className="telegram-success-subtitle">
              Заказ №{orderData.orderNumber} • Сумма: <span className="telegram-price">{formatPrice(orderData.total, orderData.currency)}</span>
            </p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="telegram-card telegram-payment-card">
          <div className="telegram-card-header">
            <CreditCard className="telegram-card-header-icon" />
            <h3 className="telegram-card-header-title">
              Реквизиты для оплаты
            </h3>
          </div>
          
          <div className="telegram-payment-details">
            {/* Card Number */}
            <div className="telegram-payment-item">
              <div className="telegram-payment-item-content">
                <div className="telegram-payment-item-label">
                  Номер карты:
                </div>
                <div className="telegram-payment-item-value">
                  4361 5390 0584 4909
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard('4361539005844909')}
                className="telegram-copy-btn"
              >
                Копировать
              </button>
            </div>
            
            {/* Recipient */}
            <div className="telegram-payment-item">
              <div className="telegram-payment-item-content">
                <div className="telegram-payment-item-label">
                  Получатель:
                </div>
                <div className="telegram-payment-item-value">
                  Пальчиков М.М (Банк Компаньон)
                </div>
              </div>
            </div>
            
            {/* Purpose */}
            <div className="telegram-payment-item">
              <div className="telegram-payment-item-content">
                <div className="telegram-payment-item-label">
                  Назначение платежа:
                </div>
                <div className="telegram-payment-item-value">
                  Оплата заказа №{orderData.orderNumber}
                </div>
              </div>
            </div>
            
            {/* Amount */}
            <div className="telegram-payment-item">
              <div className="telegram-payment-item-content">
                <div className="telegram-payment-item-label">
                  Сумма к оплате:
                </div>
                <div className="telegram-payment-item-value">
                  {formatPrice(orderData.total, orderData.currency)}
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(orderData.total)}
                className="telegram-copy-btn"
              >
                Копировать
              </button>
            </div>
          </div>
        </div>

        {/* Send Receipt Button */}
        <button 
          onClick={handleSendReceipt}
          className="telegram-primary-btn telegram-send-receipt-btn"
        >
          <Receipt size={20} />
          <span>Прислать чек</span>
        </button>

        {/* Information Card */}
        <div className="telegram-card telegram-info-card">
          <div className="telegram-info-content">
            После оплаты пришлите чек в диалог по кнопке выше. 
            Ваш заказ будет обработан в течение 10 минут. 
            После подтверждения оплаты, менеджер ответит вам в диалоге.
          </div>
        </div>

        {/* Spacer between info and order composition */}
        <div className="telegram-section-spacer"></div>

        {/* Order Details - Improved Design */}
        {orderData.items && orderData.items.length > 0 && (
          <div className="telegram-card telegram-order-composition-card">
            <div className="telegram-card-header">
              <Package className="telegram-card-header-icon" />
              <h3 className="telegram-card-header-title">Состав заказа</h3>
            </div>
            <div className="telegram-order-items-improved">
              {orderData.items.map((item, index) => (
                <div key={index} className="telegram-order-item-improved">
                  <div className="telegram-order-item-main">
                    <h4 className="telegram-order-item-name">{item.name}</h4>
                    <div className="telegram-order-item-calculation">
                      <span className="telegram-order-quantity">{item.quantity} шт.</span>
                      <span className="telegram-order-multiply">×</span>
                      <span className="telegram-order-unit-price">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className="telegram-order-item-subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              {/* Order Total */}
              <div className="telegram-order-total-improved">
                <span className="telegram-order-total-label">Итого:</span>
                <span className="telegram-order-total-amount">
                  {formatPrice(orderData.total, orderData.currency)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
