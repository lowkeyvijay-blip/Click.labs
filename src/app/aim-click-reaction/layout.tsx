import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aim & Click Reaction Test",
  description: "Test your aiming precision and click reaction time. Click appearing targets as fast and accurately as possible.",
  keywords: ["aim test", "click reaction", "aim training", "click accuracy", "target practice"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
