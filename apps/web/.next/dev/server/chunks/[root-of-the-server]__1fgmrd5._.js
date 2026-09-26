module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[project]/apps/web/app/api/live/universe/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$live$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/server/live.ts [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function GET() {
    return Response.json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$live$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLiveUniverse"])());
}
}),
"[project]/apps/web/lib/server/input.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "freshnessState",
    ()=>freshnessState,
    "minimumPnlFromInput",
    ()=>minimumPnlFromInput,
    "parseDecimalInput",
    ()=>parseDecimalInput,
    "validatePublicAddress",
    ()=>validatePublicAddress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
;
function parseDecimalInput(value, label) {
    if (typeof value !== "string") throw new Error(`${label} must be supplied as a decimal string`);
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(value);
    } catch  {
        throw new Error(`${label} must be a valid decimal`);
    }
}
function minimumPnlFromInput(mode, value) {
    const amount = parseDecimalInput(value, mode === "maximumLoss" ? "maximum loss" : "minimum terminal PnL");
    if (mode === "minimumPnl") return amount;
    if (mode === "maximumLoss") {
        if (amount.isNegative()) throw new Error("maximum loss must be non-negative");
        return amount.negate();
    }
    throw new Error("constraint mode is unsupported");
}
function validatePublicAddress(value) {
    if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error("enter a valid public Hyperliquid address");
    return value;
}
function freshnessState(observedAt, maximumAgeMs, nowMs = Date.now()) {
    if (!observedAt || !Number.isSafeInteger(maximumAgeMs) || maximumAgeMs < 0) return "UNAVAILABLE";
    const observed = Date.parse(observedAt);
    if (!Number.isFinite(observed)) return "UNAVAILABLE";
    return nowMs - observed <= maximumAgeMs ? "LIVE" : "STALE";
}
}),
"[project]/apps/web/lib/server/live.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compileLive",
    ()=>compileLive,
    "getLiveUniverse",
    ()=>getLiveUniverse,
    "getPublicAccount",
    ()=>getPublicAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/compiler/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/compiler.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/models.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$client$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/client.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/server/input.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$presentation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/server/presentation.ts [app-route] (ecmascript)");
;
;
;
;
;
const reader = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$client$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HyperliquidReader"]();
const btc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assetSymbol"])("BTC");
const fresh = (observedAt, source, network)=>({
        state: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshnessState"])(observedAt, 120_000),
        observedAt,
        source,
        network
    });
function binaryMarkets(outcomes) {
    return outcomes.filter((outcome)=>outcome.kind === "binaryPrice" && outcome.underlying === btc);
}
async function getLiveUniverse() {
    try {
        const [perp, outcomes] = await Promise.all([
            reader.btcPerpetual(),
            reader.outcomeMarkets()
        ]);
        const supported = binaryMarkets(outcomes);
        const groups = new Map();
        for (const market of supported){
            if (Date.parse(market.settlementAt.value) > Date.now()) groups.set(market.settlementAt.value, [
                ...groups.get(market.settlementAt.value) ?? [],
                market
            ]);
        }
        return {
            freshness: fresh(perp.freshness.observedAt.value, perp.freshness.source, perp.freshness.network),
            btcMark: perp.markPrice.toString(),
            btcOracle: perp.oraclePrice.toString(),
            supportedBinaryCount: supported.length,
            settlementGroups: [
                ...groups.entries()
            ].map(([timestamp, markets])=>({
                    timestamp,
                    marketCount: markets.length,
                    markets: markets.sort((left, right)=>left.threshold.compare(right.threshold)).map((market)=>({
                            id: market.id,
                            threshold: market.threshold.toString(),
                            comparator: market.comparator === "greaterThan" ? ">" : ">="
                        }))
                })).sort((left, right)=>left.timestamp.localeCompare(right.timestamp))
        };
    } catch (error) {
        return {
            freshness: {
                state: "UNAVAILABLE"
            },
            supportedBinaryCount: 0,
            settlementGroups: [],
            unavailableReason: error instanceof Error ? error.message : "live market data is unavailable"
        };
    }
}
async function getPublicAccount(addressInput) {
    const address = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validatePublicAddress"])(addressInput);
    const snapshot = await reader.accountPerpetuals(address);
    return {
        address: snapshot.address,
        positions: snapshot.positions.map((position, index)=>({
                index,
                asset: position.asset,
                direction: position.direction,
                quantity: position.quantity.toString(),
                entryPrice: position.entryPrice.toString()
            })),
        freshness: fresh(snapshot.freshness.observedAt.value, snapshot.freshness.source, snapshot.freshness.network)
    };
}
async function existingExposure(input) {
    if (input.source === "synthetic") {
        if (input.direction !== "long" && input.direction !== "short") throw new Error("synthetic direction is unsupported");
        const quantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDecimalInput"])(input.quantity, "BTC quantity");
        if (quantity.compare(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero) <= 0) throw new Error("BTC quantity must be positive");
        return {
            kind: "perpetual",
            asset: btc,
            direction: input.direction,
            quantity,
            entryPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDecimalInput"])(input.entryPrice, "entry price"),
            externalTerms: "excluded"
        };
    }
    const account = await getPublicAccount(input.address);
    if (!Number.isSafeInteger(input.positionIndex) || input.positionIndex < 0) throw new Error("public account position selection is invalid");
    const selected = account.positions[input.positionIndex];
    if (!selected || selected.asset !== "BTC") throw new Error("the selected public account position is not a supported BTC perpetual");
    return {
        kind: "perpetual",
        asset: btc,
        direction: selected.direction,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(selected.quantity),
        entryPrice: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(selected.entryPrice),
        externalTerms: "excluded"
    };
}
async function compileLive(input) {
    const settlementTimestamp = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UtcTimestamp"].parse(input.settlementTimestamp);
    const outcomes = await reader.outcomeMarkets();
    const eligible = binaryMarkets(outcomes).filter((market)=>market.settlementAt.value === settlementTimestamp.value);
    const instruments = await Promise.all(eligible.map(async (market)=>{
        const [yesBook, noBook] = await Promise.all([
            reader.outcomeOrderBook(market.id, 0),
            reader.outcomeOrderBook(market.id, 1)
        ]);
        return {
            market,
            yesBook,
            noBook
        };
    }));
    const request = {
        existingPortfolio: {
            components: [
                await existingExposure(input.exposure)
            ]
        },
        settlement: {
            underlying: btc,
            timestamp: settlementTimestamp,
            priceRange: {
                min: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDecimalInput"])(input.minimumPrice, "minimum settlement price"),
                max: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDecimalInput"])(input.maximumPrice, "maximum settlement price")
            }
        },
        constraint: {
            minimumTerminalPnl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["minimumPnlFromInput"])(input.constraintMode, input.constraintValue)
        },
        maximumAcquisitionCost: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDecimalInput"])(input.maximumBudget, "maximum acquisition budget"),
        instruments,
        policy: {
            maximumBookAgeMs: 120_000,
            compilationTime: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UtcTimestamp"].fromEpochMilliseconds(Date.now()),
            feeModel: {
                kind: "excluded"
            }
        }
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$presentation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["presentCompilerResult"])(request, await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compileTerminalPayoff"])(request));
}
}),
"[project]/apps/web/lib/server/presentation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "presentCompilerResult",
    ()=>presentCompilerResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/payoff/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/payoff.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/server/input.ts [app-route] (ecmascript)");
;
;
;
const displayNumber = (value)=>Number(value.toString());
const freshness = (value, maximumAgeMs = 120_000)=>({
        state: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$server$2f$input$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshnessState"])(value.observedAt.value, maximumAgeMs),
        observedAt: value.observedAt.value,
        source: value.source,
        network: value.network
    });
function compiledPortfolio(request, result) {
    const markets = new Map(request.instruments.map((instrument)=>[
            instrument.market.id,
            instrument.market
        ]));
    const overlay = result.executionSegments.map((segment)=>{
        const market = markets.get(segment.marketId);
        if (!market) throw new Error("selected compiler market missing from request");
        return {
            kind: "binary",
            comparator: market.comparator,
            threshold: market.threshold,
            side: segment.side,
            shares: segment.quantity,
            premium: segment.acquisitionCost.add(segment.estimatedFee)
        };
    });
    return {
        components: [
            ...request.existingPortfolio.components,
            ...overlay
        ]
    };
}
/** Chart points are display-only samples. Exact verification is represented separately. */ function chartSamples(request, result) {
    const original = request.existingPortfolio;
    const compiled = compiledPortfolio(request, result);
    const minimum = displayNumber(request.settlement.priceRange.min);
    const maximum = displayNumber(request.settlement.priceRange.max);
    const count = 40;
    return Array.from({
        length: count + 1
    }, (_, index)=>{
        const price = minimum + (maximum - minimum) * index / count;
        const exactDisplayPrice = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(price.toFixed(8));
        return {
            price,
            originalPnl: displayNumber((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalPnl"])(original, exactDisplayPrice)),
            compiledPnl: displayNumber((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalPnl"])(compiled, exactDisplayPrice))
        };
    });
}
const common = (result)=>({
        underlying: result.underlying,
        settlementTimestamp: result.settlementTimestamp.value,
        priceRange: {
            min: result.requestedPriceRange.min.toString(),
            max: result.requestedPriceRange.max.toString()
        },
        minimumTerminalPnl: result.minimumTerminalPnl.toString(),
        maximumAcquisitionCost: result.maximumAcquisitionCost.toString()
    });
function presentCompilerResult(request, result) {
    if (result.status === "INVALID_REQUEST") return {
        status: result.status,
        issues: result.issues,
        freshness: []
    };
    if (result.status === "ALREADY_SATISFIED") return {
        status: result.status,
        ...common(result),
        acquisitionCost: "0",
        estimatedFees: "0",
        feeTreatment: request.policy.feeModel.kind,
        verification: {
            passed: result.verification.holds,
            worstCasePnl: result.verification.worstCase.terminalPnl.toString(),
            worstCasePrice: result.verification.worstCase.price.toString(),
            worstCasePosition: result.verification.worstCase.position,
            boundaryStateCount: result.verification.evaluatedPoints.length,
            points: result.verification.evaluatedPoints.map((point)=>({
                    price: point.price.toString(),
                    position: point.position,
                    pnl: point.terminalPnl.toString()
                }))
        },
        selectedPositions: [],
        executionSegments: [],
        freshness: []
    };
    if (result.status === "INFEASIBLE") return {
        status: result.status,
        ...common(result),
        infeasibility: {
            reason: result.reason,
            explanation: result.explanation,
            ...result.minimumAcquisitionCost ? {
                minimumRequiredBudget: result.minimumAcquisitionCost.toString()
            } : {}
        },
        freshness: []
    };
    if (result.status === "SOLVER_FAILURE") return {
        status: result.status,
        ...common(result),
        explanation: `${result.solverStatus}: ${result.explanation}`,
        freshness: []
    };
    if (result.status === "VERIFICATION_FAILED") return {
        status: result.status,
        ...common(result),
        explanation: result.explanation,
        executionSegments: result.executionSegments.map((segment)=>({
                marketId: segment.marketId,
                side: segment.side,
                bookLevel: segment.bookLevel,
                bookPrice: segment.bookPrice.toString(),
                quantity: segment.quantity.toString(),
                available: segment.maximumAvailableAtSnapshot.toString(),
                acquisitionCost: segment.acquisitionCost.toString(),
                estimatedFee: segment.estimatedFee.toString()
            })),
        freshness: []
    };
    const verification = result.verification;
    return {
        status: result.status,
        ...common(result),
        acquisitionCost: result.totalAcquisitionCost.toString(),
        estimatedFees: result.estimatedFees.toString(),
        feeTreatment: result.feeTreatment,
        verification: {
            passed: verification.holds,
            worstCasePnl: verification.worstCase.terminalPnl.toString(),
            worstCasePrice: verification.worstCase.price.toString(),
            worstCasePosition: verification.worstCase.position,
            boundaryStateCount: verification.evaluatedPoints.length,
            points: verification.evaluatedPoints.map((point)=>({
                    price: point.price.toString(),
                    position: point.position,
                    pnl: point.terminalPnl.toString()
                }))
        },
        selectedPositions: result.selectedPositions.map((position)=>{
            const market = request.instruments.find((instrument)=>instrument.market.id === position.marketId)?.market;
            return {
                marketId: position.marketId,
                statement: market ? `BTC ${market.comparator === "greaterThan" ? ">" : ">="} ${market.threshold.toString()} at ${market.settlementAt.value}` : "normalized binary outcome",
                side: position.side,
                quantity: position.totalQuantity.toString(),
                weightedAverage: {
                    acquisitionCost: position.weightedAveragePrice.acquisitionCost.toString(),
                    quantity: position.weightedAveragePrice.quantity.toString()
                },
                acquisitionCost: position.acquisitionCost.toString(),
                estimatedFee: position.estimatedFee.toString()
            };
        }),
        executionSegments: result.executionSegments.map((segment)=>({
                marketId: segment.marketId,
                side: segment.side,
                bookLevel: segment.bookLevel,
                bookPrice: segment.bookPrice.toString(),
                quantity: segment.quantity.toString(),
                available: segment.maximumAvailableAtSnapshot.toString(),
                acquisitionCost: segment.acquisitionCost.toString(),
                estimatedFee: segment.estimatedFee.toString()
            })),
        freshness: result.marketSnapshots.map((snapshot)=>freshness(snapshot)),
        chart: {
            points: chartSamples(request, result),
            strikes: request.instruments.map((instrument)=>({
                    price: displayNumber(instrument.market.threshold),
                    label: `#${instrument.market.id}`
                })),
            floor: displayNumber(request.constraint.minimumTerminalPnl),
            protectedMin: displayNumber(request.settlement.priceRange.min),
            protectedMax: displayNumber(request.settlement.priceRange.max),
            note: "Visualization samples only. Exact settlement verification determines pass/fail."
        }
    };
}
}),
"[project]/packages/compiler/dist/compiler.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compileTerminalPayoff",
    ()=>compileTerminalPayoff
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/payoff/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$verifier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/verifier.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$solver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/solver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$validation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/validation.js [app-route] (ecmascript)");
;
;
;
;
const diagnostics = (status)=>({
        solver: "HiGHS 1.15",
        solverStatus: status,
        solverFeasibilityTolerance: "1e-7 (solver only)",
        candidateDecimalPlaces: 12,
        exactPostSolveVerification: true
    });
const context = (request)=>({
        underlying: request.settlement.underlying,
        settlementTimestamp: request.settlement.timestamp,
        requestedPriceRange: request.settlement.priceRange,
        minimumTerminalPnl: request.constraint.minimumTerminalPnl,
        maximumAcquisitionCost: request.maximumAcquisitionCost
    });
function reconstructQuantity(value, maximum) {
    if (!Number.isFinite(value) || value < -1e-7) return undefined;
    const candidate = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(Math.max(0, value).toFixed(12));
    return candidate.compare(maximum) > 0 ? maximum : candidate;
}
function reconstructCandidate(problem, solved) {
    const executionSegments = [];
    const overlay = [];
    for (const segment of problem.segments){
        const column = solved.result.Columns[segment.variable];
        if (!column || !("Primal" in column)) return undefined;
        const quantity = reconstructQuantity(column.Primal, segment.available);
        if (!quantity) return undefined;
        if (quantity.isZero()) continue;
        const acquisitionCost = segment.price.multiply(quantity);
        const estimatedFee = segment.feePerShare.multiply(quantity);
        executionSegments.push({
            marketId: segment.market.id,
            side: segment.side,
            bookLevel: segment.bookLevel,
            bookPrice: segment.price,
            quantity,
            maximumAvailableAtSnapshot: segment.available,
            acquisitionCost,
            estimatedFee
        });
        overlay.push({
            kind: "binary",
            comparator: segment.market.comparator,
            threshold: segment.market.threshold,
            side: segment.side,
            shares: quantity,
            premium: acquisitionCost.add(estimatedFee)
        });
    }
    executionSegments.sort((left, right)=>BigInt(left.marketId) < BigInt(right.marketId) ? -1 : BigInt(left.marketId) > BigInt(right.marketId) ? 1 : left.side !== right.side ? left.side.localeCompare(right.side) : left.bookLevel - right.bookLevel);
    const acquisitionCost = executionSegments.reduce((sum, segment)=>sum.add(segment.acquisitionCost), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
    const fees = executionSegments.reduce((sum, segment)=>sum.add(segment.estimatedFee), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
    return {
        executionSegments,
        portfolio: {
            components: [
                ...problem.request.existingPortfolio.components,
                ...overlay
            ]
        },
        acquisitionCost,
        fees
    };
}
function selectedPositions(segments) {
    const groups = new Map();
    for (const segment of segments){
        const key = `${segment.marketId}:${segment.side}`;
        groups.set(key, [
            ...groups.get(key) ?? [],
            segment
        ]);
    }
    return [
        ...groups.values()
    ].map((items)=>{
        const first = items[0];
        const totalQuantity = items.reduce((sum, item)=>sum.add(item.quantity), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
        const acquisitionCost = items.reduce((sum, item)=>sum.add(item.acquisitionCost), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
        const estimatedFee = items.reduce((sum, item)=>sum.add(item.estimatedFee), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
        return {
            marketId: first.marketId,
            side: first.side,
            totalQuantity,
            weightedAveragePrice: {
                acquisitionCost,
                quantity: totalQuantity
            },
            acquisitionCost,
            estimatedFee
        };
    }).sort((left, right)=>BigInt(left.marketId) < BigInt(right.marketId) ? -1 : BigInt(left.marketId) > BigInt(right.marketId) ? 1 : left.side.localeCompare(right.side));
}
function verifyCandidate(problem, solved) {
    const candidate = reconstructCandidate(problem, solved);
    if (!candidate) return {
        status: "VERIFICATION_FAILED",
        ...context(problem.request),
        explanation: "solver quantities could not be reconstructed as bounded exact decimals",
        executionSegments: [],
        diagnostics: diagnostics(solved.result.Status)
    };
    const verification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$verifier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTerminalPayoff"])(candidate.portfolio, {
        settlementPriceMin: problem.request.settlement.priceRange.min,
        settlementPriceMax: problem.request.settlement.priceRange.max,
        minimumPnl: problem.request.constraint.minimumTerminalPnl
    });
    const totalCost = candidate.acquisitionCost.add(candidate.fees);
    const segmentBoundsHold = candidate.executionSegments.every((segment)=>segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0);
    if (!verification.holds || totalCost.compare(problem.request.maximumAcquisitionCost) > 0 || !segmentBoundsHold) {
        return {
            status: "VERIFICATION_FAILED",
            ...context(problem.request),
            explanation: "the reconstructed candidate failed exact payoff, budget, or depth verification",
            verification,
            executionSegments: candidate.executionSegments,
            diagnostics: diagnostics(solved.result.Status)
        };
    }
    return {
        status: "FEASIBLE",
        ...context(problem.request),
        selectedPositions: selectedPositions(candidate.executionSegments),
        executionSegments: candidate.executionSegments,
        totalAcquisitionCost: candidate.acquisitionCost,
        estimatedFees: candidate.fees,
        feeTreatment: problem.request.policy.feeModel.kind === "excluded" ? "excluded" : "included-fixed-per-share",
        verification,
        marketSnapshots: problem.segments.map((segment)=>segment.freshness).filter((item, index, all)=>all.findIndex((candidateFreshness)=>candidateFreshness.observedAt.value === item.observedAt.value && candidateFreshness.network === item.network && candidateFreshness.source === item.source) === index),
        relevantBoundaryStates: problem.states,
        diagnostics: diagnostics(solved.result.Status)
    };
}
async function compileTerminalPayoff(request) {
    const basicIssues = [];
    if (request.settlement.priceRange.min.compare(request.settlement.priceRange.max) > 0) basicIssues.push("settlement price range min must not exceed max");
    if (request.settlement.priceRange.min.isNegative()) basicIssues.push("settlement prices must be non-negative");
    if (request.maximumAcquisitionCost.isNegative()) basicIssues.push("maximum acquisition cost must be non-negative");
    if (request.existingPortfolio.components.some((component)=>component.kind !== "perpetual")) basicIssues.push("existingPortfolio may contain only perpetual exposure in BUILD 01");
    if (request.existingPortfolio.components.length > 1) basicIssues.push("BUILD 01 supports at most one existing perpetual component");
    if (!Number.isSafeInteger(request.policy.maximumBookAgeMs) || request.policy.maximumBookAgeMs < 0) basicIssues.push("maximumBookAgeMs must be a non-negative safe integer");
    if (request.policy.feeModel.kind === "fixedPerShare" && request.policy.feeModel.feePerShare.isNegative()) basicIssues.push("feePerShare must be non-negative");
    const existingPerp = request.existingPortfolio.components[0];
    if (existingPerp?.kind === "perpetual" && existingPerp.asset !== request.settlement.underlying) basicIssues.push("existing perpetual asset must match settlement underlying");
    if (basicIssues.length > 0) return {
        status: "INVALID_REQUEST",
        issues: basicIssues
    };
    const existingVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$verifier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTerminalPayoff"])(request.existingPortfolio, {
        settlementPriceMin: request.settlement.priceRange.min,
        settlementPriceMax: request.settlement.priceRange.max,
        minimumPnl: request.constraint.minimumTerminalPnl
    });
    if (existingVerification.holds) return {
        status: "ALREADY_SATISFIED",
        ...context(request),
        selectedPositions: [],
        executionSegments: [],
        totalAcquisitionCost: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero,
        estimatedFees: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero,
        verification: existingVerification
    };
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$validation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateCompileRequest"])(request);
    if (!validation.ok) {
        if (validation.noEligible) return {
            status: "INFEASIBLE",
            ...context(request),
            reason: "NO_ELIGIBLE_MARKETS",
            explanation: validation.issues.join("; ")
        };
        if (validation.stale) return {
            status: "INFEASIBLE",
            ...context(request),
            reason: "STALE_MARKET_DATA",
            explanation: validation.issues.join("; ")
        };
        return {
            status: "INVALID_REQUEST",
            issues: validation.issues
        };
    }
    if (validation.problem.segments.length === 0) return {
        status: "INFEASIBLE",
        ...context(request),
        reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE",
        explanation: "eligible markets contain no executable ask depth"
    };
    const budgeted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$solver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["solveProblem"])(validation.problem, true);
    if (budgeted.kind === "optimal") return verifyCandidate(validation.problem, budgeted);
    if (budgeted.kind === "failure") return {
        status: "SOLVER_FAILURE",
        ...context(request),
        solverStatus: budgeted.status,
        explanation: budgeted.message
    };
    const uncapped = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$solver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["solveProblem"])(validation.problem, false);
    if (uncapped.kind === "failure") return {
        status: "SOLVER_FAILURE",
        ...context(request),
        solverStatus: uncapped.status,
        explanation: uncapped.message
    };
    if (uncapped.kind === "infeasible") return {
        status: "INFEASIBLE",
        ...context(request),
        reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE",
        explanation: "even all eligible book depth cannot satisfy every exact settlement state"
    };
    const uncappedCandidate = reconstructCandidate(validation.problem, uncapped);
    if (!uncappedCandidate) return {
        status: "SOLVER_FAILURE",
        ...context(request),
        solverStatus: uncapped.result.Status,
        explanation: "uncapped solver quantities could not be reconstructed"
    };
    const uncappedVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$verifier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyTerminalPayoff"])(uncappedCandidate.portfolio, {
        settlementPriceMin: request.settlement.priceRange.min,
        settlementPriceMax: request.settlement.priceRange.max,
        minimumPnl: request.constraint.minimumTerminalPnl
    });
    if (!uncappedVerification.holds) return {
        status: "VERIFICATION_FAILED",
        ...context(request),
        explanation: "uncapped budget diagnostic failed exact verification",
        verification: uncappedVerification,
        executionSegments: uncappedCandidate.executionSegments,
        diagnostics: diagnostics(uncapped.result.Status)
    };
    return {
        status: "INFEASIBLE",
        ...context(request),
        reason: "BUDGET_TOO_LOW",
        explanation: "the exact-verified minimum-cost candidate exceeds the maximum acquisition cost",
        minimumAcquisitionCost: uncappedCandidate.acquisitionCost.add(uncappedCandidate.fees)
    };
}
}),
"[project]/packages/compiler/dist/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/compiler.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$model$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/model.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$solver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/solver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$validation$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/validation.js [app-route] (ecmascript)");
;
;
;
;
;
}),
"[project]/packages/compiler/dist/model.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildLinearProgram",
    ()=>buildLinearProgram,
    "contributionAtState",
    ()=>contributionAtState,
    "unitCost",
    ()=>unitCost,
    "validateBookLevels",
    ()=>validateBookLevels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/payoff/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/settlement-states.js [app-route] (ecmascript)");
;
;
const unitCost = (segment)=>segment.price.add(segment.feePerShare);
function contributionAtState(segment, state) {
    const resolvesYes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["binaryResolvesYesAtState"])({
        comparator: segment.market.comparator,
        threshold: segment.market.threshold
    }, state);
    const wins = segment.side === "yes" ? resolvesYes : !resolvesYes;
    return (wins ? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].one : __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero).subtract(unitCost(segment));
}
function expression(terms) {
    if (terms.length === 0) return "0";
    return terms.map(({ coefficient, variable }, index)=>{
        const negative = coefficient.isNegative();
        const sign = negative ? "-" : index === 0 ? "" : "+";
        return `${sign} ${coefficient.abs().toString()} ${variable}`.trim();
    }).join(" ");
}
function buildLinearProgram(problem, includeBudget) {
    const objective = expression(problem.segments.map((segment)=>({
            coefficient: unitCost(segment),
            variable: segment.variable
        })));
    const rows = problem.states.map((state, index)=>{
        const existing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalPnlAtSettlementState"])(problem.request.existingPortfolio, state);
        const required = problem.request.constraint.minimumTerminalPnl.subtract(existing);
        const terms = problem.segments.map((segment)=>({
                coefficient: contributionAtState(segment, state),
                variable: segment.variable
            }));
        return ` state_${index}: ${expression(terms)} >= ${required.toString()}`;
    });
    if (includeBudget) rows.push(` budget: ${objective} <= ${problem.request.maximumAcquisitionCost.toString()}`);
    const bounds = problem.segments.map((segment)=>` 0 <= ${segment.variable} <= ${segment.available.toString()}`);
    return [
        "Minimize",
        ` cost: ${objective}`,
        "Subject To",
        ...rows,
        "Bounds",
        ...bounds,
        "End"
    ].join("\n");
}
function validateBookLevels(levels, context) {
    const issues = [];
    levels.forEach((level, index)=>{
        if (level.price.compare(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero) <= 0 || level.price.compare(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].one) > 0) issues.push(`${context} ask ${index} price must be in (0, 1]`);
        if (level.quantity.compare(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero) <= 0) issues.push(`${context} ask ${index} quantity must be positive`);
        if (index > 0 && level.price.compare(levels[index - 1].price) < 0) issues.push(`${context} asks must be ordered cheapest first`);
    });
    return issues;
}
}),
"[project]/packages/compiler/dist/solver.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "solveProblem",
    ()=>solveProblem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$highs$40$1$2e$15$2e$3$2f$node_modules$2f$highs$2f$build$2f$highs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/highs@1.15.3/node_modules/highs/build/highs.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$model$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/model.js [app-route] (ecmascript)");
;
;
// highs publishes dual CJS/ESM runtime entries; this cast bridges TypeScript's
// NodeNext interop view to the package's declared default loader signature.
const loadHighs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$highs$40$1$2e$15$2e$3$2f$node_modules$2f$highs$2f$build$2f$highs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
let runtime;
const loadRuntime = ()=>runtime ??= loadHighs();
async function solveProblem(problem, includeBudget) {
    try {
        const highs = await loadRuntime();
        const result = highs.solve((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$model$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildLinearProgram"])(problem, includeBudget), {
            output_flag: false,
            solver: "simplex",
            primal_feasibility_tolerance: 1e-7,
            dual_feasibility_tolerance: 1e-7
        });
        if (result.Status === "Optimal") return {
            kind: "optimal",
            result
        };
        if (result.Status === "Infeasible" || result.Status === "Primal infeasible or unbounded") return {
            kind: "infeasible",
            status: result.Status
        };
        return {
            kind: "failure",
            status: result.Status,
            message: "HiGHS did not prove an optimal solution or infeasibility"
        };
    } catch (error) {
        return {
            kind: "failure",
            status: "exception",
            message: error instanceof Error ? error.message : "unknown solver exception"
        };
    }
}
}),
"[project]/packages/compiler/dist/validation.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateCompileRequest",
    ()=>validateCompileRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/payoff/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/settlement-states.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$model$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/compiler/dist/model.js [app-route] (ecmascript)");
;
;
;
function sameTimestamp(left, right) {
    return left.value === right.value;
}
function validateCompileRequest(request) {
    const issues = [];
    if (request.settlement.priceRange.min.compare(request.settlement.priceRange.max) > 0) issues.push("settlement price range min must not exceed max");
    if (request.settlement.priceRange.min.isNegative()) issues.push("settlement prices must be non-negative");
    if (request.maximumAcquisitionCost.isNegative()) issues.push("maximum acquisition cost must be non-negative");
    if (!Number.isSafeInteger(request.policy.maximumBookAgeMs) || request.policy.maximumBookAgeMs < 0) issues.push("maximumBookAgeMs must be a non-negative safe integer");
    if (request.policy.feeModel.kind === "fixedPerShare" && request.policy.feeModel.feePerShare.isNegative()) issues.push("feePerShare must be non-negative");
    if (request.existingPortfolio.components.some((component)=>component.kind !== "perpetual")) issues.push("existingPortfolio may contain only the fixed perpetual exposure in BUILD 01");
    if (request.existingPortfolio.components.length > 1) issues.push("BUILD 01 supports at most one existing perpetual component");
    const existingPerp = request.existingPortfolio.components[0];
    if (existingPerp?.kind === "perpetual" && existingPerp.asset !== request.settlement.underlying) issues.push("existing perpetual asset must match settlement underlying");
    if (issues.length > 0) return {
        ok: false,
        issues,
        noEligible: false,
        stale: false
    };
    const eligible = request.instruments.filter((instrument)=>instrument.market.underlying === request.settlement.underlying && sameTimestamp(instrument.market.settlementAt, request.settlement.timestamp));
    if (eligible.length === 0) return {
        ok: false,
        issues: [
            "no instruments match both settlement underlying and exact timestamp"
        ],
        noEligible: true,
        stale: false
    };
    const duplicateIds = eligible.filter((instrument, index)=>eligible.findIndex((candidate)=>candidate.market.id === instrument.market.id) !== index);
    if (duplicateIds.length > 0) issues.push("eligible market identifiers must be unique");
    const now = Date.parse(request.policy.compilationTime.value);
    let stale = false;
    const segments = [];
    eligible.forEach((instrument, instrumentIndex)=>{
        for (const [side, book, expectedIndex] of [
            [
                "yes",
                instrument.yesBook,
                0
            ],
            [
                "no",
                instrument.noBook,
                1
            ]
        ]){
            const context = `market ${instrument.market.id} ${side}`;
            if (book.outcomeId !== instrument.market.id || book.sideIndex !== expectedIndex) issues.push(`${context} book identifiers do not match the market side`);
            issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$compiler$2f$dist$2f$model$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateBookLevels"])(book.asks, context));
            const bestBid = book.bids[0];
            const bestAsk = book.asks[0];
            if (bestBid && bestAsk && bestBid.price.compare(bestAsk.price) > 0) issues.push(`${context} book is crossed`);
            const observed = Date.parse(book.freshness.observedAt.value);
            if (observed > now || now - observed > request.policy.maximumBookAgeMs) stale = true;
            book.asks.forEach((level, bookLevel)=>segments.push({
                    variable: `x_${instrumentIndex}_${side}_${bookLevel}`,
                    market: instrument.market,
                    side,
                    bookLevel,
                    price: level.price,
                    available: level.quantity,
                    feePerShare: request.policy.feeModel.kind === "fixedPerShare" ? request.policy.feeModel.feePerShare : __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero,
                    freshness: book.freshness
                }));
        }
    });
    if (stale) return {
        ok: false,
        issues: [
            "one or more eligible books violate the compile freshness policy"
        ],
        noEligible: false,
        stale: true
    };
    if (issues.length > 0) return {
        ok: false,
        issues,
        noEligible: false,
        stale: false
    };
    const states = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveRelevantSettlementStates"])(request.settlement.priceRange.min, request.settlement.priceRange.max, eligible.map((instrument)=>instrument.market.threshold));
    return {
        ok: true,
        problem: {
            request,
            instruments: eligible,
            segments,
            states
        }
    };
}
}),
"[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Exact base-10 decimal. It deliberately has no Number conversion API. */ __turbopack_context__.s([
    "DecimalAmount",
    ()=>DecimalAmount
]);
class DecimalAmount {
    coefficient;
    scale;
    constructor(coefficient, scale){
        let normalizedCoefficient = coefficient;
        let normalizedScale = scale;
        while(normalizedScale > 0 && normalizedCoefficient % 10n === 0n){
            normalizedCoefficient /= 10n;
            normalizedScale -= 1;
        }
        this.coefficient = normalizedCoefficient;
        this.scale = normalizedScale;
    }
    static parse(input) {
        const value = input.trim();
        const match = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(value);
        if (!match) throw new RangeError(`Invalid decimal: ${input}`);
        const sign = match[1] === "-" ? -1n : 1n;
        const integer = match[2] ?? "0";
        const fraction = match[3] ?? "";
        return new DecimalAmount(sign * BigInt(`${integer}${fraction}`), fraction.length);
    }
    static zero = new DecimalAmount(0n, 0);
    static one = new DecimalAmount(1n, 0);
    add(other) {
        const scale = Math.max(this.scale, other.scale);
        return new DecimalAmount(this.toScale(scale) + other.toScale(scale), scale);
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiply(other) {
        return new DecimalAmount(this.coefficient * other.coefficient, this.scale + other.scale);
    }
    negate() {
        return new DecimalAmount(-this.coefficient, this.scale);
    }
    abs() {
        return this.coefficient < 0n ? this.negate() : this;
    }
    compare(other) {
        const scale = Math.max(this.scale, other.scale);
        const left = this.toScale(scale);
        const right = other.toScale(scale);
        return left < right ? -1 : left > right ? 1 : 0;
    }
    isNegative() {
        return this.coefficient < 0n;
    }
    isZero() {
        return this.coefficient === 0n;
    }
    toString() {
        const negative = this.coefficient < 0n;
        const digits = (negative ? -this.coefficient : this.coefficient).toString();
        if (this.scale === 0) return `${negative ? "-" : ""}${digits}`;
        const padded = digits.padStart(this.scale + 1, "0");
        return `${negative ? "-" : ""}${padded.slice(0, -this.scale)}.${padded.slice(-this.scale)}`;
    }
    toScale(scale) {
        return this.coefficient * 10n ** BigInt(scale - this.scale);
    }
}
}),
"[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
;
;
}),
"[project]/packages/domain/dist/models.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UtcTimestamp",
    ()=>UtcTimestamp,
    "assetSymbol",
    ()=>assetSymbol,
    "outcomeId",
    ()=>outcomeId
]);
function assetSymbol(value) {
    if (!/^[A-Z0-9:_-]{1,32}$/.test(value)) throw new RangeError(`Invalid asset symbol: ${value}`);
    return value;
}
function outcomeId(value) {
    if (!/^\d+$/.test(value)) throw new RangeError(`Invalid outcome id: ${value}`);
    return value;
}
class UtcTimestamp {
    value;
    constructor(value){
        this.value = value;
    }
    static parse(value) {
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) {
            throw new RangeError(`Invalid UTC timestamp: ${value}`);
        }
        return new UtcTimestamp(new Date(value).toISOString());
    }
    static fromEpochMilliseconds(value) {
        if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("Invalid epoch timestamp");
        return new UtcTimestamp(new Date(value).toISOString());
    }
}
}),
"[project]/packages/hyperliquid/dist/client.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HyperliquidReader",
    ()=>HyperliquidReader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/models.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/normalize.js [app-route] (ecmascript)");
;
;
;
const endpoint = (network)=>network === "mainnet" ? "https://api.hyperliquid.xyz/info" : "https://api.hyperliquid-testnet.xyz/info";
class HyperliquidReader {
    network;
    timeoutMs;
    requestFetch;
    constructor(options = {}){
        this.network = options.network ?? "mainnet";
        this.timeoutMs = options.timeoutMs ?? 10_000;
        this.requestFetch = options.fetchImplementation ?? fetch;
    }
    async btcPerpetual() {
        const freshness = this.freshness();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeBtcPerpetual"])(await this.info({
            type: "metaAndAssetCtxs"
        }), freshness);
    }
    async accountPerpetuals(address) {
        if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("address must be a 20-byte hexadecimal address");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePerpetualAccount"])(address, await this.info({
            type: "clearinghouseState",
            user: address
        }), this.freshness());
    }
    async outcomeMarkets() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeOutcomeMeta"])(await this.info({
            type: "outcomeMeta"
        }), this.freshness());
    }
    async outcomeOrderBook(outcomeId, sideIndex = 0) {
        if (!/^\d+$/.test(outcomeId) || sideIndex !== 0 && sideIndex !== 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("invalid outcome identifier or side index");
        // Info reads use #<10*outcome+side>; the 100m-offset asset id is for order actions.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeOutcomeOrderBook"])(outcomeId, sideIndex, await this.info({
            type: "l2Book",
            coin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["outcomeSideCoin"])(outcomeId, sideIndex)
        }), this.freshness());
    }
    freshness() {
        return {
            observedAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UtcTimestamp"].fromEpochMilliseconds(Date.now()),
            network: this.network,
            source: "hyperliquid-direct"
        };
    }
    async info(body) {
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), this.timeoutMs);
        try {
            const response = await this.requestFetch(endpoint(this.network), {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            if (response.status === 429) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RateLimited"]("Hyperliquid read was rate limited");
            if (response.status === 404) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NotFound"]("Hyperliquid resource not found");
            if (!response.ok) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NetworkFailure"](`Hyperliquid returned HTTP ${response.status}`);
            try {
                return await response.json();
            } catch  {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("Hyperliquid returned invalid JSON");
            }
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RateLimited"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NotFound"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NetworkFailure"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]) throw error;
            if (error instanceof DOMException && error.name === "AbortError") throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Timeout"](`Hyperliquid read exceeded ${this.timeoutMs}ms`);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NetworkFailure"]("Hyperliquid read failed", error);
        } finally{
            clearTimeout(timeout);
        }
    }
}
}),
"[project]/packages/hyperliquid/dist/errors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HyperliquidReadError",
    ()=>HyperliquidReadError,
    "InvalidExternalPayload",
    ()=>InvalidExternalPayload,
    "NetworkFailure",
    ()=>NetworkFailure,
    "NotFound",
    ()=>NotFound,
    "RateLimited",
    ()=>RateLimited,
    "StaleMarketData",
    ()=>StaleMarketData,
    "Timeout",
    ()=>Timeout,
    "UnsupportedMarketSemantics",
    ()=>UnsupportedMarketSemantics
]);
class HyperliquidReadError extends Error {
    category;
    cause;
    constructor(message, category, cause){
        super(message);
        this.category = category;
        this.cause = cause;
        this.name = new.target.name;
    }
}
class NetworkFailure extends HyperliquidReadError {
    constructor(message, cause){
        super(message, "NetworkFailure", cause);
    }
}
class Timeout extends HyperliquidReadError {
    constructor(message){
        super(message, "Timeout");
    }
}
class RateLimited extends HyperliquidReadError {
    constructor(message){
        super(message, "RateLimited");
    }
}
class InvalidExternalPayload extends HyperliquidReadError {
    constructor(message){
        super(message, "InvalidExternalPayload");
    }
}
class UnsupportedMarketSemantics extends HyperliquidReadError {
    constructor(message){
        super(message, "UnsupportedMarketSemantics");
    }
}
class StaleMarketData extends HyperliquidReadError {
    constructor(message){
        super(message, "StaleMarketData");
    }
}
class NotFound extends HyperliquidReadError {
    constructor(message){
        super(message, "NotFound");
    }
}
}),
"[project]/packages/hyperliquid/dist/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$client$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/client.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$normalize$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/normalize.js [app-route] (ecmascript)");
;
;
;
}),
"[project]/packages/hyperliquid/dist/normalize.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertFresh",
    ()=>assertFresh,
    "normalizeBtcPerpetual",
    ()=>normalizeBtcPerpetual,
    "normalizeHip4Outcome",
    ()=>normalizeHip4Outcome,
    "normalizeOutcomeMeta",
    ()=>normalizeOutcomeMeta,
    "normalizeOutcomeOrderBook",
    ()=>normalizeOutcomeOrderBook,
    "normalizePerpetualAccount",
    ()=>normalizePerpetualAccount,
    "outcomeSideAssetId",
    ()=>outcomeSideAssetId,
    "outcomeSideCoin",
    ()=>outcomeSideCoin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/models.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/hyperliquid/dist/errors.js [app-route] (ecmascript)");
;
;
;
const record = (value, context)=>{
    if (typeof value !== "object" || value === null || Array.isArray(value)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"](`${context} must be an object`);
    return value;
};
const string = (value, context)=>{
    if (typeof value !== "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"](`${context} must be a string`);
    return value;
};
const finiteInteger = (value, context)=>{
    if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"](`${context} must be a safe integer`);
    return value;
};
const decimal = (value, context)=>{
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(string(value, context));
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"](`${context} must be a decimal string`);
    }
};
function assertFresh(freshness, maxAgeMs, nowMs = Date.now()) {
    if (!Number.isSafeInteger(maxAgeMs) || maxAgeMs < 0 || nowMs - Date.parse(freshness.observedAt.value) > maxAgeMs) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StaleMarketData"]("Market data exceeds its allowed freshness age");
}
function outcomeSideCoin(id, sideIndex) {
    return `#${10n * BigInt(id) + BigInt(sideIndex)}`;
}
function outcomeSideAssetId(id, sideIndex) {
    return (100000000n + 10n * BigInt(id) + BigInt(sideIndex)).toString();
}
function protocolIdentifiers(id) {
    return {
        outcomeId: id,
        yesCoin: outcomeSideCoin(id, 0),
        noCoin: outcomeSideCoin(id, 1),
        yesAssetId: outcomeSideAssetId(id, 0),
        noAssetId: outcomeSideAssetId(id, 1)
    };
}
function normalizeBtcPerpetual(payload, freshness) {
    if (!Array.isArray(payload) || payload.length !== 2) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("metaAndAssetCtxs must be a two item array");
    const arrayPayload = payload;
    const metaPayload = arrayPayload[0];
    const contexts = arrayPayload[1];
    const meta = record(metaPayload, "meta");
    const universe = meta["universe"];
    if (!Array.isArray(universe) || !Array.isArray(contexts) || universe.length !== contexts.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("universe/context mismatch");
    const index = universe.findIndex((item)=>{
        try {
            return string(record(item, "universe item")["name"], "universe name") === "BTC";
        } catch  {
            return false;
        }
    });
    if (index < 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("BTC absent from perpetual universe");
    const ctx = record(contexts[index], "BTC asset context");
    return {
        asset: "BTC",
        markPrice: decimal(ctx["markPx"], "markPx"),
        oraclePrice: decimal(ctx["oraclePx"], "oraclePx"),
        freshness
    };
}
function normalizePerpetualAccount(address, payload, freshness) {
    const root = record(payload, "clearinghouseState");
    const rawPositions = root["assetPositions"];
    if (!Array.isArray(rawPositions)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("assetPositions must be an array");
    const positions = rawPositions.map((entry, index)=>{
        const position = record(record(entry, `assetPositions[${index}]`)["position"], `position[${index}]`);
        const signed = decimal(position["szi"], `position[${index}].szi`);
        const direction = signed.isNegative() ? "short" : "long";
        return {
            asset: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assetSymbol"])(string(position["coin"], "position coin")),
            direction,
            quantity: signed.abs(),
            entryPrice: decimal(position["entryPx"], "entryPx"),
            unrealizedPnl: decimal(position["unrealizedPnl"], "unrealizedPnl")
        };
    }).filter((position)=>!position.quantity.isZero());
    return {
        address,
        positions,
        freshness
    };
}
function normalizeHip4Outcome(raw, freshness) {
    const item = record(raw, "outcome");
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["outcomeId"])(String(finiteInteger(item["outcome"], "outcome id")));
    const name = string(item["name"], "outcome name");
    const description = string(item["description"], "outcome description");
    const generic = ()=>({
            kind: "generic",
            id,
            name,
            description,
            freshness
        });
    // Current mainnet template format (observed 2026-09-26). Its registered template
    // defines Yes as price strictly above threshold; do not apply it to any other name.
    if (name === "template:binaryPrice") {
        const fields = new Map();
        for (const segment of description.split("|")){
            const separator = segment.indexOf(":");
            if (separator > 0) fields.set(segment.slice(0, separator), segment.slice(separator + 1));
        }
        const perp = fields.get("perp");
        const threshold = fields.get("threshold");
        const time = fields.get("time");
        const sideSpecs = item["sideSpecs"];
        const validSides = Array.isArray(sideSpecs) && sideSpecs.length === 2 && record(sideSpecs[0], "yes side")["name"] === "template:Yes" && record(sideSpecs[1], "no side")["name"] === "template:No";
        const timeMatch = time === undefined ? undefined : /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(time);
        if (!perp || !threshold || !timeMatch || !validSides) return generic();
        try {
            return {
                kind: "binaryPrice",
                id,
                underlying: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assetSymbol"])(perp),
                threshold: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(threshold),
                settlementAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UtcTimestamp"].parse(`${timeMatch[1]}-${timeMatch[2]}-${timeMatch[3]}T${timeMatch[4]}:${timeMatch[5]}:00Z`),
                comparator: "greaterThan",
                yesSide: "yes",
                noSide: "no",
                protocol: protocolIdentifiers(id),
                sourceName: name,
                freshness
            };
        } catch  {
            return generic();
        }
    }
    const fields = new Map();
    for (const line of description.split(/\r?\n/)){
        const match = /^([a-zA-Z][\w-]*):\s*(.+)$/.exec(line.trim());
        if (match?.[1] && match[2]) fields.set(match[1], match[2].trim());
    }
    if (fields.get("class") !== "priceBinary") return generic();
    const underlying = fields.get("underlying");
    const targetPrice = fields.get("targetPrice");
    const expiry = fields.get("expiry");
    const comparatorRaw = fields.get("comparator");
    const comparator = comparatorRaw === "gte" ? "greaterThanOrEqual" : comparatorRaw === "gt" ? "greaterThan" : undefined;
    if (!underlying || !targetPrice || !expiry || !comparator) return generic();
    try {
        return {
            kind: "binaryPrice",
            id,
            underlying: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assetSymbol"])(underlying),
            threshold: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].parse(targetPrice.replaceAll(",", "")),
            settlementAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UtcTimestamp"].parse(expiry),
            comparator,
            yesSide: "yes",
            noSide: "no",
            protocol: protocolIdentifiers(id),
            sourceName: name,
            freshness
        };
    } catch  {
        return generic();
    }
}
function normalizeOutcomeMeta(payload, freshness) {
    const outcomes = record(payload, "outcomeMeta")["outcomes"];
    if (!Array.isArray(outcomes)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("outcomeMeta.outcomes must be an array");
    return outcomes.map((outcome)=>normalizeHip4Outcome(outcome, freshness));
}
function normalizeLevel(value, context) {
    const item = record(value, context);
    return {
        price: decimal(item["px"], `${context}.px`),
        quantity: decimal(item["sz"], `${context}.sz`),
        orderCount: finiteInteger(item["n"], `${context}.n`)
    };
}
function normalizeOutcomeOrderBook(id, sideIndex, payload, freshness) {
    const root = record(payload, "l2Book");
    const levels = root["levels"];
    if (!Array.isArray(levels) || levels.length !== 2 || !Array.isArray(levels[0]) || !Array.isArray(levels[1])) throw new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$hyperliquid$2f$dist$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidExternalPayload"]("l2Book levels must contain bids and asks");
    return {
        outcomeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$models$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["outcomeId"])(id),
        sideIndex,
        coin: outcomeSideCoin(id, sideIndex),
        bids: levels[0].map((level, index)=>normalizeLevel(level, `bid[${index}]`)),
        asks: levels[1].map((level, index)=>normalizeLevel(level, `ask[${index}]`)),
        freshness
    };
}
}),
"[project]/packages/payoff/dist/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/payoff.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/settlement-states.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$verifier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/verifier.js [app-route] (ecmascript)");
;
;
;
}),
"[project]/packages/payoff/dist/payoff.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "binaryResolvesYes",
    ()=>binaryResolvesYes,
    "binaryTerminalPnl",
    ()=>binaryTerminalPnl,
    "evaluateScenarios",
    ()=>evaluateScenarios,
    "perpetualTerminalPnl",
    ()=>perpetualTerminalPnl,
    "terminalPnl",
    ()=>terminalPnl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
;
function perpetualTerminalPnl(component, settlementPrice) {
    const raw = component.quantity.multiply(settlementPrice.subtract(component.entryPrice));
    return component.direction === "long" ? raw : raw.negate();
}
function binaryResolvesYes(comparator, settlementPrice, threshold) {
    const comparison = settlementPrice.compare(threshold);
    return comparator === "greaterThanOrEqual" ? comparison >= 0 : comparison > 0;
}
function binaryTerminalPnl(component, settlementPrice) {
    const resolvesYes = binaryResolvesYes(component.comparator, settlementPrice, component.threshold);
    const wins = component.side === "yes" ? resolvesYes : !resolvesYes;
    return (wins ? component.shares : __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero).subtract(component.premium);
}
function terminalPnl(portfolio, settlementPrice) {
    return portfolio.components.reduce((sum, component)=>sum.add(component.kind === "perpetual" ? perpetualTerminalPnl(component, settlementPrice) : binaryTerminalPnl(component, settlementPrice)), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
}
function evaluateScenarios(portfolio, settlementPrices) {
    return settlementPrices.map((settlementPrice)=>({
            settlementPrice,
            terminalPnl: terminalPnl(portfolio, settlementPrice)
        }));
}
}),
"[project]/packages/payoff/dist/settlement-states.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "binaryResolvesYesAtState",
    ()=>binaryResolvesYesAtState,
    "deriveRelevantSettlementStates",
    ()=>deriveRelevantSettlementStates,
    "terminalPnlAtSettlementState",
    ()=>terminalPnlAtSettlementState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/domain/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/domain/dist/decimal.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/payoff.js [app-route] (ecmascript)");
;
;
const positionOrder = {
    leftLimit: 0,
    exact: 1,
    rightLimit: 2
};
function deriveRelevantSettlementStates(min, max, strikes) {
    if (min.compare(max) > 0) throw new RangeError("settlementPriceMin must not exceed settlementPriceMax");
    const states = [
        {
            price: min,
            position: "exact"
        }
    ];
    if (max.compare(min) !== 0) states.push({
        price: max,
        position: "exact"
    });
    const uniqueStrikes = strikes.filter((strike)=>strike.compare(min) >= 0 && strike.compare(max) <= 0).filter((strike, index, all)=>all.findIndex((candidate)=>candidate.compare(strike) === 0) === index);
    for (const strike of uniqueStrikes){
        if (strike.compare(min) > 0) states.push({
            price: strike,
            position: "leftLimit"
        });
        if (!states.some((state)=>state.position === "exact" && state.price.compare(strike) === 0)) states.push({
            price: strike,
            position: "exact"
        });
        if (strike.compare(max) < 0) states.push({
            price: strike,
            position: "rightLimit"
        });
    }
    return states.sort((left, right)=>left.price.compare(right.price) || positionOrder[left.position] - positionOrder[right.position]);
}
function binaryResolvesYesAtState(component, state) {
    const comparison = state.price.compare(component.threshold);
    if (comparison < 0) return false;
    if (comparison > 0) return true;
    if (state.position === "leftLimit") return false;
    if (state.position === "rightLimit") return true;
    return component.comparator === "greaterThanOrEqual";
}
function terminalPnlAtSettlementState(portfolio, state) {
    if (state.position === "exact") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalPnl"])(portfolio, state.price);
    return portfolio.components.reduce((sum, component)=>{
        if (component.kind === "perpetual") return sum.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$payoff$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["perpetualTerminalPnl"])(component, state.price));
        const wins = component.side === "yes" ? binaryResolvesYesAtState(component, state) : !binaryResolvesYesAtState(component, state);
        return sum.add((wins ? component.shares : __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero).subtract(component.premium));
    }, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$domain$2f$dist$2f$decimal$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DecimalAmount"].zero);
}
}),
"[project]/packages/payoff/dist/verifier.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyTerminalPayoff",
    ()=>verifyTerminalPayoff
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/payoff/dist/settlement-states.js [app-route] (ecmascript)");
;
function verifyTerminalPayoff(portfolio, constraint) {
    const strikes = portfolio.components.filter((component)=>component.kind === "binary").map((component)=>component.threshold);
    const points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deriveRelevantSettlementStates"])(constraint.settlementPriceMin, constraint.settlementPriceMax, strikes).map((state)=>({
            ...state,
            terminalPnl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$payoff$2f$dist$2f$settlement$2d$states$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["terminalPnlAtSettlementState"])(portfolio, state)
        }));
    const worstCase = points.reduce((worst, point)=>point.terminalPnl.compare(worst.terminalPnl) < 0 ? point : worst);
    return {
        kind: "SettlementPayoffVerification",
        holds: worstCase.terminalPnl.compare(constraint.minimumPnl) >= 0,
        constraint,
        worstCase,
        evaluatedPoints: points
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1fgmrd5._.js.map