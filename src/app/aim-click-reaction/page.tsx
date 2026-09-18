"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

interface Target {
  x: number;
  y: number;
  id: number;
  size: number;
}

interface HitResult {
  reactionTime: number;
  distance: number;
}

export default function AimClickReactionPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [results, setResults] = useState<HitResult[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const size = 44 + Math.random() * 30;
    const x = size + Math.random() * (rect.width - size * 2);
    const y = size + Math.random() * (rect.height - size * 2);
    const newTarget = { x, y, id: Date.now(), size };
    setTarget(newTarget);
    startTimeRef.current = performance.now();
  }, []);

  const handleTargetClick = useCallback(() => {
    if (!target) return;
    const reactionTime = Math.round(performance.now() - startTimeRef.current);
    setResults((prev) => [...prev, { reactionTime, distance: 0 }]);
    setScore((prev) => prev + 1);
    setTarget(null);

    setRound((prev) => {
      const next = prev + 1;
      if (next >= totalRounds) {
        setShowResult(true);
        return next;
      }
      spawnTimerRef.current = setTimeout(spawnTarget, 500 + Math.random() * 1000);
      return next;
    });
  }, [target, totalRounds, spawnTarget]);

  const handleMiss = useCallback(
    (e: React.MouseEvent) => {
      if (!isRunning || target) return;
      if (e.target === e.currentTarget) {
        spawnTarget();
      }
    },
    [isRunning, target, spawnTarget]
  );

  const start = useCallback(() => {
    setIsRunning(true);
    setResults([]);
    setScore(0);
    setRound(0);
    setShowResult(false);
    setTarget(null);
    setTimeout(spawnTarget, 500);
  }, [spawnTarget]);

  const reset = useCallback(() => {
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    setIsRunning(false);
    setTarget(null);
    setResults([]);
    setScore(0);
    setRound(0);
    setShowResult(false);
  }, []);

  useEffect(() => {
    return () => { if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current); };
  }, []);

  const avgReaction = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b.reactionTime, 0) / results.length)
    : 0;

  return (
    <TestContainer
      title="Aim & Click Reaction Test"
      description="Test your aiming and clicking reaction time. Click appearing targets as fast and accurately as possible."
      slug="aim-click-reaction"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start and targets will appear randomly in the test area.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Click each target as fast as you can. Missing counts as a miss.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>10 rounds total. Score is based on hits and reaction time.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="How is this different from reaction time?" answer="This test combines aiming precision with reaction time. You must both see the target and accurately click it, which is more representative of real gaming scenarios." />
        </>
      }
    >
      <div className="space-y-6">
        {showResult ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
              <ScoreDisplay score={`${score}/${totalRounds}`} label="Targets Hit" description={`Average reaction: ${avgReaction}ms`} />
            </div>
            <StatsGrid>
              <ResultCard label="Hits" value={score} highlight />
              <ResultCard label="Accuracy" value={totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0} unit="%" />
              <ResultCard label="Avg Reaction" value={avgReaction} unit="ms" />
              <ResultCard label="Best" value={results.length > 0 ? Math.min(...results.map((r) => r.reactionTime)) : 0} unit="ms" />
            </StatsGrid>
            <div className="flex justify-center"><RetestButton onClick={reset} /></div>
          </div>
        ) : (
          <>
            <div className="text-sm text-text-secondary text-center">
              Round {Math.min(round + 1, totalRounds)}/{totalRounds} | Score: {score}
            </div>

            <div
              ref={containerRef}
              onClick={handleMiss}
              className={`relative rounded-xl border-2 overflow-hidden transition-all aspect-video ${
                isRunning ? "border-accent bg-surface cursor-crosshair" : "border-border bg-surface"
              }`}
            >
              {isRunning && target && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleTargetClick(); }}
                  className="absolute rounded-full bg-accent hover:bg-accent-hover transition-transform hover:scale-110"
                  style={{
                    left: target.x - target.size / 2,
                    top: target.y - target.size / 2,
                    width: target.size,
                    height: target.size,
                  }}
                />
              )}

              {!isRunning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <div className="text-lg font-semibold text-text-primary mb-1">Aim & Click</div>
                  <div className="text-sm text-text-muted">Click targets as they appear</div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {!isRunning ? (
                <button onClick={start} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
                  Start Test
                </button>
              ) : (
                <button onClick={reset} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
                  Stop
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </TestContainer>
  );
}
