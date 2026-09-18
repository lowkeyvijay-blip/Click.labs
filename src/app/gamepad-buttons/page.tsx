"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { UnsupportedBrowser } from "@/components/TestUI";

const STANDARD_BUTTONS = [
  "A / Cross", "B / Circle", "X / Square", "Y / Triangle",
  "LB / L1", "RB / R1", "LT / L2", "RT / R2",
  "Back / Select", "Start", "LS / L3", "RS / R3",
  "D-Pad Up", "D-Pad Down", "D-Pad Left", "D-Pad Right",
  "Home / PS", "Share / Capture",
];

export default function GamepadButtonsPage() {
  const [pressedButtons, setPressedButtons] = useState<Set<number>>(new Set());
  const [testedButtons, setTestedButtons] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [hasAPI] = useState(() => typeof navigator !== "undefined" && !!navigator.getGamepads);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!hasAPI) return;

    const poll = () => {
      const pads = navigator.getGamepads();
      const pressed = new Set<number>();
      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (!pad) continue;
        pad.buttons.forEach((btn, idx) => {
          if (btn.pressed) {
            pressed.add(idx);
          }
        });
      }
      setPressedButtons(pressed);
      if (isRunning) {
        setTestedButtons((prev) => {
          const next = new Set(prev);
          pressed.forEach((idx) => next.add(idx));
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, hasAPI]);

  const reset = useCallback(() => {
    setTestedButtons(new Set());
    setIsRunning(false);
  }, []);

  if (!hasAPI) {
    return (
      <TestContainer title="Gamepad Buttons Test" description="Test all gamepad buttons with real-time visual feedback." slug="gamepad-buttons">
        <UnsupportedBrowser feature="Gamepad API" message="Your browser does not support the Gamepad API." icon="🎮" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Gamepad Buttons Test"
      description="Test all gamepad buttons with real-time visual feedback. Press each button to verify it works."
      slug="gamepad-buttons"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Connect a controller and press Start Test.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press each button on your controller. Tested buttons turn green.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Buttons that don&apos;t respond may be broken or not mapped.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="Why do some buttons show as unknown?" answer="Different controllers have different button counts and mappings. Standard labels are based on Xbox/PlayStation conventions. Your controller may use different mappings." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {STANDARD_BUTTONS.map((name, i) => {
            const isPressed = pressedButtons.has(i);
            const isTested = testedButtons.has(i);

            return (
              <div
                key={i}
                className={`p-3 rounded-lg border text-sm text-center transition-all ${
                  isPressed
                    ? "bg-accent text-white border-accent scale-95"
                    : isTested
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-surface border-border text-text-muted"
                }`}
              >
                <div className="font-medium text-xs">{name}</div>
                <div className="text-[10px] mt-1 opacity-70">Button {i}</div>
              </div>
            );
          })}
        </div>

        <StatsGrid>
          <ResultCard label="Buttons Pressed" value={pressedButtons.size} />
          <ResultCard label="Tested" value={testedButtons.size} highlight />
          <ResultCard label="Total" value={STANDARD_BUTTONS.length} />
          <ResultCard label="Coverage" value={STANDARD_BUTTONS.length > 0 ? Math.round((testedButtons.size / STANDARD_BUTTONS.length) * 100) : 0} unit="%" />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          <button onClick={() => setIsRunning(!isRunning)} className={`px-8 py-3 rounded-lg font-medium transition-colors ${isRunning ? "bg-danger hover:bg-danger/80 text-white" : "bg-accent hover:bg-accent-hover text-white"}`}>
            {isRunning ? "Stop Test" : "Start Test"}
          </button>
          {testedButtons.size > 0 && (
            <button onClick={reset} className="px-6 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-primary font-medium text-sm transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>
    </TestContainer>
  );
}
