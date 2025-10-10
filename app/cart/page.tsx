'use client'

import { useCart } from "../../components/cart/store";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastSuccess, useToastError } from "@/components/ui/ToastContainer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

const formatPrice = (price: number): string => {
  if (price === 0) return 'Уточнить цену';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price).replace('₽', '').trim() + ' ₽';
};

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const items = Object.values(cart.items);
  const totalCount = cart.count();
  const totalPrice = cart.total();

  const handleIncrement = async (id: number) => {
    try {
      await cart.inc(id);
    } catch (error) {
      toastError('Ошибка', 'Не удалось обновить количество товара');
    }
  };

  const handleDecrement = async (id: number) => {
    try {
      await cart.dec(id);
    } catch (error) {
      toastError('Ошибка', 'Не удалось обновить количество товара');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await cart.remove(id);
      toastSuccess('Товар удален', 'Товар успешно удален из корзины');
    } catch (error) {
      toastError('Ошибка', 'Не удалось удалить товар');
    }
  };

  const handleCheckout = () => {
    // Переходим на новую страницу checkout
    router.push('/checkout');
  };

  return (
    <div className="telegram-app">
      {/* Header */}
      <div className="telegram-header">
        <button 
          onClick={() => router.back()}
          className="telegram-back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="telegram-header-title">Корзина</h1>
        {totalCount > 0 && (
          <span className="telegram-header-count">
            {totalCount}
          </span>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        /* Empty State */
        <div className="telegram-empty-state">
          <div className="telegram-empty-icon">🛒</div>
          <div className="telegram-empty-text">Корзина пуста</div>
          <div className="telegram-empty-hint">
            Добавьте товары из каталога
          </div>
          <button
            onClick={() => router.push('/')}
            className="telegram-empty-button"
          >
            Перейти к покупкам
          </button>
        </div>
      ) : (
        /* Cart Items */
        <div className="telegram-content">
          <div className="telegram-cart-items">
            {items.map((item) => (
              <div key={item.id} className="telegram-cart-item">
                {/* Product Image */}
                <div className="telegram-cart-item-image">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} // Добавлен alt атрибут
                      className="telegram-product-image"
                      width={80} // Укажите подходящую ширину
                      height={80} // Укажите подходящую высоту
                    />
                  ) : (
                    <div className="telegram-product-image-placeholder">
                      📦
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="telegram-cart-item-info">
                  <h3 className="telegram-product-title">
                    {item.name}
                  </h3>
                  <div className="telegram-price">
                    {formatPrice(item.price)}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="telegram-cart-item-controls">
                    <div className="telegram-quantity-controls">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="telegram-quantity-btn telegram-quantity-minus"
                        disabled={cart.loading}
                      >
                        {cart.loading ? <LoadingSpinner size="small" /> : <Minus size={16} />}
                      </button>
                      <span className="telegram-quantity-value">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="telegram-quantity-btn telegram-quantity-plus"
                        disabled={cart.loading}
                      >
                        {cart.loading ? <LoadingSpinner size="small" /> : <Plus size={16} />}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="telegram-remove-btn"
                      disabled={cart.loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom - Total & Checkout */}
      {items.length > 0 && (
        <div className="telegram-sticky-cart-bar">
          <div className="telegram-cart-summary">
            <div className="telegram-cart-info">
              <ShoppingCart className="telegram-cart-bar-icon" />
              <span className="telegram-cart-count">Итого: {totalCount} товаров</span>
              <span className="telegram-price-total">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.loading || totalCount === 0}
              className="telegram-cart-button"
            >
              {cart.loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Загрузка...</span>
                </>
              ) : (
                'Оформить заказ'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
