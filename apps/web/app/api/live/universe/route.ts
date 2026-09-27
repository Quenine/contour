import { getLiveUniverse } from "../../../../lib/server/live";
import { apiJson, limitPublicRequest } from "../../../../lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request): Promise<Response> {
  const limited = limitPublicRequest(request, "live-universe", 30, 60_000);
  if (limited) return limited;
  return apiJson(await getLiveUniverse());
}
