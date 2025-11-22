# Modern TypeScript Project Structure with src/ Directory

## ✅ New Structure (Modern React/Next.js Way)

```
alanam-dashboard/
├── src/                    # All source code (TypeScript/TSX)
│   ├── pages/              # Next.js pages (TSX)
│   │   ├── _app.tsx        # ✅ App wrapper
│   │   ├── _document.tsx   # ✅ Document wrapper
│   │   ├── index.tsx       # Landing page
│   │   ├── api/            # Next.js API routes (TS)
│   │   │   └── auth/
│   │   │       └── login.ts
│   │   ├── admin/          # Admin pages (TSX)
│   │   │   ├── dashboard.tsx
│   │   │   ├── categories.tsx
│   │   │   └── ...
│   │   └── auth/           # Auth pages (TSX)
│   │       ├── login.tsx   # ✅ Converted
│   │       └── ...
│   ├── components/         # React components (TSX)
│   │   ├── Navbars/
│   │   ├── Headers/
│   │   ├── Footers/
│   │   └── custom_components/
│   ├── layouts/            # Layout components (TSX)
│   │   ├── Admin.tsx
│   │   ├── Auth.tsx
│   │   └── RTL.tsx
│   ├── api/                # API layer (TS)
│   │   ├── auth.ts         # ✅ Converted
│   │   ├── categories.ts
│   │   ├── products.ts
│   │   ├── hooks/          # API hooks
│   │   │   ├── apihook.ts  # ✅ Converted
│   │   │   ├── useAuth.ts
│   │   │   └── useReport.ts
│   │   └── config/         # API configuration
│   │       ├── server-connect-api.ts  # ✅ Converted
│   │       ├── app-config.ts         # ✅ Converted
│   │       └── storage.ts
│   ├── hooks/              # Custom React hooks (TS)
│   ├── utils/              # Utility functions (TS)
│   │   ├── utils.ts
│   │   ├── pagination.ts
│   │   └── categoryUtils.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts        # ✅ Common types
│   │   └── api.ts          # ✅ API types
│   └── context/            # React context (TSX)
│       └── AppContext.tsx
├── public/                 # Static files
│   └── assets/
├── assets/                 # SCSS, fonts, images (not in src/)
│   ├── scss/
│   ├── img/
│   └── fonts/
├── tsconfig.json           # ✅ TypeScript config with @/ aliases
├── next.config.js
└── package.json
```

## Key Features

1. **`src/` Directory** - All source code in one place (modern standard)
2. **TypeScript Throughout** - All `.js` → `.ts/.tsx`
3. **Path Aliases** - Use `@/` for clean imports
4. **Type Safety** - Full TypeScript support
5. **Modern Structure** - Follows React/Next.js best practices

## Path Aliases

All imports use `@/` prefix:
- `@/pages/*` → `src/pages/*`
- `@/components/*` → `src/components/*`
- `@/api/*` → `src/api/*`
- `@/types/*` → `src/types/*`
- `@/layouts/*` → `src/layouts/*`
- `@/utils/*` → `src/utils/*`
- `@/assets/*` → `assets/*` (stays outside src/)

## Next.js Support

Next.js automatically detects `src/pages/` directory - no configuration needed!

## Migration Status

- ✅ TypeScript setup complete
- ✅ `src/` directory structure created
- ✅ Type definitions created
- ✅ Core files converted (auth, apihook, login)
- ⏳ Converting remaining files...
