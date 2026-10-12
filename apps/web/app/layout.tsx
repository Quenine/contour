import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://contour-ochre.vercel.app"),
  title: "Contour — Payoff Compiler for Hyperliquid",
  description: "Contour turns a trader's settlement-risk limit into a liquidity-aware Hyperliquid portfolio, then independently verifies the resulting payoff.",
  applicationName: "Contour",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Contour — Payoff Compiler for Hyperliquid",
    description: "Contour turns a trader's settlement-risk limit into a liquidity-aware Hyperliquid portfolio, then independently verifies the resulting payoff.",
    type: "website",
    siteName: "Contour",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contour — Turn a risk limit into a verified payoff." }]
  },
  twitter: { card: "summary_large_image", title: "Contour — Payoff Compiler for Hyperliquid", description: "Contour turns a trader's settlement-risk limit into a liquidity-aware Hyperliquid portfolio, then independently verifies the resulting payoff.", images: ["/opengraph-image"] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element { return <html lang="en"><body>{children}</body></html>; }
