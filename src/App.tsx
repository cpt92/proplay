import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import { useAuthStore } from './store/useAuthStore';
import { useAthletesStore } from './store/useAthletesStore';
import { useBookingsStore } from './store/useBookingsStore';
import { useChatStore } from './store/useChatStore';
import { useReviewsStore } from './store/useReviewsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import ToastHost from './components/ToastHost';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./routes/Home'));
const Browse = lazy(() => import('./routes/Browse'));
const AthleteProfile = lazy(() => import('./routes/AthleteProfile'));
const Login = lazy(() => import('./routes/Login'));
const Booking = lazy(() => import('./routes/Booking'));
const BookingConfirmation = lazy(() => import('./routes/BookingConfirmation'));
const Messages = lazy(() => import('./routes/Messages'));
const Admin = lazy(() => import('./routes/Admin'));
const Faq = lazy(() => import('./routes/Faq'));
const Privacy = lazy(() => import('./routes/Privacy'));
const Terms = lazy(() => import('./routes/Terms'));
const Favorites = lazy(() => import('./routes/Favorites'));
const Onboarding = lazy(() => import('./routes/athlete/Onboarding'));
const Dashboard = lazy(() => import('./routes/athlete/Dashboard'));
const Experiences = lazy(() => import('./routes/athlete/Experiences'));
const Availability = lazy(() => import('./routes/athlete/Availability'));
const BookingRequests = lazy(() => import('./routes/athlete/BookingRequests'));
const MyBookings = lazy(() => import('./routes/fan/MyBookings'));

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-xl">
        <FaStar className="h-8 w-8" />
      </div>
      <h1 className="mb-3 text-5xl font-extrabold">404</h1>
      <p className="mb-6 text-ink-muted">That page doesn't exist. Maybe you meant one of these?</p>
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/browse" className="btn-secondary">Browse athletes</Link>
      </div>
    </div>
  );
}

export default function App() {
  const initAuth = useAuthStore((s) => s.init);
  const profile = useAuthStore((s) => s.profile);
  const loadAthletes = useAthletesStore((s) => s.load);
  const loadBookings = useBookingsStore((s) => s.loadForUser);
  const clearBookings = useBookingsStore((s) => s.clear);
  const loadMessages = useChatStore((s) => s.loadForUser);
  const subscribeChat = useChatStore((s) => s.subscribe);
  const clearChat = useChatStore((s) => s.clear);
  const loadReviews = useReviewsStore((s) => s.load);
  const loadFavorites = useFavoritesStore((s) => s.loadForUser);
  const clearFavorites = useFavoritesStore((s) => s.clear);

  // Bootstrap: load auth + public data on mount
  useEffect(() => {
    initAuth();
    loadAthletes();
    loadReviews();
  }, [initAuth, loadAthletes, loadReviews]);

  // Load user-scoped data when the user logs in / out
  useEffect(() => {
    if (profile?.id) {
      loadBookings(profile.id);
      loadMessages(profile.id);
      subscribeChat();
      loadFavorites(profile.id);
    } else {
      clearBookings();
      clearChat();
      clearFavorites();
    }
  }, [
    profile?.id,
    loadBookings,
    loadMessages,
    subscribeChat,
    loadFavorites,
    clearBookings,
    clearChat,
    clearFavorites,
  ]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/athletes/:id" element={<AthleteProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/favorites" element={<Favorites />} />

              <Route
                path="/book/confirmation/:id"
                element={
                  <RequireAuth>
                    <BookingConfirmation />
                  </RequireAuth>
                }
              />
              <Route
                path="/book/:athleteId/:expId"
                element={
                  <RequireAuth>
                    <Booking />
                  </RequireAuth>
                }
              />

              <Route
                path="/fan/bookings"
                element={
                  <RequireAuth role="fan">
                    <MyBookings />
                  </RequireAuth>
                }
              />

              <Route
                path="/messages"
                element={
                  <RequireAuth>
                    <Messages />
                  </RequireAuth>
                }
              />

              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <Admin />
                  </RequireAuth>
                }
              />

              <Route
                path="/athlete/onboarding"
                element={
                  <RequireAuth role="athlete">
                    <Onboarding />
                  </RequireAuth>
                }
              />
              <Route
                path="/athlete/dashboard"
                element={
                  <RequireAuth role="athlete">
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/athlete/experiences"
                element={
                  <RequireAuth role="athlete">
                    <Experiences />
                  </RequireAuth>
                }
              />
              <Route
                path="/athlete/availability"
                element={
                  <RequireAuth role="athlete">
                    <Availability />
                  </RequireAuth>
                }
              />
              <Route
                path="/athlete/bookings"
                element={
                  <RequireAuth role="athlete">
                    <BookingRequests />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <ToastHost />
    </BrowserRouter>
  );
}
