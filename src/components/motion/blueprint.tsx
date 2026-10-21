import { useEffect, useState, type RefObject } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type Box = { name: string; x: number; y: number; w: number; h: number }
type Phase = "idle" | "in" | "out" | "done"

type BlueprintProps = {
  /** Container (posicionado) onde estão os elementos com data-bp. */
  containerRef: RefObject<HTMLElement | null>
  startDelay?: number
  holdMs?: number
}

/** Posição de layout de `el` dentro de `container`, ignorando transforms de animação. */
function layoutBox(el: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

const unique = (values: number[]) => [...new Set(values.map((value) => Math.round(value)))]

/**
 * Sobreposição "blueprint" do site original: ao carregar, desenha caixas de
 * medida (ex.: "h1.human · 971×113") em volta dos elementos marcados com
 * data-bp, com linhas-guia, e some depois de alguns segundos.
 */
export function Blueprint({ containerRef, startDelay = 300, holdMs = 2800 }: BlueprintProps) {
  const reduced = useReducedMotion()
  const [boxes, setBoxes] = useState<Box[]>([])
  const [phase, setPhase] = useState<Phase>("idle")
  const finished = phase === "done"

  useEffect(() => {
    const container = containerRef.current
    if (reduced || finished || !container) return
    const measure = () => {
      const targets = container.querySelectorAll<HTMLElement>("[data-bp]")
      setBoxes(Array.from(targets, (el) => ({ name: el.dataset.bp ?? "", ...layoutBox(el, container) })))
    }
    measure()
    void document.fonts.ready.then(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, reduced, finished])

  useEffect(() => {
    if (reduced) return
    const timers = [
      window.setTimeout(() => setPhase("in"), startDelay),
      window.setTimeout(() => setPhase("out"), startDelay + holdMs),
      window.setTimeout(() => setPhase("done"), startDelay + holdMs + 900),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [reduced, startDelay, holdMs])

  if (reduced || finished || boxes.length === 0) return null

  const rows = unique(boxes.flatMap((box) => [box.y, box.y + box.h]))
  const cols = unique(boxes.map((box) => box.x + box.w))

  return (
    <div aria-hidden="true" data-phase={phase} className="bp pointer-events-none absolute inset-0 -z-5">
      {rows.map((y) => (
        <span key={`row-${y}`} className="bp-guide bp-guide-h" style={{ top: y }} />
      ))}
      {cols.map((x) => (
        <span key={`col-${x}`} className="bp-guide bp-guide-v" style={{ left: x }} />
      ))}
      {boxes.map((box) => (
        <div key={box.name} className="bp-box" style={{ left: box.x, top: box.y, width: box.w, height: box.h }}>
          <span className="bp-label">
            {box.name} · {Math.round(box.w)}×{Math.round(box.h)}
          </span>
        </div>
      ))}
    </div>
  )
}
