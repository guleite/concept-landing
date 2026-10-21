import { Link } from "react-router"
import { Reveal } from "@/components/motion/reveal"
import { caseStudy, type CaseSpec } from "@/content"
import { cn } from "@/lib/utils"

/** Lista de cases (nome à esquerda, resultado e "Ver case →" à direita), com réguas entre as linhas. */
export function CaseList({ items, className }: { items: CaseSpec[]; className?: string }) {
  return (
    <dl className={cn("border-t border-grid", className)}>
      {items.map((item, i) => (
        <Reveal
          key={item.slug}
          delay={i * 80}
          className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-grid py-5 md:grid-cols-[7rem_1fr]"
        >
          <dt className="type-note pt-[0.3em] text-ink">
            <Link to={`/cases/${item.slug}`} className="transition-colors hover:text-accent-text">
              {item.client}
            </Link>
          </dt>
          <dd className="flex flex-col items-start gap-3 text-ink-muted">
            {item.summary}
            <Link
              to={`/cases/${item.slug}`}
              className="type-note text-accent-text underline-offset-4 hover:underline"
              aria-label={`${caseStudy.viewCase.replace(/\s*→$/, "")}: ${item.client}`}
            >
              {caseStudy.viewCase}
            </Link>
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
