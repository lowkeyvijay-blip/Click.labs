"use client";

import { useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { useInputLatency } from "@/hooks/useInputLatency";

export default function KeyboardLatencyPage() {
  const { result, isRunning, currentLatency, samplesNeeded, sampleCount, handleEvent, start, reset } = useInputLatency();
  const testAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRunning && testAreaRef.current) {
      const raf = requestAnimationFrame(() => {
        testAreaRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isRunning]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      handleEvent();
    }
  };

  return (
    <TestContainer
      title="Keyboard Latency Test"
      description="Estimate keyboard input latency. Browser-based measurement — results are approximate."
      slug="keyboard-latency"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start, then press Space or Enter as quickly as possible when prompted.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Each key press measures the time between the visual cue and your input.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>{samplesNeeded} samples are collected for an average latency estimate.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="How accurate is this?" answer="This measures browser-level input processing time. Real hardware latency depends on the keyboard switch type, USB polling rate, and OS processing." />
          <FAQItem question="What is good keyboard latency?" answer="Mechanical gaming keyboards: 1-5ms. Standard membrane keyboards: 10-30ms. Wireless keyboards may have additional latency." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.avgLatency} label="Average Keyboard Latency (ms)" description={`${result.samples} samples collected`} />
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
            ref={testAreaRef}
            onKeyDown={isRunning ? handleKeyDown : undefined}
            tabIndex={isRunning ? 0 : -1}
            className={`relative rounded-xl border-2 border-dashed select-none transition-all aspect-video flex flex-col items-center justify-center ${
              isRunning ? "border-accent bg-accent/5 focus:outline-none" : "border-border bg-surface"
            }`}
          >
            {isRunning ? (
              <>
                <div className="text-4xl mb-3">⌨️</div>
                <div className="text-lg font-semibold text-text-primary">Press SPACE or ENTER!</div>
                <div className="text-sm text-text-muted">Press as fast as you can</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">⏱️</div>
                <div className="text-lg font-semibold text-text-primary mb-1">Keyboard Latency</div>
                <div className="text-sm text-text-muted">Measures keyboard input delay</div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Press SPACE/ENTER!" : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
