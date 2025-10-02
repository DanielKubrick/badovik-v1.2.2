'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function PendingPaymentPage() {
  const router = useRouter()
  const [copiedItem, setCopiedItem] = useState<string>('')

  // Статические данные для демонстрации дизайна
  const paymentData = {
    orderNumber: '10WOO-2025-00867',
    total: '13844.00',
    currency: 'RUB',
    cardNumber: '4361 5390 0584 4909',
    recipient: 'Пальчиков М.М (Банк Компаньон)',
    paymentDescription: 'Оплата заказа №10WOO-2025-00867'
  }

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(''), 2000)
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(''), 2000)
    }
  }

  const handleClose = () => {
    router.push('/')
  }

  const handlePaymentComplete = () => {
    router.push('/')
  }

  // Инициализация Telegram Web App
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Настройка главной кнопки
      tg.MainButton.setText('Прислать чек')
      tg.MainButton.show()
      tg.MainButton.onClick(handlePaymentComplete)
      
      // Настройка кнопки "Назад"
      tg.BackButton.show()
      tg.BackButton.onClick(handleClose)

      return () => {
        tg.MainButton.hide()
        tg.BackButton.hide()
      }
    }
  }, [router])

  return (
    <div className="telegram-payment-page">
      {/* Заголовок в стиле Telegram */}
      <div className="telegram-header">
        <div className="telegram-header-content">
          <div className="telegram-header-back" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.024 0-1.414s-1.024-.39-1.414 0l-6 6c-.39.39-.39 1.024 0 1.414l6 6c.195.195.451.293.707.293s.512-.098.707-.293c.39-.39.39-1.024 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"/>
            </svg>
          </div>
          <h1 className="telegram-header-title">Оплата заказа</h1>
          <div className="telegram-order-badge">
            №{paymentData.orderNumber}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="telegram-content">
        
        {/* Сообщение об успехе */}
        <div className="telegram-success-section">
          <div className="telegram-success-icon">✅</div>
          <div className="telegram-success-content">
            <h2 className="telegram-success-title">Заказ успешно создан!</h2>
            <p className="telegram-success-subtitle">
              Заказ №{paymentData.orderNumber} • Сумма: {paymentData.total} ₽
            </p>
          </div>
        </div>

        {/* Секция с реквизитами */}
        <div className="telegram-section">
          <div className="telegram-section-header">
            <div className="telegram-section-icon">💳</div>
            <h3 className="telegram-section-title">Реквизиты для оплаты</h3>
          </div>

          {/* Номер карты */}
          <div className="telegram-field">
            <label className="telegram-field-label">Номер карты:</label>
            <div className="telegram-field-row">
              <div className="telegram-field-value telegram-card-number">
                {paymentData.cardNumber}
              </div>
              <button 
                className="telegram-copy-button"
                onClick={() => copyToClipboard(paymentData.cardNumber.replace(/\s/g, ''), 'cardNumber')}
              >
                {copiedItem === 'cardNumber' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
          </div>

          {/* Получатель */}
          <div className="telegram-field">
            <label className="telegram-field-label">Получатель:</label>
            <div className="telegram-field-value">
              {paymentData.recipient}
            </div>
          </div>

          {/* Назначение платежа */}
          <div className="telegram-field">
            <label className="telegram-field-label">Назначение платежа:</label>
            <div className="telegram-field-row">
              <div className="telegram-field-value">
                {paymentData.paymentDescription}
              </div>
              <button 
                className="telegram-copy-button"
                onClick={() => copyToClipboard(paymentData.paymentDescription, 'description')}
              >
                {copiedItem === 'description' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
          </div>

          {/* Сумма к оплате */}
          <div className="telegram-field">
            <label className="telegram-field-label">Сумма к оплате:</label>
            <div className="telegram-field-row">
              <div className="telegram-field-value telegram-amount">
                {paymentData.total} ₽
              </div>
              <button 
                className="telegram-copy-button"
                onClick={() => copyToClipboard(paymentData.total, 'amount')}
              >
                {copiedItem === 'amount' ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        {/* Инфо секция */}
        <div className="telegram-info-section">
          <p className="telegram-info-text">
            После оплаты нажмите кнопку Прислать чек
          </p>
          <p className="telegram-info-subtext">
            Мы проверим платеж и обработаем заказ
          </p>
        </div>

        {/* Fallback кнопка для браузеров */}
        <div className="telegram-fallback-button">
          <button 
            className="telegram-main-button"
            onClick={handlePaymentComplete}
          >
            📄 Прислать чек
          </button>
        </div>
      </div>

      <style jsx>{`
        .telegram-payment-page {
          min-height: 100vh;
          background: var(--tg-theme-bg-color, #ffffff);
          color: var(--tg-theme-text-color, #000000);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .telegram-header {
          background: var(--tg-theme-secondary-bg-color, #f7f7f7);
          border-bottom: 1px solid var(--tg-theme-hint-color, #e5e5e5);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .telegram-header-content {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
        }

        .telegram-header-back {
          width: 24px;
          height: 24px;
          color: var(--tg-theme-link-color, #007aff);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .telegram-header-title {
          flex: 1;
          font-size: 17px;
          font-weight: 600;
          margin: 0;
          color: var(--tg-theme-text-color, #000000);
        }

        .telegram-order-badge {
          background: var(--tg-theme-button-color, #007aff);
          color: var(--tg-theme-button-text-color, #ffffff);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .telegram-content {
          padding: 16px;
          padding-bottom: 80px;
        }

        .telegram-success-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--tg-theme-secondary-bg-color, #f7f7f7);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .telegram-success-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .telegram-success-content {
          flex: 1;
        }

        .telegram-success-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--tg-theme-text-color, #000000);
        }

        .telegram-success-subtitle {
          font-size: 14px;
          color: var(--tg-theme-hint-color, #999999);
          margin: 0;
        }

        .telegram-section {
          background: var(--tg-theme-secondary-bg-color, #f7f7f7);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .telegram-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .telegram-section-icon {
          font-size: 20px;
        }

        .telegram-section-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: var(--tg-theme-text-color, #000000);
        }

        .telegram-field {
          margin-bottom: 16px;
        }

        .telegram-field:last-child {
          margin-bottom: 0;
        }

        .telegram-field-label {
          display: block;
          font-size: 14px;
          color: var(--tg-theme-hint-color, #999999);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .telegram-field-value {
          font-size: 16px;
          color: var(--tg-theme-text-color, #000000);
          line-height: 1.4;
        }

        .telegram-card-number {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .telegram-amount {
          font-size: 20px;
          font-weight: 700;
          color: var(--tg-theme-link-color, #007aff);
        }

        .telegram-field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .telegram-copy-button {
          background: var(--tg-theme-button-color, #007aff);
          color: var(--tg-theme-button-text-color, #ffffff);
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }

        .telegram-copy-button:hover {
          opacity: 0.8;
        }

        .telegram-copy-button:active {
          opacity: 0.6;
        }

        .telegram-info-section {
          text-align: center;
          padding: 20px 0;
        }

        .telegram-info-text {
          font-size: 14px;
          color: var(--tg-theme-hint-color, #999999);
          margin: 0 0 4px 0;
        }

        .telegram-info-subtext {
          font-size: 13px;
          color: var(--tg-theme-hint-color, #999999);
          margin: 0;
        }

        .telegram-fallback-button {
          display: none;
          position: fixed;
          bottom: 20px;
          left: 16px;
          right: 16px;
        }

        .telegram-main-button {
          width: 100%;
          background: var(--tg-theme-button-color, #007aff);
          color: var(--tg-theme-button-text-color, #ffffff);
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Показать fallback кнопку если нет Telegram WebApp */
        @media (max-width: 768px) {
          .telegram-fallback-button {
            display: block;
          }
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .telegram-payment-page {
            background: var(--tg-theme-bg-color, #1c1c1e);
            color: var(--tg-theme-text-color, #ffffff);
          }
        }
      `}</style>
    </div>
  )
}
