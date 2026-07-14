import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import ReviewCard from "@/components/ReviewCard";
import EmptyState from "@/components/EmptyState";
import { formatPnl } from "@/lib/tradeUtils";
import { BookOpen, PlusCircle, TrendingUp, Award, Target, DollarSign } from "lucide-react";

export default function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.TradeReview.list("-created_date", 200)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const closedTrades = trades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => t.outcome === "win").length;
  const losses = closedTrades.filter((t) => t.outcome === "loss").length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgQuality = trades.length > 0
    ? Math.round(trades.filter(t => t.trade_quality_score != null).reduce((a, t) => a + (t.trade_quality_score || 0), 0) / Math.max(trades.filter(t => t.trade_quality_score != null).length, 1))
    : 0;

  if (trades.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Trade Journal</h1>
        <EmptyState
          icon={BookOpen}
          title="Your journal is empty"
          description="Every trade you review and close will be logged here with full details and outcomes."
          action={
            <Link to="/trade-review/new">
              <Button className="gradient-emerald text-white font-semibold gap-2">
                <PlusCircle className="w-4 h-4" />
                New Trade Review
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Journal</h1>
          <p className="text-muted-foreground mt-1">Complete chronological log of your trading activity.</p>
        </div>
        <Link to="/trade-review/new">
          <Button className="gradient-emerald text-white font-semibold gap-2">
            <PlusCircle className="w-4 h-4" />
            New Review
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Trades" value={trades.length} icon={Target} />
        <StatCard label="Win Rate" value={`${winRate}%`} icon={Award} sublabel={`${wins}W / ${losses}L`} />
        <StatCard
          label="Net P&L"
          value={formatPnl(totalPnl)}
          icon={DollarSign}
        />
        <StatCard label="Avg Quality" value={avgQuality} icon={TrendingUp} />
      </div>

      <div>
        <h2 className="font-semibold mb-3">All Trades</h2>
        <div className="space-y-3">
          {trades.map((t) => (
            <ReviewCard key={t.id} review={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
