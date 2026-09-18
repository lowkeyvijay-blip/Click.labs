import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Resolution Test",
  description: "Detect your screen resolution, DPI, color depth, pixel ratio, and complete display information in real-time.",
  keywords: ["screen resolution", "display info", "DPI test", "pixel ratio", "screen size"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
