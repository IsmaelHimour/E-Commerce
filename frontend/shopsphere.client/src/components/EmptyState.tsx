import { SearchX } from 'lucide-react'

type EmptyStateProps = {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded border border-dashed border-neutral-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <SearchX className="mx-auto text-neutral-400" size={32} aria-hidden="true" />
      <h2 className="mt-4 text-lg font-bold tracking-normal text-neutral-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">{message}</p>
    </div>
  )
}
