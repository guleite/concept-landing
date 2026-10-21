import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SmartLink } from "@/components/layout/smart-link"
import { footer } from "@/content"

/** Rodapé: texto e links (o de WhatsApp abre o formulário de contato). */
export function SiteFooter() {
  return (
    <footer className="wrap pt-(--section) pb-10">
      <div className="grid gap-y-8 border-t border-line-strong pt-3 md:grid-cols-12 md:gap-x-(--col-gap)">
        <p className="type-note text-ink md:col-span-5">{footer.text}</p>
        <ul className="flex flex-col gap-2 md:col-span-6 md:col-start-7">
          {footer.links.map((link) => {
            const Arrow = link.action === "contact" ? ArrowUpRight : ArrowRight
            return (
              <li key={link.text}>
                <SmartLink
                  link={link}
                  className="group/link type-h3 inline-flex items-center gap-2 transition-colors duration-300 hover:text-accent-text"
                >
                  {link.text}
                  <Arrow
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-[0.8em] transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </SmartLink>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
