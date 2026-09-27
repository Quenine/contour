import { HyperliquidReader } from "@contour/hyperliquid";
import { apiJson, limitPublicRequest } from "../../../lib/server/http";
import { logServerEvent } from "../../../lib/server/observability";
import { buildIdentity } from "../../../lib/server/build-identity";
import { healthPayload } from "../../../lib/server/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const healthReader = new HyperliquidReader({ timeoutMs: 2_500, metadataCacheMs: 0 });

export async function GET(request: Request): Promise<Response> {
  const limited = limitPublicRequest(request, "health", 120, 60_000);
  if (limited) return limited;
  let liveData: "available" | "degraded" = "available";
  try { await healthReader.btcPerpetual(); }
  catch (error) { liveData = "degraded"; logServerEvent("health-live-provider-degraded", error); }
  return apiJson(healthPayload(liveData, buildIdentity), { status: 200 });
}
