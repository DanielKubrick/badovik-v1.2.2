import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

// GET /api/users/cart - получить корзину пользователя
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error }, 
        { status: auth.status }
      )
    }

    const { user } = auth

    // Находим или создаем корзину пользователя
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
        },
        include: {
          items: true
        }
      })
    }

    // Вычисляем итоги
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items.map(item => ({
          id: item.productId,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: item.quantity,
        })),
        total,
        count: itemCount,
        isEmpty: cart.items.length === 0,
        expiresAt: cart.expiresAt,
      }
    })

  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// POST /api/users/cart - добавить товар в корзину
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error }, 
        { status: auth.status }
      )
    }

    const { user } = auth
    const { productId, name, price, image, quantity = 1 } = await request.json()

    if (!productId || !name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Находим или создаем корзину пользователя
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
        }
      })
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    })

    let cartItem

    if (existingItem) {
      // Обновляем количество
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + quantity,
          name, // Обновляем данные товара
          price,
          image
        }
      })
    } else {
      // Создаем новый элемент корзины
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          name,
          price,
          image,
          quantity
        }
      })
    }

    // Обновляем время изменения корзины
    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: `Товар "${name}" добавлен в корзину`,
      cartItem: {
        id: cartItem.productId,
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        image: cartItem.image,
        qty: cartItem.quantity,
      }
    })

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/users/cart - очистить корзину
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error }, 
        { status: auth.status }
      )
    }

    const { user } = auth

    // Находим корзину пользователя
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (cart) {
      // Удаляем все элементы корзины
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Корзина очищена'
    })

  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
