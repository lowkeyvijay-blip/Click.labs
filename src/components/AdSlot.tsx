"use client";

import { useEffect, useState } from "react";

interface AdSlotProps {
  position: "top" | "bottom" | "sidebar";
  className?: string;
}

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const sizeMap = {
    top: "h-24 w-full",
    bottom: "h-24 w-full",
    sidebar: "h-64 w-full",
  };

  return (
    <div
      className={`rounded-lg border border-border flex items-center justify-center text-text-muted text-xs ${sizeMap[position]} ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      {visible ? (
        <div className="text-center bg-surface/50 w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-[10px] uppercase tracking-widest mb-1 opacity-50">Advertisement</div>
          <div className="text-xs opacity-30">
            {position === "sidebar" ? "300×250" : "728×90"}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-surface/30 rounded-lg animate-pulse" />
      )}
    </div>
  );
}
