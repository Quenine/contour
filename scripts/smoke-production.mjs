import process, { stderr, stdout } from "node:process";
import { URL } from "node:url";

const supplied = process.argv.slice(2).filter((argument) => argument !== "--")[0];
const baseUrl = (supplied ?? "http://localhost:3000").replace(/\/$/, "");
const timeout = globalThis.AbortSignal.timeout(45_000);

async function request(path, init) {
  const response = await globalThis.fetch(new URL(path, baseUrl), { ...init, signal: timeout });
  if (!response.ok) throw new Error(`${init?.method ?? "GET"} ${path} returned HTTP ${response.status}`);
  if (path.startsWith("/api/") && !(response.headers.get("cache-control") ?? "").includes("no-store")) throw new Error(`${path} is missing its non-cacheable API policy`);
  return response;
}

try {
  for (const path of ["/", "/system"]) {
    const response = await request(path);
    if (!(response.headers.get("content-type") ?? "").includes("text/html")) throw new Error(`${path} did not return HTML`);
    if (!response.headers.get("content-security-policy")) throw new Error(`${path} is missing the Content Security Policy`);
  }
  const health = await (await request("/api/health")).json();
  if (health.status !== "ok" || !health.compiler || !health.verifier || !health.build?.build) throw new Error("health response is missing required service/build identity");
  for (const path of ["/api/fixture/compile", "/api/fixture/execution"]) {
    const result = await (await request(path, { method: "POST" })).json();
    if (result.mode !== "fixture" || !result.status || !Array.isArray(result.freshness)) throw new Error(`${path} returned an invalid compilation response`);
    if (result.status === "FEASIBLE" && result.verification?.passed !== true) throw new Error(`${path} did not return a verified feasible result`);
    if (path.endsWith("/execution") && (result.executionPreview?.status !== "READY" || result.executionPreview?.verificationPassed !== true)) throw new Error("fixture execution preview is not dry-run READY and verified");
  }
  const method = await globalThis.fetch(new URL("/api/fixture/compile", baseUrl), { signal: timeout });
  if (method.status !== 405) throw new Error("fixture compile must reject GET with HTTP 405");
  stdout.write(`Production smoke passed: ${baseUrl} (live data: ${health.liveData ?? "unreported"})\n`);
} catch (error) {
  stderr.write(`Production smoke failed: ${error instanceof Error ? error.message : "unknown error"}\n`);
  process.exitCode = 1;
}
