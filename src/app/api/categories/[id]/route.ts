import { NextRequest } from "next/server";
import { proxyRequest } from "../../_utils/proxy-handler";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/api/admin/ecom/categories/${params.id}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'status') {
    return proxyRequest(request, `/api/admin/ecom/categories/updatestatus/${params.id}`);
  }
  
  return proxyRequest(request, `/api/admin/ecom/categories/update/${params.id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Backend expects POST for delete operations
  return proxyRequest(request, `/api/admin/ecom/categories/delete/${params.id}`, { method: 'POST' });
}

