import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Check, Compass, Sparkles, Crown, ArrowLeft } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    icon: Compass,
    description: "Get started with AI trade reviews",
    features: [
      "5 trade reviews per month",
      "Basic AI decision analysis",
      "Trade journal",
      "Saved reviews",
      "1 market at a time",
    ],
    cta: "Current Plan",
    highlighted: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    icon: Sparkles,
    description: "For serious intraday traders",
    features: [
      "Unlimited trade reviews",
      "Post-trade AI analysis",
      "Weekly AI coaching reports",
      "Behaviour analytics",
      "All 6 markets",
      "Chart screenshot analysis",
      "Trade checklist generator",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    disabled: false,
  },
  {
    name: "Elite",
    price: "$79",
    period: "/mo",
    icon: Crown,
    description: "Maximum behavioural intelligence",
    features: [
      "Everything in Pro",
      "Monthly insights dashboard",
      "Advanced pattern detection",
      "Priority AI processing",
      "Email coaching reports",
      "Priority support",
      "Early access to features",
    ],
    cta: "Upgrade to Elite",
    highlighted: false,
    disabled: false,
  },
];

export default function Subscription() {
  const { toast } = useToast();

  const handleUpgrade = (plan) => {
    toast({
      title: "Coming soon",
      description: `${plan} plan upgrades will be available soon. You're on the Free plan.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Start free, upgrade when you're ready. Every plan includes the core decision-support methodology — no signals, no predictions, just transparent analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl border p-6 relative flex flex-col",
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-emerald text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => !plan.disabled && handleUpgrade(plan.name)}
                disabled={plan.disabled}
                className={cn(
                  "w-full gap-2 font-semibold",
                  plan.highlighted
                    ? "gradient-emerald text-white hover:opacity-90"
                    : ""
                )}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-sm text-muted-foreground">
          ⚠️ TradeCheck is a decision-support tool, not financial advice. All trading involves risk. Never trade with money you can't afford to lose.
        </p>
      </div>
    </div>
  );
}
