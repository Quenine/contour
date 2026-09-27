import { getPublicAccount } from "../../../lib/server/live";
import { apiJson, limitPublicRequest } from "../../../lib/server/http";
import { logServerEvent, upstreamMessage, upstreamStatus } from "../../../lib/server/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request): Promise<Response> {
  const limited = limitPublicRequest(request, "account-read", 12, 60_000);
  if (limited) return limited;
  try {
    const address = new URL(request.url).searchParams.get("address");
    if (!address) return apiJson({ error: "enter a valid public Hyperliquid address" }, { status: 400 });
    return apiJson(await getPublicAccount(address));
  } catch (error) {
    if (error instanceof Error && error.message.includes("valid public Hyperliquid address")) return apiJson({ error: error.message }, { status: 400 });
    logServerEvent("public-account-read-failed", error);
    return apiJson({ error: upstreamMessage(error) }, { status: upstreamStatus(error) });
  }
}
