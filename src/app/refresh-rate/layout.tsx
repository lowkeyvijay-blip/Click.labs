import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refresh Rate Test",
  description: "Detect your monitor refresh rate using browser APIs. Supports 60Hz, 144Hz, 240Hz detection with visual motion test.",
  keywords: ["refresh rate test", "monitor Hz", "144Hz test", "240Hz test", "screen refresh rate"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
