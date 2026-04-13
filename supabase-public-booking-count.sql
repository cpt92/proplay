-- =====================================================================
-- Public booking count RPC
-- Run once in the Supabase SQL Editor.
--
-- Why: the `bookings` table has RLS that hides rows from anonymous
-- visitors, so the Home page "Bookings" stat was always 0 for logged-out
-- users. This function bypasses RLS (SECURITY DEFINER) and returns just
-- the aggregate count of confirmed/completed bookings — no row data is
-- exposed.
-- =====================================================================

create or replace function public.public_completed_booking_count()
returns int
language sql
security definer
set search_path = public
as $$
  select count(*)::int
  from public.bookings
  where status in ('confirmed', 'completed');
$$;

grant execute on function public.public_completed_booking_count() to anon, authenticated;
