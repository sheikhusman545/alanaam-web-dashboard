import { NextRequest } from "next/server";
import { proxyRequest } from "../../../_utils/proxy-handler";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/api/admin/security/users/${params.id}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'status') {
    return proxyRequest(request, `/api/admin/security/users/updatestatus/${params.id}`);
  }
  
  // Assume it's an update
  return proxyRequest(request, `/api/admin/security/users/update/${params.id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/api/admin/security/users/delete/${params.id}`, { method: 'POST' });
}

