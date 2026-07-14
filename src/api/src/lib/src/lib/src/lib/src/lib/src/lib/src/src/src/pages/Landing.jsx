import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Shield,
  Brain,
  Camera,
  Scale,
  GraduationCap,
  Clock,
  Newspaper,
  Bell,
  Lock,
  Eye,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const FEATURES = [
  { icon: Camera, title: "Screenshot Intelligence", desc: "Upload your TradingView chart. AI identifies trend, structure, key levels, and momentum — transparently labeling facts vs. assumptions." },
  { icon: Newspaper, title: "Market Intelligence", desc: "Real-time aggregation of market-moving news across Gold, Oil, Nifty and more. AI explains why it matters and possible impact." },
  { icon: Bell, title: "Smart Watchlist Alerts", desc: "Track only the markets you care about. Get notified about breaking news, economic events, and volatility — quality over quantity." },
  { icon: Scale, title: "Risk/Reward Assessment", desc: "Clear breakdown of your R:R ratio, stop loss placement, and whether your risk parameters make sense for the setup." },
  { icon: Brain, title: "Behavioural Intelligence", desc: "Every review feeds your personal trading memory. AI spots your recurring patterns, best hours, and blind spots over time." },
  { icon: GraduationCap, title: "Post-Trade Learning", desc: "After every trade closes, AI compares plan vs. outcome, highlighting behavioural improvements and actionable lessons." },
];

const STEPS = [
  { num: "01", title: "Upload & Describe", desc: "Share your TradingView screenshot or pick a market. Enter entry, stop loss, target, and your trading thesis." },
  { num: "02", title: "Get Transparent Review", desc: "AI generates a structured decision review with quality scores, risk analysis, scenarios, and a pre-trade checklist." },
  { num: "03", title: "Learn & Improve", desc: "Close the trade, get post-trade analysis, and weekly coaching reports that build your behavioural intelligence." },
];

const PRINCIPLES = [
  { icon: Lock, text: "Never generates Buy/Sell signals" },
  { icon: Eye, text: "Never predicts future prices" },
  { icon: Shield, text: "Never guarantees profits" },
  { icon: Brain, text: "Always explains reasoning" },
];

function ProductPreview() {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-premium">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🥇</span>
        <div>
          <p className="font-semibold">Gold (XAU/USD)</p>
          <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">Long · 15m</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(160 84% 39%)" strokeWidth="6" strokeDasharray="264" strokeDashoffset="58" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400">78</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Trade Quality</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="6" strokeDasharray="264" strokeDashoffset="92" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-400">65</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Confidence</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs p-3 rounded-lg bg-accent/30">
        <div><p className="text-muted-foreground">Entry</p><p className="font-semibold">2345</p></div>
        <div><p className="text-muted-foreground">Stop</p><p className="font-semibold text-rose-400">2320</p></div>
        <div><p className="text-muted-foreground">Target</p><p className="font-semibold text-emerald-400">2400</p></div>
        <div><p className="text-muted-foreground">R:R</p><p className="font-semibold text-primary">1:2.2</p></div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-center">
          <TrendingUp className="w-3 h-3 text-emerald-400 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Bullish</p>
        </div>
        <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15 text-center">
          <AlertTriangle className="w-3 h-3 text-rose-400 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Bearish</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-center">
          <Clock className="w-3 h-3 text-amber-400 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Neutral</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-nav border-b border-border safe-top">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg leading-none">TradeCheck</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Better Decisions. Better Traders.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" className="gradient-emerald text-white font-semibold hover:opacity-90">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gradient-emerald text-white font-semibold hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border glass text-xs text-muted-foreground mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Think. Check. Trade.
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                One Last Check<br />
                Before Your <span className="gradient-text">Risk.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Trade smarter by reviewing every decision before risking capital. AI-powered Trade Decision Intelligence — not signals, not predictions. Just transparent analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={isAuthenticated ? "/trade-review/new" : "/register"}>
                  <Button size="lg" className="gradient-emerald text-white font-semibold hover:opacity-90 gap-2 w-full sm:w-auto">
                    Review Trade
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={isAuthenticated ? "/journal" : "/login"}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Open Journal
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block animate-slide-up">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-border glass">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Decision Intelligence for <span className="gradient-text">serious traders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gold, Silver, Crude Oil, Natural Gas, Nifty, Bank Nifty. Every feature helps you make better decisions, build discipline, and strengthen your edge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-200 hover:shadow-premium">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="glass border-y border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-bold gradient-text mb-4 block">{s.num}</span>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Your edge isn't more indicators.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              It's self-awareness. Think. Check. Trade. Start building your behavioural intelligence today.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="gradient-emerald text-white font-semibold hover:opacity-90 gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-sm">TradeCheck</span>
            <span className="text-xs text-muted-foreground ml-2">Decision Intelligence · Not Financial Advice</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 TradeCheck. All trading involves risk.
          </p>
        </div>
      </footer>
    </div>
  );
}
