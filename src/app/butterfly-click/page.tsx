"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useClickTest } from "@/hooks/useClickTest";

export default function ButterflyClickPage() {
  const { clicks, isRunning, result, duration, setDuration, handleClick, start, reset } = useClickTest();

  return (
    <TestContainer
      title="Butterfly Click Test"
      description="Test butterfly clicking technique — alternating two fingers on the mouse button for rapid double-clicks."
      slug="butterfly-click"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select your test duration.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Place two fingers on the mouse button and alternate pressing them rapidly.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Butterfly clicking typically achieves higher CPS than regular clicking.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is butterfly clicking?" answer="Butterfly clicking uses two fingers (typically index and middle) alternating on the same mouse button, similar to how a butterfly flaps its wings. This can achieve very high CPS." />
          <FAQItem question="Is butterfly clicking allowed in games?" answer="Some games and servers consider butterfly clicking as cheating or ban for high CPS. Check the specific game's terms of service." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.cps} label="Butterfly CPS" description={`${result.clicks} clicks in ${result.duration.toFixed(1)}s`} />
          </div>
          <StatsGrid>
            <ResultCard label="Total Clicks" value={result.clicks} />
            <ResultCard label="Duration" value={result.duration.toFixed(1)} unit="s" />
            <ResultCard label="CPS" value={result.cps} highlight />
            <ResultCard label="Rating" value={result.cps > 15 ? "Elite" : result.cps > 10 ? "Good" : "Average"} />
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
                <div className="text-sm text-text-muted">Alternate two fingers rapidly!</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🦋</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Butterfly Click</div>
                <div className="text-sm text-text-muted">Two-finger alternating technique</div>
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
