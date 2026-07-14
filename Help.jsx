import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/SectionCard";
import {
  Compass,
  Shield,
  HelpCircle,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Camera,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

const STEPS = [
  { icon: PlusCircle, title: "Create a Trade Review", desc: "Upload a TradingView screenshot or pick a market. Enter your entry, stop loss, target, and thesis." },
  { icon: Camera, title: "Review AI Analysis", desc: "Get a transparent decision review with quality scores, risk assessment, scenarios, and a pre-trade checklist." },
  { icon: RefreshCw, title: "Close Your Trades", desc: "After the trade closes, enter the outcome. AI analyzes your execution and generates lessons learned." },
  { icon: GraduationCap, title: "Get Weekly Coaching", desc: "AI reviews your week and highlights discipline score, recurring mistakes, best hours, and improvement trends." },
];

const PRINCIPLES = [
  { title: "No Buy/Sell Signals", desc: "TradeCheck never tells you what to do. It helps you think better." },
  { title: "No Price Predictions", desc: "The AI never predicts where the market will go. It analyzes what's visible now." },
  { title: "No Profit Guarantees", desc: "No outcome is guaranteed. Trading always involves risk." },
  { title: "Transparent Reasoning", desc: "Every analysis separates Facts, Assumptions, Missing Data, and Confidence Level." },
];

const FAQS = [
  {
    q: "Does TradeCheck tell me what to trade?",
    a: "No. TradeCheck is a decision-support mentor, not an advisor. It analyzes your trade setup and helps you see blind spots, but all trading decisions are yours.",
  },
  {
    q: "Can the AI predict where prices will go?",
    a: "No. The AI analyzes what's currently visible on the chart and in market data. It provides scenarios (bullish, bearish, neutral) but never predicts which will play out.",
  },
  {
    q: "What does the Trade Quality Score mean?",
    a: "It assesses how well-structured your setup is — clarity of thesis, risk management, and alignment of factors. A high score means a well-planned trade, not a guaranteed win.",
  },
  {
    q: "Is my trading data private?",
    a: "Yes. All your trade reviews are private and visible only to you. Your data is encrypted and never shared with third parties. You can delete any review at any time.",
  },
  {
    q: "What markets are supported?",
    a: "Gold (XAU/USD), Silver (XAG/USD), Crude Oil (WTI), Natural Gas, Nifty 50, and Bank Nifty.",
  },
  {
    q: "How does the behavioural intelligence work?",
    a: "Every review and post-trade analysis feeds your personal trading memory. Over time, the AI identifies patterns in your behaviour — best hours, recurring mistakes, emotional correlations — referenced in weekly coaching reports.",
  },
  {
    q: "Do I need to upload a chart screenshot?",
    a: "No, it's optional. But uploading a TradingView screenshot gives the AI much more to work with — visible trend, structure, levels, and indicators.",
  },
  {
    q: "What is Risk/Reward ratio?",
    a: "It's the ratio of your potential profit (target - entry) to your potential loss (entry - stop loss). A 1:2 R:R means you risk 1 unit to potentially gain 2. TradeCheck calculates this automatically from your inputs.",
  },
];

const CONCEPTS = [
  { title: "Risk/Reward Ratio", desc: "Compares potential profit to potential loss. Higher is generally better, but context matters." },
  { title: "Support & Resistance", desc: "Price levels where markets historically reverse. Support = floor, Resistance = ceiling." },
  { title: "Market Structure", desc: "The pattern of highs and lows. Higher highs + higher lows = uptrend. Lower highs + lower lows = downtrend." },
  { title: "Momentum", desc: "The speed of price movement. Indicators like RSI and MACD help gauge whether momentum is strengthening or fading." },
  { title: "Trade Quality", desc: "How well-planned and structured a trade is. Good quality doesn't mean profitable — it means well-reasoned." },
];

export default function Help() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Help & Education</h1>
        <p className="text-muted-foreground mt-1">Learn how TradeCheck works and become a more disciplined trader.</p>
      </div>

      {/* Getting Started */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Getting Started</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">Step {i + 1}</p>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/trade-review/new">
          <Button className="mt-4 gradient-emerald text-white font-semibold gap-2">
            <PlusCircle className="w-4 h-4" />
            Start Your First Review
          </Button>
        </Link>
      </div>

      {/* Core Principles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Core Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <SectionCard key={i} title={faq.q} defaultOpen={false}>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </SectionCard>
          ))}
        </div>
      </div>

      {/* Trading Concepts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Trading Concepts</h2>
        </div>
        <div className="space-y-3">
          {CONCEPTS.map((c, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-sm mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Review", path: "/trade-review/new" },
            { label: "Dashboard", path: "/dashboard" },
            { label: "Weekly Coaching", path: "/coaching" },
            { label: "Analytics", path: "/analytics" },
          ].map((link) => (
            <Link key={link.path} to={link.path}>
              <Button variant="outline" size="sm" className="w-full justify-between">
                {link.label}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
