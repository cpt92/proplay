import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import { useAthletesStore } from './store/useAthletesStore';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import ToastHost from './components/ToastHost';
import Home from './routes/Home';
import Browse from './routes/Browse';
import AthleteProfile from './routes/AthleteProfile';
import Login from './routes/Login';
import Booking from './routes/Booking';
import BookingConfirmation from './routes/BookingConfirmation';
import Onboarding from './routes/athlete/Onboarding';
import Dashboard from './routes/athlete/Dashboard';
import Experiences from './routes/athlete/Experiences';
import Availability from './routes/athlete/Availability';
import BookingRequests from './routes/athlete/BookingRequests';
import MyBookings from './routes/fan/MyBookings';
import Messages from './routes/Messages';
import Admin from './routes/Admin';

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
  const refreshSeedAvailability = useAthletesStore((s) => s.refreshSeedAvailability);
  useEffect(() => {
    // Keep example athletes bookable: regenerate their availability for the next 14 days
    // every time the app loads. User-created athletes are untouched.
    refreshSeedAvailability();
  }, [refreshSeedAvailability]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/athletes/:id" element={<AthleteProfile />} />
            <Route path="/login" element={<Login />} />

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
        </main>
        <Footer />
      </div>
      <ToastHost />
    </BrowserRouter>
  );
}
