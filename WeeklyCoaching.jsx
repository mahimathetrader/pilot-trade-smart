import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/ScoreRing";
import SectionCard from "@/components/SectionCard";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { getWeekRange, formatDate, getScoreColor } from "@/lib/tradeUtils";
import { generateWeeklyCoaching } from "@/lib/tradeAI";
import {
  GraduationCap,
  Loader2,
  Sparkles,
  Clock,
  AlertTriangle,
  ThumbsUp,
  Shield,
  Heart,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

export default function WeeklyCoaching() {
  const [reports, setReports] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const loadData = () => {
    Promise.all([
      base44.entities.WeeklyCoaching.list("-week_start", 50),
      base44.entities.TradeReview.list("-created_date", 200),
    ])
      .then(([r, t]) => {
        setReports(r);
        setTrades(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const { start, end } = getWeekRange();
  const thisWeekTrades = trades.filter((t) => {
    const d = new Date(t.created_date);
    return d >= new Date(start) && d <= new Date(end + "T23:59:59");
  });

  const hasThisWeekReport = reports.some((r) => r.week_start === start);
  const latestReport = reports[0];

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateWeeklyCoaching(thisWeekTrades);
      const wins = thisWeekTrades.filter((t) => t.outcome === "win").length;
      const closed = thisWeekTrades.filter((t) => t.status === "closed").length;
      await base44.entities.WeeklyCoaching.create({
        week_start: start,
        week_end: end,
        total_trades: thisWeekTrades.length,
        win_rate: closed > 0 ? Math.round((wins / closed) * 100) : 0,
        ...result,
      });
      loadData();
    } catch {
      setError("Failed to generate coaching report. Please try again.");
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weekly Coaching</h1>
          <p className="text-muted-foreground mt-1">AI analysis of your trading behaviour this week.</p>
        </div>
        {thisWeekTrades.length > 0 && !hasThisWeekReport && (
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="gradient-emerald text-white font-semibold gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate This Week
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">{error}</div>
      )}

      {/* This week status */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="font-semibold">{formatDate(start)} — {formatDate(end)}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{thisWeekTrades.length}</p>
              <p className="text-xs text-muted-foreground">Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {thisWeekTrades.filter((t) => t.outcome === "win").length}
              </p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
          </div>
        </div>
        {thisWeekTrades.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            No trades this week yet. Generate a review to start building your coaching data.
          </p>
        )}
        {hasThisWeekReport && (
          <p className="text-sm text-emerald-400 mt-3 flex items-center gap-1">
            <Award className="w-4 h-4" />
            This week's report has been generated.
          </p>
        )}
      </div>

      {/* Latest report */}
      {latestReport ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ScoreRing score={latestReport.discipline_score} size={130} label="Discipline Score" />
              <div className="flex-1 space-y-3 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Total Trades" value={latestReport.total_trades || 0} icon={Target} />
                  <StatCard label="Win Rate" value={`${latestReport.win_rate || 0}%`} icon={Award} />
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="text-sm text-muted-foreground">{latestReport.summary}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Week of {formatDate(latestReport.week_start)}
            </p>
          </div>

          {latestReport.execution_quality && (
            <SectionCard title="Execution Quality" icon={Target}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.execution_quality}</p>
            </SectionCard>
          )}
          {latestReport.best_trading_hours && (
            <SectionCard title="Best Trading Hours" icon={Clock}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.best_trading_hours}</p>
            </SectionCard>
          )}
          {latestReport.worst_trading_hours && (
            <SectionCard title="Worst Trading Hours" icon={Clock}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.worst_trading_hours}</p>
            </SectionCard>
          )}
          {latestReport.recurring_mistakes && (
            <SectionCard title="Recurring Mistakes" icon={AlertTriangle}>
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.recurring_mistakes}</p>
              </div>
            </SectionCard>
          )}
          {latestReport.strengths && (
            <SectionCard title="Strengths" icon={ThumbsUp}>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.strengths}</p>
              </div>
            </SectionCard>
          )}
          {latestReport.risk_habits && (
            <SectionCard title="Risk Habits" icon={Shield}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.risk_habits}</p>
            </SectionCard>
          )}
          {latestReport.emotional_patterns && (
            <SectionCard title="Emotional Patterns" icon={Heart}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.emotional_patterns}</p>
            </SectionCard>
          )}
          {latestReport.improvement_trends && (
            <SectionCard title="Improvement Trends" icon={TrendingUp}>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.improvement_trends}</p>
              </div>
            </SectionCard>
          )}

          {/* Past reports */}
          {reports.length > 1 && (
            <div className="pt-4">
              <h2 className="font-semibold mb-3">Past Reports</h2>
              <div className="space-y-2">
                {reports.slice(1).map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{formatDate(r.week_start)}</p>
                      <p className="text-xs text-muted-foreground">{r.total_trades} trades · {r.win_rate}% win rate</p>
                    </div>
                    <p className={`text-lg font-bold ${getScoreColor(r.discipline_score)}`}>
                      {Math.round(r.discipline_score || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No coaching reports yet"
          description="Close some trades this week, then generate your first AI coaching report to discover your behavioural patterns."
        />
      )}
    </div>
  );
}
