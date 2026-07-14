import React from "react";
import { cn } from "@/lib/utils";
import ScoreRing from "@/components/ScoreRing";
import SectionCard from "@/components/SectionCard";
import { MARKETS, DIRECTIONS, calcRiskReward } from "@/lib/tradeUtils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  Anchor,
  Gauge,
  Shield,
  Scale,
  Globe,
  Newspaper,
  CalendarClock,
  AlertCircle,
  ListChecks,
  GraduationCap,
  Target,
} from "lucide-react";

function ScenarioCard({ title, content, icon: Icon, color }) {
  if (!content) return null;
  return (
    <div className={cn("rounded-xl border p-4", color)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}

function AnalysisText({ children }) {
  return (
    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{children}</p>
  );
}

export default function ReviewDisplay({ data }) {
  const market = MARKETS[data.market] || { label: data.market, emoji: "📊" };
  const direction = DIRECTIONS[data.trade_direction] || DIRECTIONS.neutral;
  const rr = calcRiskReward(data.entry_price, data.stop_loss, data.target);

  return (
    <div className="space-y-4">
      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
          <ScoreRing score={data.trade_quality_score} size={110} label="Trade Quality" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
          <ScoreRing score={data.confidence_score} size={110} label="Confidence" />
        </div>
      </div>

      {/* Trade summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{market.emoji}</span>
          <div>
            <h3 className="font-semibold">{market.label}</h3>
            <span className={cn("inline-block px-2 py-0.5 rounded-md text-xs font-medium border mt-1", direction.bg, direction.border, direction.color)}>
              {direction.label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {data.entry_price != null && (
            <div>
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="font-semibold">{data.entry_price}</p>
            </div>
          )}
          {data.stop_loss != null && (
            <div>
              <p className="text-xs text-muted-foreground">Stop Loss</p>
              <p className="font-semibold text-rose-400">{data.stop_loss}</p>
            </div>
          )}
          {data.target != null && (
            <div>
              <p className="text-xs text-muted-foreground">Target</p>
              <p className="font-semibold text-emerald-400">{data.target}</p>
            </div>
          )}
          {rr && (
            <div>
              <p className="text-xs text-muted-foreground">Risk/Reward</p>
              <p className="font-semibold">1:{rr}</p>
            </div>
          )}
        </div>
        {data.timeframe && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">Timeframe: <span className="text-foreground font-medium">{data.timeframe}</span></p>
          </div>
        )}
        {data.trade_thesis && (
          <div className="mt-3 p-3 rounded-lg bg-accent/50">
            <p className="text-xs text-muted-foreground mb-1">Trader's Thesis</p>
            <p className="text-sm">{data.trade_thesis}</p>
          </div>
        )}
      </div>

      {/* Screenshot */}
      {data.screenshot_url && (
        <div className="rounded-xl border border-border bg-card p-3 overflow-hidden">
          <img src={data.screenshot_url} alt="Trade chart" className="w-full rounded-lg" />
        </div>
      )}

      {/* Analysis sections */}
      {data.trend_analysis && (
        <SectionCard title="Trend Analysis" icon={TrendingUp}>
          <AnalysisText>{data.trend_analysis}</AnalysisText>
        </SectionCard>
      )}
      {data.market_structure && (
        <SectionCard title="Market Structure" icon={Layers}>
          <AnalysisText>{data.market_structure}</AnalysisText>
        </SectionCard>
      )}
      {data.support_resistance && (
        <SectionCard title="Support & Resistance" icon={Anchor}>
          <AnalysisText>{data.support_resistance}</AnalysisText>
        </SectionCard>
      )}
      {data.momentum && (
        <SectionCard title="Momentum" icon={Gauge}>
          <AnalysisText>{data.momentum}</AnalysisText>
        </SectionCard>
      )}
      {data.risk_assessment && (
        <SectionCard title="Risk Assessment" icon={Shield}>
          <AnalysisText>{data.risk_assessment}</AnalysisText>
        </SectionCard>
      )}
      {data.risk_reward_analysis && (
        <SectionCard title="Risk/Reward Analysis" icon={Scale}>
          <AnalysisText>{data.risk_reward_analysis}</AnalysisText>
        </SectionCard>
      )}
      {data.market_context && (
        <SectionCard title="Market Context" icon={Globe}>
          <AnalysisText>{data.market_context}</AnalysisText>
        </SectionCard>
      )}
      {data.news_summary && (
        <SectionCard title="Relevant News" icon={Newspaper} defaultOpen={false}>
          <AnalysisText>{data.news_summary}</AnalysisText>
        </SectionCard>
      )}
      {data.economic_events && (
        <SectionCard title="Economic Events" icon={CalendarClock} defaultOpen={false}>
          <AnalysisText>{data.economic_events}</AnalysisText>
        </SectionCard>
      )}

      {/* Scenarios */}
      {(data.bullish_scenario || data.bearish_scenario || data.neutral_scenario) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ScenarioCard title="Bullish Case" content={data.bullish_scenario} icon={TrendingUp} color="border-emerald-500/20 bg-emerald-500/5" />
          <ScenarioCard title="Bearish Case" content={data.bearish_scenario} icon={TrendingDown} color="border-rose-500/20 bg-rose-500/5" />
          <ScenarioCard title="Neutral Case" content={data.neutral_scenario} icon={Minus} color="border-amber-500/20 bg-amber-500/5" />
        </div>
      )}

      {/* Missing info */}
      {data.missing_information && (
        <SectionCard title="Missing Information" icon={AlertCircle} defaultOpen={false}>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <AnalysisText>{data.missing_information}</AnalysisText>
          </div>
        </SectionCard>
      )}

      {/* Checklist */}
      {data.trade_checklist && data.trade_checklist.length > 0 && (
        <SectionCard title="Trade Checklist" icon={ListChecks}>
          <ul className="space-y-2">
            {data.trade_checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Educational */}
      {data.educational_explanation && (
        <SectionCard title="Educational Explanation" icon={GraduationCap} defaultOpen={false}>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <AnalysisText>{data.educational_explanation}</AnalysisText>
          </div>
        </SectionCard>
      )}
    </div>
  );
}.jsx
