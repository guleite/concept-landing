import { splitTrailingArrow } from "@/lib/text"

/**
 * Mostra o texto como está, mas separa a seta final (↗) num <span> para ela
 * "andar" no hover do botão ou link (classes group/button e group/link).
 */
export function ArrowText({ text }: { text: string }) {
  const { label, arrow } = splitTrailingArrow(text)
  if (!arrow) return text

  return (
    <>
      {label}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-(--ease-reveal) group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      >
        {arrow}
      </span>
    </>
  )
}
