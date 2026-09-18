import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headphone Test",
  description: "Test headphones with channel detection, stereo balance verification, and audio quality check.",
  keywords: ["headphone test", "headset test", "earphone test", "stereo headphone", "audio channel test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
