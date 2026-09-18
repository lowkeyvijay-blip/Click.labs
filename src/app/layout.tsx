import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "ClickLabs — Gaming & Device Testing Platform",
    template: "%s | ClickLabs",
  },
  description: "Free browser-based gaming tests and device diagnostics. CPS test, keyboard tester, mouse polling rate, reaction time, FPS test, microphone test, and more.",
  keywords: ["CPS test", "click speed test", "keyboard tester", "mouse test", "reaction time", "FPS test", "gaming tools", "device testing"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClickLabs",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    monetag: "d9ff31e317a51fdb8f67889b94771a82",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-text-muted">
            <div className="mb-2">
              <span className="font-semibold text-text-secondary">ClickLabs</span> — Browser-based gaming tests & device diagnostics
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-2">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
            </div>
            <div>All measurements are browser-based estimates. Hardware accuracy requires dedicated tools.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
