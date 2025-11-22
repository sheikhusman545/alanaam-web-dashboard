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
 * Get all user types
 * @returns {Promise} API response
 */
export const getUsertypes = () => {
  return getServerConnectAPI().get("/security/usertypes");
};

/**
 * Create a new user type
 * @param {string} userType - User type name
 * @returns {Promise} API response
 */
export const createUserType = (userType) => {
  const formData = new FormData();
  formData.append("usertype", userType);
  return getServerConnectAPI().post("/security/usertypes", formData);
};

/**
 * Update user type
 * @param {string} typeID - User type ID
 * @param {string} userType - Updated user type name
 * @returns {Promise} API response
 */
export const updateUserType = (typeID, userType) => {
  const formData = new FormData();
  formData.append("usertype", userType);
  return getServerConnectAPI().post(`/security/usertypes/update/${typeID}`, formData);
};

/**
 * Remove user type
 * @param {string} typeID - User type ID
 * @returns {Promise} API response
 */
export const removeUserType = (typeID) => {
  return getServerConnectAPI().post(`/security/usertypes/delete/${typeID}`);
};

/**
 * Get all users with optional pagination and sorting
 * @param {Object} params - Query parameters
 * @param {string} sort - Sort field
 * @param {number} pageSize - Number of items per page
 * @param {number} pageNumber - Page number
 * @returns {Promise} API response
 */
export const getUsers = (params = {}, sort = null, pageSize = null, pageNumber = null) => {
  const queryParams = { ...params };
  
  if (sort) queryParams.sb = sort;
  if (pageSize) queryParams.ps = pageSize;
  if (pageNumber) {
    queryParams.page = pageNumber;
    if (pageNumber === "1") {
      queryParams.cnt = "1";
    }
  }
  
  return getServerConnectAPI().get("/security/users", queryParams);
};

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise} API response
 */
export const createUser = ({
  userType,
  userFullName,
  adminEmail,
  adminPassword,
  permissionCategories,
  permissionProducts,
  permissionOrders,
  permissionUsers,
  permissionReports,
}) => {
  const formData = new FormData();
  formData.append("adminemail", adminEmail);
  formData.append("typeid", userType);
  formData.append("userfullname", userFullName);
  formData.append("adminpassword", adminPassword);
  formData.append("permissionCategories", permissionCategories ? "1" : "0");
  formData.append("permissionProducts", permissionProducts ? "1" : "0");
  formData.append("permissionOrders", permissionOrders ? "1" : "0");
  formData.append("permissionUsers", permissionUsers ? "1" : "0");
  formData.append("permissionReports", permissionReports ? "1" : "0");
  
  return getServerConnectAPI().post("/security/users", formData);
};

/**
 * Update user
 * @param {string} userID - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} API response
 */
export const updateUser = (
  userID,
  {
    userType,
    userFullName,
    permissionCategories,
    permissionProducts,
    permissionOrders,
    permissionUsers,
    permissionReports,
  }
) => {
  const formData = new FormData();
  formData.append("typeid", userType);
  formData.append("userfullname", userFullName);
  formData.append("permissionCategories", permissionCategories ? "1" : "0");
  formData.append("permissionProducts", permissionProducts ? "1" : "0");
  formData.append("permissionOrders", permissionOrders ? "1" : "0");
  formData.append("permissionUsers", permissionUsers ? "1" : "0");
  formData.append("permissionReports", permissionReports ? "1" : "0");
  
  return getServerConnectAPI().post(`/security/users/update/${userID}`, formData);
};

/**
 * Remove user
 * @param {string} userID - User ID
 * @returns {Promise} API response
 */
export const removeUser = (userID) => {
  return getServerConnectAPI().post(`/security/users/delete/${userID}`);
};

/**
 * Update user status
 * @param {string} userID - User ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateStatus = (userID, status) => {
  const formData = new FormData();
  formData.append("status", status);
  return getServerConnectAPI().post(`/security/users/updatestatus/${userID}`, formData);
};

// Default export for backward compatibility
export default {
  getUsertypes,
  createUserType,
  updateUserType,
  removeUserType,
  getUsers,
  createUser,
  updateUser,
  removeUser,
  updatestatus: updateStatus,
};
