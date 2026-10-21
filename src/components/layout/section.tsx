import type { ReactNode } from "react"
import type { SectionMeta } from "@/content"
import { cn } from "@/lib/utils"

type SectionProps = {
  meta: SectionMeta
  /** Nota à direita do cabeçalho da seção. */
  aside?: string
  /** Id do título que nomeia a seção; sem ele, usa o rótulo "[01] …". */
  labelledBy?: string
  className?: string
  children: ReactNode
}

/** Seção com o cabeçalho técnico do site original: régua no topo, "[01] Rótulo" e nota. */
export function Section({ meta, aside, labelledBy, className, children }: SectionProps) {
  const labelId = `${meta.id}-label`

  return (
    <section id={meta.id} aria-labelledby={labelledBy ?? labelId} className={cn("wrap pt-(--section)", className)}>
      <header className="mb-(--head-gap) flex items-baseline justify-between gap-4 border-t border-line-strong pt-3">
        <p id={labelId} className="type-note text-ink">
          <span className="note-brackets">{meta.index}</span> {meta.label}
        </p>
        {aside ? <p className="type-note hidden text-right text-ink-muted sm:block">{aside}</p> : null}
      </header>
      {children}
    </section>
  )
}
