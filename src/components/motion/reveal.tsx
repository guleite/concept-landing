import type { ElementType, ReactNode } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cssVars } from "@/lib/css"
import { cn } from "@/lib/utils"

type RevealProps = {
  as?: "div" | "li" | "section" | "span"
  /** Atraso da entrada, em ms (para escalonar itens de uma lista). */
  delay?: number
  className?: string
  children: ReactNode
}

/** Sobe e aparece quando entra na tela. */
export function Reveal({ as = "div", delay = 0, className, children }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  const Tag = as as ElementType

  return (
    <Tag
      ref={ref}
      data-inview={inView}
      className={cn("reveal", className)}
      style={cssVars({ "--delay": `${delay}ms` })}
    >
      {children}
    </Tag>
  )
}
