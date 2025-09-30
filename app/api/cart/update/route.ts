import { NextRequest, NextResponse } from 'next/server'

const WP = process.env.WOOCOMMERCE_URL!;

// PUT /api/cart/update - обновить количество товара в корзине
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, quantity } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Не указан ключ товара' },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${WP}/wp-json/wc/store/v1/cart/update-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ key, quantity })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    // Передаем cookies
    const headers = new Headers();
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      headers.set('set-cookie', setCookieHeaders);
    }

    return NextResponse.json(result, { headers });
    
  } catch (error) {
    console.error('Cart UPDATE Error:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить товар в корзине' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/update - удалить товар из корзины
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Не указан ключ товара' },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${WP}/wp-json/wc/store/v1/cart/remove-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    // Передаем cookies
    const headers = new Headers();
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      headers.set('set-cookie', setCookieHeaders);
    }

    return NextResponse.json(result, { headers });
    
  } catch (error) {
    console.error('Cart DELETE Error:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить товар из корзины' },
      { status: 500 }
    );
  }
}