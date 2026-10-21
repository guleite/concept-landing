import { useEffect, useRef } from "react"
import { Link, useLocation } from "react-router"
import logo from "@/assets/concept-logo.png"
import { ArrowText } from "@/components/layout/arrow-text"
import { SmartLink } from "@/components/layout/smart-link"
import { Button } from "@/components/ui/button"
import { extras, hero, sectionMeta } from "@/content"
import { useActiveSection } from "@/hooks/use-active-section"
import { subscribeScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const NAV = [sectionMeta.pillars, sectionMeta.caseStudy, sectionMeta.process, sectionMeta.faq]
const OBSERVED = ["top", ...NAV.map((item) => item.id)]

/** Cabeçalho fixo: logo da Concept, menu das seções, contato e régua com o progresso da leitura. */
export function SiteHeader() {
  const { pathname } = useLocation()
  const active = useActiveSection(OBSERVED, pathname)
  const fillRef = useRef<HTMLSpanElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)

  useEffect(
    () =>
      subscribeScroll(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        if (fillRef.current) fillRef.current.style.scale = `${progress} 1`
        if (tagRef.current) {
          tagRef.current.style.left = `${progress * 100}%`
          tagRef.current.style.translate = `${-progress * 100}% 0`
          tagRef.current.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}%`
        }
      }),
    [],
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) bg-canvas/85 backdrop-blur-md">
      <div className="wrap relative flex h-full items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link to="/" className="flex items-center justify-self-start">
          <img src={logo} alt={extras.logoAlt} width={866} height={204} className="h-7 w-auto md:h-8" />
        </Link>

        <nav aria-label="Seções" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item, i) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <Link
                    to={`/#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className="flex items-baseline gap-1.5 text-[0.9375rem] transition-colors hover:text-accent-text"
                  >
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] tracking-[0.02em] transition-colors",
                        isActive ? "text-accent-text" : "text-ink-muted",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex justify-end">
          <Button asChild size="sm">
            <SmartLink link={hero.cta}>
              <ArrowText text={hero.cta.text} />
            </SmartLink>
          </Button>
        </div>

        <div aria-hidden="true" className="ruler absolute inset-x-(--gutter) bottom-0">
          <span ref={fillRef} className="ruler-fill" />
          <span ref={tagRef} className="ruler-tag">
            00%
          </span>
        </div>
      </div>
    </header>
  )
}
