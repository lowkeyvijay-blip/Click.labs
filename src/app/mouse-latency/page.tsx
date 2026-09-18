"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useInputLatency } from "@/hooks/useInputLatency";

export default function MouseLatencyPage() {
  const { result, isRunning, currentLatency, samplesNeeded, sampleCount, handleEvent, start, reset } = useInputLatency();

  return (
    <TestContainer
      title="Mouse Latency Test"
      description="Estimate mouse input latency. This is a browser-based measurement — results are approximate and include browser/OS overhead."
      slug="mouse-latency"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start and click the test area as quickly as possible.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Each click measures the time between the visual cue and your click.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>{samplesNeeded} samples are collected for an average latency estimate.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="How accurate is this?" answer="This measures browser-level input processing time, which includes OS input handling, browser event processing, and JavaScript execution. It's an upper bound estimate, not precise hardware latency." />
          <FAQItem question="What is good mouse latency?" answer="Under 5ms is excellent (gaming mouse). 5-15ms is typical. Over 20ms may feel sluggish in competitive gaming." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay
              score={result.avgLatency}
              label="Average Input Latency (ms)"
              description={`${result.samples} samples collected`}
            />
          </div>
          <StatsGrid>
            <ResultCard label="Average" value={result.avgLatency} unit="ms" highlight />
            <ResultCard label="Best" value={result.minLatency} unit="ms" />
            <ResultCard label="Worst" value={result.maxLatency} unit="ms" />
            <ResultCard label="Samples" value={result.samples} />
          </StatsGrid>
          <div className="text-center text-xs text-text-muted">
            Includes browser + OS overhead. Real hardware latency may be lower.
          </div>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          {isRunning && (
            <div className="text-center text-sm text-text-muted">
              Sample {sampleCount}/{samplesNeeded}
              {currentLatency && <span className="ml-2 text-accent">Last: {currentLatency}ms</span>}
            </div>
          )}

          <div
            onClick={isRunning ? handleEvent : undefined}
            onTouchStart={isRunning ? (e) => { e.preventDefault(); handleEvent(); } : undefined}
            className={`relative rounded-xl border-2 border-dashed select-none cursor-pointer transition-all aspect-video flex flex-col items-center justify-center ${
              isRunning ? "border-accent bg-accent/5 active:scale-[0.98]" : "border-border bg-surface"
            }`}
          >
            {isRunning ? (
              <>
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-lg font-semibold text-text-primary">Click Here!</div>
                <div className="text-sm text-text-muted">Click as fast as you can when you see this</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">⏱️</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Mouse Latency</div>
                <div className="text-sm text-text-muted">Click reaction test for latency estimation</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Click the target!" : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
