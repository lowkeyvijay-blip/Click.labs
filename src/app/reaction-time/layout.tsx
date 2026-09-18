import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reaction Time Test",
  description: "Test your visual reaction time in milliseconds. Measures how quickly you respond to visual stimuli. Compare with pro gamer averages.",
  keywords: ["reaction time test", "reaction speed", "click reaction time", "visual reaction time", "ms reaction"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
