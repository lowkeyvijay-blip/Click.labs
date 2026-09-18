"use client";

import { useState, useCallback, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

const KEYBOARD_ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["ShiftLeft", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "ShiftRight"],
  ["ControlLeft", "AltLeft", "MetaLeft", "Space", "MetaRight", "AltRight", "ControlRight"],
];

const KEY_DISPLAY: Record<string, string> = {
  Backspace: "⌫",
  Tab: "Tab",
  CapsLock: "Caps",
  Enter: "Enter",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  AltLeft: "Alt",
  MetaLeft: "Win",
  Space: "Space",
  MetaRight: "Win",
  AltRight: "Alt",
  ControlRight: "Ctrl",
};

function getKeyLabel(code: string): string {
  return KEY_DISPLAY[code] || code.replace("Key", "").replace("Digit", "");
}

export default function KeyboardTesterPage() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [allKeys] = useState(() => new Set(KEYBOARD_ROWS.flat()));
  const [isRunning, setIsRunning] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(e.code));
      if (isRunning) {
        setTestedKeys((prev) => new Set(prev).add(e.code));
      }
    },
    [isRunning]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const testedCount = testedKeys.size;
  const totalCount = allKeys.size;
  const percentage = totalCount > 0 ? Math.round((testedCount / totalCount) * 100) : 0;

  return (
    <TestContainer
      title="Keyboard Tester"
      description="Test every key on your keyboard. Visual keyboard layout shows working and broken keys."
      slug="keyboard-tester"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start to begin testing.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press each key on your keyboard. Keys turn green when detected.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Keys that don&apos;t respond may be broken or disconnected.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="A key is not lighting up?" answer="The key may be physically broken, have debris underneath, or your keyboard may have a hardware issue. Try cleaning the key or testing with a different keyboard." />
          <FAQItem question="Why do some keys show differently?" answer="Different keyboards have different layouts. This tester shows a standard US QWERTY layout. Your physical keyboard may vary." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Keys tested: <span className="text-accent font-mono">{testedCount}</span>/{totalCount}
          </div>
          <div className="text-sm text-text-secondary">
            Progress: <span className="text-accent font-mono">{percentage}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 overflow-x-auto">
          <div className="space-y-1 min-w-[700px]">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((code) => {
                  const isPressed = pressedKeys.has(code);
                  const isTested = testedKeys.has(code);
                  const isWide = ["Space", "Backspace", "Tab", "CapsLock", "Enter", "ShiftLeft", "ShiftRight"].includes(code);

                  return (
                    <div
                      key={code}
                      className={`
                        flex items-center justify-center rounded-md border text-xs font-mono transition-all
                        ${isPressed ? "bg-accent text-white border-accent scale-95" : ""}
                        ${isTested && !isPressed ? "bg-success/10 text-success border-success/30" : ""}
                        ${!isTested && !isPressed ? "bg-surface-hover border-border text-text-muted" : ""}
                        ${isWide ? "flex-[2] h-10" : "flex-1 h-10"}
                      `}
                    >
                      {getKeyLabel(code)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <StatsGrid>
          <ResultCard label="Keys Tested" value={testedCount} highlight />
          <ResultCard label="Total Keys" value={totalCount} />
          <ResultCard label="Working" value={testedCount} unit="keys" />
          <ResultCard label="Coverage" value={percentage} unit="%" />
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
          {testedKeys.size > 0 && (
            <RetestButton onClick={() => { setTestedKeys(new Set()); setIsRunning(false); }} />
          )}
        </div>
      </div>
    </TestContainer>
  );
}
