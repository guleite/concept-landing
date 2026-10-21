import { useEffect, useRef, useState } from "react"

type InViewOptions = {
  rootMargin?: string
  threshold?: number
  /** Para de observar depois da primeira vez que o elemento aparece. */
  once?: boolean
}

/** Diz se o elemento já entrou na tela (para disparar animações de entrada). */
export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "0px 0px -12% 0px",
  threshold = 0,
  once = true,
}: InViewOptions = {}) {
  const ref = useRef<T | null>(null)
  // Sem IntersectionObserver (navegador muito antigo), mostra tudo de uma vez.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined")

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return [ref, inView] as const
}
