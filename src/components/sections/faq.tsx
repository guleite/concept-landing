import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faq, sectionMeta } from "@/content"

/** faq-section: perguntas em acordeão (+ / −), várias podem ficar abertas. */
export function Faq() {
  return (
    <Section meta={sectionMeta.faq} aside={sectionMeta.faq.aside}>
      <Reveal>
        <Accordion type="multiple" className="border-t border-grid">
          {faq.items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-grid">
              <AccordionTrigger className="type-h3 py-6 md:py-7">{item.title}</AccordionTrigger>
              <AccordionContent className="pb-7">
                <p className="max-w-[40em] text-ink-muted">{item.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  )
}
