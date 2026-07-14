import React from "react";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, sublabel, icon: Icon, trend, className }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
      {trend != null && (
        <p className={cn("text-xs font-medium mt-1", trend >= 0 ? "text-emerald-400" : "text-rose-400")}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
}
