"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useClickTest } from "@/hooks/useClickTest";

export default function JitterClickPage() {
  const { clicks, isRunning, result, duration, setDuration, handleClick, start, reset } = useClickTest();

  return (
    <TestContainer
      title="Jitter Click Test"
      description="Test your jitter clicking speed. Jitter clicking uses rapid forearm/wrist vibrations to achieve high click rates."
      slug="jitter-click"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select a duration (5s or 10s recommended).</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start and vibrate your hand/wrist rapidly on the mouse button.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Higher CPS than regular clicking indicates successful jitter technique.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is jitter clicking?" answer="Jitter clicking involves rapidly tensing and relaxing your arm/wrist muscles to create vibrations that press the mouse button. It's faster than regular clicking but harder to sustain." />
          <FAQItem question="Is jitter clicking healthy?" answer="Prolonged jitter clicking can cause wrist strain and RSI. Take regular breaks and stop if you feel any discomfort." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.cps} label="Jitter CPS" description={`${result.clicks} clicks in ${result.duration.toFixed(1)}s`} />
          </div>
          <StatsGrid>
            <ResultCard label="Total Clicks" value={result.clicks} />
            <ResultCard label="Duration" value={result.duration.toFixed(1)} unit="s" />
            <ResultCard label="CPS" value={result.cps} highlight />
            <ResultCard label="Technique" value={result.cps > 10 ? "Good" : result.cps > 7 ? "Fair" : "Low"} />
          </StatsGrid>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 5, 10, 30].map((d) => (
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
                <div className="text-sm text-text-muted">Vibrate your hand and click!</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Ready to Jitter</div>
                <div className="text-sm text-text-muted">Rapid forearm vibration technique</div>
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
