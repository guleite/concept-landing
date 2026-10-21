import { useEffect, useState } from "react"

/**
 * Id da seção que está no meio da tela (para destacar o item do menu).
 * `page` faz o hook procurar as seções de novo quando a rota muda.
 */
export function useActiveSection(ids: readonly string[], page = "") {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(" ")

  useEffect(() => {
    const sections = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((section) => observer.observe(section))
    return () => {
      observer.disconnect()
      setActive(null)
    }
  }, [key, page])

  return active
}
