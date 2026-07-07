export function VagaCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
      </div>

      <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100" />

      <div className="mt-5 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}
