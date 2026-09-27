"use client";

import type { CompilationDto } from "../lib/presentation/types";
import { formatBtcPrice, formatMoney } from "../lib/presentation/format";

export function PayoffChart({ result }: { readonly result: CompilationDto | undefined }): React.JSX.Element {
  const chart = result?.chart;
  if (!chart) return <section className="panel chart-panel empty-panel"><p className="eyebrow">PAYOFF VISUALIZATION</p><h2>Awaiting a verified construction</h2><p>Compile the fixture or a live market request to compare display-only payoff curves.</p></section>;
  const width = 900; const height = 350; const pad = { left: 58, right: 22, top: 24, bottom: 42 };
  const values = chart.points.flatMap((point) => [point.originalPnl, point.compiledPnl ?? point.originalPnl, chart.floor]);
  const minY = Math.min(...values); const maxY = Math.max(...values); const ySpan = Math.max(1, maxY - minY); const xSpan = Math.max(1, chart.protectedMax - chart.protectedMin);
  const x = (value: number) => pad.left + (value - chart.protectedMin) / xSpan * (width - pad.left - pad.right);
  const y = (value: number) => height - pad.bottom - (value - minY) / ySpan * (height - pad.top - pad.bottom);
  const line = (field: "originalPnl" | "compiledPnl") => chart.points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.price).toFixed(2)},${y(point[field] ?? point.originalPnl).toFixed(2)}`).join(" ");
  return <section className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">PAYOFF VISUALIZATION</p><h2>Terminal PnL across settlement prices</h2></div><div className="legend"><span><i className="legend-line original" />Original</span><span><i className="legend-line compiled" />Compiled</span></div></div><svg className="payoff-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="payoff-title payoff-description">
    <title id="payoff-title">Original and compiled terminal PnL chart</title><desc id="payoff-description">Sampled payoff visualization across settlement prices. Exact verification, shown separately, determines pass or fail.</desc>
    <rect x={x(chart.protectedMin)} y={pad.top} width={x(chart.protectedMax) - x(chart.protectedMin)} height={height - pad.top - pad.bottom} className="protected-range" />
    <line x1={pad.left} x2={width - pad.right} y1={y(0)} y2={y(0)} className="axis" />
    <line x1={pad.left} x2={width - pad.right} y1={y(chart.floor)} y2={y(chart.floor)} className="floor-line" />
    {chart.strikes.map((strike) => <line key={`${strike.label}-${strike.price}`} x1={x(strike.price)} x2={x(strike.price)} y1={pad.top} y2={height - pad.bottom} className="strike-line" />)}
    <path d={line("originalPnl")} className="curve original" />
    <path d={line("compiledPnl")} className="curve compiled" />
    <text x={pad.left} y={height - 12} className="chart-text">{formatBtcPrice(String(chart.protectedMin))}</text><text x={width - pad.right} y={height - 12} textAnchor="end" className="chart-text">{formatBtcPrice(String(chart.protectedMax))}</text>
    <text x={pad.left} y={y(chart.floor) - 6} className="chart-text floor-text">Floor {formatMoney(String(chart.floor))}</text>
  </svg><p className="chart-note">{chart.note}</p></section>;
}
