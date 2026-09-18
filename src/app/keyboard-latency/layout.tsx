import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Latency Test",
  description: "Estimate keyboard input latency using browser-based measurement. Test mechanical vs membrane keyboard delay.",
  keywords: ["keyboard latency", "keyboard input lag", "keyboard delay", "mechanical keyboard latency"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
