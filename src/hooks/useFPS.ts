"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useFPS() {
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const [minFps, setMinFps] = useState(Infinity);
  const [maxFps, setMaxFps] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(10);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((dur?: number) => {
    const d = dur || duration;
    setDuration(d);
    setFps(0);
    setAvgFps(0);
    setMinFps(Infinity);
    setMaxFps(0);
    setIsRunning(true);
    frameCountRef.current = 0;
    fpsHistoryRef.current = [];
    lastTimeRef.current = performance.now();

    const tick = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        setFps(currentFps);
        fpsHistoryRef.current.push(currentFps);
        setMinFps((prev) => Math.min(prev, currentFps));
        setMaxFps((prev) => Math.max(prev, currentFps));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setIsRunning(false);
      const history = fpsHistoryRef.current;
      if (history.length > 0) {
        const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
        setAvgFps(avg);
        setMinFps(Math.min(...history));
        setMaxFps(Math.max(...history));
      }
    }, d * 1000);
  }, [duration]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    const history = fpsHistoryRef.current;
    if (history.length > 0) {
      const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
      setAvgFps(avg);
      setMinFps(Math.min(...history));
      setMaxFps(Math.max(...history));
    }
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setFps(0);
    setAvgFps(0);
    setMinFps(Infinity);
    setMaxFps(0);
    setIsRunning(false);
    frameCountRef.current = 0;
    fpsHistoryRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { fps, avgFps, minFps: minFps === Infinity ? 0 : minFps, maxFps, isRunning, duration, setDuration, start, stop, reset };
}
