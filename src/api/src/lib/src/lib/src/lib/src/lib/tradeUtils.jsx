export const MARKETS = {
  gold: { label: "Gold (XAU/USD)", short: "Gold", emoji: "🥇", color: "#E8B339" },
  silver: { label: "Silver (XAG/USD)", short: "Silver", emoji: "🥈", color: "#C0C0C0" },
  crude_oil: { label: "Crude Oil (WTI)", short: "Crude Oil", emoji: "🛢️", color: "#3B3B3B" },
  natural_gas: { label: "Natural Gas", short: "Nat Gas", emoji: "🔥", color: "#4A90D9" },
  nifty: { label: "Nifty 50", short: "Nifty", emoji: "📈", color: "#FF6B6B" },
  bank_nifty: { label: "Bank Nifty", short: "Bank Nifty", emoji: "🏦", color: "#4ECDC4" },
};

export const TIMEFRAMES = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1D"];

export const DIRECTIONS = {
  long: { label: "Long", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  short: { label: "Short", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  neutral: { label: "Neutral", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
};

export function getScoreColor(score) {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 25) return "text-orange-400";
  return "text-rose-400";
}

export function getScoreStroke(score) {
  if (score == null) return "#71717A";
  if (score >= 75) return "#22C55E";
  if (score >= 50) return "#F59E0B";
  if (score >= 25) return "#FB923C";
  return "#F43F5E";
}

export function getScoreLabel(score) {
  if (score == null) return "—";
  if (score >= 75) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 25) return "Weak";
  return "Poor";
}

export function getOutcomeConfig(outcome) {
  switch (outcome) {
    case "win":
      return { label: "Win", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    case "loss":
      return { label: "Loss", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    case "breakeven":
      return { label: "Breakeven", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    default:
      return { label: "Open", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  }
}

export function formatPnl(pnl) {
  if (pnl == null) return "—";
  const sign = pnl >= 0 ? "+" : "";
  return `${sign}${Number(pnl).toFixed(2)}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function calcRiskReward(entry, sl, target) {
  if (!entry || !sl || !target) return null;
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(target - entry);
  if (risk === 0) return null;
  return (reward / risk).toFixed(2);
}

export function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  };
}
