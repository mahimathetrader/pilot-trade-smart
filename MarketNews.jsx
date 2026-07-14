import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MARKETS } from "@/lib/tradeUtils";
import { fetchMarketNews } from "@/lib/tradeAI";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import {
  Newspaper,
  RefreshCw,
  Loader2,
  ChevronDown,
  Bell,
  Zap,
  CalendarClock,
  TrendingUp,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  Activity,
  GraduationCap,
} from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "commodities", label: "Commodities" },
  { key: "indices", label: "Indices" },
  { key: "economy", label: "Economy" },
  { key: "rbi", label: "RBI" },
  { key: "global", label: "Global" },
  { key: "us_markets", label: "US Markets" },
  { key: "oil", label: "Oil" },
  { key: "metals", label: "Metals" },
];

const IMPORTANCE_CONFIG = {
  high: { label: "High", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  low: { label: "Low", color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
};

const VOLATILITY_CONFIG = {
  high: { label: "High Volatility", color: "text-rose-400", bg: "bg-rose-500/10" },
  medium: { label: "Medium Volatility", color: "text-amber-400", bg: "bg-amber-500/10" },
  low: { label: "Low Volatility", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const ALERT_TYPES = [
  { key: "alert_breaking_news", label: "Breaking News", icon: Zap },
  { key: "alert_economic_events", label: "Economic Events", icon: CalendarClock },
  { key: "alert_price_movement", label: "Major Price Movement", icon: TrendingUp },
  { key: "alert_volatility_spike", label: "Volatility Spike", icon: AlertTriangle },
  { key: "alert_central_bank", label: "Central Bank Events", icon: Landmark },
];

function getVolatilityConfig(vol) {
  if (!vol) return null;
  const v = vol.toLowerCase();
  if (v.includes("high")) return VOLATILITY_CONFIG.high;
  if (v.includes("low")) return VOLATILITY_CONFIG.low;
  return VOLATILITY_CONFIG.medium;
}

function NewsCard({ article }) {
  const [expanded, setExpanded] = useState(false);
  const importance = IMPORTANCE_CONFIG[article.importance] || IMPORTANCE_CONFIG.medium;
  const volatility = getVolatilityConfig(article.expected_volatility);

  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-sm leading-snug flex-1">{article.headline}</h3>
        <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium border shrink-0", importance.bg, importance.border, importance.color)}>
          {importance.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
        {article.source && <span className="font-medium text-foreground/70">{article.source}</span>}
        {article.source && <span>·</span>}
        <span className="capitalize">{article.category?.replace("_", " ")}</span>
        {volatility && (
          <>
            <span>·</span>
            <span className={cn("px-1.5 py-0.5 rounded font-medium", volatility.bg, volatility.color)}>
              <Activity className="w-3 h-3 inline mr-0.5" />
              {volatility.label}
            </span>
          </>
        )}
      </div>

      {article.markets_affected && article.markets_affected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.markets_affected.map((m, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-xs bg-accent/50 text-muted-foreground">
              {m}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{article.ai_summary}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
      >
        {expanded ? "Hide analysis" : "Full analysis: impact, scenarios & education"}
        <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 animate-fade-in">
          {article.why_it_matters && (
            <div className="p-3 rounded-lg bg-accent/30">
              <p className="text-xs font-medium text-foreground/70 mb-1">Why It Matters</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{article.why_it_matters}</p>
            </div>
          )}
          {article.market_impact && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <p className="text-xs font-medium text-foreground/70 mb-1">Market Impact</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{article.market_impact}</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2">
            {article.bullish_impact && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Bullish Case
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{article.bullish_impact}</p>
              </div>
            )}
            {article.bearish_impact && (
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/15">
                <p className="text-xs font-medium text-rose-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Bearish Case
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{article.bearish_impact}</p>
              </div>
            )}
            {article.neutral_view && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <p className="text-xs font-medium text-amber-400 mb-1">Neutral View</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{article.neutral_view}</p>
              </div>
            )}
          </div>
          {article.educational_explanation && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs font-medium text-accent mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Educational Note
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{article.educational_explanation}</p>
            </div>
          )}
          {article.confidence != null && (
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">AI Confidence:</span>
              <span className="font-medium">{Math.round(article.confidence)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketNews() {
  const [articles, setArticles] = useState([]);
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showWatchlist, setShowWatchlist] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [news, watchlists] = await Promise.all([
        base44.entities.NewsArticle.list("-created_date", 50),
        base44.entities.Watchlist.list("-created_date", 1),
      ]);
      setArticles(news);
      setWatchlist(watchlists[0] || null);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const newArticles = await fetchMarketNews();
      if (articles.length > 0) {
        await base44.entities.NewsArticle.deleteMany({});
      }
      if (newArticles.length > 0) {
        await base44.entities.NewsArticle.bulkCreate(
          newArticles.map((a) => ({
            headline: a.headline,
            source: a.source || "Market News",
            importance: a.importance || "medium",
            category: a.category,
            markets_affected: a.markets_affected || [],
            ai_summary: a.ai_summary,
            why_it_matters: a.why_it_matters,
            market_impact: a.market_impact,
            bullish_impact: a.bullish_impact,
            bearish_impact: a.bearish_impact,
            neutral_view: a.neutral_view,
            expected_volatility: a.expected_volatility,
            educational_explanation: a.educational_explanation,
            confidence: a.confidence,
          }))
        );
      }
      await loadData();
    } catch {}
    setRefreshing(false);
  };

  const toggleMarket = async (marketKey) => {
    if (!watchlist) {
      const created = await base44.entities.Watchlist.create({
        markets: [marketKey],
        alert_breaking_news: true,
        alert_economic_events: true,
        alert_central_bank: true,
      });
      setWatchlist(created);
      return;
    }
    const current = watchlist.markets || [];
    const updated = current.includes(marketKey)
      ? current.filter((m) => m !== marketKey)
      : [...current, marketKey];
    await base44.entities.Watchlist.update(watchlist.id, { markets: updated });
    setWatchlist({ ...watchlist, markets: updated });
  };

  const toggleAlert = async (alertKey) => {
    if (!watchlist) return;
    const updated = { ...watchlist, [alertKey]: !watchlist[alertKey] };
    await base44.entities.Watchlist.update(watchlist.id, { [alertKey]: updated[alertKey] });
    setWatchlist(updated);
  };

  const watchedMarkets = watchlist?.markets || [];
  const filtered = filter === "all" ? articles : articles.filter((a) => a.category === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Market News</h1>
          <p className="text-muted-foreground mt-1">Important market-moving information, analyzed by AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Market News</h1>
          <p className="text-muted-foreground mt-1">Understand the market in under a minute.</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="gradient-emerald text-white font-semibold gap-2"
        >
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching News...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh News
            </>
          )}
        </Button>
      </div>

      {/* Watchlist */}
      <div className="rounded-xl border border-border glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">Watchlist & Alerts</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowWatchlist(!showWatchlist)}>
            {showWatchlist ? "Done" : "Edit"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MARKETS).map(([key, market]) => {
            const active = watchedMarkets.includes(key);
            return (
              <button
                key={key}
                onClick={() => showWatchlist && toggleMarket(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  active
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                  !showWatchlist && !active && "hidden"
                )}
              >
                <span>{market.emoji}</span>
                {market.short}
              </button>
            );
          })}
          {!showWatchlist && watchedMarkets.length === 0 && (
            <p className="text-sm text-muted-foreground">No markets in watchlist. Click "Edit" to add.</p>
          )}
        </div>
        {showWatchlist && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            <p className="text-xs text-muted-foreground mb-3">Alert me about:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALERT_TYPES.map((alert) => (
                <div key={alert.key} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    <alert.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{alert.label}</span>
                  </div>
                  <Switch
                    checked={watchlist?.[alert.key] || false}
                    onCheckedChange={() => toggleAlert(alert.key)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              filter === c.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* News feed */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={articles.length === 0 ? "No news gathered yet" : "No articles in this category"}
          description={articles.length === 0 ? "Click Refresh News to fetch the latest market-moving developments with full AI analysis." : "Try a different category filter."}
          action={
            articles.length === 0 ? (
              <Button onClick={handleRefresh} disabled={refreshing} className="gradient-emerald text-white font-semibold gap-2">
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Fetch News
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
