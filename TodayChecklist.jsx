import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ClipboardCheck } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Reviewed today's market news",
  "Checked economic calendar for events",
  "Reviewed watchlist status",
  "Risk per trade is defined",
  "Stop loss level is set",
  "Trade thesis is written down",
  "Not trading on FOMO or emotion",
  "Not revenge trading after a loss",
];

export default function TodayChecklist() {
  const today = new Date().toDateString();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`tc_checklist_${today}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return new Array(CHECKLIST_ITEMS.length).fill(false);
  });

  useEffect(() => {
    try {
      localStorage.setItem(`tc_checklist_${today}`, JSON.stringify(items));
    } catch {}
  }, [items, today]);

  const completed = items.filter(Boolean).length;
  const allDone = completed === CHECKLIST_ITEMS.length;

  const toggle = (i) => {
    setItems((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="rounded-xl border border-border glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold">Today's Pre-Trade Checklist</h2>
            <p className="text-xs text-muted-foreground mt-0.5">One last check before your risk</p>
          </div>
        </div>
        <span
          className={cn(
            "text-sm font-medium px-2.5 py-1 rounded-full",
            allDone ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
          )}
        >
          {completed}/{CHECKLIST_ITEMS.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {CHECKLIST_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left"
          >
            {items[i] ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={cn("text-sm", items[i] ? "text-muted-foreground line-through" : "text-foreground")}>
              {item}
            </span>
          </button>
        ))}
      </div>
      {allDone && (
        <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-sm text-emerald-400 animate-fade-in">
          ✓ All checks complete. You're ready to trade with discipline.
        </div>
      )}
    </div>
  );
}
