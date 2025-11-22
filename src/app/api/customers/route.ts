import { NextRequest } from "next/server";
import { proxyRequest } from "../_utils/proxy-handler";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Backend uses /getcustomers endpoint
  return proxyRequest(request, '/api/admin/ecom/customers/getcustomers');
}

