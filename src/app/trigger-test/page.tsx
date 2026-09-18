"use client";

import { useState, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { UnsupportedBrowser } from "@/components/TestUI";

export default function TriggerTestPage() {
  const [triggers, setTriggers] = useState<{ index: number; value: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasAPI] = useState(() => typeof navigator !== "undefined" && !!navigator.getGamepads);
  const [peakValues, setPeakValues] = useState<Map<number, number>>(new Map());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!hasAPI || !isRunning) return;

    const poll = () => {
      const pads = navigator.getGamepads();
      const newTriggers: { index: number; value: number }[] = [];

      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (!pad) continue;
        [6, 7].forEach((btnIdx) => {
          if (btnIdx < pad.buttons.length) {
            const val = pad.buttons[btnIdx].value;
            newTriggers.push({ index: btnIdx, value: val });
            setPeakValues((prev) => {
              const next = new Map(prev);
              const peak = next.get(btnIdx) || 0;
              if (val > peak) next.set(btnIdx, val);
              return next;
            });
          }
        });
      }

      setTriggers(newTriggers);
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, hasAPI]);

  if (!hasAPI) {
    return (
      <TestContainer title="Trigger Test" description="Test analog trigger pressure sensitivity." slug="trigger-test">
        <UnsupportedBrowser feature="Gamepad API" message="Your browser does not support the Gamepad API." icon="🎯" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Trigger Test"
      description="Test analog trigger pressure sensitivity, range of motion, and dead zones."
      slug="trigger-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Connect a controller with analog triggers (L2/R2 or LT/RT).</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start and squeeze the triggers slowly from 0% to 100%.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>The bar shows current pressure. Release to check return-to-zero.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="My triggers only show 0 or 100?" answer="Some controllers use digital triggers instead of analog. This is common on older or budget controllers. The test will show binary (on/off) behavior." />
          <FAQItem question="What is trigger deadzone?" answer="The deadzone is the range at the start of the trigger pull where no input is registered. Some controllers have a small deadzone by design to prevent accidental activation." />
        </>
      }
    >
      <div className="space-y-6">
        {triggers.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-lg font-semibold text-text-primary mb-1">No Triggers Detected</div>
            <div className="text-sm text-text-muted">Connect a controller with analog triggers</div>
          </div>
        ) : (
          <div className="space-y-4">
            {triggers.map((trig) => (
              <div key={trig.index} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    {trig.index === 6 ? "Left Trigger (LT/L2)" : "Right Trigger (RT/R2)"}
                  </span>
                  <span className="text-sm font-mono text-accent">{(trig.value * 100).toFixed(1)}%</span>
                </div>

                <div className="relative h-8 rounded-full bg-background border border-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${trig.value * 100}%`,
                      backgroundColor: trig.value > 0.9 ? "#ef4444" : trig.value > 0.5 ? "#f59e0b" : "#3b82f6",
                    }}
                  />
                  {[25, 50, 75].map((mark) => (
                    <div
                      key={mark}
                      className="absolute top-0 bottom-0 w-px bg-border/50"
                      style={{ left: `${mark}%` }}
                    />
                  ))}
                </div>

                <div className="flex justify-between mt-1 text-[10px] text-text-muted">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>

                <div className="mt-2 text-xs text-text-muted">
                  Peak: {((peakValues.get(trig.index) || 0) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Triggers" value={triggers.length} highlight />
          <ResultCard label="L Peak" value={triggers.length > 0 ? ((peakValues.get(6) || 0) * 100).toFixed(0) : "—"} unit="%" />
          <ResultCard label="R Peak" value={triggers.length > 1 ? ((peakValues.get(7) || 0) * 100).toFixed(0) : "—"} unit="%" />
          <ResultCard label="Status" value={isRunning ? "Active" : "Idle"} />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button onClick={() => setIsRunning(true)} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start Test
            </button>
          ) : (
            <button onClick={() => setIsRunning(false)} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Test
            </button>
          )}
        </div>
      </div>
    </TestContainer>
  );
}
