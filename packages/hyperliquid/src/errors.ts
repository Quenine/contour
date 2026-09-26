export class HyperliquidReadError extends Error { constructor(message: string, readonly category: string, readonly cause?: unknown) { super(message); this.name = new.target.name; } }
export class NetworkFailure extends HyperliquidReadError { constructor(message: string, cause?: unknown) { super(message, "NetworkFailure", cause); } }
export class Timeout extends HyperliquidReadError { constructor(message: string) { super(message, "Timeout"); } }
export class RateLimited extends HyperliquidReadError { constructor(message: string) { super(message, "RateLimited"); } }
export class InvalidExternalPayload extends HyperliquidReadError { constructor(message: string) { super(message, "InvalidExternalPayload"); } }
export class UnsupportedMarketSemantics extends HyperliquidReadError { constructor(message: string) { super(message, "UnsupportedMarketSemantics"); } }
export class StaleMarketData extends HyperliquidReadError { constructor(message: string) { super(message, "StaleMarketData"); } }
export class NotFound extends HyperliquidReadError { constructor(message: string) { super(message, "NotFound"); } }
