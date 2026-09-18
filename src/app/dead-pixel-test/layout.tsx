import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dead Pixel Test",
  description: "Full-screen color test to identify dead, stuck, or hot pixels on your monitor. Tests 8 colors in fullscreen mode.",
  keywords: ["dead pixel test", "stuck pixel", "pixel test", "monitor test", "screen test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
