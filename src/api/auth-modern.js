/**
 * Modern API client - Uses Next.js API routes instead of direct external calls
 * This is the recommended Next.js 14 approach
 */

/**
 * Login user via Next.js API route
 * @param {string} username - Username/email
 * @param {string} password - Password
 * @param {string} deviceType - Device type (optional)
 * @returns {Promise} API response
 */
export const login = async (username, password, deviceType = "web") => {
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
    return {
      ok: response.ok && data.respondStatus === "SUCCESS",
      status: response.status,
      data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: error.message || "Network error occurred",
        },
      },
      problem: "CONNECTION_ERROR",
    };
  }
};

// Default export for backward compatibility
export default {
  login,
};

