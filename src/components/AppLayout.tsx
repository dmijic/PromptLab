import type { ReactNode } from 'react'

interface AppLayoutProps {
  header: ReactNode
  left: ReactNode
  right: ReactNode
}

export function AppLayout({ header, left, right }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,190,118,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,#fffdf9_0%,#f6fbff_52%,#f8fafc_100%)]" />
      <div className="pointer-events-none absolute left-[6%] top-24 h-32 w-32 rounded-full bg-[color:var(--accent-soft)] blur-3xl motion-safe:animate-[orb-float_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[7%] top-44 h-36 w-36 rounded-full bg-[rgba(20,122,123,0.12)] blur-3xl motion-safe:animate-[orb-float_13s_ease-in-out_infinite_reverse]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          {header}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            <div className="min-w-0">{left}</div>
            <div className="min-w-0">{right}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
