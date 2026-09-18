"use client";

import { useState, useCallback, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

const COLORS = [
  { name: "Red", bg: "#ff0000" },
  { name: "Green", bg: "#00ff00" },
  { name: "Blue", bg: "#0000ff" },
  { name: "White", bg: "#ffffff" },
  { name: "Black", bg: "#000000" },
  { name: "Cyan", bg: "#00ffff" },
  { name: "Magenta", bg: "#ff00ff" },
  { name: "Yellow", bg: "#ffff00" },
];

export default function DeadPixelPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentColor, setCurrentColor] = useState(0);
  const [checkedColors, setCheckedColors] = useState<Set<string>>(new Set());

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setCurrentColor(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.code === "Escape") {
        setIsFullscreen(false);
        return;
      }
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        const color = COLORS[currentColor];
        setCheckedColors((prev) => new Set(prev).add(color.name));
        if (currentColor < COLORS.length - 1) {
          setCurrentColor((prev) => prev + 1);
        } else {
          setIsFullscreen(false);
        }
      }
    },
    [isFullscreen, currentColor]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setIsFullscreen(false);
    setCurrentColor(0);
    setCheckedColors(new Set());
  }, []);

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-[100] cursor-pointer flex items-center justify-center select-none"
        style={{ backgroundColor: COLORS[currentColor].bg, touchAction: "manipulation" }}
        onClick={() => {
          const color = COLORS[currentColor];
          setCheckedColors((prev) => new Set(prev).add(color.name));
          if (currentColor < COLORS.length - 1) {
            setCurrentColor((prev) => prev + 1);
          } else {
            setIsFullscreen(false);
          }
        }}
      >
        <div className="absolute top-4 left-4 text-sm font-mono" style={{ color: COLORS[currentColor].bg === "#000000" ? "#fff" : "#000" }}>
          {currentColor + 1}/{COLORS.length} — Press SPACE or click to advance, ESC to exit
        </div>
        <div className="text-center" style={{ color: COLORS[currentColor].bg === "#000000" ? "#fff" : "#000" }}>
          <div className="text-lg font-medium">{COLORS[currentColor].name}</div>
          <div className="text-sm opacity-70">Look for dead, stuck, or bright pixels</div>
        </div>
      </div>
    );
  }

  return (
    <TestContainer
      title="Dead Pixel Test"
      description="Full-screen color test to identify dead, stuck, or hot pixels on your display."
      slug="dead-pixel-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start to enter fullscreen color mode.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Carefully inspect each color for dead (black), stuck (always on), or hot (bright) pixels.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Press Space/Click to advance through colors. ESC to exit.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is a dead pixel?" answer="A dead pixel appears as a permanently black dot. Stuck pixels show a constant color (red, green, or blue). Hot pixels appear brighter than surrounding pixels." />
          <FAQItem question="Can dead pixels be fixed?" answer="Software fixes (like pixel flash tools) can sometimes unstick stuck pixels. Truly dead pixels require panel replacement." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color, i) => (
            <div key={i} className="text-center">
              <div
                className="h-16 rounded-lg border border-border"
                style={{ backgroundColor: color.bg }}
              />
              <div className="text-xs text-text-muted mt-1">
                {color.name}
                {checkedColors.has(color.name) && <span className="text-success ml-1">✓</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-lg font-semibold text-text-primary mb-1">Dead Pixel Test</div>
          <div className="text-sm text-text-muted">Fullscreen color inspection for pixel defects</div>
        </div>

        <StatsGrid>
          <ResultCard label="Colors Checked" value={checkedColors.size} unit={`/ ${COLORS.length}`} />
          <ResultCard label="Status" value={checkedColors.size === COLORS.length ? "Complete" : "Ready"} />
          <ResultCard label="Colors" value={COLORS.length} />
          <ResultCard label="Mode" value="Fullscreen" />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          <button onClick={enterFullscreen} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
            Start Test
          </button>
          {checkedColors.size > 0 && <RetestButton onClick={reset} />}
        </div>
      </div>
    </TestContainer>
  );
}
