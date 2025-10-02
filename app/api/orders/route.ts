import { NextRequest, NextResponse } from 'next/server';
import { generateOrderNumber, generateOrderKey, type OrderData } from '@/lib/order-utils';
import { requireAuth } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

const WP = process.env.WOOCOMMERCE_URL!;
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

interface OrderPayload {
  line_items: Array<{
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  billing: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
  };
  customer_note?: string;
}

export async function POST(req: Request) {
  try {
    // Проверяем авторизацию пользователя
    const auth = await requireAuth(req as NextRequest);
    let userId: string | null = null;
    
    if (!('error' in auth)) {
      userId = auth.user.id;
    }
    // Если нет авторизации, продолжаем без userId (гость)

    const payload: OrderPayload = await req.json();
    
    // Валидация данных
    if (!payload.line_items || payload.line_items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Корзина пуста' }, 
        { status: 400 }
      );
    }

    if (!payload.billing?.first_name) {
      return NextResponse.json(
        { ok: false, error: 'Не указано имя покупателя' }, 
        { status: 400 }
      );
    }

    // Генерируем временный ключ заказа (номер будет создан после получения ID от WooCommerce)
    const orderKey = generateOrderKey();

    // Готовим данные заказа - конвертируем telegram username в валидный email
    const telegramUsername = payload.billing.email;
    const billingData = {
      ...payload.billing,
      // Если это telegram username, конвертируем в псевдо-email для WooCommerce
      email: telegramUsername && telegramUsername.startsWith('@') 
        ? `${telegramUsername.slice(1)}@telegram.user`  // @username -> username@telegram.user
        : telegramUsername || ''
    };

    const orderData = {
      ...payload,
      billing: billingData,
      set_paid: false,
      status: 'on-hold', // 'ожидает оплаты'
      payment_method: 'bacs',
      payment_method_title: 'Банковский перевод',
      meta_data: [
        { key: 'source', value: 'mini-woo-app' },
        { key: 'created_via', value: 'telegram-webapp' },
        { key: 'mini_woo_order_key', value: orderKey },
        ...(userId ? [{ key: 'mini_woo_user_id', value: userId }] : []),
        // Сохраняем telegram username в meta_data (если есть)
        ...(payload.billing.email ? [{ key: 'telegram_username', value: payload.billing.email }] : [])
      ],
    };

    console.log('Creating order in WooCommerce...');

    // Создаем заказ в WooCommerce
    const res = await fetch(
      `${WP}/wp-json/wc/v3/orders?consumer_key=${CK}&consumer_secret=${CS}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('WooCommerce API Error:', errorText);
      return NextResponse.json(
        { ok: false, error: 'Ошибка при создании заказа в WooCommerce' }, 
        { status: res.status }
      );
    }

    const wooOrder = await res.json();
    
    // Теперь генерируем правильный номер заказа на основе ID из WooCommerce
    const orderNumber = generateOrderNumber(wooOrder.id);
    
    console.log('WooCommerce Order created:', wooOrder.id, 'Order Number:', orderNumber, 'Total:', wooOrder.total);

    // Обновляем заказ в WooCommerce с правильным номером
    try {
      await fetch(
        `${WP}/wp-json/wc/v3/orders/${wooOrder.id}?consumer_key=${CK}&consumer_secret=${CS}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meta_data: [
              ...orderData.meta_data,
              { key: 'mini_woo_order_number', value: orderNumber }
            ],
          }),
        }
      );
      console.log('Updated WooCommerce order with order number:', orderNumber);
    } catch (updateError) {
      console.warn('Failed to update WooCommerce order with order number:', updateError);
    }

    // Сохраняем заказ в локальной базе данных
    let localOrder = null;
    
    if (userId) {
      try {
        localOrder = await prisma.order.create({
          data: {
            userId: userId,
            orderNumber: orderNumber,
            orderKey: orderKey,
            wooCommerceId: wooOrder.id,
            status: 'PENDING',
            total: parseFloat(wooOrder.total),
            currency: wooOrder.currency || 'RUB',
            billingFirstName: payload.billing.first_name,
            billingLastName: payload.billing.last_name,
            billingPhone: payload.billing.phone,
            billingEmail: payload.billing.email, // telegram username
            customerNote: payload.customer_note,
            items: {
              create: payload.line_items.map(item => ({
                productId: item.product_id,
                name: item.name || `Товар #${item.product_id}`,
                price: item.price || 0,
                quantity: item.quantity
              }))
            }
          },
          include: {
            items: true
          }
        });

        console.log('Local order saved to database:', localOrder.id);

        // Обновляем статистику пользователя
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: parseFloat(wooOrder.total) }
          }
        });

        console.log('User statistics updated');

        // Очищаем корзину пользователя после создания заказа
        const userCart = await prisma.cart.findFirst({
          where: { userId: userId }
        });
        
        if (userCart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: userCart.id }
          });
          console.log('User cart cleared');
        }

      } catch (dbError) {
        console.error('Error saving order to local database:', dbError);
        // Не прерываем выполнение, так как заказ уже создан в WooCommerce
      }
    } else {
      console.log('Order created for guest user - not saved to local database');
    }

    // Формируем данные заказа для клиента
    const orderResponse: OrderData = {
      id: wooOrder.id.toString(),
      orderNumber: orderNumber,
      key: orderKey,
      total: wooOrder.total,
      currency: wooOrder.currency || 'RUB',
      status: wooOrder.status,
      createdAt: new Date().toISOString(),
      items: payload.line_items.map(item => ({
        id: item.product_id,
        name: item.name || `Товар #${item.product_id}`,
        quantity: item.quantity,
        price: item.price || 0
      })),
      billing: {
        firstName: payload.billing.first_name,
        lastName: payload.billing.last_name,
        phone: payload.billing.phone,
        email: payload.billing.email
      }
    };

    return NextResponse.json({
      ok: true,
      order: orderResponse,
      // Для обратной совместимости
      id: wooOrder.id,
      orderNumber: orderNumber,
      key: orderKey,
      total: wooOrder.total,
      currency: wooOrder.currency,
      status: wooOrder.status,
      localOrderId: localOrder?.id,
      // Ссылка для онлайн оплаты (на будущее)
      paymentUrl: wooOrder.payment_url ?? 
        `${WP}/checkout/order-pay/${wooOrder.id}/?pay_for_order=true&key=${wooOrder.order_key}`,
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { ok: false, error: 'Внутренняя ошибка сервера' }, 
      { status: 500 }
    );
  }
}
