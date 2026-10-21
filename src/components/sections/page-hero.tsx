import { useRef, useState } from "react"
import { Blueprint } from "@/components/motion/blueprint"
import { GeneratedText } from "@/components/motion/generated-text"
import { TopoCanvas } from "@/components/motion/topo-canvas"
import { Badge } from "@/components/ui/badge"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cssVars } from "@/lib/css"

export type HeroSpec = { id: string; label: string; value: string }

type PageHeroProps = {
  /** Rótulo técnico acima do título, ex.: [Marketing · IA · Dados · CRM] */
  tag: string
  /** Título grande ("humano"). */
  title: string
  /** Frase que aparece palavra por palavra ("máquina"). */
  machineLine: string
  /** Parágrafo de abertura. */
  lead: string
  /** Ficha técnica (4 itens). */
  specs: HeroSpec[]
}

/**
 * Topo das páginas: curvas de nível, caixas de medida, título grande, frase
 * "gerada" e, quando ela termina, o parágrafo de abertura e a ficha técnica.
 */
export function PageHero({ tag, title, machineLine, lead, specs }: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [generated, setGenerated] = useState(false)
  const revealed = reduced || generated

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="wrap relative isolate flex flex-col gap-5 pt-28 pb-8 md:pt-36"
    >
      <TopoCanvas className="-z-10" />
      <Blueprint containerRef={sectionRef} />

      <Badge variant="note" className="note-brackets">
        {tag}
      </Badge>

      <h1 id="hero-title" className="flex flex-col gap-2 md:gap-3">
        <span data-bp="h1.human" className="hero-human-mask block w-fit max-w-full">
          <span className="hero-human type-display block">{title}</span>
        </span>{" "}
        <GeneratedText
          data-bp="h1.machine"
          text={machineLine}
          onDone={() => setGenerated(true)}
          className="type-h2 block w-fit max-w-[16.2em] text-balance"
        />
      </h1>

      <div
        className="hero-fade mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-8 border-t border-grid pt-6"
        data-shown={revealed}
        style={cssVars({ "--delay": "120ms" })}
      >
        <p className="type-lead max-w-[28em] text-ink-muted">{lead}</p>
        <dl data-bp="dl.tolerances" className="grid w-full grid-cols-2 border-t border-grid sm:w-[min(100%,30rem)]">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="flex flex-col gap-1 border-b border-grid py-3 pr-4 even:border-l even:pl-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <dt className="type-note text-ink-muted">{spec.label}</dt>
              <dd className="sm:text-right">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
