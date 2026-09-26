import { compileTerminalPayoff } from "@contour/compiler";
import { createFixtureRequest } from "../../../../lib/server/fixture";
import { presentCompilerResult } from "../../../../lib/server/presentation";
import { verifiedFixtureRequestIdentity } from "../../../../lib/presentation/fixture-profile";

export const runtime = "nodejs";
export async function POST(): Promise<Response> {
  const request = createFixtureRequest();
  return Response.json(presentCompilerResult(request, await compileTerminalPayoff(request), { mode: "fixture", requestIdentity: verifiedFixtureRequestIdentity }));
}
