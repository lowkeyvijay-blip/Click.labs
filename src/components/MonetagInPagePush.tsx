"use client";

import Script from "next/script";

const MONETAG_ZONE_ID = "11832907";
const MONETAG_TAG_SRC = "https://nap5k.com/tag.min.js";

export function MonetagInPagePush() {
  return (
    <Script
      src={MONETAG_TAG_SRC}
      data-zone={MONETAG_ZONE_ID}
      strategy="afterInteractive"
    />
  );
}
