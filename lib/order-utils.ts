/**
 * Утилиты для работы с заказами
 */

/**
 * Генерирует номер заказа на основе ID из WooCommerce в формате MMWOO-YYYY-ID
 * MM - месяц (01-12)
 * WOO - константа магазина
 * YYYY - год
 * ID - ID заказа из WooCommerce
 */
export function generateOrderNumber(wooCommerceId?: number): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  
  if (wooCommerceId) {
    // Используем ID из WooCommerce для синхронизации
    return `${month}WOO-${year}-${String(wooCommerceId).padStart(5, '0')}`
  } else {
    // Fallback: генерируем случайный номер если ID недоступен
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    return `${month}WOO-${year}-${randomNum}`
  }
}

/**
 * Генерирует уникальный ключ заказа для безопасности
 */
export function generateOrderKey(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Интерфейс для данных заказа
 */
export interface OrderData {
  id: string
  orderNumber: string
  key: string
  total: string
  currency: string
  status: string
  createdAt: string
  items: Array<{
    id: number
    name: string
    quantity: number
    price: number
  }>
  billing: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
  }
}

/**
 * Сохраняет данные заказа в localStorage для использования на странице успеха
 */
export function saveOrderToStorage(orderData: OrderData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentOrder', JSON.stringify(orderData))
  }
}

/**
 * Получает данные заказа из localStorage
 */
export function getOrderFromStorage(): OrderData | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('currentOrder')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error parsing stored order:', error)
    return null
  }
}

/**
 * Очищает данные заказа из localStorage
 */
export function clearOrderFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentOrder')
  }
}

/**
 * Форматирует цену для отображения
 */
export function formatPrice(price: number | string, currency: string = 'RUB'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (currency === 'RUB') {
    return `${numPrice.toFixed(0)} ₽`
  }
  
  return `${numPrice.toFixed(2)} ${currency}`
}
