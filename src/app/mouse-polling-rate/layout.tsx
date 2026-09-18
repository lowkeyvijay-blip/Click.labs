import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mouse Polling Rate Test",
  description: "Estimate your mouse polling rate (Hz) using browser-based measurement. Tests 125Hz to 1000Hz+ polling rates.",
  keywords: ["mouse polling rate", "polling rate test", "mouse Hz", "mouse frequency", "1000Hz"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
