import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { MARKETS, getScoreColor } from "@/lib/tradeUtils";
import { Brain, PlusCircle, Clock, Award, Compass, Heart, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(222 20% 9%)",
  border: "1px solid hsl(222 18% 17%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function BehaviourAnalytics() {
  const [trades, setTrades] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.TradeReview.list("-created_date", 200),
      base44.entities.WeeklyCoaching.list("-week_start", 20),
    ])
      .then(([t, r]) => {
        setTrades(t);
        setReports(r);
      })
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

  if (trades.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Behaviour Analytics</h1>
        <EmptyState
          icon={Brain}
          title="No behavioural data yet"
          description="Your behavioural patterns emerge from your trading history. Start reviewing and closing trades to unlock personalised insights."
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

  // Trades by 2-hour intervals
  const byHour = [];
  for (let h = 0; h < 24; h += 2) {
    const count = trades.filter((t) => {
      const hour = new Date(t.created_date).getHours();
      return hour >= h && hour < h + 2;
    }).length;
    if (count > 0) byHour.push({ hour: `${h.toString().padStart(2, "0")}:00`, trades: count });
  }

  // Win rate by market
  const winRateByMarket = Object.entries(
    trades.reduce((acc, t) => {
      if (!acc[t.market]) acc[t.market] = { wins: 0, total: 0 };
      acc[t.market].total++;
      if (t.outcome === "win") acc[t.market].wins++;
      return acc;
    }, {})
  )
    .map(([market, data]) => ({
      market: MARKETS[market]?.short || market,
      winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
    }))
    .filter((d) => d.winRate > 0);

  // Direction pie
  const directionData = [
    { name: "Long", value: trades.filter((t) => t.trade_direction === "long").length, color: "#22C55E" },
    { name: "Short", value: trades.filter((t) => t.trade_direction === "short").length, color: "#F43F5E" },
    { name: "Neutral", value: trades.filter((t) => t.trade_direction === "neutral").length, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  // Discipline trend from weekly coaching
  const disciplineData = [...reports]
    .sort((a, b) => new Date(a.week_start) - new Date(b.week_start))
    .map((r) => ({
      week: new Date(r.week_start).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: r.discipline_score || 0,
    }));

  // Emotional state analysis
  const byEmotion = Object.entries(
    trades.filter((t) => t.emotional_state).reduce((acc, t) => {
      const key = t.emotional_state;
      if (!acc[key]) acc[key] = { wins: 0, total: 0 };
      acc[key].total++;
      if (t.outcome === "win") acc[key].wins++;
      return acc;
    }, {})
  )
    .map(([emotion, data]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Behaviour Analytics</h1>
        <p className="text-muted-foreground mt-1">Discover your patterns. Your edge is self-awareness.</p>
      </div>

      {/* Trading Hours */}
      {byHour.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Trading Activity by Hour</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
              <XAxis dataKey="hour" stroke="hsl(215 14% 55%)" fontSize={10} />
              <YAxis stroke="hsl(215 14% 55%)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 18% 13%)" }} />
              <Bar dataKey="trades" fill="#E8B339" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Win rate by market */}
        {winRateByMarket.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Win Rate by Market</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={winRateByMarket}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
                <XAxis dataKey="market" stroke="hsl(215 14% 55%)" fontSize={10} />
                <YAxis stroke="hsl(215 14% 55%)" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 18% 13%)" }} />
                <Bar dataKey="winRate" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Direction distribution */}
        {directionData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Direction Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={directionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {directionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Discipline trend */}
      {disciplineData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Discipline Score Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={disciplineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
              <XAxis dataKey="week" stroke="hsl(215 14% 55%)" fontSize={10} />
              <YAxis stroke="hsl(215 14% 55%)" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#E8B339" strokeWidth={2} dot={{ fill: "#E8B339", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotional state analysis */}
      {byEmotion.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Win Rate by Emotional State</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byEmotion}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 18% 17%)" />
              <XAxis dataKey="emotion" stroke="hsl(215 14% 55%)" fontSize={10} />
              <YAxis stroke="hsl(215 14% 55%)" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 18% 13%)" }} />
              <Bar dataKey="winRate" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Trades", value: trades.length },
          { label: "Markets Traded", value: new Set(trades.map((t) => t.market)).size },
          { label: "Avg Quality", value: Math.round(trades.reduce((a, t) => a + (t.trade_quality_score || 0), 0) / Math.max(trades.filter(t => t.trade_quality_score).length, 1)) },
          { label: "Coaching Reports", value: reports.length },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
