// Conditional import - only load on client-side to avoid SSR issues
let serverConnectAPI = null;

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

/**
 * Get all customers with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getCustomers = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
  const queryParams = { ...params };
  
  if (sort) queryParams.sb = sort;
  if (pageSize) queryParams.ps = pageSize;
  if (pageNumber) {
    queryParams.page = pageNumber;
    if (pageNumber === "1") {
      queryParams.cnt = "1";
    }
  }
  
  return getServerConnectAPI().get("/ecom/customers/getcustomers", queryParams);
};

// Default export for backward compatibility
export default {
  getCustomers,
};
