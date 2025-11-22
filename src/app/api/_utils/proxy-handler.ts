import { NextRequest, NextResponse } from "next/server";

// Get backend URL - use environment variable first, then default
// Avoid imports to prevent issues with force-dynamic on Vercel
function getBackendUrl(): string {
  // Try environment variables first (most reliable on Vercel)
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // Default fallback (matches app-config.js)
  return "https://shopapi.alanaam.qa";
}

/**
 * Shared utility for proxying API requests to backend
 */
export async function proxyRequest(
  request: NextRequest,
  backendPath: string,
  options: {
    method?: string;
    convertFormDataToUrlEncoded?: boolean;
  } = {}
) {
  try {
    const method = options.method || request.method;
    const backendBaseUrl = getBackendUrl();
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = `${backendBaseUrl}${backendPath}${queryString ? `?${queryString}` : ""}`;

    // Get auth token from headers
    const authToken = request.headers.get("x-auth-token");
    const headers: HeadersInit = {};

    // Determine content type
    const contentType = request.headers.get("content-type");
    
    // Prepare request body
    let body: BodyInit | undefined;

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      // Handle login FormData conversion first (before reading body)
      if (options.convertFormDataToUrlEncoded) {
        try {
          // Always try to read as FormData for login (browser sends multipart/form-data)
          const formData = await request.formData();
          const urlParams = new URLSearchParams();
          formData.forEach((value, key) => {
            urlParams.append(key, value.toString());
          });
          body = urlParams.toString();
          headers["Content-Type"] = "application/x-www-form-urlencoded";
          console.log(`[API Proxy] Converted FormData to URL-encoded: ${body.substring(0, 100)}...`);
        } catch (formError: any) {
          console.error(`[API Proxy] Error converting FormData to URL-encoded:`, formError);
          return NextResponse.json(
            {
              respondStatus: "ERROR",
              errorMessages: {
                ErrorType: "Server.Error",
                Errors: "Failed to process form data: " + (formError?.message || "Unknown error"),
              },
            },
            { status: 400 }
          );
        }
      } else if (contentType?.includes('multipart/form-data')) {
        // Pass FormData directly
        body = await request.formData();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        const urlParams = new URLSearchParams();
        formData.forEach((value, key) => {
          urlParams.append(key, value.toString());
        });
        body = urlParams.toString();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else {
        // JSON or other
        try {
          const json = await request.json();
          body = JSON.stringify(json);
          headers["Content-Type"] = "application/json";
        } catch {
          // If not JSON, try as text
          try {
            body = await request.text();
          } catch (textError) {
            // If body is already consumed or empty, that's okay
            body = undefined;
          }
        }
      }
    }

    // Add auth token if present
    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    // Make request to backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    // Parse response
    const responseContentType = response.headers.get("content-type");
    let data: any;

    if (responseContentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError: any) {
        const text = await response.text();
        console.error(`[API Proxy] Failed to parse JSON response from ${backendPath}:`, text.substring(0, 500));
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
      const text = await response.text();
      console.error(`[API Proxy] Non-JSON response from ${backendPath}:`, text.substring(0, 500));
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
    console.error(`[API Proxy] Error proxying ${backendPath}:`, error);
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
  }
}

