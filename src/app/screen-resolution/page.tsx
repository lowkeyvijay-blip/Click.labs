"use client";

import { useState, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";

interface DisplayInfo {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelRatio: number;
  physicalWidth: number;
  physicalHeight: number;
  orientation: string;
  dpi: number;
}

export default function ScreenResolutionPage() {
  const [info, setInfo] = useState<DisplayInfo | null>(null);

  useEffect(() => {
    const updateInfo = () => {
      const dpr = window.devicePixelRatio || 1;
      setInfo({
        screenWidth: screen.width,
        screenHeight: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelRatio: dpr,
        physicalWidth: Math.round(screen.width * dpr),
        physicalHeight: Math.round(screen.height * dpr),
        orientation: screen.orientation?.type || "unknown",
        dpi: Math.round(dpr * 96),
      });
    };

    updateInfo();
    window.addEventListener("resize", updateInfo);
    screen.orientation?.addEventListener("change", updateInfo);
    return () => {
      window.removeEventListener("resize", updateInfo);
      screen.orientation?.removeEventListener("change", updateInfo);
    };
  }, []);

  return (
    <TestContainer
      title="Screen Resolution Test"
      description="Detect your screen resolution, DPI, color depth, and complete display information."
      slug="screen-resolution"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Your display information is automatically detected.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Resize your browser window to see values update in real-time.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>All values are read from browser APIs — no external data needed.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is device pixel ratio?" answer="DPR is the ratio between physical pixels and CSS pixels. A DPR of 2 means each CSS pixel maps to 2×2 physical pixels (Retina displays). Higher DPR means sharper rendering." />
          <FAQItem question="Why is my resolution different in games?" answer="Games typically render at the monitor's native resolution. Browsers may report the CSS pixel resolution, which differs from the physical pixel count on high-DPI displays." />
        </>
      }
    >
      {info && (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{info.screenWidth} × {info.screenHeight}</div>
            <div className="text-sm text-text-muted">Screen Resolution (CSS pixels)</div>
          </div>

          <StatsGrid>
            <ResultCard label="Resolution" value={`${info.screenWidth}×${info.screenHeight}`} highlight />
            <ResultCard label="Physical" value={`${info.physicalWidth}×${info.physicalHeight}`} />
            <ResultCard label="Available" value={`${info.availWidth}×${info.availHeight}`} />
            <ResultCard label="Pixel Ratio" value={info.pixelRatio} unit="x" />
          </StatsGrid>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ResultCard label="Color Depth" value={info.colorDepth} unit="bit" />
            <ResultCard label="DPI" value={info.dpi} unit="dpi" />
            <ResultCard label="Orientation" value={info.orientation.replace("-", " ")} />
            <ResultCard label="Aspect Ratio" value={(() => {
              const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
              const d = gcd(info.screenWidth, info.screenHeight);
              return `${info.screenWidth / d}:${info.screenHeight / d}`;
            })()} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Display Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">CSS Resolution</span>
                <span className="text-text-primary font-mono">{info.screenWidth} × {info.screenHeight}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Physical Resolution</span>
                <span className="text-text-primary font-mono">{info.physicalWidth} × {info.physicalHeight}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Viewport (Available)</span>
                <span className="text-text-primary font-mono">{info.availWidth} × {info.availHeight}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Device Pixel Ratio</span>
                <span className="text-text-primary font-mono">{info.pixelRatio}x</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Color Depth</span>
                <span className="text-text-primary font-mono">{info.colorDepth}-bit</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Estimated DPI</span>
                <span className="text-text-primary font-mono">{info.dpi} DPI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
