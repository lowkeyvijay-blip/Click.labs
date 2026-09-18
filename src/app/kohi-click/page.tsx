"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useClickTest } from "@/hooks/useClickTest";

export default function KohiClickPage() {
  const { clicks, isRunning, result, duration, setDuration, handleClick, start, reset } = useClickTest();

  return (
    <TestContainer
      title="Kohi Click Test"
      description="Kohi-style click test measuring sustained rapid clicking performance over a set duration."
      slug="kohi-click"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Choose your test duration.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start and click as fast and consistently as possible.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Kohi clicking focuses on sustained speed without breaks.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is Kohi clicking?" answer="Kohi clicking is a sustained rapid clicking technique popularized in competitive gaming. It emphasizes maintaining high CPS over extended periods rather than short bursts." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.cps} label="Kohi CPS" description={`${result.clicks} clicks in ${result.duration.toFixed(1)}s`} />
          </div>
          <StatsGrid>
            <ResultCard label="Total Clicks" value={result.clicks} />
            <ResultCard label="Duration" value={result.duration.toFixed(1)} unit="s" />
            <ResultCard label="CPS" value={result.cps} highlight />
            <ResultCard label="Consistency" value={result.cps > 8 ? "High" : result.cps > 5 ? "Medium" : "Low"} />
          </StatsGrid>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[5, 10, 30, 60].map((d) => (
              <button key={d} onClick={() => { if (!isRunning) setDuration(d); }} disabled={isRunning}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${duration === d ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"}`}>
                {d}s
              </button>
            ))}
          </div>

          <div onMouseDown={isRunning ? handleClick : undefined}
            onTouchStart={isRunning ? (e) => { e.preventDefault(); handleClick(); } : undefined}
            className={`relative rounded-xl border-2 border-dashed select-none cursor-pointer transition-all aspect-video flex flex-col items-center justify-center ${
              isRunning ? "border-accent bg-accent/5 active:scale-[0.98]" : "border-border bg-surface hover:border-accent/30"
            }`}>
            {isRunning ? (
              <>
                <div className="text-6xl font-bold tabular-nums text-accent mb-2">{clicks}</div>
                <div className="text-sm text-text-muted">Sustain your clicking speed!</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🎮</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Kohi Click</div>
                <div className="text-sm text-text-muted">Sustained rapid clicking test</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={() => start()} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Click the test area!" : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
