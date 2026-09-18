import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CPS Test — Clicks Per Second",
  description: "Measure your clicking speed in clicks per second. Test with 1s, 5s, 10s, 30s, or 60s timers. Find your true CPS for competitive gaming.",
  keywords: ["CPS test", "clicks per second", "click speed test", "mouse click test", "gaming"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
