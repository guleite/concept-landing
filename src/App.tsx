import { BrowserRouter, Route, Routes } from "react-router"
import { ContactProvider } from "@/components/contact/contact-provider"
import { ScrollManager } from "@/components/layout/scroll-manager"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { CrosshairCursor } from "@/components/motion/crosshair-cursor"
import { extras } from "@/content"
import { CasePage } from "@/pages/case-page"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"

// No GitHub Pages o site fica em /concept-landing/ (definido no build pelo --base).
const basename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "")

/**
 * Rotas: / (página inicial) e /cases/<slug> (um case por página).
 * O cabeçalho, o rodapé, o cursor e o formulário de contato são comuns a todas.
 */
export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ContactProvider>
        <ScrollManager />
        <a href="#main" className="skip-link type-note">
          {extras.skipLink}
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cases/:slug" element={<CasePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
        <CrosshairCursor />
      </ContactProvider>
    </BrowserRouter>
  )
}
