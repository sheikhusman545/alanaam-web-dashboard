# Modern Next.js App Router API Routes Structure

## ✅ App Router API Routes (route.ts files)

Next.js 13+ App Router uses `route.ts` files for API endpoints. This is the modern pattern.

### Structure

```
src/app/api/
├── auth/
│   └── login/
│       └── route.ts          # POST /api/auth/login
├── categories/
│   ├── route.ts              # GET, POST /api/categories
│   └── [id]/
│       └── route.ts          # GET, POST, DELETE /api/categories/[id]
├── products/
│   ├── route.ts              # GET, POST /api/products
│   └── [id]/
│       └── route.ts          # GET, POST, DELETE /api/products/[id]
├── orders/
│   ├── route.ts              # GET /api/orders
│   └── [id]/
│       └── route.ts          # GET, POST /api/orders/[id]
├── bookings/
│   ├── route.ts              # GET, POST /api/bookings
│   └── [id]/
│       └── route.ts          # GET, POST /api/bookings/[id]
├── users/
│   ├── route.ts              # GET, POST /api/users
│   └── [id]/
│       └── route.ts          # GET, POST, DELETE /api/users/[id]
└── reports/
    ├── productwise/
    │   └── route.ts          # GET /api/reports/productwise
    ├── categorywise/
    │   └── route.ts          # GET /api/reports/categorywise
    └── datewise/
        └── route.ts          # GET /api/reports/datewise
```

## Route.ts File Pattern

Each `route.ts` file exports HTTP method handlers:

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Handle POST request
  return NextResponse.json({ data: "..." });
}

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ data: "..." });
}
```

## Dynamic Routes

For dynamic routes like `/api/categories/[id]`:

```typescript
// src/app/api/categories/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // Use id...
}
```

## Benefits

- ✅ Modern Next.js 13+ App Router pattern
- ✅ TypeScript support out of the box
- ✅ Better type safety with NextRequest/NextResponse
- ✅ Cleaner file structure
- ✅ Server-side execution (secure)
- ✅ Automatic route handling

## Created Routes

- ✅ `/api/auth/login` - Login endpoint
- ✅ `/api/categories` - Categories CRUD
- ✅ `/api/categories/[id]` - Category by ID

## Next Steps

Create remaining routes:
- [ ] `/api/products/route.ts`
- [ ] `/api/orders/route.ts`
- [ ] `/api/bookings/route.ts`
- [ ] `/api/users/route.ts`
- [ ] `/api/reports/*/route.ts`

