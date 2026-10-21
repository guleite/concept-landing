import { useEffect, useRef } from "react"
import { extras } from "@/content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { createTween, easeOutElastic, type Tween } from "@/lib/tween"

const INTERACTIVE = "a, button, summary, [data-cursor]"
const MAGNETIC = '[data-slot="button"]'

const pad = (value: number) => String(Math.max(0, Math.round(value))).padStart(4, "0")
const coordinates = (x: number, y: number) => `x ${pad(x)} · y ${pad(y)}`

/** Texto do cursor sobre algo clicável (textos em extras.cursor; data-cursor="…" troca o texto). */
function hoverLabel(element: HTMLElement) {
  const labels = extras.cursor
  if (element.dataset.cursor) return element.dataset.cursor
  if (element instanceof HTMLAnchorElement) {
    if (element.href.startsWith("mailto:")) return labels.email
    if (element.origin !== window.location.origin) return labels.external
    return labels.link
  }
  return labels.button
}

/**
 * Cursor em cruz do site original: linhas finas cruzando a tela, um quadrado
 * azul no ponteiro e as coordenadas ao lado. Sobre links e botões vira um
 * círculo com "open →", "visit ↗" ou "click", e os botões são puxados de leve
 * em direção ao ponteiro. Só aparece com mouse e some com "reduzir movimento".
 */
export function CrosshairCursor() {
  const finePointer = useMediaQuery("(pointer: fine)")
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  const rootRef = useRef<HTMLDivElement>(null)
  const lineHRef = useRef<HTMLSpanElement>(null)
  const lineVRef = useRef<HTMLSpanElement>(null)
  const pointRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const lineH = lineHRef.current
    const lineV = lineVRef.current
    const point = pointRef.current
    const label = labelRef.current
    if (!enabled || !root || !lineH || !lineV || !point || !label) return

    const html = document.documentElement
    html.classList.add("has-cursor")

    // As linhas seguem em 0,12s e o quadrado em 0,2s, como no original.
    const lineY = createTween(120)
    const lineX = createTween(120)
    const pointX = createTween(200)
    const pointY = createTween(200)
    const magnets = new Map<HTMLElement, { x: Tween; y: Tween }>()
    let magnet: HTMLElement | null = null
    let hovered: HTMLElement | null = null
    let visible = false
    let frame = 0

    const render = (now: number) => {
      frame = 0
      let busy = false
      for (const tween of [lineY, lineX, pointX, pointY]) busy = tween.update(now) || busy
      lineH.style.transform = `translate3d(0, ${lineY.value}px, 0)`
      lineV.style.transform = `translate3d(${lineX.value}px, 0, 0)`
      point.style.transform = `translate3d(${pointX.value}px, ${pointY.value}px, 0)`

      for (const [element, offset] of magnets) {
        const moving = [offset.x.update(now), offset.y.update(now)].some(Boolean)
        if (moving || element === magnet) {
          element.style.transform = `translate3d(${offset.x.value}px, ${offset.y.value}px, 0)`
          busy ||= moving
        } else {
          element.style.transform = ""
          magnets.delete(element)
        }
      }
      if (busy) frame = requestAnimationFrame(render)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    // Ao sair do botão, ele volta ao lugar com um "elástico".
    const release = (element: HTMLElement, now: number) => {
      const offset = magnets.get(element)
      offset?.x.to(0, now, 600, easeOutElastic)
      offset?.y.to(0, now, 600, easeOutElastic)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const now = performance.now()
      const { clientX: x, clientY: y } = event

      if (!visible) {
        // Primeiro movimento (ou volta para a janela): aparece já no lugar certo.
        visible = true
        root.classList.add("is-visible")
        for (const [tween, value] of [[lineY, y], [lineX, x], [pointX, x], [pointY, y]] as const) tween.snap(value)
      } else {
        lineY.to(y, now)
        lineX.to(x, now)
        pointX.to(x, now)
        pointY.to(y, now)
      }
      if (!hovered) label.textContent = coordinates(x, y)

      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(MAGNETIC) : null
      if (target !== magnet) {
        if (magnet) release(magnet, now)
        magnet = target
      }
      if (magnet) {
        let offset = magnets.get(magnet)
        if (!offset) {
          offset = { x: createTween(400), y: createTween(400) }
          magnets.set(magnet, offset)
        }
        const rect = magnet.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2 - offset.x.value
        const centerY = rect.top + rect.height / 2 - offset.y.value
        offset.x.to((x - centerX) * 0.25, now)
        offset.y.to((y - centerY) * 0.35, now)
      }
      schedule()
    }

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(INTERACTIVE) : null
      if (target === hovered) return
      hovered = target
      root.classList.toggle("is-hover", target !== null)
      if (target) label.textContent = hoverLabel(target)
    }

    const onLeave = () => {
      visible = false
      root.classList.remove("is-visible")
    }
    const onDown = () => root.classList.add("is-down")
    const onUp = () => root.classList.remove("is-down")

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerover", onOver, { passive: true })
    html.addEventListener("pointerleave", onLeave)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)

    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerover", onOver)
      html.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      cancelAnimationFrame(frame)
      for (const element of magnets.keys()) element.style.transform = ""
      html.classList.remove("has-cursor")
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor">
      <span ref={lineHRef} className="cursor-h" />
      <span ref={lineVRef} className="cursor-v" />
      <span ref={pointRef} className="cursor-pt">
        <span className="cursor-ring" />
        <span ref={labelRef} className="cursor-label" />
      </span>
    </div>
  )
}
