import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Tester",
  description: "Test every key on your keyboard with a visual layout. Detect broken or non-responsive keys instantly.",
  keywords: ["keyboard tester", "keyboard test", "key test", "broken key", "keyboard check"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
