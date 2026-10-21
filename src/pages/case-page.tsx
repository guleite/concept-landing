import { Link, useParams } from "react-router"
import { CaseList } from "@/components/cases/case-list"
import { ContactLink } from "@/components/contact/contact-link"
import { ArrowText } from "@/components/layout/arrow-text"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { SplitReveal } from "@/components/motion/split-reveal"
import { PageHero } from "@/components/sections/page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { casePage, cases, type CaseSpec } from "@/content"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { NotFoundPage } from "@/pages/not-found-page"

/** Página de um case (/cases/<slug>). Endereço desconhecido mostra a página de "não encontrado". */
export function CasePage() {
  const { slug } = useParams()
  const index = cases.findIndex((item) => item.slug === slug)
  const item = cases[index]
  if (!item) return <NotFoundPage />
  // key: ao trocar de case, a página inteira remonta e as animações recomeçam.
  return <CaseContent key={item.slug} item={item} position={index + 1} />
}

function CaseContent({ item, position }: { item: CaseSpec; position: number }) {
  useDocumentTitle(`${item.client} | ${casePage.titleSuffix}`, item.headline)
  const others = cases.filter((entry) => entry.slug !== item.slug)
  const specs = item.metrics.map((metric, i) => ({ id: `${item.slug}-${i}`, ...metric }))
  const ctaTitleId = "case-contato-title"

  return (
    <>
      <PageHero
        tag={`${casePage.tag} / ${String(position).padStart(2, "0")}`}
        title={item.client}
        machineLine={item.headline}
        lead={item.whatWeDid}
        specs={specs}
      />

      <Section meta={casePage.services} aside={item.segment}>
        <ul className="flex flex-wrap gap-2.5">
          {item.services.map((service, i) => (
            <Reveal as="li" key={service} delay={i * 50}>
              <Badge variant="pill">{service}</Badge>
            </Reveal>
          ))}
        </ul>
        {item.highlight ? (
          <Reveal className="mt-16 md:mt-24">
            <p className="type-h2 max-w-[20ch] text-balance">{item.highlight}</p>
          </Reveal>
        ) : null}
      </Section>

      <Section meta={casePage.contact} aside={casePage.contact.aside} labelledBy={ctaTitleId}>
        <SplitReveal id={ctaTitleId} as="h2" text={casePage.ctaHeading} className="type-display text-balance" />
        <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <ContactLink>
              <ArrowText text={casePage.ctaButton} />
            </ContactLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/#cases">{casePage.allCases}</Link>
          </Button>
        </Reveal>
      </Section>

      <Section meta={casePage.others} aside={others.map((entry) => entry.client).join(" · ")}>
        <CaseList items={others} className="max-w-3xl" />
      </Section>
    </>
  )
}
