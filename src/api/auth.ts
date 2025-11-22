// Conditional import - only load on client-side to avoid SSR issues
let serverConnectAPI: any = null;

function getServerConnectAPI() {
  // Server-side: return a no-op mock (these functions are only called client-side)
  if (typeof window === 'undefined') {
    return {
      get: () => Promise.resolve({ ok: false, data: null, problem: 'CLIENT_ERROR' }),
      post: () => Promise.resolve({ ok: false, data: null, problem: 'CLIENT_ERROR' }),
    };
  }
  
  // Client-side: lazy load the API client
  if (!serverConnectAPI) {
    try {
      // Use dynamic require to avoid webpack bundling issues
      const module = require("./config/server-connect-api");
      serverConnectAPI = module.default || module;
    } catch (e) {
      // Fallback if import fails
      console.warn('Failed to load server-connect-api:', e);
      serverConnectAPI = {
        get: () => Promise.reject(new Error('API client not available')),
        post: () => Promise.reject(new Error('API client not available')),
      };
    }
  }
  
  return serverConnectAPI;
}

import { LoginRequest, LoginApiResponse } from "@/types/api";

/**
 * Login user
 * @param username - Username/email
 * @param password - Password
 * @param deviceType - Device type (optional)
 * @returns Promise with API response
 */
export const login = async (
  username: string,
  password: string,
  deviceType: string = "web"
) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("devicetype", deviceType);

  return getServerConnectAPI().post("/login", formData);
};

// Default export for backward compatibility
export default {
  login,
};

