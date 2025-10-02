import {NextRequest, NextResponse} from "next/server";
import woo from "@/lib/woo";

export async function GET(request: NextRequest) {
    try {
        console.log(`Fetching categories with params: ${request.nextUrl.searchParams.toString()}`);
        
        const res = await woo.get('products/categories', request.nextUrl.searchParams);
        
        if (!res.ok) {
            console.error(`WooCommerce Categories API error: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                { error: 'External API error', status: res.status },
                { status: 502 }
            );
        }

        const data = await res.json();
        console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 0} categories`);
        
        const response = NextResponse.json(data);
        
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return response;
        
    } catch (error) {
        console.error('Categories API error:', error);
        
        // More detailed error handling
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                { error: 'Network error - cannot reach WooCommerce API' },
                { status: 503 }
            );
        }
        
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid response from WooCommerce API' },
                { status: 502 }
            );
        }
        
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
