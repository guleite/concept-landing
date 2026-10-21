import { CaseList } from "@/components/cases/case-list"
import { CaptionsVisual } from "@/components/figures/captions-visual"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { SplitReveal } from "@/components/motion/split-reveal"
import { cases, caseStudy, sectionMeta } from "@/content"

/** Cases da página inicial: ilustração à esquerda; título e lista de clientes (com link) à direita. */
export function CaseStudy() {
  const titleId = `${sectionMeta.caseStudy.id}-title`

  return (
    <Section meta={sectionMeta.caseStudy} aside={cases.map((item) => item.client).join(" · ")} labelledBy={titleId}>
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-(--col-gap)">
        <Reveal className="md:sticky md:top-24 md:col-span-6 md:self-start">
          <CaptionsVisual />
        </Reveal>
        <div className="md:col-span-5 md:col-start-8">
          <SplitReveal id={titleId} as="h2" text={caseStudy.title} className="type-h2" />
          <CaseList items={cases} className="mt-10 md:mt-12" />
        </div>
      </div>
    </Section>
  )
}
