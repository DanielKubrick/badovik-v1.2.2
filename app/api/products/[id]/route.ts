import { NextRequest, NextResponse } from "next/server"

const WP = process.env.WOOCOMMERCE_URL!;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    console.log(`Fetching product: ${id}`);

    const url = `${WP}/wp-json/wc/v3/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" }, 
          { status: 404 }
        );
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const product = await response.json();

    // Дополнительная обработка данных товара
    const processedProduct = {
      ...product,
      price: parseFloat(product.price) || 0,
      regular_price: parseFloat(product.regular_price) || 0,
      sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
      // Парсим HTML описание для лучшего отображения
      description_plain: product.description.replace(/<[^>]*>/g, ""),
      short_description_plain: product.short_description.replace(/<[^>]*>/g, ""),
    };

    return NextResponse.json(processedProduct);

  } catch (error: any) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" }, 
      { status: 500 }
    );
  }
}
