import { SeoSkillFigure } from "@/components/figures/seo-skill-figure"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { pillars, sectionMeta } from "@/content"
import { splitIndexedTitle } from "@/lib/text"

/** pillars-section: figura fixa à esquerda e os três serviços numerados à direita. */
export function Pillars() {
  const items = pillars.cards.map((card) => ({ ...card, ...splitIndexedTitle(card.title) }))

  return (
    <Section meta={sectionMeta.pillars} aside={items.map((item) => item.label).join(" · ")}>
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-(--col-gap)">
        <div className="md:col-span-5">
          <SeoSkillFigure className="md:sticky md:top-24" />
        </div>
        <ol className="border-t border-grid md:col-span-6 md:col-start-7">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 80}
              className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2.5 border-b border-grid py-7 md:grid-cols-[3.5rem_1fr]"
            >
              <span className="type-note row-span-2 pt-[0.5em] text-accent-text">{item.index}</span>
              <h2 className="type-h3">{item.label}</h2>
              <p className="max-w-[34em] text-ink-muted">{item.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
