import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { Badge } from "@/components/ui/badge"
import { sectionMeta, tools } from "@/content"

/** tools-section: a lista de ferramentas em pílulas. */
export function Tools() {
  return (
    <Section meta={sectionMeta.tools} aside={sectionMeta.tools.aside}>
      <ul className="flex flex-wrap gap-2.5">
        {tools.items.map((item, i) => (
          <Reveal as="li" key={item} delay={i * 50}>
            <Badge variant="pill">{item}</Badge>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
