import {NextRequest, NextResponse} from "next/server";
import woo from "@/lib/woo";

export async function POST(request: NextRequest) {

    const body = await request.json();

    const line_items = Array.from(body.items).map((item: any) => {
        return {
            product_id: item.id,
            quantity: item.count
        }
    });

    const order = await woo.createOrder(line_items, body.comment)

    console.log(JSON.stringify(order))
    
    // Return the WooCommerce payment URL directly instead of creating a Telegram invoice
    return NextResponse.json({"invoice_link": order.payment_url});
}
