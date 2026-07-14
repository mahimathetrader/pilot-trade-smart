import React from "react";
import { getScoreStroke } from "@/lib/tradeUtils";

export default function ScoreRing({ score, size = 120, label, sublabel }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score || 0) * (circumference / 100);
  const stroke = getScoreStroke(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: stroke }}>
            {score != null ? Math.round(score) : "—"}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/100</span>
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-center">{label}</p>}
      {sublabel && <p className="text-xs text-muted-foreground text-center">{sublabel}</p>}
    </div>
  );
}
