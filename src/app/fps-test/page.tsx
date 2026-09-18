"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useFPS } from "@/hooks/useFPS";

export default function FPSTestPage() {
  const { fps, avgFps, minFps, maxFps, isRunning, duration, setDuration, start, stop, reset } = useFPS();

  return (
    <TestContainer
      title="FPS Test — Frames Per Second"
      description="Measure browser rendering FPS in real-time. Tests actual frame rate performance of your browser and display."
      slug="fps-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select a test duration.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start and keep this tab focused during the test.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Average, min, and max FPS are calculated over the duration.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="Why is my browser FPS different from game FPS?" answer="Browser FPS measures the rendering performance of the browser tab, not your GPU's full capability. Games use optimized rendering pipelines that typically achieve higher FPS." />
          <FAQItem question="How can I improve browser FPS?" answer="Close other tabs, reduce browser extensions, ensure hardware acceleration is enabled in browser settings, and keep the tab focused during testing." />
        </>
      }
    >
      <div className="space-y-6">
        {isRunning && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
            <div className="text-6xl font-bold tabular-nums text-accent mb-2">{fps}</div>
            <div className="text-sm text-text-muted">Current FPS</div>
          </div>
        )}

        {!isRunning && avgFps > 0 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
              <ScoreDisplay
                score={avgFps}
                label="Average FPS"
                description={`Min: ${minFps} | Max: ${maxFps}`}
              />
            </div>
            <StatsGrid>
              <ResultCard label="Average" value={avgFps} unit="fps" highlight />
              <ResultCard label="Minimum" value={minFps} unit="fps" />
              <ResultCard label="Maximum" value={maxFps} unit="fps" />
              <ResultCard label="Duration" value={duration} unit="s" />
            </StatsGrid>
            <div className="flex justify-center"><RetestButton onClick={reset} /></div>
          </div>
        )}

        {!isRunning && avgFps === 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {[5, 10, 30, 60].map((d) => (
              <button key={d} onClick={() => setDuration(d)} disabled={isRunning}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${duration === d ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"}`}>
                {d}s
              </button>
            ))}
          </div>
        )}

        {!isRunning && avgFps === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">📊</div>
            <div className="text-lg font-semibold text-text-primary mb-1">FPS Benchmark</div>
            <div className="text-sm text-text-muted">Measures browser rendering performance</div>
          </div>
        )}

        <div className="flex justify-center">
          {!isRunning ? (
            <button onClick={() => start()} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start FPS Test
            </button>
          ) : (
            <button onClick={stop} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Test
            </button>
          )}
        </div>
      </div>
    </TestContainer>
  );
}
