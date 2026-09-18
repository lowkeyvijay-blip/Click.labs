"use client";

import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { useReactionTime } from "@/hooks/useReactionTime";

export default function ReactionTimePage() {
  const { state, reactionTime, history, attempts, bestTime, avgTime, start, handleClick, reset } = useReactionTime();

  return (
    <TestContainer
      title="Reaction Time Test"
      description="Test your visual reaction time. Measures how quickly you respond to visual stimuli."
      slug="reaction-time"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start and wait for the screen to turn green.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Click as soon as you see the green screen.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Clicking too early counts as a false start. Try 5+ attempts for accurate results.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is a good reaction time?" answer="Average human reaction time is 200-250ms. Under 200ms is fast. Under 150ms is exceptional (possibly anticipatory). Pro gamers average 150-180ms." />
          <FAQItem question="Why do I keep clicking too early?" answer="It&apos;s called anticipation. Your brain predicts when the green will appear. Vary the delay makes it unpredictable to prevent this." />
        </>
      }
    >
      <div className="space-y-6">
        <div
          onClick={handleClick}
          className={`relative rounded-xl border-2 select-none cursor-pointer transition-all aspect-video flex flex-col items-center justify-center ${
            state === "idle"
              ? "border-border bg-surface"
              : state === "waiting"
              ? "border-danger bg-danger/10"
              : state === "ready"
              ? "border-success bg-success/10"
              : state === "too-early"
              ? "border-danger bg-danger/10"
              : "border-accent bg-accent/5"
          }`}
        >
          {state === "idle" && (
            <>
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-lg font-semibold text-text-primary mb-1">Reaction Time</div>
              <div className="text-sm text-text-muted">Click when the screen turns green</div>
            </>
          )}
          {state === "waiting" && (
            <>
              <div className="text-4xl mb-3">👀</div>
              <div className="text-lg font-semibold text-danger">Wait for green...</div>
              <div className="text-sm text-text-muted">Don&apos;t click yet!</div>
            </>
          )}
          {state === "ready" && (
            <>
              <div className="text-4xl mb-3">🟢</div>
              <div className="text-lg font-semibold text-success">CLICK NOW!</div>
            </>
          )}
          {state === "too-early" && (
            <>
              <div className="text-4xl mb-3">❌</div>
              <div className="text-lg font-semibold text-danger">Too early!</div>
              <div className="text-sm text-text-muted">Wait for the green screen</div>
            </>
          )}
          {state === "clicked" && reactionTime !== null && (
            <>
              <div className="text-5xl font-bold text-accent mb-2">{reactionTime}ms</div>
              <div className="text-sm text-text-muted">
                {reactionTime < 150 ? "Lightning fast!" : reactionTime < 200 ? "Very fast!" : reactionTime < 250 ? "Average" : "Keep practicing!"}
              </div>
            </>
          )}
        </div>

        {history.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">History ({attempts} attempts)</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((rt, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono ${
                    rt === bestTime ? "bg-success/10 text-success border border-success/30" : "bg-surface-hover text-text-secondary"
                  }`}
                >
                  {rt}ms {rt === bestTime && "★"}
                </div>
              ))}
            </div>
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Best Time" value={bestTime ?? "—"} unit={bestTime ? "ms" : ""} highlight />
          <ResultCard label="Average" value={avgTime ?? "—"} unit={avgTime ? "ms" : ""} />
          <ResultCard label="Attempts" value={attempts} />
          <ResultCard label="Rating" value={
            bestTime === null ? "—" : bestTime < 150 ? "Elite" : bestTime < 200 ? "Fast" : bestTime < 250 ? "Average" : "Slow"
          } />
        </StatsGrid>

        <div className="flex justify-center">
          {(state === "idle" || state === "clicked" || state === "too-early") ? (
            <button onClick={start} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              {state === "clicked" ? "Try Again" : state === "too-early" ? "Try Again" : "Start Test"}
            </button>
          ) : (
            <button onClick={reset} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>
    </TestContainer>
  );
}
