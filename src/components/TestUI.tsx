"use client";

import { type ReactNode } from "react";

interface UnsupportedBrowserProps {
  feature: string;
  message?: string;
  icon?: ReactNode;
}

export function UnsupportedBrowser({ feature, message, icon }: UnsupportedBrowserProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon || "⚠️"}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {feature} Not Available
      </h3>
      <p className="text-sm text-text-secondary max-w-md">
        {message ||
          `Your browser does not support ${feature}. Please try a modern browser like Chrome, Firefox, or Edge.`}
      </p>
    </div>
  );
}

interface TestInstructionsProps {
  items: string[];
}

export function TestInstructions({ items }: TestInstructionsProps) {
  return (
    <ol className="space-y-1 text-sm text-text-secondary">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-accent font-mono text-xs mt-0.5">{i + 1}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

interface RetestButtonProps {
  onClick: () => void;
  className?: string;
}

export function RetestButton({ onClick, className = "" }: RetestButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 min-h-[44px] rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors ${className}`}
    >
      Test Again
    </button>
  );
}
