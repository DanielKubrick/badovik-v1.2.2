import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveOrderToStorage, type OrderData } from "@/lib/order-utils";

type Item = { 
  id: number; 
  name: string; 
  price: number; 
  image?: string; 
  qty: number;
  key?: string;
};

interface BillingInfo {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

type CartState = {
  items: Record<number, Item>;
  loading: boolean;
  orderLoading: boolean;
  
  // Actions
  add: (p: Omit<Item, "qty">, qty?: number) => Promise<void>;
  inc: (id: number) => Promise<void>;
  dec: (id: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  clear: () => void;
  
  // Order creation
  createOrder: (billingInfo: BillingInfo, customerNote?: string) => Promise<{ success: boolean; orderData?: OrderData; error?: string }>;
  
  // Computed
  count: () => number;
  total: () => number;
  isEmpty: () => boolean;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      loading: false,
      orderLoading: false,
      
      add: async (product, qty = 1) => {
        try {
          set({ loading: true });
          
          const { items } = get();
          const existingItem = items[product.id];
          
          if (existingItem) {
            // Увеличиваем количество если товар уже есть
            set({
              items: {
                ...items,
                [product.id]: {
                  ...existingItem,
                  qty: existingItem.qty + qty
                }
              },
              loading: false
            });
          } else {
            // Добавляем новый товар
            set({
              items: {
                ...items,
                [product.id]: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  qty: qty
                }
              },
              loading: false
            });
          }

          // Опционально: отправить в API для синхронизации
          try {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: product.id, quantity: qty })
            });
          } catch (apiError) {
            console.log('API sync failed, but local cart is updated');
          }
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          set({ loading: false });
        }
      },

      inc: async (id: number) => {
        const { items } = get();
        const item = items[id];
        if (!item) return;
        
        set({
          items: {
            ...items,
            [id]: { ...item, qty: item.qty + 1 }
          }
        });
      },

      dec: async (id: number) => {
        const { items } = get();
        const item = items[id];
        if (!item) return;
        
        if (item.qty <= 1) {
          // Удаляем товар если количество становится 0
          const newItems = { ...items };
          delete newItems[id];
          set({ items: newItems });
        } else {
          set({
            items: {
              ...items,
              [id]: { ...item, qty: item.qty - 1 }
            }
          });
        }
      },

      remove: async (id: number) => {
        const { items } = get();
        const newItems = { ...items };
        delete newItems[id];
        set({ items: newItems });
      },

      clear: () => {
        set({ items: {} });
      },

      // New: Create Order function
      createOrder: async (billingInfo: BillingInfo, customerNote?: string) => {
        try {
          set({ orderLoading: true });
          
          const { items } = get();
          const itemsArray = Object.values(items);
          
          if (itemsArray.length === 0) {
            set({ orderLoading: false });
            return { success: false, error: 'Корзина пуста' };
          }

          // Подготавливаем данные для API
          const orderPayload = {
            line_items: itemsArray.map(item => ({
              product_id: item.id,
              quantity: item.qty,
              name: item.name,
              price: item.price
            })),
            billing: {
              first_name: billingInfo.firstName,
              last_name: billingInfo.lastName,
              phone: billingInfo.phone || '',
              email: billingInfo.email || ''
            },
            customer_note: customerNote || ''
          };

          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });

          const result = await response.json();

          if (!result.ok) {
            set({ orderLoading: false });
            return { success: false, error: result.error || 'Ошибка при создании заказа' };
          }

          // Сохраняем данные заказа в localStorage для страницы успеха
          const orderData = result.order;
          saveOrderToStorage(orderData);

          // Очищаем корзину после успешного создания заказа
          set({ items: {}, orderLoading: false });

          return { success: true, orderData };

        } catch (error) {
          console.error('Error creating order:', error);
          set({ orderLoading: false });
          return { success: false, error: 'Ошибка сети при создании заказа' };
        }
      },

      // Computed properties
      count: () => {
        const { items } = get();
        return Object.values(items).reduce((total, item) => total + item.qty, 0);
      },

      total: () => {
        const { items } = get();
        return Object.values(items).reduce(
          (total, item) => total + (item.price * item.qty), 
          0
        );
      },

      isEmpty: () => {
        const { items } = get();
        return Object.keys(items).length === 0;
      }
    }),
    {
      name: 'mini-woo-cart',
      storage: createJSONStorage(() => {
        // Проверяем что мы в браузере
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }
        return localStorage;
      }),
    }
  )
);
