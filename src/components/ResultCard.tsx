"use client";

import { type ReactNode } from "react";

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  highlight?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ResultCard({ label, value, unit, icon, highlight = false, size = "md" }: ResultCardProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4 md:p-5",
    lg: "p-5 md:p-6",
  };

  const valueClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  };

  return (
    <div
      className={`rounded-xl border ${
        highlight ? "border-accent/40 bg-accent/5" : "border-border bg-surface"
      } ${sizeClasses[size]} flex flex-col items-center text-center`}
    >
      {icon && <div className="text-text-muted mb-1">{icon}</div>}
      <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`${valueClasses[size]} font-bold tabular-nums`}>
        {value}
        {unit && <span className="text-sm font-normal text-text-muted ml-1">{unit}</span>}
      </div>
    </div>
  );
}

interface ScoreDisplayProps {
  score: number | string;
  label: string;
  description?: string;
}

export function ScoreDisplay({ score, label, description }: ScoreDisplayProps) {
  return (
    <div className="text-center py-6">
      <div className="text-5xl md:text-6xl font-bold tabular-nums text-accent mb-2">{score}</div>
      <div className="text-sm font-medium text-text-primary">{label}</div>
      {description && <div className="text-xs text-text-muted mt-1">{description}</div>}
    </div>
  );
}

interface StatsGridProps {
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>;
}
