export function createBuildIdentity(revision: string): { readonly build: "SUBMISSION"; readonly revision: string } {
  return Object.freeze({ build: "SUBMISSION", revision: /^[a-f0-9]{7,40}$/i.test(revision) ? revision.slice(0, 12) : revision === "local" ? "local" : "deployment" });
}

export const buildIdentity = createBuildIdentity(process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? process.env.BUILD_ID ?? "local");
