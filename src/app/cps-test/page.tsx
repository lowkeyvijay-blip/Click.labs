"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useClickTest } from "@/hooks/useClickTest";

const DURATIONS = [1, 5, 10, 30, 60];

export default function CPSTestPage() {
  const { clicks, isRunning, result, duration, setDuration, handleClick, start, reset } = useClickTest();

  return (
    <TestContainer
      title="CPS Test — Clicks Per Second"
      description="Measure your clicking speed in clicks per second. Test with different time limits to find your true CPS."
      slug="cps-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select a time duration below.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Click &quot;Start Test&quot; then click the test area as fast as you can.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Your CPS will be calculated when time runs out.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is a good CPS?" answer="Average CPS is around 6-8. Professional gamers typically achieve 10-15 CPS. Jitter clicking can push this higher but may reduce accuracy." />
          <FAQItem question="Does rapid clicking damage my mouse?" answer="Excessive rapid clicking can cause wear on mouse switches over time. Mechanical mice rated for millions of clicks will last longer." />
          <FAQItem question="Why is my CPS inconsistent?" answer="Mouse grip, finger fatigue, and technique all affect consistency. Warm up before testing and try different grip styles." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.cps} label="Clicks Per Second" description={`${result.clicks} clicks in ${result.duration.toFixed(1)}s`} />
          </div>
          <StatsGrid>
            <ResultCard label="Total Clicks" value={result.clicks} />
            <ResultCard label="Duration" value={result.duration.toFixed(1)} unit="s" />
            <ResultCard label="CPS" value={result.cps} highlight />
            <ResultCard label="Peak (est)" value={Math.round(result.cps * 1.3)} unit="cps" />
          </StatsGrid>
          <div className="flex justify-center">
            <RetestButton onClick={reset} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => { if (!isRunning) setDuration(d); }}
                disabled={isRunning}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                  duration === d ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {d}s
              </button>
            ))}
          </div>

          <div
            onMouseDown={isRunning ? handleClick : undefined}
            onTouchStart={isRunning ? (e) => { e.preventDefault(); handleClick(); } : undefined}
            className={`relative rounded-xl border-2 border-dashed select-none cursor-pointer transition-all aspect-video flex flex-col items-center justify-center ${
              isRunning
                ? "border-accent bg-accent/5 hover:bg-accent/10 active:scale-[0.98]"
                : "border-border bg-surface hover:border-accent/30"
            }`}
          >
            {isRunning ? (
              <>
                <div className="text-6xl font-bold tabular-nums text-accent mb-2">{clicks}</div>
                <div className="text-sm text-text-muted">Click here as fast as you can!</div>
                <div className="absolute bottom-4 text-xs text-text-muted">{duration}s timer running</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🖱️</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Click to Start</div>
                <div className="text-sm text-text-muted">Select duration and press Start</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => start()}
              disabled={isRunning}
              className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors"
            >
              {isRunning ? "Click the test area!" : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
