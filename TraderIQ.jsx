import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/ScoreRing";
import SectionCard from "@/components/SectionCard";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { generateTraderIQ } from "@/lib/tradeAI";
import { getScoreColor, formatDate } from "@/lib/tradeUtils";
import {
  Gauge,
  Loader2,
  Sparkles,
  ClipboardList,
  Repeat,
  Shield,
  Crosshair,
  GraduationCap,
  Lock,
  FileSearch,
  TrendingUp,
  Award,
} from "lucide-react";

const COMPONENTS = [
  { key: "planning_score", label: "Planning", icon: ClipboardList, desc: "Quality of trade setups and thesis" },
  { key: "consistency_score", label: "Consistency", icon: Repeat, desc: "Regularity of trading and review habits" },
  { key: "risk_management_score", label: "Risk Management", icon: Shield, desc: "Risk/reward quality and stop loss usage" },
  { key: "execution_score", label: "Execution", icon: Crosshair, desc: "How well trades were executed vs planned" },
  { key: "learning_score", label: "Learning", icon: GraduationCap, desc: "Evidence of learning from mistakes" },
  { key: "discipline_score", label: "Discipline", icon: Lock, desc: "Following plans, avoiding FOMO" },
  { key: "review_habit_score", label: "Review Habit", icon: FileSearch, desc: "Regularity of trade reviews" },
];

export default function TraderIQ() {
  const [reports, setReports] = useState([]);
  const [trades, setTrades] = useState([]);
  const [coaching, setCoaching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadData = () => {
    Promise.all([
      base44.entities.TraderIQ.list("-created_date", 10),
      base44.entities.TradeReview.list("-created_date", 200),
      base44.entities.WeeklyCoaching.list("-week_start", 20),
    ])
      .then(([r, t, c]) => {
        setReports(r);
        setTrades(t);
        setCoaching(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateTraderIQ(trades, coaching);
      await base44.entities.TraderIQ.create(result);
      loadData();
    } catch {}
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Trader IQ</h1>
          <p className="text-muted-foreground mt-1">Your trading discipline score — not intelligence, not profitability.</p>
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const latestReport = reports[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trader IQ</h1>
          <p className="text-muted-foreground mt-1">Trading discipline measured across 7 dimensions. Every score is explained.</p>
        </div>
        {trades.length > 0 && (
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
                {latestReport ? "Regenerate Trader IQ" : "Generate Trader IQ"}
              </>
            )}
          </Button>
        )}
      </div>

      {trades.length === 0 ? (
        <EmptyState
          icon={Gauge}
          title="No trading data yet"
          description="Trader IQ analyzes your trade reviews and coaching reports to measure discipline. Start by reviewing your first trade."
        />
      ) : latestReport ? (
        <>
          {/* Overall Score */}
          <div className="rounded-xl border border-border glass-card p-6 flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={latestReport.overall_score} size={160} label="Trader IQ" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Overall Score</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {latestReport.explanation || "Your Trader IQ reflects trading discipline and decision quality, not profitability. A higher score means better habits, not guaranteed profits."}
              </p>
            </div>
          </div>

          {/* Component Scores */}
          <div>
            <h2 className="font-semibold mb-3">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPONENTS.map((comp) => {
                const score = latestReport[comp.key];
                const Icon = comp.icon;
                return (
                  <div key={comp.key} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{comp.label}</p>
                        <p className="text-xs text-muted-foreground">{comp.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{Math.round(score || 0)}</span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${score || 0}%`,
                          background: score >= 75 ? "#22C55E" : score >= 50 ? "#F59E0B" : score >= 25 ? "#FB923C" : "#F43F5E",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Improvement Trend */}
          {latestReport.improvement_trend && (
            <SectionCard title="Improvement Trend" icon={TrendingUp}>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{latestReport.improvement_trend}</p>
              </div>
            </SectionCard>
          )}

          {/* Past reports */}
          {reports.length > 1 && (
            <div>
              <h2 className="font-semibold mb-3">History</h2>
              <div className="space-y-2">
                {reports.slice(1).map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{formatDate(r.created_date)}</p>
                      <p className="text-xs text-muted-foreground">Overall: {Math.round(r.overall_score || 0)} · Discipline: {Math.round(r.discipline_score || 0)}</p>
                    </div>
                    <p className={`text-lg font-bold ${getScoreColor(r.overall_score)}`}>
                      {Math.round(r.overall_score || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Gauge}
          title="Generate your Trader IQ"
          description="We'll analyze your trade reviews and coaching reports to score your discipline across 7 dimensions. Every score comes with a full explanation."
          action={
            <Button onClick={handleGenerate} disabled={generating} className="gradient-emerald text-white font-semibold gap-2">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "Analyzing..." : "Generate Trader IQ"}
            </Button>
          }
        />
      )}
    </div>
  );
}
