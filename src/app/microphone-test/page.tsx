"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";
import { UnsupportedBrowser } from "@/components/TestUI";

export default function MicrophoneTestPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [level, setLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const enumerateDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioInputs);
      if (audioInputs.length > 0 && !selectedDevice) {
        setSelectedDevice(audioInputs[0].deviceId);
      }
    } catch {
      setError("Cannot enumerate audio devices");
    }
  }, [selectedDevice]);

  const startRecording = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsRecording(true);
      setRecordingTime(0);
      setPeakLevel(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const draw = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const normalizedLevel = Math.min(100, Math.round((avg / 128) * 100));
        setLevel(normalizedLevel);
        setPeakLevel((prev) => Math.max(prev, normalizedLevel));

        // Draw waveform
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;
            ctx.fillStyle = "#13161c";
            ctx.fillRect(0, 0, w, h);

            analyser.getByteTimeDomainData(dataArray);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#3b82f6";
            ctx.beginPath();
            const sliceWidth = w / dataArray.length;
            let x = 0;
            for (let i = 0; i < dataArray.length; i++) {
              const v = dataArray[i] / 128.0;
              const y = (v * h) / 2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              x += sliceWidth;
            }
            ctx.lineTo(w, h / 2);
            ctx.stroke();
          }
        }

        animRef.current = requestAnimationFrame(draw);
      };
      draw();

      await enumerateDevices();
    } catch (err) {
      setHasPermission(false);
      setError(err instanceof Error ? err.message : "Microphone access denied");
    }
  }, [selectedDevice, enumerateDevices]);

  const stopRecording = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    cancelAnimationFrame(animRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setLevel(0);
  }, []);

  const reset = useCallback(() => {
    stopRecording();
    setPeakLevel(0);
    setRecordingTime(0);
    setError(null);
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  if (hasPermission === false) {
    return (
      <TestContainer title="Microphone Test" description="Test your microphone with real-time audio visualization." slug="microphone-test">
        <UnsupportedBrowser feature="Microphone Access" message={error || "Please allow microphone access in your browser settings."} icon="🎤" />
      </TestContainer>
    );
  }

  return (
    <TestContainer
      title="Microphone Test"
      description="Test your microphone with real-time audio visualization, level metering, and device detection."
      slug="microphone-test"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Press Start and allow microphone access when prompted.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Speak into your microphone. The waveform and level meter respond in real-time.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>If multiple microphones are detected, select one from the dropdown.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="My microphone is not detected?" answer="Ensure microphone permissions are granted. Check OS sound settings. Try a different browser. Some privacy extensions block microphone access." />
          <FAQItem question="The level meter is not moving?" answer="Check that the correct microphone is selected. Ensure the microphone is not muted at the OS level. Try speaking louder or closer to the mic." />
        </>
      }
    >
      <div className="space-y-6">
        {devices.length > 1 && (
          <div>
            <label className="text-sm text-text-muted mb-1 block">Select Microphone</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              disabled={isRecording}
              className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-accent/50"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Microphone ${d.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full rounded-xl border border-border bg-surface"
        />

        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Level</span>
              <span>{level}%</span>
            </div>
            <div className="h-3 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${level}%`,
                  backgroundColor: level > 90 ? "#ef4444" : level > 70 ? "#f59e0b" : "#3b82f6",
                }}
              />
            </div>
          </div>
        )}

        <StatsGrid>
          <ResultCard label="Status" value={isRecording ? "Recording" : "Idle"} highlight />
          <ResultCard label="Current Level" value={level} unit="%" />
          <ResultCard label="Peak Level" value={peakLevel} unit="%" />
          <ResultCard label="Duration" value={recordingTime} unit="s" />
        </StatsGrid>

        <div className="flex justify-center gap-3">
          {!isRecording ? (
            <button onClick={startRecording} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="px-8 py-3 rounded-lg bg-danger hover:bg-danger/80 text-white font-medium transition-colors">
              Stop Recording
            </button>
          )}
          {(isRecording || peakLevel > 0) && <RetestButton onClick={reset} />}
        </div>
      </div>
    </TestContainer>
  );
}
