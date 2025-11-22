# Next.js API Routes Migration Guide

## Current Setup (Old React Way)
- **Client-side API calls** using `apisauce` directly to external backend
- API endpoint exposed to client: `https://shopapi.alanaam.qa/api/admin`
- Files: `api/auth.js`, `api/categories.js`, etc. use `serverConnectAPI.post/get`

## Modern Next.js Approach (Recommended)
- **Server-side API routes** that proxy to external backend
- API endpoints hidden from client: `/api/auth/login`, `/api/categories`, etc.
- Benefits:
  - ✅ Hide API credentials/URLs from client
  - ✅ Better security (no CORS issues)
  - ✅ Can add middleware (rate limiting, caching, etc.)
  - ✅ Consistent error handling
  - ✅ Server-side execution (can use env vars securely)

## Migration Steps

### Option 1: Keep Current Setup (Works Fine)
- Current setup works if external API is public
- No migration needed
- Continue using `api/auth.js` with `apisauce`

### Option 2: Migrate to Next.js API Routes (Recommended)

1. **Create API route files** in `pages/api/`:
   - `pages/api/auth/login.js` - Login endpoint
   - `pages/api/categories.js` - Categories CRUD
   - `pages/api/products.js` - Products CRUD
   - etc.

2. **Update API client files** to call Next.js routes instead:
   ```javascript
   // OLD: api/auth.js
   return serverConnectAPI.post("/login", formData);
   
   // NEW: api/auth-modern.js
   return fetch("/api/auth/login", { method: "POST", body: JSON.stringify(...) });
   ```

3. **Update components** to use new API client:
   ```javascript
   // OLD
   import authFunctions from "../../api/auth";
   
   // NEW
   import authFunctions from "../../api/auth-modern";
   ```

## Example: Login API Route

Created `pages/api/auth/login.js` that:
- Receives POST request from frontend
- Validates input
- Calls external backend (`https://shopapi.alanaam.qa/api/admin/login`)
- Returns response to frontend

## Next Steps

1. Create all API route files (`pages/api/categories.js`, `pages/api/products.js`, etc.)
2. Update API client files to use Next.js routes
3. Update components to use new API clients
4. Test all endpoints
5. Remove old `apisauce` dependency (optional)

