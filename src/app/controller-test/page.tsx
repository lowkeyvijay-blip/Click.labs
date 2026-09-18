"use client";

import { useState, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { UnsupportedBrowser } from "@/components/TestUI";

interface GamepadInfo {
  id: string;
  index: number;
  axes: number[];
  buttons: number;
  connected: boolean;
  timestamp: number;
}

export default function ControllerTestPage() {
  const [gamepads, setGamepads] = useState<GamepadInfo[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [hasAPI] = useState(() => typeof navigator !== "undefined" && !!navigator.getGamepads);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!hasAPI || !isPolling) return;

    const pollGamepads = () => {
      const pads = navigator.getGamepads();
      const info: GamepadInfo[] = [];
      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (pad) {
          info.push({
            id: pad.id,
            index: pad.index,
            axes: Array.from(pad.axes),
            buttons: pad.buttons.length,
            connected: pad.connected,
            timestamp: pad.timestamp,
          });
        }
      }
      setGamepads(info);
      rafRef.current = requestAnimationFrame(pollGamepads);
    };

    rafRef.current = requestAnimationFrame(pollGamepads);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPolling, hasAPI]);

  useEffect(() => {
    const handleConnect = () => {};
    const handleDisconnect = () => {};
    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);
    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!hasAPI) {
    return (
      <TestContainer title="Controller/Gamepad Test" description="Test your gamepad or controller connection." slug="controller-test">
        <UnsupportedBrowser feature="Gamepad API" message="Your browser does not support the Gamepad API. Please use Chrome, Firefox, or Edge." icon="🎮" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Controller/Gamepad Test"
      description="Test your gamepad or controller connection and basic input detection using the Gamepad API."
      slug="controller-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Connect your controller via USB or Bluetooth.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Press any button on the controller to activate it.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Press Start Detection to see connected controllers.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="My controller is not detected?" answer="Ensure the controller is properly connected. Press a button to activate it. Some controllers need specific drivers. Try a different USB port or reconnect Bluetooth." />
          <FAQItem question="Which controllers are supported?" answer="Most modern gamepads work: Xbox, PlayStation, Switch Pro, and generic USB/Bluetooth controllers. The Gamepad API is standardized across browsers." />
        </>
      }
    >
      <div className="space-y-6">
        {gamepads.length === 0 && !isPolling && (
          <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🎮</div>
            <div className="text-lg font-semibold text-text-primary mb-1">No Controller Detected</div>
            <div className="text-sm text-text-muted">Connect a controller and press a button, then start detection</div>
          </div>
        )}

        {gamepads.length > 0 && (
          <div className="space-y-4">
            {gamepads.map((gp) => (
              <div key={gp.index} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{gp.id}</div>
                    <div className="text-xs text-text-muted">Port {gp.index}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${gp.connected ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                    {gp.connected ? "Connected" : "Disconnected"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-text-muted mb-1">Buttons: {gp.buttons}</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: gp.buttons }, (_, i) => (
                        <div key={i} className="w-6 h-6 rounded bg-surface-hover border border-border flex items-center justify-center text-[10px] text-text-muted">
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted mb-1">Axes: {gp.axes.length}</div>
                    <div className="space-y-1">
                      {gp.axes.map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-text-muted w-6">A{i}</span>
                          <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${((val + 1) / 2) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-text-muted w-10 text-right">{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Controllers" value={gamepads.length} highlight />
          <ResultCard label="Status" value={isPolling ? "Polling" : "Idle"} />
          <ResultCard label="API" value="Gamepad" />
          <ResultCard label="Total Buttons" value={gamepads.reduce((a, g) => a + g.buttons, 0)} />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          {!isPolling ? (
            <button onClick={() => setIsPolling(true)} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start Detection
            </button>
          ) : (
            <button onClick={() => setIsPolling(false)} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Detection
            </button>
          )}
        </div>
      </div>
    </TestContainer>
  );
}
