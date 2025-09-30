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

        const res = await woo.get('products', params);
        const data = await res.json();
        
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
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
