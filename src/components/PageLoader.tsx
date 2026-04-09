// Suspense fallback shown while a lazily-loaded route is being fetched.
export default function PageLoader() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent-primary" />
        <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">Loading…</div>
      </div>
    </div>
  );
}
