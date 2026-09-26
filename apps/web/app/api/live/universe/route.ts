import { getLiveUniverse } from "../../../../lib/server/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(): Promise<Response> { return Response.json(await getLiveUniverse()); }
