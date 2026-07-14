import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/ReviewCard";
import ScoreRing from "@/components/ScoreRing";
import TodayChecklist from "@/components/TodayChecklist";
import { Skeleton, StatsSkeleton } from "@/components/Skeleton";
import { MARKETS, getScoreColor, formatPnl, getWeekRange } from "@/lib/tradeUtils";
import {
  PlusCircle,
  RefreshCw,
  Target,
  Award,
  TrendingUp,
  AlertTriangle,
  Brain,
  ArrowRight,
  Newspaper,
  BookOpen,
  BadgeCheck,
  ChevronUp,
  ChevronDown,
  Gauge,
  GraduationCap,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [coaching, setCoaching] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.TradeReview.list("-created_date", 50),
      base44.entities.WeeklyCoaching.list("-week_start", 5),
      base44.entities.NewsArticle.list("-created_date", 3),
    ])
      .then(([t, c, n]) => {
        setTrades(t);
        setCoaching(c);
        setNews(n);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openTrades = trades.filter((t) => t.status === "open");
  const closedTrades = trades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => t.outcome === "win").length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;
  const avgQuality = trades.length > 0
    ? Math.round(trades.filter(t => t.trade_quality_score != null).reduce((a, t) => a + (t.trade_quality_score || 0), 0) / Math.max(trades.filter(t => t.trade_quality_score != null).length, 1))
    : 0;
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const latestCoaching = coaching[0];
  const prevCoaching = coaching[1];
  const weeklyTrend = latestCoaching && prevCoaching
    ? (latestCoaching.discipline_score || 0) - (prevCoaching.discipline_score || 0)
    : null;

  const { start } = getWeekRange();
  const thisWeekTrades = trades.filter((t) => new Date(t.created_date) >= new Date(start));
  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Trader";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (trades.length === 0 && news.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Think. Check. Trade.</span>
          </div>
          <h1 className="text-3xl font-bold">Welcome, {firstName}</h1>
          <p className="text-muted-foreground mt-1">One last check before your risk — let's start with your first trade review.</p>
        </div>
        <TodayChecklist />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/trade-review/new" className="block">
            <div className="rounded-xl border border-border glass-card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Review a Trade</h3>
              <p className="text-sm text-muted-foreground">Upload a chart or pick a market to get a transparent AI decision review.</p>
            </div>
          </Link>
          <Link to="/market-news" className="block">
            <div className="rounded-xl border border-border glass-card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">Read Market News</h3>
              <p className="text-sm text-muted-foreground">Fetch the latest market-moving news with AI analysis. Understand in under a minute.</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Think. Check. Trade.</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground mt-1">What should you know before risking money today?</p>
        </div>
        <Link to="/trade-review/new">
          <Button className="gradient-emerald text-white font-semibold gap-2">
            <PlusCircle className="w-4 h-4" />
            Review Trade
          </Button>
        </Link>
      </div>

      {/* Today's Checklist */}
      <TodayChecklist />

      {/* Top Market News */}
      {news.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-accent" />
              <h2 className="font-semibold">Top Market News</h2>
            </div>
            <Link to="/market-news">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                All news <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {news.map((n) => (
              <Link key={n.id} to="/market-news" className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground capitalize">{n.category?.replace("_", " ")}</span>
                  {n.importance === "high" && <span className="px-1.5 py-0.5 rounded text-xs bg-rose-500/10 text-rose-400">High</span>}
                </div>
                <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors">{n.headline}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.ai_summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: trades.length, icon: Target },
          { label: "Open Trades", value: openTrades.length, icon: RefreshCw, sub: "Need post-trade" },
          { label: "Win Rate", value: `${winRate}%`, icon: Award, sub: `${wins}W / ${closedTrades.length - wins}L` },
          { label: "Avg Quality", value: avgQuality, icon: TrendingUp, sub: "Setup score" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            {s.sub && <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Needs review */}
      {openTrades.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold">Trades Needing Post-Trade Review</h2>
            </div>
            <Link to="/post-trade">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {openTrades.slice(0, 4).map((t) => (
              <ReviewCard key={t.id} review={t} to="/post-trade" />
            ))}
          </div>
        </div>
      )}

      {/* Recent reviews + Behaviour Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Recent Reviews</h2>
            </div>
            <Link to="/reviews">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {trades.slice(0, 5).map((t) => (
              <ReviewCard key={t.id} review={t} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Behaviour Score</h2>
            </div>
            <div className="rounded-xl border border-border glass-card p-5 flex flex-col items-center">
              <ScoreRing
                score={latestCoaching?.discipline_score ?? avgQuality}
                size={120}
                label={latestCoaching ? "Discipline" : "Avg Quality"}
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {latestCoaching ? "Based on latest weekly coaching" : "Generate weekly coaching for discipline score"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Weekly Improvement</h2>
            </div>
            <div className="rounded-xl border border-border glass-card p-5">
              {weeklyTrend != null ? (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${weeklyTrend >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                    {weeklyTrend >= 0 ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-rose-400" />}
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${weeklyTrend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {weeklyTrend >= 0 ? "+" : ""}{Math.round(weeklyTrend)} pts
                    </p>
                    <p className="text-xs text-muted-foreground">vs last week</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Generate 2+ weekly coaching reports to track improvement.</p>
                  <Link to="/coaching">
                    <Button variant="outline" size="sm" className="gap-2 mt-1">
                      <GraduationCap className="w-4 h-4" />
                      Weekly Coaching
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/trader-iq" className="block">
              <div className="rounded-xl border border-border glass-card p-4 hover:border-primary/30 transition-all group">
                <Gauge className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">Trader IQ</p>
              </div>
            </Link>
            <Link to="/journal" className="block">
              <div className="rounded-xl border border-border glass-card p-4 hover:border-primary/30 transition-all group">
                <BookOpen className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-sm">Journal</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Journal Summary */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Journal Summary</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
            <p className="text-xl font-bold">{trades.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">This Week</p>
            <p className="text-xl font-bold">{thisWeekTrades.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Net P&L</p>
            <p className={`text-xl font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {formatPnl(totalPnl)}
            </p>
          </div>
          <Link to="/journal" className="block">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition-colors h-full">
              <p className="text-xs text-muted-foreground mb-1">Full Journal</p>
              <div className="flex items-center gap-1 text-primary font-semibold">
                <span className="text-sm">Open</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
