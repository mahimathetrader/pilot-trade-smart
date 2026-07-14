import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MARKETS, DIRECTIONS, getOutcomeConfig } from "@/lib/tradeUtils";
import { generatePostTradeReview } from "@/lib/tradeAI";
import EmptyState from "@/components/EmptyState";
import SectionCard from "@/components/SectionCard";
import { RefreshCw, ArrowLeft, Loader2, Sparkles, Save, CheckCircle2, Lightbulb } from "lucide-react";

const EMOTIONS = ["Calm", "Confident", "Anxious", "FOMO", "Greedy", "Fearful", "Patient", "Impulsive", "Disciplined", "Frustrated", "Neutral"];
const OUTCOMES = [
  { value: "win", label: "Win" },
  { value: "loss", label: "Loss" },
  { value: "breakeven", label: "Breakeven" },
];

export default function PostTradeReview() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ outcome: "", actual_exit_price: "", pnl: "", emotional_state: "", post_trade_notes: "" });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const loadTrades = () => {
    base44.entities.TradeReview.filter({ status: "open" }, "-created_date", 50)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrades();
  }, []);

  const selectedTrade = trades.find((t) => t.id === selectedId);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!selectedTrade) return;
    setGenerating(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await generatePostTradeReview(selectedTrade, {
        outcome: formData.outcome,
        actual_exit_price: formData.actual_exit_price ? Number(formData.actual_exit_price) : null,
        pnl: formData.pnl ? Number(formData.pnl) : null,
        emotional_state: formData.emotional_state,
        post_trade_notes: formData.post_trade_notes,
      });
      setAnalysis(result);
    } catch {
      setError("Failed to generate post-trade review. Please try again.");
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!selectedTrade || !analysis) return;
    setSaving(true);
    try {
      await base44.entities.TradeReview.update(selectedTrade.id, {
        status: "closed",
        outcome: formData.outcome,
        actual_exit_price: formData.actual_exit_price ? Number(formData.actual_exit_price) : null,
        pnl: formData.pnl ? Number(formData.pnl) : null,
        emotional_state: formData.emotional_state,
        post_trade_notes: formData.post_trade_notes,
        post_trade_analysis: analysis.post_trade_analysis,
        post_trade_lessons: analysis.post_trade_lessons,
      });
      setSelectedId(null);
      setFormData({ outcome: "", actual_exit_price: "", pnl: "", emotional_state: "", post_trade_notes: "" });
      setAnalysis(null);
      loadTrades();
    } catch {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Selected trade form view
  if (selectedTrade) {
    const market = MARKETS[selectedTrade.market] || { label: selectedTrade.market, emoji: "📊" };
    const direction = DIRECTIONS[selectedTrade.trade_direction] || DIRECTIONS.neutral;

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <button
          onClick={() => { setSelectedId(null); setAnalysis(null); setError(null); }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to open trades
        </button>

        <div>
          <h1 className="text-2xl font-bold">Post-Trade Review</h1>
          <p className="text-muted-foreground mt-1">Close this trade and let AI analyze your execution.</p>
        </div>

        {/* Trade summary */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{market.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold">{market.label}</p>
              <span className={cn("inline-block px-2 py-0.5 rounded-md text-xs font-medium border mt-1", direction.bg, direction.border, direction.color)}>
                {direction.label}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="font-semibold">{selectedTrade.entry_price || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stop Loss</p>
              <p className="font-semibold text-rose-400">{selectedTrade.stop_loss || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="font-semibold text-emerald-400">{selectedTrade.target || "—"}</p>
            </div>
          </div>
        </div>

        {/* Outcome form */}
        {!analysis && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <Label className="text-sm font-semibold">Trade Outcome</Label>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Result</p>
              <div className="grid grid-cols-3 gap-2">
                {OUTCOMES.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => updateField("outcome", o.value)}
                    className={cn(
                      "py-2.5 rounded-lg border text-sm font-medium transition-all",
                      formData.outcome === o.value
                        ? o.value === "win"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : o.value === "loss"
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Exit Price</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.actual_exit_price}
                  onChange={(e) => updateField("actual_exit_price", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">P&L</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.pnl}
                  onChange={(e) => updateField("pnl", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Emotional State</Label>
              <Select value={formData.emotional_state} onValueChange={(v) => updateField("emotional_state", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="How did you feel?" />
                </SelectTrigger>
                <SelectContent>
                  {EMOTIONS.map((e) => (
                    <SelectItem key={e} value={e.toLowerCase()}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea
                placeholder="What happened? Did you follow your plan?"
                value={formData.post_trade_notes}
                onChange={(e) => updateField("post_trade_notes", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">{error}</div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!formData.outcome || generating}
              className="w-full gradient-emerald text-white font-semibold gap-2 h-12"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your trade...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Post-Trade Review
                </>
              )}
            </Button>
          </div>
        )}

        {/* AI Analysis */}
        {analysis && (
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">{error}</div>
            )}

            <SectionCard title="Post-Trade Analysis" icon={CheckCircle2}>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{analysis.post_trade_analysis}</p>
            </SectionCard>

            <SectionCard title="Lessons Learned" icon={Lightbulb}>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{analysis.post_trade_lessons}</p>
              </div>
            </SectionCard>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full gradient-emerald text-white font-semibold gap-2 h-12"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Close Trade
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Post-Trade Review</h1>
        <p className="text-muted-foreground mt-1">Close your open trades and learn from each outcome.</p>
      </div>

      {trades.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No open trades to review"
          description="When you save trade reviews, they'll appear here as open trades. Close them after the trade to get AI post-trade analysis."
          action={
            <Link to="/trade-review/new">
              <Button className="gradient-emerald text-white font-semibold gap-2">
                New Trade Review
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {trades.map((t) => {
            const market = MARKETS[t.market] || { short: t.market, emoji: "📊" };
            const direction = DIRECTIONS[t.trade_direction] || DIRECTIONS.neutral;
            return (
              <div
                key={t.id}
                className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{market.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{market.short}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-xs font-medium", direction.color)}>{direction.label}</span>
                      {t.entry_price && <span className="text-xs text-muted-foreground">@ {t.entry_price}</span>}
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => setSelectedId(t.id)} className="gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Close Trade
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
