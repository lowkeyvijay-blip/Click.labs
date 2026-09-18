import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FPS Test — Frames Per Second",
  description: "Measure browser rendering FPS in real-time. Benchmark your display and browser performance with min/max/avg stats.",
  keywords: ["FPS test", "frames per second", "browser FPS", "FPS benchmark", "frame rate test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
