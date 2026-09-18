"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";


type TestPhase = "idle" | "left" | "right" | "both" | "result";

export default function HeadphoneTestPage() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [results, setResults] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
  const [volume, setVolume] = useState(60);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playTone = useCallback((channel: "left" | "right" | "both", freq: number, duration: number) => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);

    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = volume / 100;

    osc.connect(splitter);

    if (channel === "left") {
      splitter.connect(merger, 0, 0);
    } else if (channel === "right") {
      splitter.connect(merger, 1, 1);
    } else {
      splitter.connect(merger, 0, 0);
      splitter.connect(merger, 1, 1);
    }

    merger.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    timerRef.current = setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  }, [volume]);

  const startTest = useCallback(() => {
    setResults({ left: false, right: false });
    setPhase("left");
    playTone("left", 880, 1500);
  }, [playTone]);

  const handleResponse = useCallback(
    (heard: boolean) => {
      if (phase === "left") {
        setResults((prev) => ({ ...prev, left: heard }));
        setPhase("right");
        playTone("right", 660, 1500);
      } else if (phase === "right") {
        setResults((prev) => ({ ...prev, right: heard }));
        setPhase("both");
        playTone("both", 440, 2000);
      } else if (phase === "both") {
        setPhase("result");
      }
    },
    [phase, playTone]
  );

  const reset = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
    setResults({ left: false, right: false });
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const bothPass = results.left && results.right;

  return (
    <TestContainer
      title="Headphone Test"
      description="Test headphones with channel detection, stereo balance, and audio quality verification."
      slug="headphone-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Put on your headphones and press Start.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>A tone plays in the left ear first, then right, then both.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Click Yes/No after each tone to confirm you can hear it.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="I can&apos;t hear anything in one ear?" answer="Check that the headphone jack is fully inserted. Test with a different audio source. The issue may be with the headphone cable, driver, or audio jack." />
          <FAQItem question="What frequencies are tested?" answer="Left: 880Hz (A5). Right: 660Hz (E5). Both: 440Hz (A4). Different frequencies help identify if specific audio ranges are affected." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-4">
          <span className="text-xs text-text-muted">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-accent"
          />
          <span className="text-xs text-text-muted w-8">{volume}%</span>
        </div>

        {phase === "result" ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {bothPass ? "✓ Both Channels Working" : "⚠ Issue Detected"}
              </div>
              <div className="text-sm text-text-muted">
                {bothPass
                  ? "Both left and right channels are working correctly."
                  : "One or both channels may have issues. Try reseating your headphones."}
              </div>
            </div>

            <StatsGrid>
              <ResultCard label="Left Channel" value={results.left ? "Pass" : "Fail"} highlight={results.left} />
              <ResultCard label="Right Channel" value={results.right ? "Pass" : "Fail"} highlight={results.right} />
              <ResultCard label="Stereo" value={bothPass ? "Yes" : "No"} />
              <ResultCard label="Status" value={bothPass ? "Good" : "Check"} />
            </StatsGrid>

            <div className="flex justify-center">
              <button onClick={reset} className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors">
                Test Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border-2 border-dashed border-border bg-surface aspect-video flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">🎧</div>
              {phase === "idle" && (
                <>
                  <div className="text-lg font-semibold text-text-primary mb-1">Headphone Test</div>
                  <div className="text-sm text-text-muted">Tests stereo channels individually</div>
                </>
              )}
              {phase === "left" && (
                <>
                  <div className="text-lg font-semibold text-accent mb-1">🔊 Playing Left Channel</div>
                  <div className="text-sm text-text-muted">Can you hear the tone in your left ear?</div>
                </>
              )}
              {phase === "right" && (
                <>
                  <div className="text-lg font-semibold text-accent mb-1">🔊 Playing Right Channel</div>
                  <div className="text-sm text-text-muted">Can you hear the tone in your right ear?</div>
                </>
              )}
              {phase === "both" && (
                <>
                  <div className="text-lg font-semibold text-accent mb-1">🔊 Playing Both Channels</div>
                  <div className="text-sm text-text-muted">Can you hear the tone in both ears?</div>
                </>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {phase !== "idle" && (
                <>
                  <button onClick={() => handleResponse(true)} className="px-8 py-3 rounded-lg bg-success hover:bg-success/80 text-white font-medium transition-colors">
                    Yes, I hear it
                  </button>
                  <button onClick={() => handleResponse(false)} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
                    No, I don&apos;t
                  </button>
                </>
              )}
            </div>

            {phase === "idle" && (
              <div className="flex justify-center">
                <button onClick={startTest} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
                  Start Test
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </TestContainer>
  );
}
