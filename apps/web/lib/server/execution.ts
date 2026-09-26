import type { CompileTerminalPayoffRequest, CompileTerminalPayoffResult } from "@contour/compiler";
import { UtcTimestamp } from "@contour/domain";
import { executionSnapshot, knownHip4ProtocolFee, outcomeMetadataForRequest, planExecution, type ExecutionPlanResult } from "@contour/execution";

export function planFixtureExecution(request: CompileTerminalPayoffRequest, result: CompileTerminalPayoffResult, requestIdentity: string): ExecutionPlanResult {
  const snapshot = executionSnapshot(request); const checkedAt = request.policy.compilationTime;
  return planExecution({ request, compilerResult: result, requestIdentity, compilerSnapshotIdentity: snapshot.identity,
    protocolMetadata: outcomeMetadataForRequest(request, { precision: { kind: "KNOWN", szDecimals: 2, source: "BUILD 03 deterministic HIP-4 fixture metadata" }, observedAt: checkedAt }),
    protocolFee: knownHip4ProtocolFee(checkedAt), checkedAt, maximumBookAgeMs: 45_000 });
}

export function planLiveExecution(request: CompileTerminalPayoffRequest, result: CompileTerminalPayoffResult, requestIdentity: string, checkedAt = UtcTimestamp.fromEpochMilliseconds(Date.now())): ExecutionPlanResult {
  const snapshot = executionSnapshot(request);
  return planExecution({ request, compilerResult: result, requestIdentity, compilerSnapshotIdentity: snapshot.identity,
    protocolMetadata: outcomeMetadataForRequest(request, { precision: { kind: "UNAVAILABLE", source: "Hyperliquid outcomeMeta read", explanation: "current outcomeMeta does not expose outcome-side szDecimals, so the documented spot-style size/tick rule cannot be instantiated without guessing" }, observedAt: checkedAt }),
    protocolFee: knownHip4ProtocolFee(checkedAt), checkedAt, maximumBookAgeMs: 30_000 });
}
