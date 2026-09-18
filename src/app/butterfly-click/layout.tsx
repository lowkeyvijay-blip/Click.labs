import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Butterfly Click Test",
  description: "Test butterfly clicking technique — alternating two fingers on the mouse button for maximum CPS.",
  keywords: ["butterfly click", "butterfly click test", "butterfly clicking speed", "two finger clicking"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
