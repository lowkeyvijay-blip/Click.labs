"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type ReactionState = "idle" | "waiting" | "ready" | "clicked" | "too-early";

export function useReactionTime() {
  const [state, setState] = useState<ReactionState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    setState("waiting");
    setReactionTime(null);
    const delay = 1500 + Math.random() * 4000;
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setState("ready");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("too-early");
      setReactionTime(-1);
      return;
    }
    if (state === "ready") {
      const rt = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(rt);
      setHistory((prev) => [...prev, rt]);
      setAttempts((prev) => prev + 1);
      setState("clicked");
    }
  }, [state]);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState("idle");
    setReactionTime(null);
  }, []);

  const bestTime = history.length > 0 ? Math.min(...history) : null;
  const avgTime = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { state, reactionTime, history, attempts, bestTime, avgTime, start, handleClick, reset };
}
