import { compileTerminalPayoff } from "@contour/compiler";
import { createFixtureRequest } from "../../../../lib/server/fixture";
import { presentCompilerResult } from "../../../../lib/server/presentation";
import { verifiedFixtureRequestIdentity } from "../../../../lib/presentation/fixture-profile";
import { executionSnapshot } from "@contour/execution";
import { planFixtureExecution } from "../../../../lib/server/execution";

export const runtime = "nodejs";
export async function POST(): Promise<Response> {
  const request = createFixtureRequest();
  const result = await compileTerminalPayoff(request); const snapshot = executionSnapshot(request);
  return Response.json(presentCompilerResult(request, result, { mode: "fixture", requestIdentity: verifiedFixtureRequestIdentity, marketSnapshotIdentity: snapshot.identity }, planFixtureExecution(request, result, verifiedFixtureRequestIdentity)));
}
