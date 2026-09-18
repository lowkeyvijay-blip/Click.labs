import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mouse Button Test",
  description: "Test all mouse buttons — left, right, middle, and side buttons. Detect double-click speed and button functionality.",
  keywords: ["mouse button test", "mouse test", "double click test", "side buttons", "mouse click test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
