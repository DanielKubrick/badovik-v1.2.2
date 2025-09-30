import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

// PUT /api/users/cart/items - обновить количество товара в корзине
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error }, 
        { status: auth.status }
      )
    }

    const { user } = auth
    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing productId or quantity' }, 
        { status: 400 }
      )
    }

    // Находим корзину пользователя
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' }, 
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // Удаляем товар из корзины
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Товар удален из корзины'
      })
    } else {
      // Обновляем количество товара
      const updatedItem = await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          productId: productId
        },
        data: { quantity }
      })

      if (updatedItem.count === 0) {
        return NextResponse.json(
          { success: false, error: 'Item not found in cart' }, 
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Количество товара обновлено'
      })
    }

  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/users/cart/items?productId=123 - удалить товар из корзины
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
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Missing productId' }, 
        { status: 400 }
      )
    }

    // Находим корзину пользователя
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id }
    })

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' }, 
        { status: 404 }
      )
    }

    // Удаляем товар из корзины
    const deleted = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Товар удален из корзины'
    })

  } catch (error) {
    console.error('Error deleting cart item:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
