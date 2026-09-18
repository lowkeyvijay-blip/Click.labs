import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Microphone Test",
  description: "Test your microphone with real-time audio waveform visualization, level metering, and device detection.",
  keywords: ["microphone test", "mic test", "audio input", "microphone check", "mic level"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
