type PageShellProps = {
  eyebrow: string
  title: string
  description: string
}

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-stone-50 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
      </div>
    </section>
  )
}
