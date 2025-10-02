// Утилиты для сохранения и восстановления состояния оплаты

export interface PendingPayment {
  orderId: string;
  orderNumber: string;
  total: string;
  currency: string;
  createdAt: string;
  expiresAt: string;
  paymentDetails?: {
    cardNumber?: string;
    recipient?: string;
    paymentDescription?: string;
  };
}

const PAYMENT_STORAGE_KEY = 'mini-woo-pending-payment';
const PAYMENT_EXPIRY_HOURS = 24; // Платежи истекают через 24 часа

export function savePendingPayment(payment: PendingPayment): void {
  try {
    if (typeof window === 'undefined') return;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + PAYMENT_EXPIRY_HOURS);
    
    const paymentData = {
      ...payment,
      expiresAt: expiresAt.toISOString()
    };
    
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentData));
  } catch (error) {
    console.error('Failed to save pending payment:', error);
  }
}

export function getPendingPayment(): PendingPayment | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!stored) return null;
    
    const payment: PendingPayment = JSON.parse(stored);
    
    // Проверяем не истек ли платеж
    if (new Date() > new Date(payment.expiresAt)) {
      clearPendingPayment();
      return null;
    }
    
    return payment;
  } catch (error) {
    console.error('Failed to get pending payment:', error);
    return null;
  }
}

export function clearPendingPayment(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PAYMENT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear pending payment:', error);
  }
}

export function hasPendingPayment(): boolean {
  return getPendingPayment() !== null;
}
