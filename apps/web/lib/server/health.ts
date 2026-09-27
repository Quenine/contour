import type { buildIdentity } from "./build-identity";

export type LiveHealthState = "available" | "degraded";
export function healthPayload(liveData: LiveHealthState, build: typeof buildIdentity) {
  return { status: "ok" as const, liveData, compiler: "available" as const, verifier: "available" as const, build };
}
