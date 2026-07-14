import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MarketNews = lazy(() => import('@/pages/MarketNews'));
const NewTradeReview = lazy(() => import('@/pages/NewTradeReview'));
const SavedReviews = lazy(() => import('@/pages/SavedReviews'));
const ReviewDetail = lazy(() => import('@/pages/ReviewDetail'));
const TradeJournal = lazy(() => import('@/pages/TradeJournal'));
const PostTradeReview = lazy(() => import('@/pages/PostTradeReview'));
const WeeklyCoaching = lazy(() => import('@/pages/WeeklyCoaching'));
const MonthlyInsights = lazy(() => import('@/pages/MonthlyInsights'));
const BehaviourAnalytics = lazy(() => import('@/pages/BehaviourAnalytics'));
const TraderIQ = lazy(() => import('@/pages/TraderIQ'));
const Settings = lazy(() => import('@/pages/Settings'));
const Subscription = lazy(() => import('@/pages/Subscription'));
const Help = lazy(() => import('@/pages/Help'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market-news" element={<MarketNews />} />
            <Route path="/trade-review/new" element={<NewTradeReview />} />
            <Route path="/reviews" element={<SavedReviews />} />
            <Route path="/reviews/:id" element={<ReviewDetail />} />
            <Route path="/journal" element={<TradeJournal />} />
            <Route path="/post-trade" element={<PostTradeReview />} />
            <Route path="/coaching" element={<WeeklyCoaching />} />
            <Route path="/insights" element={<MonthlyInsights />} />
            <Route path="/analytics" element={<BehaviourAnalytics />} />
            <Route path="/trader-iq" element={<TraderIQ />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
