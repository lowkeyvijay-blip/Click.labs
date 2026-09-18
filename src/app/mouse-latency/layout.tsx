import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mouse Latency Test",
  description: "Estimate mouse input latency with browser-based measurement. Tests click reaction delay for gaming optimization.",
  keywords: ["mouse latency", "mouse input lag", "click latency", "mouse delay test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
