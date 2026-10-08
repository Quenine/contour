import { compileTerminalPayoff } from "@contour/compiler";
import { executionSnapshot } from "@contour/execution";
import { verifiedFixtureRequestIdentity } from "../../../../lib/presentation/fixture-profile";
import { createFixtureRequest } from "../../../../lib/server/fixture";
import { planFixtureExecution } from "../../../../lib/server/execution";
import { presentCompilerResult } from "../../../../lib/server/presentation";
import { apiJson, limitPublicRequest } from "../../../../lib/server/http";
import { logCompileOutcome, logServerEvent } from "../../../../lib/server/observability";

export const runtime = "nodejs";
export async function POST(request: Request): Promise<Response> {
  const limited = limitPublicRequest(request, "fixture-execution", 24, 60_000);
  if (limited) return limited;
  try {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const snapshot = executionSnapshot(request);
    const dto = presentCompilerResult(request, result, { mode: "fixture", requestIdentity: verifiedFixtureRequestIdentity, targetPresentation: "minimumPnl", marketSnapshotIdentity: snapshot.identity }, planFixtureExecution(request, result, verifiedFixtureRequestIdentity));
    logCompileOutcome("fixture", dto.status, dto.executionPreview?.status);
    return apiJson(dto);
  } catch (error) { logServerEvent("fixture-execution-read-failed", error); return apiJson({ error: "The verified fixture preview could not be produced." }, { status: 500 }); }
}
export function GET(): Response { return apiJson({ error: "method not allowed" }, { status: 405, headers: { allow: "POST" } }); }
