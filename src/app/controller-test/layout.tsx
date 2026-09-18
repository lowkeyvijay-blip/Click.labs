import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controller/Gamepad Test",
  description: "Test your gamepad or controller connection. Detect connected controllers, button counts, and axis data via Gamepad API.",
  keywords: ["controller test", "gamepad test", "Xbox controller", "PlayStation controller", "gamepad detection"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
