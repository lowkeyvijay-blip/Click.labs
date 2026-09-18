"use client";

import { useState, useCallback, useRef } from "react";

interface LatencyResult {
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  samples: number;
}

export function useInputLatency() {
  const [result, setResult] = useState<LatencyResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [samplesNeeded] = useState(30);
  const [sampleCount, setSampleCount] = useState(0);
  const timestampsRef = useRef<{ start: number; end: number }[]>([]);
  const startTimeRef = useRef(0);

  const handleEvent = useCallback(() => {
    if (!isRunning) return;

    const end = performance.now();
    const latency = end - startTimeRef.current;

    setCurrentLatency(Math.round(latency * 10) / 10);
    timestampsRef.current.push({ start: startTimeRef.current, end });
    setSampleCount(timestampsRef.current.length);

    if (timestampsRef.current.length >= samplesNeeded) {
      setIsRunning(false);
      const latencies = timestampsRef.current.map((t) => t.end - t.start);
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const min = Math.min(...latencies);
      const max = Math.max(...latencies);

      setResult({
        avgLatency: Math.round(avg * 10) / 10,
        minLatency: Math.round(min * 10) / 10,
        maxLatency: Math.round(max * 10) / 10,
        samples: latencies.length,
      });
    }
  }, [isRunning, samplesNeeded]);

  const start = useCallback(() => {
    timestampsRef.current = [];
    setCurrentLatency(null);
    setResult(null);
    setSampleCount(0);
    setIsRunning(true);
    startTimeRef.current = performance.now();
  }, []);

  const reset = useCallback(() => {
    timestampsRef.current = [];
    setCurrentLatency(null);
    setResult(null);
    setSampleCount(0);
    setIsRunning(false);
  }, []);

  return { result, isRunning, currentLatency, samplesNeeded, sampleCount, handleEvent, start, reset, startTimeRef };
}
