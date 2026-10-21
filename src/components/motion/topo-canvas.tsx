import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { mulberry32 } from "@/lib/random"
import { cn } from "@/lib/utils"

const CELL = 14 // px entre pontos da grade de amostragem
const LEVELS = [-0.6, -0.42, -0.24, -0.06, 0.12, 0.3, 0.48, 0.66]
const MAJOR_LEVELS = new Set([0.3]) // curva escura e mais grossa, como a do original
const SPEED = 0.000035 // quanto o relevo muda por ms
const FRAME_MS = 1000 / 30

/**
 * Curvas de nível animadas atrás do herói (o site original usa WebGL; aqui é
 * canvas 2D com marching squares sobre ruído simplex). Pausa fora da tela e
 * fica estático com "reduzir movimento".
 */
export function TopoCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const noise = createNoise3D(mulberry32(11))
    const root = getComputedStyle(document.documentElement)
    const minorColor = root.getPropertyValue("--color-grid--line-strong").trim() || "#0E0E0D52"
    const majorColor = root.getPropertyValue("--color-text-primary").trim() || "#0E0E0D"

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let field = new Float32Array(0)
    let time = 0
    let frame = 0
    let last = 0
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / CELL) + 1
      rows = Math.ceil(height / CELL) + 1
      field = new Float32Array(cols * rows)
    }

    const sample = () => {
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * CELL
          const y = j * CELL
          field[j * cols + i] =
            noise(x / 560, y / 560, time) * 0.72 + noise(x / 230 + 40, y / 230, time * 1.7) * 0.28
        }
      }
    }

    const segment = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
    }

    // Marching squares: traça a curva onde o relevo cruza `level`.
    const contour = (level: number) => {
      for (let j = 0; j < rows - 1; j++) {
        const y = j * CELL
        for (let i = 0; i < cols - 1; i++) {
          const k = j * cols + i
          const a = field[k] // topo-esquerda
          const b = field[k + 1] // topo-direita
          const c = field[k + cols + 1] // base-direita
          const d = field[k + cols] // base-esquerda
          const index = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0)
          if (index === 0 || index === 15) continue

          const x = i * CELL
          const tx = x + CELL * ((level - a) / (b - a))
          const ry = y + CELL * ((level - b) / (c - b))
          const bx = x + CELL * ((level - d) / (c - d))
          const ly = y + CELL * ((level - a) / (d - a))
          const right = x + CELL
          const bottom = y + CELL

          switch (index) {
            case 1:
            case 14:
              segment(x, ly, bx, bottom)
              break
            case 2:
            case 13:
              segment(bx, bottom, right, ry)
              break
            case 3:
            case 12:
              segment(x, ly, right, ry)
              break
            case 4:
            case 11:
              segment(tx, y, right, ry)
              break
            case 6:
            case 9:
              segment(tx, y, bx, bottom)
              break
            case 7:
            case 8:
              segment(x, ly, tx, y)
              break
            case 5:
            case 10: {
              const centerAbove = (a + b + c + d) / 4 > level
              if ((index === 5) === centerAbove) {
                segment(x, ly, tx, y)
                segment(bx, bottom, right, ry)
              } else {
                segment(tx, y, right, ry)
                segment(x, ly, bx, bottom)
              }
              break
            }
          }
        }
      }
    }

    const draw = () => {
      sample()
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = "round"
      for (const level of LEVELS) {
        const major = MAJOR_LEVELS.has(level)
        ctx.beginPath()
        contour(level)
        ctx.strokeStyle = major ? majorColor : minorColor
        ctx.globalAlpha = major ? 0.8 : 0.75
        ctx.lineWidth = major ? 1.75 : 1
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (!visible || document.hidden) {
        last = now
        return
      }
      const delta = last ? now - last : FRAME_MS
      if (delta < FRAME_MS) return
      last = now
      time += Math.min(delta, 100) * SPEED
      draw()
    }

    resize()
    draw()
    canvas.dataset.ready = "true"

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    resizeObserver.observe(canvas)

    let visibilityObserver: IntersectionObserver | undefined
    if (!reduced) {
      visibilityObserver = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
      })
      visibilityObserver.observe(canvas)
      frame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver?.disconnect()
    }
  }, [reduced])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("topo pointer-events-none absolute inset-0 size-full", className)}
    />
  )
}
