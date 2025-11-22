import { NextRequest } from "next/server";
import { proxyRequest } from "../../../_utils/proxy-handler";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/api/admin/security/usertypes/${params.id}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const pathname = request.nextUrl.pathname;
  
  // Check if it's an update or delete operation based on path segments
  // Path would be like /api/adminusers/usertypes/[id]/update or /api/adminusers/usertypes/[id]/delete
  // But Next.js dynamic routes don't support this, so we'll check query params or handle in catch-all
  
  // For now, assume it's an update
  return proxyRequest(request, `/api/admin/security/usertypes/update/${params.id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/api/admin/security/usertypes/delete/${params.id}`, { method: 'POST' });
}

