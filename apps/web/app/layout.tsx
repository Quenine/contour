import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Contour — Compile the payoff you want.", description: "Liquidity-aware Hyperliquid terminal-payoff compilation with independent exact verification." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element { return <html lang="en"><body>{children}</body></html>; }
