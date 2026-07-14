import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { MARKETS, formatPnl } from "@/lib/tradeUtils";
import { CalendarRange, Target, Award, DollarSign, TrendingUp, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#E8B339", "#22C55E", "#F43F5E", "#F59E0B", "#3B82F6", "#4ECDC4"];
const tooltipStyle = {
  backgroundColor: "hsl(222 20% 9%)",
  border: "1px solid hsl(222 18% 17%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function MonthlyInsights() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    base44.entities.TradeReview.list("-created_date", 200)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = targetMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

  const monthTrades = trades.filter((t) => {
    const d = new Date(t.created_date);
    return d.getMonth() === targetMonth.getMonth() && d.getFullYear() === targetMonth.getFullYear();
  });

  const closedTrades = monthTrades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => t.outcome === "win").length;
  const losses = closedTrades.filter((t) => t.outcome === "loss").length;
  const breakevens = closedTrades.filter((t) => t.outcome === "breakeven").length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgQuality = monthTrades.length > 0
    ? Math.round(monthTrades.filter(t => t.trade_quality_score != null).reduce((a, t) => a + (t.trade_quality_score || 0), 0) / Math.max(monthTrades.filter(t => t.trade_quality_score != null).length, 1))
    : 0;

  // Cumulative P&L
  const sortedClosed = [...closedTrades].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
  let cumulative = 0;
  const pnlData = sortedClosed.map((t, i) => {
    cumulative += t.pnl || 0;
    return { day: `T${i + 1}`, pnl: Number(cumulative.toFixed(2)) };
  });

  // Win/Loss pie
  const winLossData = [
    { name: "Wins", value: wins, color: "#22C55E" },
    { name: "Losses", value: losses, color: "#F43F5E" },
    { name: "Breakeven", value: breakevens, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  // By market
  const byMarket = Object.entries(
    monthTrades.reduce((acc, t) => {
      acc[t.market] = (acc[t.market] || 0) + 1;
      return acc;
    }, {})
  ).map(([market, count]) => ({ market: MARKETS[market]?.short || market, trades: count }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Monthly Insights</h1>
        <EmptyState
          icon={CalendarRange}
          title="No data yet"
          description="Generate trade reviews and close trades to see your monthly performance insights and trends."
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
          <h1 className="text-2xl font-bold">Monthly Insights</h1>
          <p className="text-muted-foreground mt-1">Your trading performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonthOffset(monthOffset - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
          {monthOffset < 0 && (
            <Button variant="outline" size="icon" onClick={() => setMonthOffset(monthOffset + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {monthTrades.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title={`No trades in ${monthName}`}
          description="Try a different month or start a new trade review."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Trades" value={monthTrades.length} icon={Target} />
            <StatCard label="Win Rate" value={`${winRate}%`} icon={Award} sublabel={`${wins}W / ${losses}L`} />
            <StatCard label="Net P&L" value={formatPnl(totalPnl)} icon={DollarSign} />
            <StatCard label="Avg Quality" value={avgQuality} icon={TrendingUp} />
          </div>

          {/* P&L Trend */}
          {pnlData.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-sm mb-4">Cumulative P&L Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={pnlData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8B339" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E8B339" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
                  <XAxis dataKey="day" stroke="hsl(215 14% 55%)" fontSize={11} />
                  <YAxis stroke="hsl(215 14% 55%)" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="pnl" stroke="#E8B339" fill="url(#pnlGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Win/Loss pie */}
            {winLossData.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Win / Loss Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={winLossData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {winLossData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* By market */}
            {byMarket.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4">Trades by Market</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byMarket}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
                    <XAxis dataKey="market" stroke="hsl(215 14% 55%)" fontSize={10} />
                    <YAxis stroke="hsl(215 14% 55%)" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 18% 13%)" }} />
                    <Bar dataKey="trades" fill="#E8B339" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
