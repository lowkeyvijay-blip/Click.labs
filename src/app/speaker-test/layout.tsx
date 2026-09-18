import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaker Test",
  description: "Test your speakers with stereo audio output. Play test tones through left, right, or both channels.",
  keywords: ["speaker test", "audio test", "stereo test", "speaker check", "sound test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
