"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { UnsupportedBrowser } from "@/components/TestUI";

export default function SpeakerTestPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<"both" | "left" | "right">("both");
  const [volume, setVolume] = useState(70);
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startTest = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      osc.type = "sine";
      osc.frequency.value = 440; // A4

      // Channel splitting
      const splitter = ctx.createChannelSplitter(2);
      const merger = ctx.createChannelMerger(2);

      osc.connect(splitter);

      if (selectedChannel === "left") {
        splitter.connect(merger, 0, 0);
      } else if (selectedChannel === "right") {
        splitter.connect(merger, 1, 1);
      } else {
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 1, 1);
      }

      merger.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      gain.gain.value = volume / 100;

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      analyserRef.current = analyser;

      setIsPlaying(true);
      setHasAudio(true);

      const draw = () => {
        if (!analyserRef.current || !canvasRef.current) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          ctx.fillStyle = "#13161c";
          ctx.fillRect(0, 0, w, h);

          const barWidth = w / dataArray.length * 2.5;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * h;
            ctx.fillStyle = `hsl(${210 + i}, 70%, ${50 + dataArray[i] / 10}%)`;
            ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
            x += barWidth;
            if (x > w) break;
          }
        }

        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    } catch (err) {
      setHasAudio(false);
      setError(err instanceof Error ? err.message : "Audio playback failed");
    }
  }, [selectedChannel, volume]);

  const stopTest = useCallback(() => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    cancelAnimationFrame(animRef.current);
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    stopTest();
    setHasAudio(null);
    setError(null);
  }, [stopTest]);

  useEffect(() => {
    return () => { stopTest(); };
  }, [stopTest]);

  if (hasAudio === false) {
    return (
      <TestContainer title="Speaker Test" description="Test your speakers with stereo audio output." slug="speaker-test">
        <UnsupportedBrowser feature="Audio Playback" message={error || "Audio playback is not available."} icon="🔊" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Speaker Test"
      description="Test your speakers with stereo audio output, channel detection, and volume verification."
      slug="speaker-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select a channel (Both, Left, or Right) and press Start.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>A 440Hz tone plays through the selected channel(s).</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Adjust the volume slider to test different output levels.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="I can hear sound from only one speaker?" answer="Try the Left/Right channel test. If sound only comes from one side, check speaker connections, audio balance settings, or try a different audio source." />
          <FAQItem question="What frequency is being played?" answer="440Hz (A4 note) — a standard reference tone. It's a pure sine wave that clearly reveals speaker distortion, rattling, or channel imbalance." />
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {(["both", "left", "right"] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => { if (!isPlaying) setSelectedChannel(ch); }}
              disabled={isPlaying}
              className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                selectedChannel === ch ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {ch === "both" ? "🔊 Both" : ch === "left" ? "🔈 Left" : "🔉 Right"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4">
          <span className="text-xs text-text-muted">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (gainRef.current) gainRef.current.gain.value = Number(e.target.value) / 100;
            }}
            className="flex-1 accent-accent"
          />
          <span className="text-xs text-text-muted w-8">{volume}%</span>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full rounded-xl border border-border bg-surface"
        />

        <StatsGrid>
          <ResultCard label="Status" value={isPlaying ? "Playing" : "Idle"} highlight />
          <ResultCard label="Channel" value={selectedChannel} />
          <ResultCard label="Frequency" value="440" unit="Hz" />
          <ResultCard label="Volume" value={volume} unit="%" />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          {!isPlaying ? (
            <button onClick={startTest} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start Test
            </button>
          ) : (
            <button onClick={stopTest} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Test
            </button>
          )}
          {hasAudio && <RetestButton onClick={reset} />}
        </div>
      </div>
    </TestContainer>
  );
}
