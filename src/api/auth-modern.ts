import { LoginRequest, LoginApiResponse } from "@/types/api";

/**
 * Modern API client - Uses Next.js App Router API routes
 * This calls the route.ts files in src/app/api/
 */
export const login = async (
  username: string,
  password: string,
  deviceType: string = "web"
): Promise<{
  ok: boolean;
  status?: number;
  data: LoginApiResponse;
  problem?: string | null;
}> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        devicetype: deviceType,
      }),
    });

    const data = await response.json();

    // Return in apisauce-compatible format
    // The response from Next.js App Router route.ts is already the JSON object
    return {
      ok: response.ok && data.respondStatus === "SUCCESS",
      status: response.status,
      data: data, // This is already the API response object
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      data: {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: error.message || "Network error occurred",
        },
      } as LoginApiResponse,
      problem: "CONNECTION_ERROR",
    };
  }
};

// Default export for backward compatibility
export default {
  login,
};

