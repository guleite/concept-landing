import { ArrowText } from "@/components/layout/arrow-text"
import { Section } from "@/components/layout/section"
import { SmartLink } from "@/components/layout/smart-link"
import { Reveal } from "@/components/motion/reveal"
import { SplitReveal } from "@/components/motion/split-reveal"
import { Button } from "@/components/ui/button"
import { cta, sectionMeta } from "@/content"

/** Chamada final: pergunta em display e os botões (contato abre o formulário). */
export function Cta() {
  const titleId = `${sectionMeta.cta.id}-title`

  return (
    <Section meta={sectionMeta.cta} aside={sectionMeta.cta.aside} labelledBy={titleId}>
      <SplitReveal id={titleId} as="h2" text={cta.heading} className="type-display text-balance" />
      <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
        {cta.buttons.map((button) => (
          <Button key={button.id} asChild size="lg" variant={button.variant}>
            <SmartLink link={button}>
              <ArrowText text={button.text} />
            </SmartLink>
          </Button>
        ))}
      </Reveal>
    </Section>
  )
}
