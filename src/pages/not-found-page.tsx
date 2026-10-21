import { Link } from "react-router"
import { ArrowText } from "@/components/layout/arrow-text"
import { Button } from "@/components/ui/button"
import { metadata, notFound } from "@/content"
import { useDocumentTitle } from "@/hooks/use-document-title"

/** Endereço que não existe (ou case com nome errado). */
export function NotFoundPage() {
  useDocumentTitle(`${notFound.title.replace(/\.$/, "")} | ${metadata.siteName}`)

  return (
    <section aria-labelledby="not-found-title" className="wrap pt-36 md:pt-44">
      <h1 id="not-found-title" className="type-display max-w-[10em] text-balance">
        {notFound.title}
      </h1>
      <p className="type-lead mt-8 max-w-[28em] text-ink-muted">{notFound.description}</p>
      <Button asChild size="lg" className="mt-10">
        <Link to="/">
          <ArrowText text={notFound.back} />
        </Link>
      </Button>
    </section>
  )
}
