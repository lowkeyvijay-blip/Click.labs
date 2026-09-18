import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jitter Click Test",
  description: "Test your jitter clicking speed. Measure rapid forearm vibration clicking technique for Minecraft PvP and competitive gaming.",
  keywords: ["jitter click", "jitter click test", "jitter clicking speed", "Minecraft click speed"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
