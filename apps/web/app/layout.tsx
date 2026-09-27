import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contour — Payoff Compiler for Hyperliquid",
  description: "Compile a terminal payoff from Hyperliquid outcome-market liquidity and verify it with exact arithmetic.",
  openGraph: {
    title: "Contour — Payoff Compiler for Hyperliquid",
    description: "Compile a terminal payoff from Hyperliquid outcome-market liquidity and verify it with exact arithmetic.",
    type: "website",
    siteName: "Contour"
  },
  twitter: { card: "summary", title: "Contour — Payoff Compiler for Hyperliquid", description: "Liquidity-aware payoff compilation with independent exact verification." }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element { return <html lang="en"><body>{children}</body></html>; }
