(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/components/payoff-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayoffChart",
    ()=>PayoffChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function PayoffChart({ result }) {
    const chart = result?.chart;
    if (!chart) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel chart-panel empty-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "eyebrow",
                children: "PAYOFF VISUALIZATION"
            }, void 0, false, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 7,
                columnNumber: 73
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Awaiting a verified construction"
            }, void 0, false, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 7,
                columnNumber: 120
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Compile the fixture or a live market request to compare display-only payoff curves."
            }, void 0, false, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 7,
                columnNumber: 161
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/payoff-chart.tsx",
        lineNumber: 7,
        columnNumber: 22
    }, this);
    const width = 900;
    const height = 350;
    const pad = {
        left: 58,
        right: 22,
        top: 24,
        bottom: 42
    };
    const values = chart.points.flatMap((point)=>[
            point.originalPnl,
            point.compiledPnl ?? point.originalPnl,
            chart.floor
        ]);
    const minY = Math.min(...values);
    const maxY = Math.max(...values);
    const ySpan = Math.max(1, maxY - minY);
    const xSpan = Math.max(1, chart.protectedMax - chart.protectedMin);
    const x = (value)=>pad.left + (value - chart.protectedMin) / xSpan * (width - pad.left - pad.right);
    const y = (value)=>height - pad.bottom - (value - minY) / ySpan * (height - pad.top - pad.bottom);
    const line = (field)=>chart.points.map((point, index)=>`${index === 0 ? "M" : "L"}${x(point.price).toFixed(2)},${y(point[field] ?? point.originalPnl).toFixed(2)}`).join(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel chart-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "panel-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "PAYOFF VISUALIZATION"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                lineNumber: 14,
                                columnNumber: 85
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Terminal PnL across settlement prices"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                lineNumber: 14,
                                columnNumber: 132
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 14,
                        columnNumber: 80
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "legend",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "legend-line original"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                        lineNumber: 14,
                                        columnNumber: 214
                                    }, this),
                                    "Original"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                lineNumber: 14,
                                columnNumber: 208
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "legend-line compiled"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                        lineNumber: 14,
                                        columnNumber: 273
                                    }, this),
                                    "Compiled"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                                lineNumber: 14,
                                columnNumber: 267
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 14,
                        columnNumber: 184
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 14,
                columnNumber: 49
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "payoff-chart",
                viewBox: `0 0 ${width} ${height}`,
                role: "img",
                "aria-label": "Original and compiled terminal PnL chart",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: x(chart.protectedMin),
                        y: pad.top,
                        width: x(chart.protectedMax) - x(chart.protectedMin),
                        height: height - pad.top - pad.bottom,
                        className: "protected-range"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 15,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: pad.left,
                        x2: width - pad.right,
                        y1: y(0),
                        y2: y(0),
                        className: "axis"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 16,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: pad.left,
                        x2: width - pad.right,
                        y1: y(chart.floor),
                        y2: y(chart.floor),
                        className: "floor-line"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 17,
                        columnNumber: 5
                    }, this),
                    chart.strikes.map((strike)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: x(strike.price),
                            x2: x(strike.price),
                            y1: pad.top,
                            y2: height - pad.bottom,
                            className: "strike-line"
                        }, `${strike.label}-${strike.price}`, false, {
                            fileName: "[project]/apps/web/components/payoff-chart.tsx",
                            lineNumber: 18,
                            columnNumber: 36
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: line("originalPnl"),
                        className: "curve original"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 19,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: line("compiledPnl"),
                        className: "curve compiled"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 20,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: pad.left,
                        y: height - 12,
                        className: "chart-text",
                        children: [
                            "$",
                            chart.protectedMin.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 21,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: width - pad.right,
                        y: height - 12,
                        textAnchor: "end",
                        className: "chart-text",
                        children: [
                            "$",
                            chart.protectedMax.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 21,
                        columnNumber: 108
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: pad.left,
                        y: y(chart.floor) - 6,
                        className: "chart-text floor-text",
                        children: [
                            "Floor ",
                            chart.floor.toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/payoff-chart.tsx",
                        lineNumber: 22,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 14,
                columnNumber: 338
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "chart-note",
                children: chart.note
            }, void 0, false, {
                fileName: "[project]/apps/web/components/payoff-chart.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/payoff-chart.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_c = PayoffChart;
var _c;
__turbopack_context__.k.register(_c, "PayoffChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/result-panels.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResultPanels",
    ()=>ResultPanels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/status-pill.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ResultPanels({ result }) {
    _s();
    const [segmentsOpen, setSegmentsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!result) return null;
    if (result.status === "FEASIBLE") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "result-grid",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel verification success",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "panel-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: "EXACT SETTLEMENT VERIFICATION"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 157
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Passed"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 213
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 152
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                                value: "FEASIBLE"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 234
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 121
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "metric-list",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Worst terminal PnL"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 304
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.verification?.worstCasePnl
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 331
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 299
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Worst settlement state"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 386
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: [
                                            result.verification?.worstCasePrice,
                                            " · ",
                                            result.verification?.worstCasePosition
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 417
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 381
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Relevant boundary states"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 517
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.verification?.boundaryStateCount
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 550
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 512
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Acquisition premium"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 611
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.acquisitionCost
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 639
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 606
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Fee treatment"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 683
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.feeTreatment
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 705
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 678
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Depth constraints"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 746
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: "Respected"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 772
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 741
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Book snapshot"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 801
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.freshness[0]?.observedAt ?? "Unavailable"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 823
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 796
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        children: "Freshness"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 893
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        children: result.freshness.length ? result.freshness.map((entry)=>entry.state).join(", ") : "Unavailable"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 911
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 888
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 271
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "scope-warning",
                        children: "Contour verifies terminal settlement payoff. It does not eliminate intra-period liquidation risk, future funding, book changes after this snapshot, incomplete fills, or settlement/oracle risks outside this model."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 1030
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 10,
                columnNumber: 73
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel construction",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "panel-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "eyebrow",
                                        children: "CONSTRUCTION"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 1361
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Selected positions"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 1400
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 1356
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "count",
                                children: result.selectedPositions?.length ?? 0
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 1433
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 1325
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "position-list",
                        children: result.selectedPositions?.map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "position-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "#",
                                                    position.marketId,
                                                    " · ",
                                                    position.side.toUpperCase()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1670
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: position.statement
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1739
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 1665
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Quantity"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1777
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: position.quantity
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1798
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 1772
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Premium"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1845
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: position.acquisitionCost
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 1865
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 1840
                                    }, this)
                                ]
                            }, `${position.marketId}-${position.side}`, true, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 10,
                                columnNumber: 1585
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 1509
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "secondary-button",
                        type: "button",
                        onClick: ()=>setSegmentsOpen((open)=>!open),
                        children: [
                            segmentsOpen ? "Hide" : "Inspect",
                            " execution segments (",
                            result.executionSegments?.length ?? 0,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 1932
                    }, this),
                    segmentsOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "segment-table-wrap",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Market"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 2208
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Side"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 2223
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Book price"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 2236
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Chosen"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 2255
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Available"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                                lineNumber: 10,
                                                columnNumber: 2270
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/result-panels.tsx",
                                        lineNumber: 10,
                                        columnNumber: 2204
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                    lineNumber: 10,
                                    columnNumber: 2197
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: result.executionSegments?.map((segment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: [
                                                        "#",
                                                        segment.marketId,
                                                        " / L",
                                                        segment.bookLevel + 1
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                                    lineNumber: 10,
                                                    columnNumber: 2421
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: segment.side.toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                                    lineNumber: 10,
                                                    columnNumber: 2476
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: segment.bookPrice
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                                    lineNumber: 10,
                                                    columnNumber: 2513
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: segment.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                                    lineNumber: 10,
                                                    columnNumber: 2541
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: segment.available
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                                    lineNumber: 10,
                                                    columnNumber: 2568
                                                }, this)
                                            ]
                                        }, `${segment.marketId}-${segment.side}-${segment.bookLevel}`, true, {
                                            fileName: "[project]/apps/web/components/result-panels.tsx",
                                            lineNumber: 10,
                                            columnNumber: 2352
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/components/result-panels.tsx",
                                    lineNumber: 10,
                                    columnNumber: 2301
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/components/result-panels.tsx",
                            lineNumber: 10,
                            columnNumber: 2190
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 10,
                        columnNumber: 2154
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 10,
                columnNumber: 1285
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/result-panels.tsx",
        lineNumber: 10,
        columnNumber: 44
    }, this);
    if (result.status === "ALREADY_SATISFIED") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel result-state success",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                value: result.status
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 11,
                columnNumber: 101
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Already satisfied"
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 11,
                columnNumber: 137
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "The existing terminal exposure meets this constraint. No additional outcome positions are required."
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 11,
                columnNumber: 163
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: "Acquisition premium: 0"
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 11,
                columnNumber: 269
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/result-panels.tsx",
        lineNumber: 11,
        columnNumber: 53
    }, this);
    if (result.status === "INFEASIBLE") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel result-state infeasible",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                value: result.status
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 12,
                columnNumber: 97
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "No executable contour found"
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 12,
                columnNumber: 133
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: result.infeasibility?.explanation
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 12,
                columnNumber: 169
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "metric-list",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Reason"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 244
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                children: result.infeasibility?.reason
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 259
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 12,
                        columnNumber: 239
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Budget"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 309
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                children: result.maximumAcquisitionCost
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 324
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 12,
                        columnNumber: 304
                    }, this),
                    result.infeasibility?.minimumRequiredBudget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Minimum required budget"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 423
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                children: result.infeasibility.minimumRequiredBudget
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/result-panels.tsx",
                                lineNumber: 12,
                                columnNumber: 455
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/result-panels.tsx",
                        lineNumber: 12,
                        columnNumber: 418
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 12,
                columnNumber: 211
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/result-panels.tsx",
        lineNumber: 12,
        columnNumber: 46
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel result-state error",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                value: result.status
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 13,
                columnNumber: 56
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: result.status.replaceAll("_", " ")
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 13,
                columnNumber: 92
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: result.explanation ?? result.issues?.join(" · ")
            }, void 0, false, {
                fileName: "[project]/apps/web/components/result-panels.tsx",
                lineNumber: 13,
                columnNumber: 137
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/result-panels.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s(ResultPanels, "CxCmv3GRo/gj9f9/3EZDKXwmfWw=");
_c = ResultPanels;
var _c;
__turbopack_context__.k.register(_c, "ResultPanels");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/status-pill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusPill",
    ()=>StatusPill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function StatusPill({ value }) {
    const tone = value === "FEASIBLE" || value === "LIVE" || value === "ALREADY_SATISFIED" ? "good" : value === "INFEASIBLE" || value === "STALE" ? "warn" : value === "UNAVAILABLE" || value === "INVALID_REQUEST" || value === "VERIFICATION_FAILED" || value === "SOLVER_FAILURE" ? "bad" : "neutral";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `status-pill ${tone}`,
        children: value.replaceAll("_", " ")
    }, void 0, false, {
        fileName: "[project]/apps/web/components/status-pill.tsx",
        lineNumber: 3,
        columnNumber: 10
    }, this);
}
_c = StatusPill;
var _c;
__turbopack_context__.k.register(_c, "StatusPill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/terminal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Terminal",
    ()=>Terminal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.6_@types+node@24._da50992b59334c77a30e2c76b5f2fc01/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$payoff$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/payoff-chart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$result$2d$panels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/result-panels.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/components/status-pill.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const stateForResult = (status)=>({
        FEASIBLE: "feasible",
        ALREADY_SATISFIED: "already satisfied",
        INFEASIBLE: "infeasible",
        INVALID_REQUEST: "invalid request",
        VERIFICATION_FAILED: "verification failure",
        SOLVER_FAILURE: "solver failure"
    })[status];
async function json(url, init) {
    const response = await fetch(url, {
        ...init,
        headers: {
            "content-type": "application/json",
            ...init?.headers ?? {}
        }
    });
    const body = await response.json();
    if (!response.ok) throw new Error(typeof body === "object" && body !== null && "error" in body && typeof body.error === "string" ? body.error : "request failed");
    return body;
}
function Terminal() {
    _s();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("fixture");
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ready");
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [live, setLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [account, setAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [exposureSource, setExposureSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("synthetic");
    const [direction, setDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("long");
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("0.01");
    const [entryPrice, setEntryPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("80000");
    const [selectedPosition, setSelectedPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [settlement, setSettlement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [rangeMin, setRangeMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("55000");
    const [rangeMax, setRangeMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("85000");
    const [constraintMode, setConstraintMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("minimumPnl");
    const [constraintValue, setConstraintValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("-2500");
    const [budget, setBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("400");
    const loadLive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[loadLive]": async ()=>{
            setError(undefined);
            try {
                const universe = await json("/api/live/universe");
                setLive(universe);
                setSettlement({
                    "Terminal.useCallback[loadLive]": (current)=>current || universe.settlementGroups[0]?.timestamp || ""
                }["Terminal.useCallback[loadLive]"]);
                if (universe.btcMark) setEntryPrice(universe.btcMark);
            } catch (reason) {
                setError(reason instanceof Error ? reason.message : "live market data is unavailable");
            }
        }
    }["Terminal.useCallback[loadLive]"], []);
    const runFixture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[runFixture]": async ()=>{
            setProgress("compiling");
            setError(undefined);
            try {
                const compiled = await json("/api/fixture/compile", {
                    method: "POST"
                });
                setResult(compiled);
                setProgress(stateForResult(compiled.status));
            } catch (reason) {
                setError(reason instanceof Error ? reason.message : "fixture compilation failed");
                setProgress("solver failure");
            }
        }
    }["Terminal.useCallback[runFixture]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Terminal.useEffect": ()=>{
            void runFixture();
        }
    }["Terminal.useEffect"], [
        runFixture
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Terminal.useEffect": ()=>{
            if (mode === "live") void loadLive();
        }
    }["Terminal.useEffect"], [
        mode,
        loadLive
    ]);
    const currentGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Terminal.useMemo[currentGroup]": ()=>live?.settlementGroups.find({
                "Terminal.useMemo[currentGroup]": (group)=>group.timestamp === settlement
            }["Terminal.useMemo[currentGroup]"])
    }["Terminal.useMemo[currentGroup]"], [
        live,
        settlement
    ]);
    const compileLive = async ()=>{
        setProgress("validating");
        setError(undefined);
        if (!settlement) {
            setProgress("invalid request");
            setError("Choose a supported exact settlement horizon.");
            return;
        }
        setProgress("fetching market depth");
        try {
            const exposure = exposureSource === "synthetic" ? {
                source: "synthetic",
                direction,
                quantity,
                entryPrice
            } : {
                source: "account",
                address,
                positionIndex: selectedPosition
            };
            setProgress("compiling");
            const compiled = await json("/api/live/compile", {
                method: "POST",
                body: JSON.stringify({
                    settlementTimestamp: settlement,
                    minimumPrice: rangeMin,
                    maximumPrice: rangeMax,
                    constraintMode,
                    constraintValue,
                    maximumBudget: budget,
                    exposure
                })
            });
            setProgress("verifying");
            setResult(compiled);
            setProgress(stateForResult(compiled.status));
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "live compilation failed");
            setProgress("invalid request");
        }
    };
    const loadAccount = async ()=>{
        setError(undefined);
        try {
            const publicAccount = await json(`/api/account?address=${encodeURIComponent(address)}`);
            setAccount(publicAccount);
            setExposureSource("account");
            setSelectedPosition(publicAccount.positions.find((position)=>position.asset === "BTC")?.index ?? 0);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "public account is unavailable");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "terminal-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "topbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "wordmark",
                                href: "/",
                                children: "CONTOUR"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 75
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Compile the payoff you want."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 119
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 70
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "#terminal",
                                children: "Terminal"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 165
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/system",
                                children: "System"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 197
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "readonly",
                                children: "READ-ONLY"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 225
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 160
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/terminal.tsx",
                lineNumber: 74,
                columnNumber: 43
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "terminal-intro",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "HYPERLIQUID SETTLEMENT PAYOFF COMPILER"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 324
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: [
                                    "Specify the settlement outcome.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 74,
                                        columnNumber: 424
                                    }, this),
                                    "Inspect the construction."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 389
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 319
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Contour converts terminal-risk constraints into liquidity-aware outcome overlays and independently verifies the supported result."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 466
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/terminal.tsx",
                lineNumber: 74,
                columnNumber: 283
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "terminal",
                className: "mode-switch",
                "aria-label": "Workflow mode",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: mode === "fixture" ? "active" : "",
                        onClick: ()=>setMode("fixture"),
                        children: [
                            "Verified Fixture Demo ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "deterministic"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 812
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 686
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: mode === "live" ? "active" : "",
                        onClick: ()=>setMode("live"),
                        children: [
                            "Live Market ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "read-only"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 74,
                                columnNumber: 959
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 849
                    }, this),
                    mode === "live" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "text-button",
                        onClick: ()=>void loadLive(),
                        children: "Refresh market status"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 74,
                        columnNumber: 1012
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/terminal.tsx",
                lineNumber: 74,
                columnNumber: 612
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "notice error-notice",
                children: error
            }, void 0, false, {
                fileName: "[project]/apps/web/components/terminal.tsx",
                lineNumber: 75,
                columnNumber: 15
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "terminal-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "input-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "eyebrow",
                                                        children: "A · PORTFOLIO"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 134
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: mode === "fixture" ? "Verified demo exposure" : "Existing BTC exposure"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 174
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 129
                                            }, this),
                                            mode === "live" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$status$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusPill"], {
                                                value: live?.freshness.state ?? "UNAVAILABLE"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 282
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 76,
                                        columnNumber: 98
                                    }, this),
                                    mode === "fixture" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fixture-summary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "LONG 1 BTC PERPETUAL"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 405
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Entry price 100 · deterministic fixture data"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 442
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 76,
                                        columnNumber: 372
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-grid two",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Source",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: exposureSource,
                                                                onChange: (event)=>setExposureSource(event.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "synthetic",
                                                                        children: "Synthetic exposure"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 672
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "account",
                                                                        children: "Public account"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 725
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 554
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 541
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Direction",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: direction,
                                                                disabled: exposureSource === "account",
                                                                onChange: (event)=>setDirection(event.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "long",
                                                                        children: "Long"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 946
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "short",
                                                                        children: "Short"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 980
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 805
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 789
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 510
                                            }, this),
                                            exposureSource === "synthetic" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-grid two",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "BTC quantity",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: quantity,
                                                                inputMode: "decimal",
                                                                onChange: (event)=>setQuantity(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 1123
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 1104
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Entry price",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: entryPrice,
                                                                inputMode: "decimal",
                                                                onChange: (event)=>setEntryPrice(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 1249
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 1231
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 1073
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "account-box",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Public Hyperliquid address",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: address,
                                                                placeholder: "0x…",
                                                                onChange: (event)=>setAddress(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 1432
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 1399
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "secondary-button",
                                                        onClick: ()=>void loadAccount(),
                                                        children: "Inspect public account"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 1536
                                                    }, this),
                                                    account && (account.positions.filter((position)=>position.asset === "BTC").length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "BTC position",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: selectedPosition,
                                                                onChange: (event)=>setSelectedPosition(Number(event.target.value)),
                                                                children: account.positions.filter((position)=>position.asset === "BTC").map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: position.index,
                                                                        children: [
                                                                            position.direction,
                                                                            " ",
                                                                            position.quantity,
                                                                            " ",
                                                                            position.asset,
                                                                            " @ ",
                                                                            position.entryPrice
                                                                        ]
                                                                    }, position.index, true, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 1950
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 1763
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 1744
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "muted",
                                                        children: "No supported BTC perpetual position found for this public address."
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 2114
                                                    }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 76,
                                                columnNumber: 1370
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 76,
                                        columnNumber: 508
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 76,
                                columnNumber: 71
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "eyebrow",
                                                    children: "B · SETTLEMENT INTENT"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/terminal.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 70
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: mode === "fixture" ? "Fixed demo constraint" : "Protection constraint"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/components/terminal.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 118
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/components/terminal.tsx",
                                            lineNumber: 77,
                                            columnNumber: 65
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 77,
                                        columnNumber: 34
                                    }, this),
                                    mode === "fixture" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "metric-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Settlement"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 266
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: "2026-10-01 00:00 UTC"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 285
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 261
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Protected range"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 325
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: "0 — 100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 349
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 320
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Terminal PnL floor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 376
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: "-40"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 403
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 371
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Maximum premium"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 426
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: "100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 450
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 421
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Fees"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 473
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: "Excluded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 486
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 468
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 77,
                                        columnNumber: 233
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Exact settlement horizon",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: settlement,
                                                        onChange: (event)=>setSettlement(event.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Select a supported horizon"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 633
                                                            }, this),
                                                            live?.settlementGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: group.timestamp,
                                                                    children: [
                                                                        new Date(group.timestamp).toLocaleString(),
                                                                        " · ",
                                                                        group.marketCount,
                                                                        " binaries"
                                                                    ]
                                                                }, group.timestamp, true, {
                                                                    fileName: "[project]/apps/web/components/terminal.tsx",
                                                                    lineNumber: 77,
                                                                    columnNumber: 724
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 550
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 519
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "input-help",
                                                children: currentGroup ? `${currentGroup.marketCount} normalized BTC binaries; fees excluded.` : "Only normalized same-horizon markets are eligible."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 881
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-grid two",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Min settlement price",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: rangeMin,
                                                                inputMode: "decimal",
                                                                onChange: (event)=>setRangeMin(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 1110
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 1083
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Max settlement price",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: rangeMax,
                                                                inputMode: "decimal",
                                                                onChange: (event)=>setRangeMax(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 1245
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 1218
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 1052
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-grid two",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            "Constraint",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: constraintMode,
                                                                onChange: (event)=>setConstraintMode(event.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "minimumPnl",
                                                                        children: "Minimum terminal PnL"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 77,
                                                                        columnNumber: 1530
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "maximumLoss",
                                                                        children: "Maximum terminal loss"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                                        lineNumber: 77,
                                                                        columnNumber: 1586
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 1407
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 1390
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: [
                                                            constraintMode === "maximumLoss" ? "Maximum loss" : "Minimum PnL",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: constraintValue,
                                                                inputMode: "decimal",
                                                                onChange: (event)=>setConstraintValue(event.target.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 1735
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 1661
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 1359
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Maximum acquisition budget",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: budget,
                                                        inputMode: "decimal",
                                                        onChange: (event)=>setBudget(event.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 1896
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 77,
                                                columnNumber: 1863
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 77,
                                        columnNumber: 517
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 77,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel compile-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "eyebrow",
                                                children: "C · COMPILE"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 78,
                                                columnNumber: 53
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: progress
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 78,
                                                columnNumber: 91
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: mode === "fixture" ? "This construction is deterministic and never represents live liquidity." : "Live books are fetched only after the selected settlement horizon is compiled."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/components/terminal.tsx",
                                                lineNumber: 78,
                                                columnNumber: 110
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 78,
                                        columnNumber: 48
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "primary-button",
                                        onClick: ()=>void (mode === "fixture" ? runFixture() : compileLive()),
                                        children: mode === "fixture" ? "Compile fixture payoff" : "Compile payoff"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/components/terminal.tsx",
                                        lineNumber: 78,
                                        columnNumber: 302
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 78,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 76,
                        columnNumber: 40
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "output-stack",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$payoff$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayoffChart"], {
                                result: result
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 79,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$6_$40$types$2b$node$40$24$2e$_da50992b59334c77a30e2c76b5f2fc01$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$result$2d$panels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResultPanels"], {
                                result: result
                            }, void 0, false, {
                                fileName: "[project]/apps/web/components/terminal.tsx",
                                lineNumber: 79,
                                columnNumber: 68
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/components/terminal.tsx",
                        lineNumber: 79,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/components/terminal.tsx",
                lineNumber: 76,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/components/terminal.tsx",
        lineNumber: 74,
        columnNumber: 10
    }, this);
}
_s(Terminal, "Ljin21UOdJqo2uLnXNxhIwH01QY=");
_c = Terminal;
var _c;
__turbopack_context__.k.register(_c, "Terminal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_components_0rm86ag._.js.map