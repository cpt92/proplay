export default function AthleteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  );
}
