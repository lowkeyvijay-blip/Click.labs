"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useMousePollingRate } from "@/hooks/useMousePollingRate";

export default function MousePollingRatePage() {
  const { result, isRunning, sampleCount, start, reset } = useMousePollingRate();

  return (
    <TestContainer
      title="Mouse Polling Rate Test"
      description="Estimate your mouse polling rate (Hz). This is a browser-based measurement — results are approximate."
      slug="mouse-polling-rate"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start and move your mouse continuously over the test area.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Move the mouse at a consistent speed for 3 seconds.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>The estimated polling rate is calculated from mouse movement intervals.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="How accurate is this?" answer="Browser APIs introduce variable latency. This provides an estimate. Professional tools using dedicated hardware are more accurate. Common polling rates: 125Hz (8ms), 250Hz (4ms), 500Hz (2ms), 1000Hz (1ms)." />
          <FAQItem question="What is polling rate?" answer="Polling rate is how often your mouse reports its position to the computer, measured in Hz. Higher rates mean smoother cursor movement and lower input lag." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay
              score={result.rate > 0 ? `~${result.rate}` : "N/A"}
              label="Estimated Polling Rate (Hz)"
              description={result.samples > 2 ? `Based on ${result.samples} movement samples` : "Not enough samples — try moving mouse faster"}
            />
          </div>
          <StatsGrid>
            <ResultCard label="Rate" value={`~${result.rate}`} unit="Hz" highlight />
            <ResultCard label="Avg Interval" value={result.avgInterval} unit="ms" />
            <ResultCard label="Samples" value={result.samples} />
            <ResultCard label="Confidence" value={result.samples > 100 ? "High" : result.samples > 30 ? "Medium" : "Low"} />
          </StatsGrid>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className={`relative rounded-xl border-2 border-dashed select-none transition-all aspect-video flex flex-col items-center justify-center ${
              isRunning ? "border-accent bg-accent/5" : "border-border bg-surface"
            }`}
          >
            {isRunning ? (
              <>
                <div className="text-2xl font-bold tabular-nums text-accent mb-2">Samples: {sampleCount}</div>
                <div className="text-sm text-text-muted">Move your mouse continuously over this area</div>
                <div className="absolute bottom-4 text-xs text-text-muted">Keep moving for 3 seconds</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">📡</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Mouse Polling Rate</div>
                <div className="text-sm text-text-muted">Move mouse to measure Hz</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Measuring..." : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
