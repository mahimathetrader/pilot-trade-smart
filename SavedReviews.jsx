import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/ReviewCard";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { PlusCircle, Bookmark } from "lucide-react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "win", label: "Wins" },
  { key: "loss", label: "Losses" },
];

export default function SavedReviews() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    base44.entities.TradeReview.list("-created_date", 100)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = trades.filter((t) => {
    if (filter === "all") return true;
    if (filter === "open") return t.status === "open";
    if (filter === "closed") return t.status === "closed";
    return t.outcome === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Saved Reviews</h1>
          <p className="text-muted-foreground mt-1">{trades.length} total review{trades.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/trade-review/new">
          <Button className="gradient-emerald text-white font-semibold gap-2">
            <PlusCircle className="w-4 h-4" />
            New Review
          </Button>
        </Link>
      </div>

      {trades.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved reviews"
          description="Generate your first trade decision review to see it here."
          action={
            <Link to="/trade-review/new">
              <Button className="gradient-emerald text-white font-semibold gap-2">
                <PlusCircle className="w-4 h-4" />
                New Trade Review
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No reviews match this filter.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => (
                <ReviewCard key={t.id} review={t} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
