import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Speed Test — WPM",
  description: "Measure your words per minute typing speed with accuracy tracking. Free online WPM test with multiple durations.",
  keywords: ["typing speed", "WPM test", "words per minute", "typing test", "type speed test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
