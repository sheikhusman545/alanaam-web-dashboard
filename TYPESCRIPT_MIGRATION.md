# TypeScript Migration Guide

## ✅ Completed Conversions

### 1. TypeScript Setup
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `next-env.d.ts` - Next.js TypeScript declarations
- ✅ Type definitions in `types/` directory

### 2. Type Definitions Created
- ✅ `types/index.ts` - Common types (UserDetails, Category, Product, Order, etc.)
- ✅ `types/api.ts` - API-specific types (LoginRequest, ApiResponse, etc.)

### 3. API Files Converted
- ✅ `api/auth.ts` - Login function with TypeScript
- ✅ `api/hooks/apihook.ts` - API hook with generic types
- ✅ `api/config/server-connect-api.ts` - API client config

### 4. Pages Converted
- ✅ `pages/auth/login.tsx` - Login page with TypeScript

## 📋 Remaining Files to Convert

### API Files (Convert .js to .ts)
- [ ] `api/categories.js` → `api/categories.ts`
- [ ] `api/products.js` → `api/products.ts`
- [ ] `api/orders.js` → `api/orders.ts`
- [ ] `api/adminusers.js` → `api/adminusers.ts`
- [ ] `api/customer.js` → `api/customer.ts`
- [ ] `api/bookings.js` → `api/bookings.ts`
- [ ] `api/reports.js` → `api/reports.ts`
- [ ] `api/config/app-config.js` → `api/config/app-config.ts`
- [ ] `api/config/storage.js` → `api/config/storage.ts`

### API Hooks (Convert .js to .ts)
- [ ] `api/hooks/useAuth.js` → `api/hooks/useAuth.ts`
- [ ] `api/hooks/useReport.js` → `api/hooks/useReport.ts`
- [ ] `api/hooks/apiutils.js` → `api/hooks/apiutils.ts`

### Pages (Convert .js to .tsx)
- [ ] `pages/_app.js` → `pages/_app.tsx`
- [ ] `pages/_document.js` → `pages/_document.tsx`
- [ ] `pages/index.js` → `pages/index.tsx`
- [ ] `pages/admin/*.js` → `pages/admin/*.tsx` (31 files)
- [ ] `pages/auth/*.js` → `pages/auth/*.tsx` (4 files)

### Components (Convert .js to .tsx)
- [ ] `components/Navbars/*.js` → `components/Navbars/*.tsx`
- [ ] `components/Headers/*.js` → `components/Headers/*.tsx`
- [ ] `components/Footers/*.js` → `components/Footers/*.tsx`
- [ ] `components/custom_components/*.js` → `components/custom_components/*.tsx`

### Layouts (Convert .js to .tsx)
- [ ] `layouts/Admin.js` → `layouts/Admin.tsx`
- [ ] `layouts/Auth.js` → `layouts/Auth.tsx`
- [ ] `layouts/RTL.js` → `layouts/RTL.tsx`

### Utils (Convert .js to .ts)
- [ ] `utils/utils.js` → `utils/utils.ts`
- [ ] `utils/pagination.js` → `utils/pagination.ts`
- [ ] `utils/categoryUtils.js` → `utils/categoryUtils.ts`

## 🔧 Migration Steps

1. **Install TypeScript** ✅ (Already done)
   ```bash
   npm install --save-dev typescript @types/react @types/react-dom @types/node
   ```

2. **Convert files incrementally**:
   - Start with API files (`.js` → `.ts`)
   - Then convert pages (`.js` → `.tsx`)
   - Finally convert components (`.js` → `.tsx`)

3. **Add type annotations**:
   - Function parameters and return types
   - Component props interfaces
   - State types
   - API response types

4. **Fix TypeScript errors**:
   - Import path issues (use `@/` aliases)
   - Type mismatches
   - Missing type definitions

## 📝 TypeScript Best Practices

1. **Use path aliases** (`@/`) for cleaner imports
2. **Define interfaces** for props and data structures
3. **Use generics** for reusable hooks and functions
4. **Enable strict mode** in `tsconfig.json`
5. **Type all API responses** using the types in `types/api.ts`

## 🚀 Next Steps

1. Convert remaining API files to TypeScript
2. Convert all pages to TSX
3. Convert components to TSX
4. Fix any TypeScript errors
5. Remove `.js` files after conversion (keep backups)

