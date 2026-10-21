import { useEffect } from "react"
import { useLocation } from "react-router"

/**
 * Rolagem ao trocar de página: vai para a seção do #hash (ex.: /#cases) ou
 * volta ao topo quando a página muda.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" })
      return
    }
    // Espera a página nova desenhar antes de procurar a seção.
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key])

  return null
}
