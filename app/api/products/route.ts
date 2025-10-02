import {NextRequest, NextResponse} from "next/server";
import woo from "@/lib/woo";

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        params.set('status', 'publish');
        
        // Set default pagination if not provided
        if (!params.has('per_page')) {
            params.set('per_page', '20');
        }
        
        if (!params.has('page')) {
            params.set('page', '1');
        }

        console.log(`Fetching products with params: ${params.toString()}`);

        const res = await woo.get('products', params);
        
        if (!res.ok) {
            console.error(`WooCommerce API error: ${res.status} ${res.statusText}`);
            return NextResponse.json(
                { error: 'External API error', status: res.status },
                { status: 502 }
            );
        }

        const data = await res.json();
        
        console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 0} products`);
        
        // Create response with data
        const response = NextResponse.json(data);
        
        // Add pagination headers from WooCommerce response
        const totalPages = res.headers.get('X-WP-TotalPages');
        const total = res.headers.get('X-WP-Total');
        
        if (total) {
            response.headers.set('X-WP-Total', total);
        }
        
        if (totalPages) {
            response.headers.set('X-WP-TotalPages', totalPages);
        }
        
        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Expose-Headers', 'X-WP-Total, X-WP-TotalPages');
        
        return response;
        
    } catch (error) {
        console.error('Products API error:', error);
        
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
