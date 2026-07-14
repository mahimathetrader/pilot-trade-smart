import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { MARKETS, TIMEFRAMES, calcRiskReward } from "@/lib/tradeUtils";
import { generateTradeReview } from "@/lib/tradeAI";
import ReviewDisplay from "@/components/ReviewDisplay";
import {
  Camera,
  Sparkles,
  Save,
  X,
  Upload,
  Loader2,
  ChevronRight,
} from "lucide-react";

export default function NewTradeReview() {
  const navigate = useNavigate();
  const reviewRef = useRef(null);

  const [formData, setFormData] = useState({
    market: "",
    trade_direction: "",
    entry_price: "",
    stop_loss: "",
    target: "",
    timeframe: "",
    trade_thesis: "",
  });
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setScreenshotUrl(file_url);
    } catch {
      setError("Failed to upload screenshot. Please try again.");
    }
    setUploading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setReview(null);
    try {
      const data = {
        market: formData.market,
        timeframe: formData.timeframe || null,
        trade_direction: formData.trade_direction || null,
        entry_price: formData.entry_price ? Number(formData.entry_price) : null,
        stop_loss: formData.stop_loss ? Number(formData.stop_loss) : null,
        target: formData.target ? Number(formData.target) : null,
        trade_thesis: formData.trade_thesis || null,
        screenshot_url: screenshotUrl,
      };
      const result = await generateTradeReview(data);
      setReview(result);
      setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Failed to generate review. Please try again.");
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const created = await base44.entities.TradeReview.create({
        market: formData.market,
        trade_direction: formData.trade_direction || "neutral",
        entry_price: formData.entry_price ? Number(formData.entry_price) : null,
        stop_loss: formData.stop_loss ? Number(formData.stop_loss) : null,
        target: formData.target ? Number(formData.target) : null,
        timeframe: formData.timeframe || null,
        trade_thesis: formData.trade_thesis || null,
        screenshot_url: screenshotUrl,
        status: "open",
        outcome: "open",
        ...review,
      });
      navigate(`/reviews/${created.id}`);
    } catch {
      setError("Failed to save review. Please try again.");
    }
    setSaving(false);
  };

  const rr = calcRiskReward(
    formData.entry_price ? Number(formData.entry_price) : null,
    formData.stop_loss ? Number(formData.stop_loss) : null,
    formData.target ? Number(formData.target) : null
  );

  const reviewData = review
    ? {
        ...formData,
        entry_price: formData.entry_price ? Number(formData.entry_price) : null,
        stop_loss: formData.stop_loss ? Number(formData.stop_loss) : null,
        target: formData.target ? Number(formData.target) : null,
        screenshot_url: screenshotUrl,
        ...review,
      }
    : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">New Trade Review</h1>
        <p className="text-muted-foreground mt-1">Upload a chart or describe your setup. Get a transparent AI decision review.</p>
      </div>

      {/* Market Selection */}
      <div className="rounded-xl border border-border bg-card p-5">
        <Label className="text-sm font-semibold mb-3 block">Market <span className="text-rose-400">*</span></Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(MARKETS).map(([key, market]) => (
            <button
              key={key}
              onClick={() => updateField("market", key)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                formData.market === key
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              )}
            >
              <span className="text-xl">{market.emoji}</span>
              <span className="font-medium text-sm">{market.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Upload */}
      <div className="rounded-xl border border-border bg-card p-5">
        <Label className="text-sm font-semibold mb-3 block">Chart Screenshot (Optional)</Label>
        {screenshotUrl ? (
          <div className="relative group">
            <img src={screenshotUrl} alt="Chart" className="w-full rounded-lg max-h-80 object-contain bg-black/30" />
            <button
              onClick={() => setScreenshotUrl(null)}
              className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Upload TradingView screenshot</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </>
            )}
          </label>
        )}
      </div>

      {/* Trade Details */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <Label className="text-sm font-semibold">Trade Details (Optional)</Label>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Direction</p>
          <div className="grid grid-cols-3 gap-2">
            {["long", "short", "neutral"].map((dir) => (
              <button
                key={dir}
                onClick={() => updateField("trade_direction", formData.trade_direction === dir ? "" : dir)}
                className={cn(
                  "py-2.5 rounded-lg border text-sm font-medium capitalize transition-all",
                  formData.trade_direction === dir
                    ? dir === "long"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : dir === "short"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Entry Price</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.entry_price}
              onChange={(e) => updateField("entry_price", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Stop Loss</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.stop_loss}
              onChange={(e) => updateField("stop_loss", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Target</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.target}
              onChange={(e) => updateField("target", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {rr && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Calculated Risk/Reward:</span>
            <span className="font-bold text-primary">1:{rr}</span>
          </div>
        )}

        <div>
          <Label className="text-xs text-muted-foreground">Timeframe</Label>
          <Select value={formData.timeframe} onValueChange={(v) => updateField("timeframe", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Trade Thesis</Label>
          <Textarea
            placeholder="Why are you considering this trade? What's your reasoning?"
            value={formData.trade_thesis}
            onChange={(e) => updateField("trade_thesis", e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Generate Button */}
      {!review && (
        <Button
          onClick={handleGenerate}
          disabled={!formData.market || generating || uploading}
          className="w-full gradient-emerald text-white font-semibold gap-2 h-12"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your trade setup...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Trade Decision Review
            </>
          )}
        </Button>
      )}

      {/* Review Display */}
      {review && reviewData && (
        <div ref={reviewRef} className="space-y-4">
          <div className="flex items-center gap-2 pt-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Trade Decision Review</h2>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
            ⚠️ This is a decision-support analysis, not financial advice. The AI never predicts prices or generates buy/sell signals. Always do your own research.
          </div>

          <ReviewDisplay data={reviewData} />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setReview(null); setFormData({ market: formData.market }); }}
              className="flex-1"
            >
              Start New
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gradient-emerald text-white font-semibold gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Review
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
