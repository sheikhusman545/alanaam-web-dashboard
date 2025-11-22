import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Minimal implementation - just return success to test if route works
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://shopapi.alanaam.qa";
    const fullUrl = `${backendUrl}/api/admin/login`;
    
    // Get headers
    const authToken = request.headers.get("x-auth-token");
    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (authToken) {
      headers["x-auth-token"] = authToken;
    }

    // Read form data
    const formData = await request.formData();
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, String(value));
    });
    const body = params.toString();

    // Make request
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body,
    });

    // Get response
    const contentType = response.headers.get("content-type") || "";
    let data: any;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: `Invalid response: ${text.substring(0, 200)}`,
          },
        },
        { status: response.status || 500 }
      );
    }

    // Return response
    if (!response.ok) {
      return NextResponse.json(
        {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Network.Error",
            Errors: data?.message || data?.errorMessages?.Errors || "Request failed",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Server.Error",
          Errors: errorMessage || "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
