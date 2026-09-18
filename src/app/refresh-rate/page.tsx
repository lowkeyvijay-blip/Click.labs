"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

export default function RefreshRatePage() {
  const [detectedRate, setDetectedRate] = useState<number | null>(null);
  const [method, setMethod] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [motionScore, setMotionScore] = useState<number | null>(null);
  const rafRef = useRef<number>(0);
  const framesRef = useRef<number[]>([]);

  const detectViaScreen = useCallback(() => {
    // Try screen.refreshRate (limited browser support)
    const screenRate = (screen as unknown as Record<string, number>).refreshRate;
    if (screenRate && screenRate > 0) {
      setDetectedRate(screenRate);
      setMethod("Screen API (exact detection)");
      return true;
    }
    return false;
  }, []);

  const detectViaAnimationFrame = useCallback(() => {
    setIsRunning(true);
    framesRef.current = [];

    const measure = () => {
      const now = performance.now();
      framesRef.current.push(now);

      // Keep last 3 seconds of frames
      framesRef.current = framesRef.current.filter((t) => now - t < 3000);

      if (framesRef.current.length > 10) {
        const intervals: number[] = [];
        for (let i = 1; i < framesRef.current.length; i++) {
          intervals.push(framesRef.current[i] - framesRef.current[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const estimated = Math.round(1000 / avgInterval);

        // Snap to common refresh rates
        const commonRates = [60, 75, 100, 120, 144, 165, 240, 360];
        const snapped = commonRates.reduce((prev, curr) =>
          Math.abs(curr - estimated) < Math.abs(prev - estimated) ? curr : prev
        );

        setDetectedRate(snapped);
        setMethod(`Frame timing estimate (raw: ~${estimated}Hz)`);
        setIsRunning(false);
        return;
      }

      rafRef.current = requestAnimationFrame(measure);
    };

    rafRef.current = requestAnimationFrame(measure);
  }, []);

  const start = useCallback(() => {
    setDetectedRate(null);
    setMotionScore(null);
    if (!detectViaScreen()) {
      detectViaAnimationFrame();
    }
  }, [detectViaScreen, detectViaAnimationFrame]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setDetectedRate(null);
    setMotionScore(null);
    setIsRunning(false);
    setMethod("");
  }, []);

  // Motion blur visual test
  const startMotionTest = useCallback(() => {
    setIsRunning(true);
    setMotionScore(null);
    const start = performance.now();
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      const elapsed = performance.now() - start;
      if (elapsed < 3000) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setMotionScore(fps);
        setIsRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const rateDescription = detectedRate
    ? detectedRate >= 240 ? "Ultra-high refresh rate — excellent for competitive gaming"
    : detectedRate >= 144 ? "High refresh rate — great for gaming"
    : detectedRate >= 120 ? "Good refresh rate — smooth experience"
    : detectedRate >= 75 ? "Above standard — slight improvement over 60Hz"
    : "Standard refresh rate"
    : "";

  return (
    <TestContainer
      title="Refresh Rate Test"
      description="Detect your monitor refresh rate. Uses browser APIs for detection — results may vary."
      slug="refresh-rate"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start to auto-detect your refresh rate.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>The test uses screen APIs and frame timing analysis.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Results are snapped to common refresh rate values.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="Why is exact detection difficult?" answer="Browsers have limited access to display hardware info. The Screen API's refreshRate property is not universally supported. Frame timing provides an estimate." />
          <FAQItem question="What refresh rate do I need?" answer="60Hz is standard. 144Hz is recommended for competitive gaming. 240Hz+ provides marginal gains for professional players." />
        </>
      }
    >
      <div className="space-y-6">
        {detectedRate ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
              <ScoreDisplay score={`${detectedRate}Hz`} label="Detected Refresh Rate" description={rateDescription} />
            </div>
            <StatsGrid>
              <ResultCard label="Refresh Rate" value={`${detectedRate}`} unit="Hz" highlight />
              <ResultCard label="Frame Time" value={Math.round(1000 / detectedRate)} unit="ms" />
              <ResultCard label="Method" value={method.includes("Screen") ? "API" : "Estimate"} />
              <ResultCard label="Confidence" value={method.includes("exact") ? "High" : "Medium"} />
            </StatsGrid>
            <div className="text-center text-xs text-text-muted">{method}</div>
            <div className="flex justify-center gap-3">
              <RetestButton onClick={reset} />
              <button onClick={startMotionTest} className="px-6 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-primary font-medium text-sm transition-colors">
                Visual Motion Test
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {isRunning && !motionScore && (
              <div className="text-center text-sm text-text-muted animate-pulse">Measuring refresh rate...</div>
            )}

            {motionScore && (
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <div className="text-sm text-text-muted mb-1">Visual Motion Test Result</div>
                <div className="text-2xl font-bold text-accent">{motionScore} FPS detected</div>
              </div>
            )}

            <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">🔄</div>
              <div className="text-lg font-semibold text-text-primary mb-1">Refresh Rate Detection</div>
              <div className="text-sm text-text-muted">Uses screen API and frame timing</div>
            </div>

            <div className="flex justify-center">
              <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
                {isRunning ? "Measuring..." : "Start Detection"}
              </button>
            </div>
          </div>
        )}
      </div>
    </TestContainer>
  );
}
