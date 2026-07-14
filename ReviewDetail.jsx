import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ReviewDisplay from "@/components/ReviewDisplay";
import SectionCard from "@/components/SectionCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Lightbulb,
  ClipboardList,
} from "lucide-react";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.entities.TradeReview.get(id)
      .then(setReview)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.entities.TradeReview.delete(id);
      navigate("/reviews");
    } catch {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Review not found.</p>
        <Link to="/reviews">
          <Button variant="outline">Back to Reviews</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/reviews">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {review.status === "open" && (
            <Link to="/post-trade">
              <Button size="sm" variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Close Trade
              </Button>
            </Link>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-400 gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the trade review and its AI analysis. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ReviewDisplay data={review} />

      {/* Post-trade review */}
      {review.post_trade_analysis && (
        <SectionCard title="Post-Trade Analysis" icon={CheckCircle2} defaultOpen={true}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-accent/50">
              <div>
                <p className="text-xs text-muted-foreground">Outcome</p>
                <p className="font-semibold capitalize">{review.outcome}</p>
              </div>
              {review.actual_exit_price != null && (
                <div>
                  <p className="text-xs text-muted-foreground">Exit Price</p>
                  <p className="font-semibold">{review.actual_exit_price}</p>
                </div>
              )}
              {review.pnl != null && (
                <div>
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p className={`font-semibold ${review.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {review.pnl >= 0 ? "+" : ""}{Number(review.pnl).toFixed(2)}
                  </p>
                </div>
              )}
              {review.emotional_state && (
                <div>
                  <p className="text-xs text-muted-foreground">Emotional State</p>
                  <p className="font-semibold">{review.emotional_state}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{review.post_trade_analysis}</p>
            </div>
          </div>
        </SectionCard>
      )}

      {review.post_trade_lessons && (
        <SectionCard title="Lessons Learned" icon={Lightbulb} defaultOpen={true}>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{review.post_trade_lessons}</p>
          </div>
        </SectionCard>
      )}

      {review.post_trade_notes && (
        <SectionCard title="Trader's Notes" icon={ClipboardList} defaultOpen={false}>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{review.post_trade_notes}</p>
        </SectionCard>
      )}
    </div>
  );
}
