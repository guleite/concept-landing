import { Fragment, type ElementType } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cssVars } from "@/lib/css"
import { cn } from "@/lib/utils"

type SplitRevealProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "p"
  id?: string
  className?: string
  delay?: number
  /** Intervalo entre palavras, em ms. */
  stagger?: number
}

/**
 * Título que sobe palavra por palavra, cada uma saindo de uma "máscara".
 * O texto completo fica disponível para leitores de tela.
 */
export function SplitReveal({ text, as = "h2", id, className, delay = 0, stagger = 45 }: SplitRevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const Tag = as as ElementType
  const words = text.split(/\s+/)

  return (
    <Tag
      ref={ref}
      id={id}
      data-inview={inView}
      className={cn("split", className)}
      style={cssVars({ "--delay": `${delay}ms`, "--stagger": `${stagger}ms` })}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="split-mask">
              <span className="split-word" style={cssVars({ "--i": String(i) })}>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
