"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CompilationDto, LiveUniverseDto, PublicAccountDto, TerminalMode } from "../lib/presentation/types";
import { PayoffChart } from "./payoff-chart";
import { ResultPanels } from "./result-panels";
import { StatusPill } from "./status-pill";

type Progress = "ready" | "validating" | "fetching market depth" | "compiling" | "verifying" | "feasible" | "already satisfied" | "infeasible" | "invalid request" | "verification failure" | "solver failure";
const stateForResult = (status: CompilationDto["status"]): Progress => ({ FEASIBLE: "feasible", ALREADY_SATISFIED: "already satisfied", INFEASIBLE: "infeasible", INVALID_REQUEST: "invalid request", VERIFICATION_FAILED: "verification failure", SOLVER_FAILURE: "solver failure" } as const)[status];

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body: unknown = await response.json();
  if (!response.ok) throw new Error(typeof body === "object" && body !== null && "error" in body && typeof body.error === "string" ? body.error : "request failed");
  return body as T;
}

export function Terminal(): React.JSX.Element {
  const [mode, setMode] = useState<TerminalMode>("fixture");
  const [progress, setProgress] = useState<Progress>("ready");
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

  const loadLive = useCallback(async () => {
    setError(undefined);
    try {
      const universe = await json<LiveUniverseDto>("/api/live/universe");
      setLive(universe);
      setSettlement((current) => current || universe.settlementGroups[0]?.timestamp || "");
      if (universe.btcMark) setEntryPrice(universe.btcMark);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "live market data is unavailable"); }
  }, []);
  const runFixture = useCallback(async () => {
    setProgress("compiling"); setError(undefined);
    try { const compiled = await json<CompilationDto>("/api/fixture/compile", { method: "POST" }); setResult(compiled); setProgress(stateForResult(compiled.status)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "fixture compilation failed"); setProgress("solver failure"); }
  }, []);
  useEffect(() => { void runFixture(); }, [runFixture]);
  useEffect(() => { if (mode === "live") void loadLive(); }, [mode, loadLive]);

  const currentGroup = useMemo(() => live?.settlementGroups.find((group) => group.timestamp === settlement), [live, settlement]);
  const compileLive = async (): Promise<void> => {
    setProgress("validating"); setError(undefined);
    if (!settlement) { setProgress("invalid request"); setError("Choose a supported exact settlement horizon."); return; }
    setProgress("fetching market depth");
    try {
      const exposure = exposureSource === "synthetic" ? { source: "synthetic" as const, direction, quantity, entryPrice } : { source: "account" as const, address, positionIndex: selectedPosition };
      setProgress("compiling");
      const compiled = await json<CompilationDto>("/api/live/compile", { method: "POST", body: JSON.stringify({ settlementTimestamp: settlement, minimumPrice: rangeMin, maximumPrice: rangeMax, constraintMode, constraintValue, maximumBudget: budget, exposure }) });
      setProgress("verifying"); setResult(compiled); setProgress(stateForResult(compiled.status));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "live compilation failed"); setProgress("invalid request"); }
  };
  const loadAccount = async (): Promise<void> => {
    setError(undefined);
    try { const publicAccount = await json<PublicAccountDto>(`/api/account?address=${encodeURIComponent(address)}`); setAccount(publicAccount); setExposureSource("account"); setSelectedPosition(publicAccount.positions.find((position) => position.asset === "BTC")?.index ?? 0); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "public account is unavailable"); }
  };

  return <main className="terminal-shell"><header className="topbar"><div><a className="wordmark" href="/">CONTOUR</a><p>Compile the payoff you want.</p></div><nav><a href="#terminal">Terminal</a><a href="/system">System</a><span className="readonly">READ-ONLY</span></nav></header><section className="terminal-intro"><div><p className="eyebrow">HYPERLIQUID SETTLEMENT PAYOFF COMPILER</p><h1>Specify the settlement outcome.<br />Inspect the construction.</h1></div><p>Contour converts terminal-risk constraints into liquidity-aware outcome overlays and independently verifies the supported result.</p></section><section id="terminal" className="mode-switch" aria-label="Workflow mode"><button type="button" className={mode === "fixture" ? "active" : ""} onClick={() => setMode("fixture")}>Verified Fixture Demo <small>deterministic</small></button><button type="button" className={mode === "live" ? "active" : ""} onClick={() => setMode("live")}>Live Market <small>read-only</small></button>{mode === "live" && <button type="button" className="text-button" onClick={() => void loadLive()}>Refresh market status</button>}</section>
    {error && <div className="notice error-notice">{error}</div>}
    <section className="terminal-grid"><aside className="input-stack"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">A · PORTFOLIO</p><h2>{mode === "fixture" ? "Verified demo exposure" : "Existing BTC exposure"}</h2></div>{mode === "live" && <StatusPill value={live?.freshness.state ?? "UNAVAILABLE"} />}</div>{mode === "fixture" ? <div className="fixture-summary"><strong>LONG 1 BTC PERPETUAL</strong><span>Entry price 100 · deterministic fixture data</span></div> : <><div className="form-grid two"><label>Source<select value={exposureSource} onChange={(event) => setExposureSource(event.target.value as "synthetic" | "account")}><option value="synthetic">Synthetic exposure</option><option value="account">Public account</option></select></label><label>Direction<select value={direction} disabled={exposureSource === "account"} onChange={(event) => setDirection(event.target.value as "long" | "short")}><option value="long">Long</option><option value="short">Short</option></select></label></div>{exposureSource === "synthetic" ? <div className="form-grid two"><label>BTC quantity<input value={quantity} inputMode="decimal" onChange={(event) => setQuantity(event.target.value)} /></label><label>Entry price<input value={entryPrice} inputMode="decimal" onChange={(event) => setEntryPrice(event.target.value)} /></label></div> : <div className="account-box"><label>Public Hyperliquid address<input value={address} placeholder="0x…" onChange={(event) => setAddress(event.target.value)} /></label><button type="button" className="secondary-button" onClick={() => void loadAccount()}>Inspect public account</button>{account && (account.positions.filter((position) => position.asset === "BTC").length > 0 ? <label>BTC position<select value={selectedPosition} onChange={(event) => setSelectedPosition(Number(event.target.value))}>{account.positions.filter((position) => position.asset === "BTC").map((position) => <option key={position.index} value={position.index}>{position.direction} {position.quantity} {position.asset} @ {position.entryPrice}</option>)}</select></label> : <p className="muted">No supported BTC perpetual position found for this public address.</p>)}</div>}</>}</section>
      <section className="panel"><div className="panel-heading"><div><p className="eyebrow">B · SETTLEMENT INTENT</p><h2>{mode === "fixture" ? "Fixed demo constraint" : "Protection constraint"}</h2></div></div>{mode === "fixture" ? <dl className="metric-list"><div><dt>Settlement</dt><dd>2026-10-01 00:00 UTC</dd></div><div><dt>Protected range</dt><dd>0 — 100</dd></div><div><dt>Terminal PnL floor</dt><dd>-40</dd></div><div><dt>Maximum premium</dt><dd>100</dd></div><div><dt>Fees</dt><dd>Excluded</dd></div></dl> : <><label>Exact settlement horizon<select value={settlement} onChange={(event) => setSettlement(event.target.value)}><option value="">Select a supported horizon</option>{live?.settlementGroups.map((group) => <option key={group.timestamp} value={group.timestamp}>{new Date(group.timestamp).toLocaleString()} · {group.marketCount} binaries</option>)}</select></label><p className="input-help">{currentGroup ? `${currentGroup.marketCount} normalized BTC binaries; fees excluded.` : "Only normalized same-horizon markets are eligible."}</p><div className="form-grid two"><label>Min settlement price<input value={rangeMin} inputMode="decimal" onChange={(event) => setRangeMin(event.target.value)} /></label><label>Max settlement price<input value={rangeMax} inputMode="decimal" onChange={(event) => setRangeMax(event.target.value)} /></label></div><div className="form-grid two"><label>Constraint<select value={constraintMode} onChange={(event) => setConstraintMode(event.target.value as "minimumPnl" | "maximumLoss")}><option value="minimumPnl">Minimum terminal PnL</option><option value="maximumLoss">Maximum terminal loss</option></select></label><label>{constraintMode === "maximumLoss" ? "Maximum loss" : "Minimum PnL"}<input value={constraintValue} inputMode="decimal" onChange={(event) => setConstraintValue(event.target.value)} /></label></div><label>Maximum acquisition budget<input value={budget} inputMode="decimal" onChange={(event) => setBudget(event.target.value)} /></label></>}</section>
      <section className="panel compile-panel"><div><p className="eyebrow">C · COMPILE</p><h2>{progress}</h2><p>{mode === "fixture" ? "This construction is deterministic and never represents live liquidity." : "Live books are fetched only after the selected settlement horizon is compiled."}</p></div><button type="button" className="primary-button" onClick={() => void (mode === "fixture" ? runFixture() : compileLive())}>{mode === "fixture" ? "Compile fixture payoff" : "Compile payoff"}</button></section></aside>
      <div className="output-stack"><PayoffChart result={result} /><ResultPanels result={result} /></div></section></main>;
}
