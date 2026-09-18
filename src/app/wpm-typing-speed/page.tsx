"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TestContainer, FAQItem } from "@/components/TestContainer";
import { ScoreDisplay, ResultCard, StatsGrid } from "@/components/ResultCard";
import { RetestButton } from "@/components/TestUI";

const WORD_LIST = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "pack", "my",
  "box", "with", "five", "dozen", "liquor", "jugs", "how", "vast", "daft", "two",
  "big", "phinx", "of", "jewel", "grabs", "my", "very", "fine", "woman", "said",
  "prof", "plum", "blew", "crazy", "quiz", "fix", "bed", "near", "wall", "car",
  "drive", "street", "power", "light", "great", "green", "world", "life", "time",
  "work", "play", "move", "make", "like", "come", "take", "know", "get", "give",
  "find", "tell", "ask", "seem", "feel", "try", "leave", "call", "need", "become",
  "keep", "let", "begin", "show", "hear", "play", "run", "move", "live", "believe",
  "hold", "bring", "happen", "write", "provide", "sit", "stand", "lose", "pay", "meet",
  "include", "continue", "set", "learn", "change", "lead", "understand", "watch", "follow", "stop",
];

interface TypingResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  time: number;
}

export default function WPMTestPage() {
  const [targetText, setTargetText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetTextRef = useRef(targetText);

  useEffect(() => { targetTextRef.current = targetText; }, [targetText]);

  const calculateResult = useCallback(
    (typed: string, elapsed: number) => {
      const target = targetTextRef.current;
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === target[i]) correct++;
      }
      const minutes = elapsed / 60;
      const words = correct / 5;
      const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
      const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
      setResult({ wpm, accuracy, correctChars: correct, totalChars: typed.length, time: Math.round(elapsed) });
    },
    []
  );

  const generateText = useCallback(() => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 50).join(" ");
  }, []);

  const start = useCallback(() => {
    const text = generateText();
    setTargetText(text);
    setTypedText("");
    setResult(null);
    setIsFinished(false);
    setIsRunning(true);
    setTimeLeft(duration);
    startTimeRef.current = performance.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [duration, generateText]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isRunning) return;
      const value = e.target.value;
      setTypedText(value);

      if (value.length >= targetTextRef.current.length) {
        clearInterval(timerRef.current!);
        setIsRunning(false);
        setIsFinished(true);
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        calculateResult(value, elapsed);
      }
    },
    [isRunning, calculateResult]
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedText("");
    setResult(null);
    setIsRunning(false);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    if (isFinished && typedText) {
      calculateResult(typedText, (performance.now() - startTimeRef.current) / 1000);
    }
  }, [isFinished, typedText, calculateResult]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const renderText = () => {
    return targetText.split("").map((char, i) => {
      let color = "text-text-muted";
      if (i < typedText.length) {
        color = typedText[i] === char ? "text-success" : "text-danger";
      } else if (i === typedText.length && isRunning) {
        color = "text-text-primary underline";
      }
      return (
        <span key={i} className={`${color} transition-colors`}>
          {char}
        </span>
      );
    });
  };

  return (
    <TestContainer
      title="Typing Speed Test — WPM"
      description="Measure your words per minute typing speed with real-time accuracy tracking."
      slug="wpm-typing-speed"
      instructions={
        <ol className="space-y-1 text-sm text-text-secondary">
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">1.</span><span>Select a duration and press Start.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">2.</span><span>Type the displayed text as fast and accurately as possible.</span></li>
          <li className="flex gap-2"><span className="text-accent font-mono text-xs">3.</span><span>Your WPM and accuracy are calculated when time runs out.</span></li>
        </ol>
      }
      faq={
        <>
          <FAQItem question="What is a good WPM?" answer="Average typing speed is 40 WPM. Good is 60+ WPM. Professional typists achieve 80-100+ WPM. Gamers often benefit from higher typing speeds for in-game communication." />
          <FAQItem question="How is WPM calculated?" answer="WPM = (correct characters / 5) / (time in minutes). Each word is standardized as 5 characters. Only correct characters count toward WPM." />
        </>
      }
    >
      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <ScoreDisplay score={result.wpm} label="Words Per Minute" description={`${result.accuracy}% accuracy`} />
          </div>
          <StatsGrid>
            <ResultCard label="WPM" value={result.wpm} highlight />
            <ResultCard label="Accuracy" value={result.accuracy} unit="%" />
            <ResultCard label="Correct" value={result.correctChars} unit="chars" />
            <ResultCard label="Time" value={result.time} unit="s" />
          </StatsGrid>
          <div className="flex justify-center"><RetestButton onClick={reset} /></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[30, 60, 120].map((d) => (
              <button key={d} onClick={() => { if (!isRunning) setDuration(d); }} disabled={isRunning}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${duration === d ? "bg-accent text-white" : "bg-surface border border-border text-text-secondary hover:text-text-primary"}`}>
                {d}s
              </button>
            ))}
          </div>

          {targetText && (
            <div className="rounded-xl border border-border bg-surface p-6 font-mono text-lg leading-relaxed">
              {renderText()}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={handleInput}
            disabled={!isRunning}
            placeholder={isRunning ? "Start typing..." : "Press Start to begin"}
            className="w-full h-12 px-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 font-mono disabled:opacity-50"
          />

          {isRunning && (
            <div className="text-center">
              <span className="text-2xl font-bold tabular-nums text-accent">{timeLeft}s</span>
            </div>
          )}

          <div className="flex justify-center">
            <button onClick={start} disabled={isRunning} className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium transition-colors">
              {isRunning ? "Typing..." : "Start Test"}
            </button>
          </div>
        </div>
      )}
    </TestContainer>
  );
}
