"use client";

import { useState, useCallback } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

interface ButtonEvent {
  button: number;
  name: string;
  time: number;
  doubleClick: boolean;
}

const BUTTON_NAMES: Record<number, string> = {
  0: "Left Click",
  1: "Middle Click",
  2: "Right Click",
  3: "Back (Side)",
  4: "Forward (Side)",
};

export default function MouseButtonPage() {
  const [events, setEvents] = useState<ButtonEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<Record<number, number>>({});

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isRunning) return;
      e.preventDefault();
      const now = performance.now();
      const prev = lastClickTime[e.button] || 0;
      const doubleClick = now - prev < 300;

      setLastClickTime((prev) => ({ ...prev, [e.button]: now }));
      setEvents((prev) => [
        ...prev,
        {
          button: e.button,
          name: BUTTON_NAMES[e.button] || `Button ${e.button}`,
          time: now,
          doubleClick,
        },
      ]);
    },
    [isRunning, lastClickTime]
  );

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const reset = useCallback(() => {
    setEvents([]);
    setIsRunning(false);
    setLastClickTime({});
  }, []);

  const buttonCounts = events.reduce(
    (acc, ev) => {
      acc[ev.name] = (acc[ev.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const doubleClicks = events.filter((e) => e.doubleClick).length;

  return (
    <TestContainer
      title="Mouse Button Test"
      description="Test all mouse buttons — left, right, middle, and side buttons. Detect double-click speed and button functionality."
      slug="mouse-button-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start to begin testing.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Click each mouse button to test it. All buttons are recorded.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Double-click quickly to test double-click detection.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="Why are side buttons not detected?" answer="Some mice require driver software to enable side buttons. Ensure your mouse drivers are installed and side buttons are configured." />
          <FAQItem question="What is double-click speed?" answer="Double-click speed is the maximum time between two clicks to register as a double-click. This test uses 300ms as the threshold." />
        </>
      }
    >
      <div className="space-y-6">
        <div
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`relative rounded-xl border-2 border-dashed select-none cursor-pointer transition-all aspect-video flex flex-col items-center justify-center ${
            isRunning ? "border-accent bg-accent/5" : "border-border bg-surface"
          }`}
        >
          {isRunning ? (
            <>
              <div className="text-lg font-semibold text-text-primary mb-2">Click any mouse button</div>
              <div className="text-sm text-text-muted mb-4">All buttons will be detected and recorded</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(BUTTON_NAMES).map(([num, name]) => (
                  <div key={num} className={`px-3 py-2 rounded-lg border ${buttonCounts[name] ? "border-success bg-success/10 text-success" : "border-border bg-surface text-text-muted"}`}>
                    {name}: {buttonCounts[name] || 0}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">🔘</div>
              <div className="text-lg font-semibold text-text-primary mb-1">Mouse Button Test</div>
              <div className="text-sm text-text-muted">Test left, right, middle, and side buttons</div>
            </>
          )}
        </div>

        {events.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Click Log ({events.length} events)</h3>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {events.slice(-20).reverse().map((ev, i) => (
                <div key={i} className={`flex items-center justify-between text-xs px-2 py-1 rounded ${ev.doubleClick ? "bg-warning/10 text-warning" : "bg-surface text-text-secondary"}`}>
                  <span>{ev.name}</span>
                  <span className="text-text-muted">{ev.doubleClick ? "Double-click!" : "Single"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Total Clicks" value={events.length} />
          <ResultCard label="Double Clicks" value={doubleClicks} />
          <ResultCard label="Buttons Used" value={Object.keys(buttonCounts).length} />
          <ResultCard label="Unique Buttons" value={Object.keys(buttonCounts).length} unit={`/ ${Object.keys(BUTTON_NAMES).length}`} />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button onClick={() => { setEvents([]); setIsRunning(true); }} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start Test
            </button>
          ) : (
            <button onClick={() => setIsRunning(false)} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Test
            </button>
          )}
          {events.length > 0 && <RetestButton onClick={reset} />}
        </div>
      </div>
    </TestContainer>
  );
}
