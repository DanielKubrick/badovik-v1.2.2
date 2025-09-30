import { NextResponse } from 'next/server'
import { PrismaClient, OrderStatus } from '@prisma/client'

const prisma = new PrismaClient()

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

interface WooCommerceCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  username: string
  date_created: string
  date_modified: string
  avatar_url: string
  meta_data: Array<{ key: string; value: any }>
}

interface WooCommerceOrder {
  id: number
  number: string
  status: string
  currency: string
  total: string
  customer_id: number
  date_created: string
  date_modified: string
  billing: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  line_items: Array<{
    id: number
    name: string
    product_id: number
    quantity: number
    price: number
    total: string
  }>
  meta_data: Array<{ key: string; value: any }>
}

function mapWooCommerceStatusToOrderStatus(wooStatus: string): OrderStatus {
  switch (wooStatus) {
    case 'pending':
      return OrderStatus.PENDING
    case 'processing':
      return OrderStatus.PROCESSING
    case 'on-hold':
      return OrderStatus.PENDING
    case 'completed':
      return OrderStatus.COMPLETED
    case 'cancelled':
      return OrderStatus.CANCELLED
    case 'refunded':
      return OrderStatus.REFUNDED
    case 'failed':
      return OrderStatus.CANCELLED
    default:
      return OrderStatus.PENDING
  }
}

async function fetchFromWooCommerce(endpoint: string): Promise<any> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
  
  const response = await fetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${endpoint}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status}`)
  }

  return response.json()
}

async function syncCustomers() {
  console.log('🔄 Синхронизация пользователей из WooCommerce...')
  
  try {
    const customers: WooCommerceCustomer[] = await fetchFromWooCommerce('customers?per_page=100')
    let syncedCount = 0

    for (const customer of customers) {
      // Ищем telegramId в meta_data
      const telegramIdMeta = customer.meta_data.find(meta => meta.key === 'telegram_id')
      
      if (telegramIdMeta && telegramIdMeta.value) {
        try {
          await prisma.user.upsert({
            where: { telegramId: telegramIdMeta.value },
            update: {
              firstName: customer.first_name || undefined,
              lastName: customer.last_name || undefined,
              username: customer.username || undefined,
              photoUrl: customer.avatar_url || undefined,
              updatedAt: new Date(),
            },
            create: {
              telegramId: telegramIdMeta.value,
              firstName: customer.first_name || undefined,
              lastName: customer.last_name || undefined,
              username: customer.username || undefined,
              photoUrl: customer.avatar_url || undefined,
              createdAt: new Date(customer.date_created),
              updatedAt: new Date(),
              lastActiveAt: new Date(),
            },
          })
          syncedCount++
        } catch (error) {
          console.error(`Ошибка при синхронизации пользователя ${customer.id}:`, error)
        }
      }
    }

    console.log(`✅ Синхронизировано ${syncedCount} пользователей`)
    return { customers: syncedCount }
  } catch (error) {
    console.error('❌ Ошибка синхронизации пользователей:', error)
    throw error
  }
}

async function syncOrders() {
  console.log('🔄 Синхронизация заказов из WooCommerce...')
  
  try {
    const orders: WooCommerceOrder[] = await fetchFromWooCommerce('orders?per_page=100&status=any')
    let syncedCount = 0

    for (const order of orders) {
      // Ищем telegramId в meta_data заказа
      const telegramIdMeta = order.meta_data.find(meta => meta.key === 'telegram_user_id')
      
      if (telegramIdMeta && telegramIdMeta.value) {
        try {
          // Находим пользователя по telegramId
          const user = await prisma.user.findUnique({
            where: { telegramId: telegramIdMeta.value }
          })

          if (user) {
            // Создаем/обновляем заказ
            const existingOrder = await prisma.order.findFirst({
              where: { orderKey: order.number }
            })

            const orderData = {
              userId: user.id,
              orderNumber: order.number,
              orderKey: order.number,
              wooCommerceId: order.id,
              status: mapWooCommerceStatusToOrderStatus(order.status),
              total: parseFloat(order.total),
              currency: order.currency,
              billingFirstName: order.billing.first_name || 'Unknown',
              billingLastName: order.billing.last_name || 'User',
              billingPhone: order.billing.phone || undefined,
              billingEmail: order.billing.email || undefined,
              createdAt: new Date(order.date_created),
              updatedAt: new Date(order.date_modified),
            }

            if (existingOrder) {
              await prisma.order.update({
                where: { id: existingOrder.id },
                data: orderData
              })
            } else {
              const newOrder = await prisma.order.create({
                data: orderData
              })

              // Добавляем товары заказа
              for (const item of order.line_items) {
                await prisma.orderItem.create({
                  data: {
                    orderId: newOrder.id,
                    productId: item.product_id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                  }
                })
              }
            }

            // Обновляем статистику пользователя
            const userOrders = await prisma.order.findMany({
              where: { userId: user.id }
            })
            
            const totalOrders = userOrders.length
            const totalSpent = userOrders.reduce((sum, ord) => sum + ord.total, 0)

            await prisma.user.update({
              where: { id: user.id },
              data: {
                totalOrders,
                totalSpent,
              }
            })

            syncedCount++
          }
        } catch (error) {
          console.error(`Ошибка при синхронизации заказа ${order.id}:`, error)
        }
      }
    }

    console.log(`✅ Синхронизировано ${syncedCount} заказов`)
    return { orders: syncedCount }
  } catch (error) {
    console.error('❌ Ошибка синхронизации заказов:', error)
    throw error
  }
}

export async function GET() {
  try {
    console.log('🚀 Начинаем синхронизацию данных с WooCommerce')
    
    const customerResult = await syncCustomers()
    const orderResult = await syncOrders()

    const result = {
      success: true,
      message: 'Синхронизация завершена',
      synced: {
        ...customerResult,
        ...orderResult,
      },
      timestamp: new Date().toISOString(),
    }

    console.log('✅ Синхронизация завершена:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST() {
  return GET() // Позволяем как GET, так и POST запросы
}
