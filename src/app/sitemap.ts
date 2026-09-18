import type { MetadataRoute } from "next";

const BASE_URL = process.env.SITE_URL || "https://click-labs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const testSlugs = [
    "cps-test",
    "spacebar-speed",
    "jitter-click",
    "butterfly-click",
    "kohi-click",
    "mouse-polling-rate",
    "mouse-button-test",
    "mouse-latency",
    "keyboard-tester",
    "wpm-typing-speed",
    "keyboard-latency",
    "reaction-time",
    "aim-click-reaction",
    "refresh-rate",
    "fps-test",
    "dead-pixel-test",
    "screen-resolution",
    "microphone-test",
    "speaker-test",
    "headphone-test",
    "controller-test",
    "gamepad-buttons",
    "analog-stick-test",
    "trigger-test",
  ];

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
  ];

  const testPages = testSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...testPages];
}
