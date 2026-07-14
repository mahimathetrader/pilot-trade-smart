import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MARKETS, DIRECTIONS, getOutcomeConfig, getScoreColor, formatDate, calcRiskReward } from "@/lib/tradeUtils";
import { ChevronRight } from "lucide-react";

export default function ReviewCard({ review, to }) {
  const market = MARKETS[review.market] || { short: review.market, emoji: "📊" };
  const direction = DIRECTIONS[review.trade_direction] || DIRECTIONS.neutral;
  const outcome = getOutcomeConfig(review.outcome);
  const rr = calcRiskReward(review.entry_price, review.stop_loss, review.target);
  const linkTo = to || `/reviews/${review.id}`;

  return (
    <Link
      to={linkTo}
      className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{market.emoji}</span>
          <div>
            <p className="font-semibold text-sm">{market.short}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.created_date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border", direction.bg, direction.border, direction.color)}>
            {direction.label}
          </span>
          <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border", outcome.bg, outcome.border, outcome.color)}>
            {outcome.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {review.trade_quality_score != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Quality</span>
            <span className={cn("font-bold", getScoreColor(review.trade_quality_score))}>
              {Math.round(review.trade_quality_score)}
            </span>
          </div>
        )}
        {rr && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">R:R</span>
            <span className="font-bold">1:{rr}</span>
          </div>
        )}
        {review.pnl != null && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">P&L</span>
            <span className={cn("font-bold", review.pnl >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {review.pnl >= 0 ? "+" : ""}{Number(review.pnl).toFixed(2)}
            </span>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}
