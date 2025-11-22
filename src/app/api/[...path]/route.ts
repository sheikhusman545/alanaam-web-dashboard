import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for Vercel serverless functions
export const dynamic = 'force-dynamic';

// Note: Empty API directories removed to fix 405 errors with catch-all route

// Get backend URL - avoid importing from api/ directory to prevent module loading issues
// Use environment variables or default URL
function getBackendUrl(): string {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return "https://shopapi.alanaam.qa";
}

/**
 * Unified API Proxy Route - Handles all API requests
 * This consolidates all API routes into a single serverless function
 * to stay within Vercel's Hobby plan limit of 12 functions
 * 
 * Maps Next.js API paths to backend API paths:
 * - /api/auth/login -> /api/admin/login
 * - /api/categories -> /api/admin/ecom/categories
 * - /api/products -> /api/admin/ecom/products
 * - /api/orders -> /api/admin/ecom/orders
 * - /api/bookings -> /api/admin/ecom/bookings
 * - /api/customers -> /api/admin/ecom/customers
 * - /api/reports/productwise -> /api/admin/ecom/reports/ordersproductwise
 * - /api/reports/categorywise -> /api/admin/ecom/reports/orderscategorywise
 * - /api/reports/datewise -> /api/admin/ecom/reports/ordersdatewise
 * - /api/adminusers/usertypes -> /api/admin/usertypes
 * - /api/adminusers/users -> /api/admin/users
 */

/**
 * Maps Next.js API path to backend API path
 */
function mapApiPath(pathSegments: string[]): string {
  const [first, second, ...rest] = pathSegments;

  // Auth routes
  if (first === 'auth' && second === 'login') {
    return '/api/admin/login';
  }

  // Admin users routes
  if (first === 'adminusers') {
    if (second === 'usertypes') {
      const id = rest[0];
      if (id) {
        return `/api/admin/security/usertypes/${id}`;
      }
      return '/api/admin/security/usertypes';
    }
    if (second === 'users') {
      const id = rest[0];
      if (id) {
        return `/api/admin/security/users/${id}`;
      }
      return '/api/admin/security/users';
    }
  }

  // Reports routes
  if (first === 'reports') {
    if (second === 'productwise') {
      return '/api/admin/ecom/reports/ordersproductwise';
    }
    if (second === 'categorywise') {
      return '/api/admin/ecom/reports/orderscategorywise';
    }
    if (second === 'datewise') {
      return '/api/admin/ecom/reports/ordersdatewise';
    }
  }

    // ECOM routes (categories, products, orders, bookings, customers)
  if (['categories', 'products', 'orders', 'bookings', 'customers'].includes(first)) {
    const resource = first;
    const id = second;
    const action = rest[0];

    // Special handling for customers - backend uses /getcustomers endpoint
    if (resource === 'customers' && !id) {
      return '/api/admin/ecom/customers/getcustomers';
    }

    if (id) {
      // Handle special actions
      if (action === 'update' || action === 'updatestatus') {
        return `/api/admin/ecom/${resource}/${action}/${id}`;
      }
      if (action === 'delete') {
        return `/api/admin/ecom/${resource}/delete/${id}`;
      }
      // Regular ID-based route
      return `/api/admin/ecom/${resource}/${id}`;
    }
    // Collection route
    return `/api/admin/ecom/${resource}`;
  }

  // Default: return as-is (shouldn't happen, but fallback)
  return `/api/${pathSegments.join('/')}`;
}

/**
 * Check if DELETE method should be converted to POST for backend
 */
function shouldConvertDeleteToPost(pathSegments: string[]): boolean {
  const [first, second] = pathSegments;
  // DELETE operations for categories, products, etc. need to be POST to backend
  return ['categories', 'products'].includes(first) && !!second;
}

/**
 * Handle all HTTP methods
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get backend URL
    const backendBaseUrl = getBackendUrl();
    
    // Validate params
    if (!params || !params.path) {
      console.error("[API Proxy] Invalid params received:", params);
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: "Invalid request path",
          },
        },
        { status: 400 }
      );
    }

    // Handle trailing slashes - filter out empty strings from path array
    const { path } = params;
    const cleanPath = path.filter(segment => segment !== '');
    
    if (cleanPath.length === 0) {
      console.error("Empty path after cleaning:", path);
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: "Invalid API path",
          },
        },
        { status: 400 }
      );
    }

    let method = request.method;
    const { searchParams } = new URL(request.url);

    // Handle DELETE method - backend expects POST with /delete/ in path
    let backendPath: string;
    if (method === 'DELETE' && shouldConvertDeleteToPost(cleanPath)) {
      // Convert DELETE to POST and modify path
      method = 'POST';
      const [first, second] = cleanPath;
      backendPath = `/api/admin/ecom/${first}/delete/${second}`;
    } else {
      // Map Next.js API path to backend API path
      backendPath = mapApiPath(cleanPath);
      
      // Handle POST updates to /{resource}/{id}
      if (method === 'POST') {
        const [first, second, ...restSegments] = cleanPath;
        const action = searchParams.get('action');
        
        // Handle adminusers routes (security endpoints)
        if (first === 'adminusers') {
          if (second === 'usertypes' && restSegments[0]) {
            const id = restSegments[0];
            const updateAction = restSegments[1]; // 'update' or 'delete'
            if (updateAction === 'update') {
              backendPath = `/api/admin/security/usertypes/update/${id}`;
            } else if (updateAction === 'delete') {
              backendPath = `/api/admin/security/usertypes/delete/${id}`;
            }
          } else if (second === 'users' && restSegments[0]) {
            const id = restSegments[0];
            if (action === 'status') {
              backendPath = `/api/admin/security/users/updatestatus/${id}`;
              searchParams.delete('action');
            } else {
              const updateAction = restSegments[1]; // 'update' or 'delete'
              if (updateAction === 'update') {
                backendPath = `/api/admin/security/users/update/${id}`;
              } else if (updateAction === 'delete') {
                backendPath = `/api/admin/security/users/delete/${id}`;
              }
            }
          }
        }
        // Handle ECOM routes
        else if (['categories', 'products'].includes(first) && second) {
          if (action === 'status') {
            // Status update
            backendPath = `/api/admin/ecom/${first}/updatestatus/${second}`;
            searchParams.delete('action');
          } else {
            // Regular update
            backendPath = `/api/admin/ecom/${first}/update/${second}`;
          }
        } else if (['orders', 'bookings'].includes(first) && second && action === 'status') {
          // Status update for orders/bookings
          backendPath = `/api/admin/ecom/${first}/updatestatus/${second}`;
          searchParams.delete('action');
        }
      }
    }
    
    // Validate backend URL configuration
    if (!backendBaseUrl) {
      console.error("[API Proxy] Backend URL not configured. env vars:", {
        BACKEND_URL: process.env.BACKEND_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      });
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: "Server configuration error: Backend URL not configured",
          },
        },
        { status: 500 }
      );
    }

    const queryString = searchParams.toString();
    const backendUrl = `${backendBaseUrl}${backendPath}${queryString ? `?${queryString}` : ""}`;
    
    console.log(`[API Proxy] ${method} ${request.url} -> ${backendUrl}`);

    // Get auth token from headers
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {};

    // Prepare request body
    let body: BodyInit | undefined;
    
    // Special handling for login (always URL-encoded) - handle FIRST before general body reading
    const isLogin = cleanPath[0] === 'auth' && cleanPath[1] === 'login' && method === 'POST';
    
    if (isLogin) {
      try {
        const formData = await request.formData();
        const urlParams = new URLSearchParams();
        
        // Convert FormData to URLSearchParams
        formData.forEach((value, key) => {
          urlParams.append(key, value.toString());
        });
        
        // Ensure body is a string (URLSearchParams.toString() returns a string)
        body = urlParams.toString();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        
        // Verify the conversion
        if (typeof body !== 'string') {
          console.error("[API Proxy] Login - Body is not a string:", typeof body);
          body = String(body);
        }
        
        console.log(`[API Proxy] Login - Original Content-Type: ${request.headers.get("content-type")}`);
        console.log(`[API Proxy] Login - Converted body: ${body}`);
        console.log(`[API Proxy] Login - Body type: ${typeof body}`);
        console.log(`[API Proxy] Login - Final Content-Type: ${headers["Content-Type"]}`);
      } catch (formError: any) {
        console.error("[API Proxy] Error processing login form data:", formError);
        return NextResponse.json(
          {
            respondStatus: "ERROR",
            errorMessages: {
              ErrorType: "Server.Error",
              Errors: "Failed to process login request",
            },
          },
          { status: 400 }
        );
      }
    } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      // Determine content type based on method and request (skip if already set for login)
      const contentType = request.headers.get("content-type");
      
      // For POST/PUT with FormData, don't set Content-Type (browser will set it with boundary)
      if (contentType && contentType.includes('multipart/form-data')) {
        // Don't set Content-Type for FormData - fetch will set it with boundary
      } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else {
        headers["Content-Type"] = "application/json";
      }
      // Skip body reading for DELETE operations that were converted to POST
      // The backend delete endpoints don't expect a body
      if (request.method === 'DELETE' && shouldConvertDeleteToPost(cleanPath)) {
        // No body needed for delete operations
        body = undefined;
      } else {
        // General body handling for other requests
        if (contentType && contentType.includes('multipart/form-data')) {
          // For FormData, pass it directly
          body = await request.formData();
        } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          // For URL-encoded form data
          const formData = await request.formData();
          const urlParams = new URLSearchParams();
          formData.forEach((value, key) => {
            urlParams.append(key, value.toString());
          });
          body = urlParams.toString();
        } else {
          // For JSON, try to parse and forward
          try {
            const json = await request.json();
            body = JSON.stringify(json);
          } catch {
            // If not JSON, try as text
            body = await request.text();
          }
        }
      }
    }

    // Add auth token if present
    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    // Make request to backend (use converted method if DELETE was converted)
    let response: Response;
    try {
      console.log(`[API Proxy] Making ${method} request to backend...`);
      console.log(`[API Proxy] Request headers:`, JSON.stringify(Object.fromEntries(Object.entries(headers)), null, 2));
      console.log(`[API Proxy] Request body:`, body ? (typeof body === 'string' ? body.substring(0, 200) : '[FormData or other]') : '[empty]');
      
      response = await fetch(backendUrl, {
        method: method, // Use converted method (POST for DELETE operations)
        headers,
        body,
      });
      console.log(`[API Proxy] Backend responded with status: ${response.status}`);
    } catch (fetchError: any) {
      console.error(`[API Proxy] Network error calling backend API ${backendUrl}:`, fetchError);
      console.error(`[API Proxy] Error details:`, {
        message: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name,
      });
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: `Failed to connect to server: ${fetchError.message || "Network error"}`,
          },
        },
        { status: 503 }
      );
    }

    // Parse response
    const responseContentType = response.headers.get("content-type");
    let data: any;

    if (responseContentType && responseContentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("Response text:", text.substring(0, 500));
        return NextResponse.json(
          {
            respondStatus: "ERROR",
            errorMessages: {
              ErrorType: "Server.Error",
              Errors: "Invalid response format from server",
            },
          },
          { status: 500 }
        );
      }
    } else {
      // Non-JSON response (likely HTML error page)
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 500));
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: `Server returned invalid response (status: ${response.status})`,
          },
        },
        { status: response.status || 500 }
      );
    }

    // Return error response if backend returned error
    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data.message || data.errorMessages?.Errors || "Request failed",
          },
        },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[API Proxy] Unhandled error:", error);
    console.error("[API Proxy] Error stack:", error?.stack);
    console.error("[API Proxy] Error name:", error?.name);
    console.error("[API Proxy] Error message:", error?.message);
    
    // Ensure we always return JSON, even if something goes wrong
    try {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: error?.message || "Internal server error",
          },
        },
        { status: 500 }
      );
    } catch (jsonError: any) {
      // If even JSON response fails, log and return minimal response
      console.error("[API Proxy] Failed to create JSON error response:", jsonError);
      return new NextResponse(
        JSON.stringify({
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: "Internal server error",
          },
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

