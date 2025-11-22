import { NextRequest } from "next/server";
import { proxyRequest } from "../../_utils/proxy-handler";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/api/admin/ecom/reports/orderscategorywise');
}

