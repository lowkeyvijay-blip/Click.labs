"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useMousePollingRate() {
  const [result, setResult] = useState<{ rate: number; avgInterval: number; samples: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const timestampsRef = useRef<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const listenerRef = useRef<(() => void) | null>(null);
  const SAMPLE_DURATION = 3000;

  const cleanup = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("mousemove", listenerRef.current);
      listenerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cleanup();
    timestampsRef.current = [];
    setSampleCount(0);
    setResult(null);
    setIsRunning(true);

    const onMouseMove = () => {
      const now = performance.now();
      timestampsRef.current.push(now);
      setSampleCount(timestampsRef.current.length);
    };

    listenerRef.current = onMouseMove;
    window.addEventListener("mousemove", onMouseMove);

    timerRef.current = setTimeout(() => {
      cleanup();
      setIsRunning(false);
      const timestamps = timestampsRef.current;
      if (timestamps.length < 2) {
        setResult({ rate: 0, avgInterval: 0, samples: timestamps.length });
        return;
      }

      const intervals: number[] = [];
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const rate = Math.round(1000 / avgInterval);

      setResult({ rate, avgInterval: Math.round(avgInterval * 100) / 100, samples: timestamps.length });
    }, SAMPLE_DURATION);
  }, [cleanup]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cleanup();
    timestampsRef.current = [];
    setSampleCount(0);
    setResult(null);
    setIsRunning(false);
  }, [cleanup]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      cleanup();
    };
  }, [cleanup]);

  return { result, isRunning, sampleCount, start, reset };
}
