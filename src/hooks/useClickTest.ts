"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface ClickTestResult {
  clicks: number;
  cps: number;
  duration: number;
}

export function useClickTest() {
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ClickTestResult | null>(null);
  const [duration, setDuration] = useState(10);
  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    if (!isRunning) return;
    setClicks((prev) => prev + 1);
  }, [isRunning]);

  const start = useCallback((dur?: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const d = dur || duration;
    setDuration(d);
    setClicks(0);
    setResult(null);
    setIsRunning(true);
    startTimeRef.current = performance.now();

    timerRef.current = setTimeout(() => {
      setIsRunning(false);
      setClicks((finalClicks) => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        const finalCps = finalClicks / elapsed;
        setResult({ clicks: finalClicks, cps: Math.round(finalCps * 100) / 100, duration: elapsed });
        return finalClicks;
      });
    }, d * 1000);
  }, [duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setClicks(0);
    setResult(null);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { clicks, isRunning, result, duration, setDuration, handleClick, start, reset };
}
