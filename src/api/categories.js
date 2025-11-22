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
 * Get all categories with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getAlCategories = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
  const queryParams = { ...params };
  
  if (sort) queryParams.sb = sort;
  if (pageSize) queryParams.ps = pageSize;
  if (pageNumber) {
    queryParams.page = pageNumber;
    if (pageNumber === "1") {
      queryParams.cnt = "1";
    }
  }
  
  return getServerConnectAPI().get("/ecom/categories", queryParams);
};

/**
 * Create a new category
 * @param {Object} category - Category data
 * @returns {Promise} API response
 */
export const createCategory = (category) => {
  const formData = new FormData();
  
  Object.entries(category).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return getServerConnectAPI().post("/ecom/categories", formData);
};

/**
 * Update an existing category
 * @param {string} categoryID - Category ID
 * @param {Object} category - Updated category data
 * @returns {Promise} API response
 */
export const updateCategory = (categoryID, category) => {
  const formData = new FormData();
  
  Object.entries(category).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return getServerConnectAPI().post(`/ecom/categories/update/${categoryID}`, formData);
};

/**
 * Update category status
 * @param {string} categoryID - Category ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = (categoryID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  
  return getServerConnectAPI().post(`/ecom/categories/updatestatus/${categoryID}`, formData);
};

/**
 * Delete a category
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const deleteCategory = (categoryID) => {
  return getServerConnectAPI().post(`/ecom/categories/delete/${categoryID}`);
};

/**
 * Get category by ID
 * @param {string} categoryID - Category ID
 * @returns {Promise} API response
 */
export const getCategoryByID = (categoryID) => {
  return getServerConnectAPI().get(`/ecom/categories/${categoryID}`);
};

// Default export for backward compatibility
export default {
  getAlCategories,
  createCategory,
  updateCategory,
  updatestatus: updateStatus,
  deleteVal: deleteCategory,
  getCategoryByID,
};
