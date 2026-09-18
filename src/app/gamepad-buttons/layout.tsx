import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamepad Buttons Test",
  description: "Test all gamepad buttons with real-time visual feedback. Detect pressed, tested, and broken buttons on your controller.",
  keywords: ["gamepad buttons", "controller buttons", "button test", "gamepad input test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
