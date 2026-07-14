import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  Bookmark,
  BookOpen,
  RefreshCw,
  GraduationCap,
  CalendarRange,
  Brain,
  Settings,
  CreditCard,
  HelpCircle,
  X,
  BadgeCheck,
  Newspaper,
  Gauge,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Market News", path: "/market-news", icon: Newspaper },
  { label: "New Review", path: "/trade-review/new", icon: PlusCircle },
  { label: "Saved Reviews", path: "/reviews", icon: Bookmark },
  { label: "Trade Journal", path: "/journal", icon: BookOpen },
  { label: "Post-Trade", path: "/post-trade", icon: RefreshCw },
  { label: "Weekly Coaching", path: "/coaching", icon: GraduationCap },
  { label: "Monthly Insights", path: "/insights", icon: CalendarRange },
  { label: "Behaviour", path: "/analytics", icon: Brain },
  { label: "Trader IQ", path: "/trader-iq", icon: Gauge },
];

const BOTTOM_ITEMS = [
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Subscription", path: "/subscription", icon: CreditCard },
  { label: "Help", path: "/help", icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive(item.path)
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg leading-none">TradeCheck</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Decision Intelligence</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-accent">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {NAV_ITEMS.map(renderNavItem)}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          {BOTTOM_ITEMS.map(renderNavItem)}
        </div>
      </aside>
    </>
  );
}
