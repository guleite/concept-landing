import { useEffect, useRef } from "react"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { SplitReveal } from "@/components/motion/split-reveal"
import { processSteps, sectionMeta, type CardSpec } from "@/content"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { clamp } from "@/lib/math"
import { subscribeScroll } from "@/lib/scroll"
import { splitIndexedTitle } from "@/lib/text"

/**
 * process-section: frase grande e os passos A → B → C.
 * Como no original: a partir de 1100px os passos ficam lado a lado sobre uma
 * linha horizontal que se desenha ao rolar; abaixo disso, viram uma coluna
 * ligada por uma linha vertical (estilos .seq* em src/index.css).
 */
export function Process() {
  const titleId = `${sectionMeta.process.id}-title`

  return (
    <Section meta={sectionMeta.process} aside={sectionMeta.process.aside} labelledBy={titleId}>
      <SplitReveal
        id={titleId}
        as="h2"
        text={processSteps.title}
        className="type-h2 mb-[clamp(2.5rem,5vw,4rem)] max-w-[20ch] text-balance"
      />
      <Steps steps={processSteps.cards} />
    </Section>
  )
}

function Steps({ steps }: { steps: CardSpec[] }) {
  const lineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // A linha horizontal cresce da esquerda para a direita conforme a seção sobe na tela.
  useEffect(() => {
    const line = lineRef.current
    if (!line) return
    if (reduced) {
      line.style.scale = "1 1"
      return
    }
    return subscribeScroll(() => {
      const viewport = window.innerHeight
      const progress = clamp((viewport * 0.9 - line.getBoundingClientRect().top) / (viewport * 0.45), 0, 1)
      line.style.scale = `${progress} 1`
    })
  }, [reduced])

  return (
    <>
      <div ref={lineRef} aria-hidden="true" className="seq-line" />
      <ol className="seq">
        {steps.map((step, i) => {
          const { index, label } = splitIndexedTitle(step.title)
          return (
            <Reveal as="li" key={step.id} delay={i * 80} className="seq-item">
              <span aria-hidden="true" className="seq-n">
                {index}
              </span>
              <h3 className="type-h3">{label}</h3>
              <p className="max-w-[34ch] text-ink-muted">{step.description}</p>
            </Reveal>
          )
        })}
      </ol>
    </>
  )
}
