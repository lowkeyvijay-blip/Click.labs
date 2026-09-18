"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

export default function SpacebarSpeedPage() {
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ cps: number; total: number } | null>(null);
  const [duration, setDuration] = useState(10);
  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space" || !isRunning) return;
      e.preventDefault();
      setClicks((prev) => prev + 1);
    },
    [isRunning]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const start = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setClicks(0);
    setResult(null);
    setIsRunning(true);
    startTimeRef.current = performance.now();

    timerRef.current = setTimeout(() => {
      setIsRunning(false);
      setClicks((finalClicks) => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        setResult({ cps: Math.round((finalClicks / elapsed) * 100) / 100, total: finalClicks });
        return finalClicks;
      });
    }, duration * 1000);
  }, [duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setClicks(0);
    setResult(null);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <TestContainer
      title="Spacebar Speed Test"
      description="Measure how fast you can press the spacebar. Tracks your spacebar presses per second."
      slug="spacebar-speed"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select your test duration.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start then tap the spacebar as fast as you can.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Your speed is measured in spacebar presses per second.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="Why test spacebar speed?" answer="Spacebar speed matters in games that use space for jumping or abilities. Faster spacebar presses can give a competitive edge." />
          <FAQItem question="Is this accurate?" answer="This measures browser-level input events. Results are affected by browser processing time and OS input handling." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.cps} label="Spacebar Presses Per Second" description={`${result.total} presses in ${duration}s`} />
          </div>
          <StatsGrid>
            <ResultCard label="Total Presses" value={result.total} />
            <ResultCard label="Duration" value={duration} unit="s" />
            <ResultCard label="Speed" value={result.cps} unit="ps" highlight />
            <ResultCard label="Peak (est)" value={Math.round(result.cps * 1.3)} unit="ps" />
          </StatsGrid>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 5, 10, 30].map((d) => (
              <button
                key={d}
                onClick={() => { if (!isRunning) setDuration(d); }}
                disabled={isRunning}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                  duration === d ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          <div className={`relative rounded-xl border-2 border-dashed select-none aspect-video flex flex-col items-center justify-center transition-all ${
            isRunning ? "border-accent bg-accent/5" : "border-border bg-surface"
          }`}>
            {isRunning ? (
              <>
                <div className="text-6xl font-bold tabular-nums text-accent mb-2">{clicks}</div>
                <div className="text-sm text-text-muted">Press SPACEBAR repeatedly!</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">⌨️</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Ready to Start</div>
                <div className="text-sm text-text-muted">Press spacebar as fast as you can</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Go! Press Spacebar!" : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
