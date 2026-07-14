import { base44 } from "@/api/base44Client";
import { MARKETS } from "./tradeUtils";

const TRADE_REVIEW_SCHEMA = {
  type: "object",
  properties: {
    trade_quality_score: { type: "number" },
    confidence_score: { type: "number" },
    trend_analysis: { type: "string" },
    market_structure: { type: "string" },
    support_resistance: { type: "string" },
    momentum: { type: "string" },
    risk_assessment: { type: "string" },
    risk_reward_analysis: { type: "string" },
    market_context: { type: "string" },
    news_summary: { type: "string" },
    economic_events: { type: "string" },
    bullish_scenario: { type: "string" },
    bearish_scenario: { type: "string" },
    neutral_scenario: { type: "string" },
    missing_information: { type: "string" },
    trade_checklist: { type: "array", items: { type: "string" } },
    educational_explanation: { type: "string" },
  },
};

const POST_TRADE_SCHEMA = {
  type: "object",
  properties: {
    post_trade_analysis: { type: "string" },
    post_trade_lessons: { type: "string" },
  },
};

const WEEKLY_COACHING_SCHEMA = {
  type: "object",
  properties: {
    discipline_score: { type: "number" },
    execution_quality: { type: "string" },
    best_trading_hours: { type: "string" },
    worst_trading_hours: { type: "string" },
    recurring_mistakes: { type: "string" },
    strengths: { type: "string" },
    risk_habits: { type: "string" },
    emotional_patterns: { type: "string" },
    improvement_trends: { type: "string" },
    summary: { type: "string" },
  },
};

const PRINCIPLES = `You are TradeCheck, an AI Trade Decision Intelligence platform for intermediate intraday traders.

ABSOLUTE RULES (NEVER VIOLATE):
- NEVER generate Buy/Sell signals or tell the trader what to do.
- NEVER predict future prices or where the market will go.
- NEVER guarantee profits or outcomes.
- ALWAYS explain your reasoning transparently.
- ALWAYS clearly separate: Facts (observable from chart/data), Assumptions (your inferences), Missing Data (what's not available), and Confidence Level.
- You are a decision-support mentor, not an advisor. The trader makes ALL decisions.

Your goal is to help traders make better decisions BEFORE risking money and improve through personalized post-trade learning.`;

export async function generateTradeReview(data) {
  const marketLabel = MARKETS[data.market]?.label || data.market;
  const rr = data.entry_price && data.stop_loss && data.target
    ? (Math.abs(data.target - data.entry_price) / Math.abs(data.entry_price - data.stop_loss)).toFixed(2)
    : "not calculable";

  let prompt = `${PRINCIPLES}

Analyze the following trade setup and produce a comprehensive Trade Decision Review.

TRADE DETAILS:
- Market: ${marketLabel}
- Timeframe: ${data.timeframe || "not specified"}
- Direction: ${data.trade_direction || "not specified"}
- Entry Price: ${data.entry_price || "not specified"}
- Stop Loss: ${data.stop_loss || "not specified"}
- Target: ${data.target || "not specified"}
- Calculated Risk/Reward: 1:${rr}
- Trader's Thesis: ${data.trade_thesis || "not provided"}

${data.screenshot_url ? "A TradingView chart screenshot has been provided. Analyze it carefully — identify visible trend, structure, key levels, and any indicators shown." : "No chart screenshot was provided. Base your analysis on the trade details and your knowledge of this market instrument's typical behavior. Clearly flag the missing chart as a limitation."}

In EVERY section, clearly label what is Fact vs Assumption vs Missing Data. Use web search for current market news and upcoming economic events relevant to this instrument.

Provide the trade_quality_score (0-100) as an assessment of how well-structured the setup is — NOT a prediction of success. Provide confidence_score (0-100) as your confidence in the analysis itself.`;

  const params = {
    prompt,
    add_context_from_internet: true,
    model: "gemini_3_flash",
    response_json_schema: TRADE_REVIEW_SCHEMA,
  };

  if (data.screenshot_url) {
    params.file_urls = [data.screenshot_url];
  }

  return await base44.integrations.Core.InvokeLLM(params);
}

export async function generatePostTradeReview(trade, outcomeData) {
  const marketLabel = MARKETS[trade.market]?.label || trade.market;

  const prompt = `${PRINCIPLES}

Perform a structured Post-Trade Review for a completed trade. Compare what actually happened against the original trade plan.

ORIGINAL TRADE PLAN:
- Market: ${marketLabel}
- Direction: ${trade.trade_direction}
- Entry: ${trade.entry_price}
- Stop Loss: ${trade.stop_loss}
- Target: ${trade.target}
- Timeframe: ${trade.timeframe}
- Original Thesis: ${trade.trade_thesis || "not provided"}
- Original Quality Score: ${trade.trade_quality_score}
- Original AI Analysis Summary: ${trade.trend_analysis || "N/A"}

OUTCOME:
- Result: ${outcomeData.outcome}
- Actual Exit Price: ${outcomeData.actual_exit_price || "not specified"}
- P&L: ${outcomeData.pnl || "not specified"}
- Emotional State: ${outcomeData.emotional_state || "not specified"}
- Trader's Notes: ${outcomeData.post_trade_notes || "none"}

Analyze:
1. Did the trade play out according to the thesis, or did something unexpected happen?
2. Was risk managed properly (did they respect the stop loss)?
3. What can be learned from the gap between plan and outcome?
4. Are there behavioural patterns visible (e.g., premature exit, moving stop loss, overtrading)?

Provide post_trade_analysis (detailed breakdown) and post_trade_lessons (actionable lessons for future trades).`;

  return await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: POST_TRADE_SCHEMA,
  });
}

export async function generateWeeklyCoaching(trades) {
  const tradeSummaries = trades.map((t, i) => {
    const market = MARKETS[t.market]?.short || t.market;
    return `Trade ${i + 1}: ${market} | ${t.trade_direction || "?"} | Entry: ${t.entry_price || "?"} | SL: ${t.stop_loss || "?"} | Target: ${t.target || "?"} | Outcome: ${t.outcome || "open"} | P&L: ${t.pnl || "N/A"} | Quality Score: ${t.trade_quality_score || "N/A"} | Emotional State: ${t.emotional_state || "N/A"} | Timeframe: ${t.timeframe || "N/A"} | Created: ${t.created_date}`;
  }).join("\n");

  const wins = trades.filter(t => t.outcome === "win").length;
  const losses = trades.filter(t => t.outcome === "loss").length;

  const prompt = `${PRINCIPLES}

You are performing a Weekly Coaching analysis for an intraday trader. Based on their trades this week, provide personalized behavioural intelligence.

TRADER'S TRADES THIS WEEK (${trades.length} total, ${wins} wins, ${losses} losses):
${tradeSummaries}

Analyze patterns across these trades. Reference the trader's OWN historical behaviour whenever possible. Focus on:
- Discipline: Did they follow their plans? Did they respect stop losses and targets?
- Execution quality: How well did they enter and exit?
- Time patterns: Which hours/timeframes seem to correlate with better outcomes?
- Recurring mistakes: What errors keep repeating?
- Strengths: What are they doing well?
- Risk habits: Are they taking consistent or erratic risk?
- Emotional patterns: Any correlation between emotional state and outcomes?
- Improvement trends: What's getting better compared to typical beginner patterns?

Provide discipline_score (0-100) and all fields in the schema. Be specific, honest, and constructive. Reference actual trade data in your analysis.`;

  return await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: WEEKLY_COACHING_SCHEMA,
  });
}

export async function fetchMarketNews() {
  const prompt = `You are the Market Intelligence engine for TradeCheck, an AI-powered Trade Decision Intelligence platform.

Search for the latest important market-moving news and events relevant to these markets:
- Gold (XAU/USD)
- Silver (XAG/USD)
- Crude Oil (WTI)
- Natural Gas
- Nifty 50
- Bank Nifty

Find the 10 most important recent developments. For each, provide:
- headline: clear, factual headline
- source: where the news comes from (e.g. Reuters, Bloomberg, Economic Times)
- importance: "high", "medium", or "low" based on potential market impact
- category: one of "commodities", "indices", "economy", "rbi", "global", "us_markets", "oil", "metals"
- markets_affected: array of market names affected (e.g. ["Gold", "Silver"])
- ai_summary: 2-3 sentence factual summary
- why_it_matters: why this matters for traders
- market_impact: possible directional impact with brief reasoning
- bullish_impact: how this could be bullish for affected markets (or "Limited bullish impact")
- bearish_impact: how this could be bearish for affected markets (or "Limited bearish impact")
- neutral_view: the neutral/balanced perspective
- expected_volatility: expected volatility level ("low", "medium", "high") with brief reasoning
- educational_explanation: 1-2 sentence educational note explaining the concept for newer traders
- confidence: 0-100 confidence in the analysis based on data quality

RULES:
- Never predict future prices or tell traders what to do
- Be factual, transparent, and educational
- Prioritize quality over quantity — only include genuinely market-moving developments
- Include central bank events (Fed, RBI), economic data (inflation, GDP, jobs), and geopolitical events
- Clearly separate facts from analysis`;

  const response = await base44.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    model: "gemini_3_flash",
    response_json_schema: {
      type: "object",
      properties: {
        articles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              headline: { type: "string" },
              source: { type: "string" },
              importance: { type: "string", enum: ["high", "medium", "low"] },
              category: { type: "string", enum: ["commodities", "indices", "economy", "rbi", "global", "us_markets", "oil", "metals"] },
              markets_affected: { type: "array", items: { type: "string" } },
              ai_summary: { type: "string" },
              why_it_matters: { type: "string" },
              market_impact: { type: "string" },
              bullish_impact: { type: "string" },
              bearish_impact: { type: "string" },
              neutral_view: { type: "string" },
              expected_volatility: { type: "string" },
              educational_explanation: { type: "string" },
              confidence: { type: "number" },
            },
          },
        },
      },
    },
  });

  return response.articles || [];
}

const TRADER_IQ_SCHEMA = {
  type: "object",
  properties: {
    overall_score: { type: "number" },
    planning_score: { type: "number" },
    consistency_score: { type: "number" },
    risk_management_score: { type: "number" },
    execution_score: { type: "number" },
    learning_score: { type: "number" },
    discipline_score: { type: "number" },
    review_habit_score: { type: "number" },
    explanation: { type: "string" },
    improvement_trend: { type: "string" },
  },
};

export async function generateTraderIQ(trades, coachingReports) {
  const tradeSummaries = trades.map((t, i) => {
    const market = MARKETS[t.market]?.short || t.market;
    return `Trade ${i + 1}: ${market} | ${t.trade_direction || "?"} | Quality: ${t.trade_quality_score || "N/A"} | Outcome: ${t.outcome || "open"} | P&L: ${t.pnl || "N/A"} | Emotional: ${t.emotional_state || "N/A"} | Created: ${t.created_date}`;
  }).join("\n");

  const coachingSummaries = coachingReports.map((r, i) =>
    `Week ${i + 1} (${r.week_start}): Discipline ${r.discipline_score || "N/A"} | ${r.summary || "N/A"}`
  ).join("\n");

  const prompt = `${PRINCIPLES}

You are calculating the Trader IQ for an intraday trader. Trader IQ measures trading discipline and decision quality — NOT intelligence or profitability.

TRADER'S DATA:
Total Trades: ${trades.length}
Closed Trades: ${trades.filter(t => t.status === "closed").length}
Wins: ${trades.filter(t => t.outcome === "win").length}
Losses: ${trades.filter(t => t.outcome === "loss").length}

TRADE HISTORY:
${tradeSummaries || "No trades yet"}

WEEKLY COACHING REPORTS:
${coachingSummaries || "No coaching reports yet"}

Score each component 0-100 based on EVIDENCE from the data:
- planning_score: Quality of trade setups (entry/SL/target/thesis quality)
- consistency_score: Regularity of trading and review habits
- risk_management_score: Risk/reward quality, stop loss usage, position sizing
- execution_score: How well trades were executed vs planned
- learning_score: Evidence of learning from mistakes (post-trade reviews, improvement)
- discipline_score: Following plans, avoiding FOMO/revenge trading
- review_habit_score: Regularity of trade reviews and post-trade analysis
- overall_score: Weighted average of all components

Provide a detailed explanation referencing specific evidence from the data. Be honest — never inflate scores. If there's insufficient data, say so and score conservatively.`;

  return await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: TRADER_IQ_SCHEMA,
  });
}
