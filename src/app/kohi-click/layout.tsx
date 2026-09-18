import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kohi Click Test",
  description: "Kohi-style click test measuring sustained rapid clicking performance over extended durations.",
  keywords: ["kohi click", "kohi click test", "sustained clicking", "rapid clicking test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
