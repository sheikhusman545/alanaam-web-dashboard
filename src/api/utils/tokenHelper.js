/**
 * Helper function to get JWT token from localStorage
 * Client-side only
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user?.JWT_Token || null;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Helper function to get headers with auth token
 */
export const getHeaders = (includeContentType = true) => {
  const token = getToken();
  const headers = {};
  
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["x-auth-token"] = token;
  }
  
  return headers;
};

