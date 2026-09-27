import { compileLive } from "../../../../lib/server/live";
import { parseLiveCompileInput } from "../../../../lib/server/input";
import { apiJson, limitPublicRequest, readJsonBounded } from "../../../../lib/server/http";
import { logCompileOutcome, logServerEvent, upstreamMessage, upstreamStatus } from "../../../../lib/server/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(): Response { return apiJson({ error: "method not allowed" }, { status: 405, headers: { allow: "POST" } }); }
export async function POST(request: Request): Promise<Response> {
  const limited = limitPublicRequest(request, "live-compile", 6, 60_000);
  if (limited) return limited;
  try {
    const body = parseLiveCompileInput(await readJsonBounded(request));
    const result = await compileLive(body);
    logCompileOutcome("live", result.status, result.executionPreview?.status);
    return apiJson(result);
  } catch (error) {
    if (error instanceof Error && (error.message.includes("request body") || error.message.includes("content-type") || error.message.includes("must be") || error.message.includes("unsupported") || error.message.includes("invalid") || error.message.includes("required"))) {
      return apiJson({ status: "INVALID_REQUEST", issues: [error.message], freshness: [] }, { status: 400 });
    }
    logServerEvent("live-compile-failed", error);
    return apiJson({ status: "UPSTREAM_UNAVAILABLE", error: upstreamMessage(error), freshness: [] }, { status: upstreamStatus(error) });
  }
}
