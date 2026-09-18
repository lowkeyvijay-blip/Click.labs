"use client";

import { useState, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { UnsupportedBrowser } from "@/components/TestUI";

interface StickState {
  x: number;
  y: number;
  deadzone: number;
}

export default function AnalogStickTestPage() {
  const [sticks, setSticks] = useState<StickState[]>([]);
  const [deadzone, setDeadzone] = useState(0.1);
  const [isRunning, setIsRunning] = useState(false);
  const [hasAPI] = useState(() => typeof navigator !== "undefined" && !!navigator.getGamepads);
  const [driftHistory, setDriftHistory] = useState<{ stick: number; x: number; y: number }[]>([]);
  const rafRef = useRef<number>(0);
  const isRunningRef = useRef(isRunning);
  const deadzoneRef = useRef(deadzone);

  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { deadzoneRef.current = deadzone; }, [deadzone]);

  useEffect(() => {
    if (!hasAPI || !isRunning) return;

    const poll = () => {
      const pads = navigator.getGamepads();
      const newSticks: StickState[] = [];
      const drifts: { stick: number; x: number; y: number }[] = [];
      const dz = deadzoneRef.current;

      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (!pad) continue;
        for (let a = 0; a < pad.axes.length; a += 2) {
          if (a + 1 < pad.axes.length) {
            const rawX = pad.axes[a];
            const rawY = pad.axes[a + 1];
            const dist = Math.sqrt(rawX * rawX + rawY * rawY);
            const x = dist < dz ? 0 : rawX;
            const y = dist < dz ? 0 : rawY;
            newSticks.push({ x, y, deadzone: dz });
            if (dist > 0.01 && dist < dz) {
              drifts.push({ stick: a / 2, x: rawX, y: rawY });
            }
          }
        }
      }

      setSticks(newSticks);
      if (drifts.length > 0) {
        setDriftHistory((prev) => [...prev.slice(-20), ...drifts]);
      }
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, hasAPI]);

  if (!hasAPI) {
    return (
      <TestContainer title="Analog Stick Test" description="Test analog stick drift and range of motion." slug="analog-stick-test">
        <UnsupportedBrowser feature="Gamepad API" message="Your browser does not support the Gamepad API." icon="🕹️" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Analog Stick Test"
      description="Test analog stick drift, dead zones, and full range of motion with visual feedback."
      slug="analog-stick-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Connect a controller with analog sticks.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press Start and move the sticks. The visualizer shows position and range.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Release sticks to check for drift. Adjust deadzone if needed.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is stick drift?" answer="Stick drift is when the analog stick registers input even when not being touched. It&apos;s caused by worn potentiometers. The deadzone setting helps compensate." />
          <FAQItem question="How do I fix stick drift?" answer="Increase the deadzone setting. Clean around the stick base. If persistent, the controller may need professional repair or replacement." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-4">
          <span className="text-xs text-text-muted">Deadzone</span>
          <input
            type="range"
            min="0"
            max="50"
            value={deadzone * 100}
            onChange={(e) => setDeadzone(Number(e.target.value) / 100)}
            className="flex-1 accent-accent"
          />
          <span className="text-xs text-text-muted w-12">{(deadzone * 100).toFixed(0)}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sticks.length === 0 ? (
            <>
              <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-square flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">🕹️</div>
                <div className="text-sm text-text-muted">Left Stick</div>
                <div className="text-xs text-text-muted">No data</div>
              </div>
              <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-square flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">🕹️</div>
                <div className="text-sm text-text-muted">Right Stick</div>
                <div className="text-xs text-text-muted">No data</div>
              </div>
            </>
          ) : (
            sticks.map((stick, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs text-text-muted mb-2 text-center">{i === 0 ? "Left Stick" : "Right Stick"}</div>
                <div className="relative w-full aspect-square rounded-lg bg-background border border-border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-border" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div
                    className="absolute rounded-full border border-accent/30 bg-accent/5"
                    style={{
                      width: `${deadzone * 200}%`,
                      height: `${deadzone * 200}%`,
                      left: `${50 - deadzone * 100}%`,
                      top: `${50 - deadzone * 100}%`,
                    }}
                  />
                  <div
                    className="absolute w-4 h-4 rounded-full bg-accent border-2 border-white shadow-lg transition-all duration-75"
                    style={{
                      left: `${50 + stick.x * 50}%`,
                      top: `${50 + stick.y * 50}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
                <div className="mt-2 text-center text-xs text-text-muted">
                  X: {stick.x.toFixed(3)} | Y: {stick.y.toFixed(3)}
                </div>
              </div>
            ))
          )}
        </div>

        {driftHistory.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <h3 className="text-sm font-semibold text-warning mb-2">Potential Drift Detected</h3>
            <div className="text-xs text-text-muted">
              {driftHistory.length} drift events detected. Consider increasing the deadzone.
            </div>
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Sticks" value={sticks.length} highlight />
          <ResultCard label="Deadzone" value={(deadzone * 100).toFixed(0)} unit="%" />
          <ResultCard label="Drift Events" value={driftHistory.length} />
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
