"use client";

/**
 * Login user
 * Uses Next.js API route instead of direct external API call
 * @param {string} username - Username/email
 * @param {string} password - Password
 * @param {string} deviceType - Device type (optional)
 * @returns {Promise} API response
 */
export const login = (username, password, deviceType = "web") => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('devicetype', deviceType);

  // Use Next.js API route instead of direct external call
  return fetch("/api/auth/login", {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const text = await response.text();
        console.error("Response text:", text.substring(0, 500));
        return {
          ok: false,
          status: response.status,
          data: {
            respondStatus: "ERROR",
            errorMessages: {
              ErrorType: "Client.Error",
              Errors: "Invalid response format from server",
            },
          },
          problem: "CLIENT_ERROR",
        };
      }
    } else {
      // Non-JSON response (likely HTML error page)
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 500));
      return {
        ok: false,
        status: response.status,
        data: {
          respondStatus: "ERROR",
          errorMessages: {
            ErrorType: "Server.Error",
            Errors: `Server returned invalid response (status: ${response.status})`,
          },
        },
        problem: "CLIENT_ERROR",
      };
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data: data,
      problem: response.ok ? null : "CLIENT_ERROR",
    };
  }).catch((error) => {
    console.error("Network error during login:", error);
    return {
      ok: false,
      status: 0,
      data: {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: `Network error: ${error.message || "Failed to connect to server"}`,
        },
      },
      problem: "NETWORK_ERROR",
    };
  });
};

// Default export for backward compatibility
export default {
  login,
};

