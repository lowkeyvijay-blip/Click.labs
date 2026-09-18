import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spacebar Speed Test",
  description: "Measure how fast you can press the spacebar. Track spacebar presses per second for gaming performance.",
  keywords: ["spacebar speed", "spacebar test", "keyboard speed", "spacebar clicks per second"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
