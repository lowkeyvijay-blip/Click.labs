import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trigger Test",
  description: "Test analog trigger pressure sensitivity, range of motion, and dead zones on gamepad controllers.",
  keywords: ["trigger test", "analog trigger", "L2 R2 test", "LT RT test", "trigger sensitivity"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
