import { compileLive, type LiveCompileInput } from "../../../../lib/server/live";

export const runtime = "nodejs";
export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) return Response.json({ status: "INVALID_REQUEST", issues: ["request body must be an object"], freshness: [] }, { status: 400 });
    return Response.json(await compileLive(body as LiveCompileInput));
  } catch (error) {
    return Response.json({ status: "INVALID_REQUEST", issues: [error instanceof Error ? error.message : "live compile request failed"], freshness: [] }, { status: 400 });
  }
}
