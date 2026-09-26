import { getPublicAccount } from "../../../lib/server/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request): Promise<Response> {
  try {
    const address = new URL(request.url).searchParams.get("address");
    return Response.json(await getPublicAccount(address));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "public account is unavailable" }, { status: 400 });
  }
}
