import { AlertCircle } from 'lucide-react'

type InlineNoticeProps = {
  title: string
  message: string
}

export function InlineNotice({ title, message }: InlineNoticeProps) {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  )
}
