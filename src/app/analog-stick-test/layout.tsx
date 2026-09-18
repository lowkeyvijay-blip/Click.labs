import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analog Stick Test",
  description: "Test analog stick drift, dead zones, and full range of motion with visual position tracking and drift detection.",
  keywords: ["analog stick test", "stick drift", "controller drift", "deadzone test", "joystick test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
