import type { Athlete, Booking } from './types';

export type BrowseAggregates = {
  avgResponseHours: number | null;
  avgRating: number | null;
  bookingsThisMonth: number | null;
};

function parseHours(raw: string): number | null {
  if (!raw) return null;
  const match = raw.match(/(\d+)\s*(hour|hr|minute|min|day)/i);
  if (!match) return null;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('hour') || unit.startsWith('hr')) return n;
  if (unit.startsWith('min')) return n / 60;
  if (unit.startsWith('day')) return n * 24;
  return null;
}

export function computeBrowseAggregates(
  athletes: Athlete[],
  bookings: Booking[]
): BrowseAggregates {
  if (athletes.length === 0) {
    return { avgResponseHours: null, avgRating: null, bookingsThisMonth: null };
  }

  const responseHours = athletes
    .map((a) => parseHours(a.responseTime))
    .filter((n): n is number => n !== null);
  const avgResponseHours =
    responseHours.length > 0
      ? responseHours.reduce((s, n) => s + n, 0) / responseHours.length
      : null;

  const rated = athletes.filter((a) => a.rating > 0);
  const avgRating =
    rated.length > 0 ? rated.reduce((s, a) => s + a.rating, 0) / rated.length : null;

  const athleteIds = new Set(athletes.map((a) => a.id));
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const bookingsThisMonth = bookings.filter((b) => {
    if (!athleteIds.has(b.athleteId)) return false;
    const ts = new Date(b.createdAt).getTime();
    return !Number.isNaN(ts) && ts >= monthAgo;
  }).length;

  return {
    avgResponseHours,
    avgRating,
    bookingsThisMonth: bookingsThisMonth > 0 ? bookingsThisMonth : null,
  };
}

export function formatResponseHours(h: number | null): string | null {
  if (h === null) return null;
  if (h < 1) return `~${Math.round(h * 60)}m`;
  if (h < 24) return `~${Math.round(h)}h`;
  return `~${Math.round(h / 24)}d`;
}
