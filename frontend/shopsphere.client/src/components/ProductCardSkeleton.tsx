export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-4 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="flex items-end justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-9 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
