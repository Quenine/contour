import { compileRequestFingerprint } from "./identity";

export const VERIFIED_FIXTURE = {
  version: "btc-risk-demo-2026-1",
  settlementTimestamp: "2026-10-01T00:00:00.000Z",
  direction: "long" as const,
  quantity: "0.1",
  entryPrice: "84000",
  minimumPrice: "70000",
  maximumPrice: "90000",
  minimumTerminalPnl: "-800",
  maximumBudget: "100",
  strikes: ["76000", "82000", "88000"] as const
} as const;

export const verifiedFixtureRequestIdentity = compileRequestFingerprint({ mode: "fixture", fixtureVersion: VERIFIED_FIXTURE.version });
