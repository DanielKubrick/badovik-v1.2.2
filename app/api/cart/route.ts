import { NextRequest, NextResponse } from "next/server"

const WP = process.env.WOOCOMMERCE_URL!;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

// GET /api/cart - получить содержимое корзины (пустая корзина по умолчанию)
export async function GET(request: NextRequest) {
  try {
    // Возвращаем пустую корзину в формате Store API
    const emptyCart = {
      items: [],
      totals: {
        total_price: "0",
        total_items: "0",
        currency_code: "RUB",
        currency_symbol: "₽",
      },
      items_count: 0,
      needs_payment: false,
      errors: []
    };

    return NextResponse.json(emptyCart);
  } catch (error: any) {
    console.log("Cart GET Error:", error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

// POST /api/cart - добавить товар в корзину (симуляция)
export async function POST(request: NextRequest) {
  try {
    const { id, quantity = 1 } = await request.json();

    // Получаем информацию о товаре
    const productResponse = await fetch(
      `${WP}/wp-json/wc/v3/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
    );

    if (!productResponse.ok) {
      throw new Error("Товар не найден");
    }

    const product = await productResponse.json();

    // Возвращаем успешный ответ (симуляция добавления)
    return NextResponse.json({
      success: true,
      message: `Товар "${product.name}" добавлен в корзину (${quantity} шт.)`,
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: (parseFloat(product.price) * quantity).toString()
      }
    });

  } catch (error: any) {
    console.log("Cart POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Не удалось добавить товар в корзину" }, 
      { status: 500 }
    );
  }
}
