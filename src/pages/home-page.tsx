import { CaseStudy } from "@/components/sections/case-study"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Pillars } from "@/components/sections/pillars"
import { Process } from "@/components/sections/process"
import { Tools } from "@/components/sections/tools"
import { metadata } from "@/content"
import { useDocumentTitle } from "@/hooks/use-document-title"

/** Página inicial (/): as seções na ordem da página original. */
export function HomePage() {
  useDocumentTitle(metadata.title, metadata.description)

  return (
    <>
      <Hero />
      <Pillars />
      <CaseStudy />
      <Process />
      <Tools />
      <Faq />
      <Cta />
    </>
  )
}
