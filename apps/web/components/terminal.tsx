"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatBtcPrice, formatMoney, formatUtc } from "../lib/presentation/format";
import { VERIFIED_FIXTURE, verifiedFixtureRequestIdentity } from "../lib/presentation/fixture-profile";
import { invalidatedCompileState } from "../lib/presentation/compile-state";
import { isResultCurrent, liveRequestFingerprint, marketContextFingerprint, type ActiveRequestIdentity, type LiveRequestFingerprintInput } from "../lib/presentation/identity";
import type { CompilationDto, LiveUniverseDto, PublicAccountDto, TerminalMode } from "../lib/presentation/types";
import { PayoffChart } from "./payoff-chart";
import { ResultPanels } from "./result-panels";
import { StatusPill } from "./status-pill";

type Progress = "not compiled" | "inputs changed" | "validating" | "fetching market depth" | "compiling" | "verifying" | "feasible" | "already satisfied" | "infeasible" | "invalid request" | "verification failure" | "solver failure";
const stateForResult = (status: CompilationDto["status"]): Progress => ({ FEASIBLE: "feasible", ALREADY_SATISFIED: "already satisfied", INFEASIBLE: "infeasible", INVALID_REQUEST: "invalid request", VERIFICATION_FAILED: "verification failure", SOLVER_FAILURE: "solver failure" } as const)[status];

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body: unknown = await response.json();
  if (!response.ok) throw new Error(typeof body === "object" && body !== null && "error" in body && typeof body.error === "string" ? body.error : "request failed");
  return body as T;
}

export function Terminal(): React.JSX.Element {
  const [mode, setMode] = useState<TerminalMode>("fixture");
  const [progress, setProgress] = useState<Progress>("not compiled");
  const [result, setResult] = useState<CompilationDto>();
  const [live, setLive] = useState<LiveUniverseDto>();
  const [account, setAccount] = useState<PublicAccountDto>();
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState("");
  const [exposureSource, setExposureSource] = useState<"synthetic" | "account">("synthetic");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [quantity, setQuantity] = useState("0.01");
  const [entryPrice, setEntryPrice] = useState("80000");
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [settlement, setSettlement] = useState("");
  const [rangeMin, setRangeMin] = useState("55000");
  const [rangeMax, setRangeMax] = useState("85000");
  const [constraintMode, setConstraintMode] = useState<"minimumPnl" | "maximumLoss">("minimumPnl");
  const [constraintValue, setConstraintValue] = useState("-2500");
  const [budget, setBudget] = useState("400");

  const liveRequest = useMemo<LiveRequestFingerprintInput>(() => ({
    mode: "live",
    exposure: exposureSource === "synthetic" ? { source: "synthetic", direction, quantity, entryPrice } : { source: "account", address, positionIndex: selectedPosition },
    settlementTimestamp: settlement, minimumPrice: rangeMin, maximumPrice: rangeMax, constraintMode, constraintValue, maximumBudget: budget, feeTreatment: "excluded"
  }), [address, budget, constraintMode, constraintValue, direction, entryPrice, exposureSource, quantity, rangeMax, rangeMin, selectedPosition, settlement]);
  const activeRequest = useMemo<ActiveRequestIdentity>(() => mode === "fixture"
    ? { mode: "fixture", requestIdentity: verifiedFixtureRequestIdentity }
    : { mode: "live", requestIdentity: liveRequestFingerprint(liveRequest), marketContextIdentity: marketContextFingerprint(live?.freshness) }, [live?.freshness, liveRequest, mode]);
  const activeRequestRef = useRef<ActiveRequestIdentity>(activeRequest);
  const requestVersionRef = useRef(0);
  activeRequestRef.current = activeRequest;
  const visibleResult = isResultCurrent(result, activeRequest) ? result : undefined;
  const currentGroup = useMemo(() => live?.settlementGroups.find((group) => group.timestamp === settlement), [live, settlement]);

  const invalidate = useCallback((next: Progress = "inputs changed"): void => {
    requestVersionRef.current += 1;
    const cleared = invalidatedCompileState(next === "not compiled" ? "not compiled" : "inputs changed");
    setResult(cleared.result); setError(cleared.error); setProgress(next);
  }, []);
  const updateInput = (update: () => void): void => { invalidate(); update(); };

  const loadLive = useCallback(async (): Promise<void> => {
    invalidate();
    try {
      const universe = await json<LiveUniverseDto>("/api/live/universe");
      if (activeRequestRef.current.mode !== "live") return;
      setLive(universe);
      setSettlement((current) => current || universe.settlementGroups[0]?.timestamp || "");
      if (universe.btcMark) setEntryPrice(universe.btcMark);
    } catch (reason) {
      if (activeRequestRef.current.mode === "live") setError(reason instanceof Error ? reason.message : "live market data is unavailable");
    }
  }, [invalidate]);

  const runFixture = useCallback(async (): Promise<void> => {
    const requested = { mode: "fixture" as const, requestIdentity: verifiedFixtureRequestIdentity };
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    setProgress("compiling"); setError(undefined); setResult(undefined);
    try {
      const compiled = await json<CompilationDto>("/api/fixture/compile", { method: "POST" });
      if (requestVersion !== requestVersionRef.current || !isResultCurrent(compiled, activeRequestRef.current) || !isResultCurrent(compiled, requested)) return;
      setProgress("verifying"); setResult(compiled); setProgress(stateForResult(compiled.status));
    } catch (reason) {
      if (activeRequestRef.current.mode === "fixture") { setError(reason instanceof Error ? reason.message : "fixture compilation failed"); setProgress("solver failure"); }
    }
  }, []);

  useEffect(() => { void runFixture(); }, [runFixture]);
  useEffect(() => { if (mode === "live") void loadLive(); }, [loadLive, mode]);

  const compileLive = async (): Promise<void> => {
    const requested = activeRequestRef.current;
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    setProgress("validating"); setError(undefined); setResult(undefined);
    if (!settlement) { setProgress("invalid request"); setError("Choose a supported exact settlement horizon."); return; }
    setProgress("fetching market depth");
    try {
      const compiled = await json<CompilationDto>("/api/live/compile", { method: "POST", body: JSON.stringify({ ...liveRequest, marketContextIdentity: requested.marketContextIdentity }) });
      if (requestVersion !== requestVersionRef.current || !isResultCurrent(compiled, activeRequestRef.current) || !isResultCurrent(compiled, requested)) return;
      setProgress("verifying"); setResult(compiled); setProgress(stateForResult(compiled.status));
    } catch (reason) {
      if (requestVersion === requestVersionRef.current && activeRequestRef.current.mode === "live" && activeRequestRef.current.requestIdentity === requested.requestIdentity) { setError(reason instanceof Error ? reason.message : "live compilation failed"); setProgress("invalid request"); }
    }
  };

  const loadAccount = async (): Promise<void> => {
    invalidate();
    try {
      const publicAccount = await json<PublicAccountDto>(`/api/account?address=${encodeURIComponent(address)}`);
      if (activeRequestRef.current.mode !== "live") return;
      setAccount(publicAccount); setExposureSource("account"); setSelectedPosition(publicAccount.positions.find((position) => position.asset === "BTC")?.index ?? 0);
    } catch (reason) { if (activeRequestRef.current.mode === "live") setError(reason instanceof Error ? reason.message : "public account is unavailable"); }
  };

  const switchMode = (next: TerminalMode): void => {
    if (next === mode) return;
    setMode(next); invalidate("not compiled");
  };

  return <main className="terminal-shell"><header className="topbar"><div><a className="wordmark" href="/">CONTOUR</a><p>Compile the payoff you want.</p></div><nav><a href="#terminal">Terminal</a><a href="/system">System</a><span className="readonly">READ-ONLY</span></nav></header>
    <section className="terminal-intro"><div><p className="eyebrow">HYPERLIQUID SETTLEMENT PAYOFF COMPILER</p><h1>Specify the settlement outcome.<br />Inspect the construction.</h1></div><p>Position, payoff intent, construction, and exact proof — all tied to the same request.</p></section>
    <section id="terminal" className="mode-switch" aria-label="Workflow mode"><button type="button" className={mode === "fixture" ? "active" : ""} onClick={() => switchMode("fixture")}>Verified Fixture Demo <small>deterministic</small></button><button type="button" className={mode === "live" ? "active" : ""} onClick={() => switchMode("live")}>Live Market <small>read-only</small></button>{mode === "live" && <button type="button" className="text-button" onClick={() => void loadLive()}>Refresh market status</button>}</section>
    {error && <div className="notice error-notice">{error}</div>}
    <section className="terminal-grid"><aside className="input-stack"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">A · PORTFOLIO</p><h2>{mode === "fixture" ? "Verified demo exposure" : "Existing BTC exposure"}</h2></div>{mode === "live" && <StatusPill value={live?.freshness.state ?? "UNAVAILABLE"} />}</div>
      {mode === "fixture" ? <div className="fixture-summary"><strong>LONG {VERIFIED_FIXTURE.quantity} BTC PERPETUAL</strong><span>Entry {formatBtcPrice(VERIFIED_FIXTURE.entryPrice)} · DETERMINISTIC DATA</span></div> : <><div className="form-grid two"><label>Source<select value={exposureSource} onChange={(event) => updateInput(() => setExposureSource(event.target.value as "synthetic" | "account"))}><option value="synthetic">Synthetic exposure</option><option value="account">Public account</option></select></label><label>Direction<select value={direction} disabled={exposureSource === "account"} onChange={(event) => updateInput(() => setDirection(event.target.value as "long" | "short"))}><option value="long">Long</option><option value="short">Short</option></select></label></div>{exposureSource === "synthetic" ? <div className="form-grid two"><label>BTC quantity<input value={quantity} inputMode="decimal" onChange={(event) => updateInput(() => setQuantity(event.target.value))} /></label><label>Entry price<input value={entryPrice} inputMode="decimal" onChange={(event) => updateInput(() => setEntryPrice(event.target.value))} /></label></div> : <div className="account-box"><label>Public Hyperliquid address<input value={address} placeholder="0x…" onChange={(event) => updateInput(() => setAddress(event.target.value))} /></label><button type="button" className="secondary-button" onClick={() => void loadAccount()}>Inspect public account</button>{account && (account.positions.filter((position) => position.asset === "BTC").length > 0 ? <label>BTC position<select value={selectedPosition} onChange={(event) => updateInput(() => setSelectedPosition(Number(event.target.value)))}>{account.positions.filter((position) => position.asset === "BTC").map((position) => <option key={position.index} value={position.index}>{position.direction} {position.quantity} {position.asset} @ {formatBtcPrice(position.entryPrice)}</option>)}</select></label> : <p className="muted">No supported BTC perpetual position found for this public address.</p>)}</div>}</>}</section>
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">B · SETTLEMENT INTENT</p><h2>{mode === "fixture" ? "Fixed demo constraint" : "Protection constraint"}</h2></div></div>{mode === "fixture" ? <dl className="metric-list"><div><dt>Settlement</dt><dd>{formatUtc(VERIFIED_FIXTURE.settlementTimestamp)}</dd></div><div><dt>Protected range</dt><dd>{formatBtcPrice(VERIFIED_FIXTURE.minimumPrice)} — {formatBtcPrice(VERIFIED_FIXTURE.maximumPrice)}</dd></div><div><dt>Terminal PnL floor</dt><dd>{formatMoney(VERIFIED_FIXTURE.minimumTerminalPnl)}</dd></div><div><dt>Maximum premium</dt><dd>{formatMoney(VERIFIED_FIXTURE.maximumBudget)}</dd></div><div><dt>Fees</dt><dd>Excluded</dd></div></dl> : <><label>Exact settlement horizon<select value={settlement} onChange={(event) => updateInput(() => setSettlement(event.target.value))}><option value="">Select a supported horizon</option>{live?.settlementGroups.map((group) => <option key={group.timestamp} value={group.timestamp}>{formatUtc(group.timestamp)} · {group.marketCount} binaries</option>)}</select></label><p className="input-help">{currentGroup ? `${currentGroup.marketCount} normalized BTC binaries; fees excluded.` : "Only normalized same-horizon markets are eligible."}</p><div className="form-grid two"><label>Min settlement price<input value={rangeMin} inputMode="decimal" onChange={(event) => updateInput(() => setRangeMin(event.target.value))} /></label><label>Max settlement price<input value={rangeMax} inputMode="decimal" onChange={(event) => updateInput(() => setRangeMax(event.target.value))} /></label></div><div className="form-grid two"><label>Constraint<select value={constraintMode} onChange={(event) => updateInput(() => setConstraintMode(event.target.value as "minimumPnl" | "maximumLoss"))}><option value="minimumPnl">Minimum terminal PnL</option><option value="maximumLoss">Maximum terminal loss</option></select></label><label>{constraintMode === "maximumLoss" ? "Maximum loss" : "Minimum PnL"}<input value={constraintValue} inputMode="decimal" onChange={(event) => updateInput(() => setConstraintValue(event.target.value))} /></label></div><label>Maximum acquisition budget<input value={budget} inputMode="decimal" onChange={(event) => updateInput(() => setBudget(event.target.value))} /></label></>}</section>
      <section className="panel compile-panel"><div><p className="eyebrow">C · COMPILE</p><h2>{progress}</h2><p>{progress === "inputs changed" ? "Inputs changed — compile again. Any previous construction has been cleared." : mode === "fixture" ? "This construction is deterministic and never represents live liquidity." : "Live books are fetched only after the selected settlement horizon is compiled."}</p></div><button type="button" className="primary-button" onClick={() => void (mode === "fixture" ? runFixture() : compileLive())}>{mode === "fixture" ? "Compile fixture payoff" : "Compile payoff"}</button></section></aside>
      <div className="output-stack"><PayoffChart result={visibleResult} /><ResultPanels result={visibleResult} /></div></section></main>;
}
