import type { CSSProperties } from "react"

/** Permite passar variáveis CSS no atributo style, ex.: cssVars({ "--delay": "120ms" }). */
export function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars as CSSProperties
}
