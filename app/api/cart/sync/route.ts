import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { items } = await request.json()
    const userId = authResult.user.id

    // Найти или создать активную корзину пользователя
    let cart = await prisma.cart.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!cart) {
      // Создаем новую корзину с истечением через 30 дней
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)
      
      cart = await prisma.cart.create({
        data: {
          userId,
          expiresAt
        }
      })
    }

    // Очищаем старые элементы корзины
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    // Добавляем новые элементы
    if (items && Array.isArray(items) && items.length > 0) {
      const cartItems = items.map((item: any) => ({
        cartId: cart!.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image || null,
        quantity: item.qty
      }))

      await prisma.cartItem.createMany({
        data: cartItems
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Корзина синхронизирована',
      cartId: cart.id
    })

  } catch (error) {
    console.error('Cart sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ success: false, items: [] })
    }

    const userId = authResult.user.id

    // Найти активную корзину
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        items: true
      }
    })

    if (!cart) {
      return NextResponse.json({ success: true, items: [] })
    }

    // Преобразуем элементы корзины в нужный формат
    const items = cart.items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: item.quantity
    }))

    return NextResponse.json({ 
      success: true, 
      items,
      cartId: cart.id 
    })

  } catch (error) {
    console.error('Cart load error:', error)
    return NextResponse.json({ success: false, items: [] })
  } finally {
    await prisma.$disconnect()
  }
}
