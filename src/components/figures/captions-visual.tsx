import { useEffect, useRef } from "react"
import { extras } from "@/content"
import { useInView } from "@/hooks/use-in-view"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cssVars } from "@/lib/css"
import { clamp } from "@/lib/math"
import { subscribeScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const FRAMES = [
  { x: 30, accent: false, bar: 78 },
  { x: 150, accent: true, bar: 92 },
  { x: 270, accent: false, bar: 64 },
]

/**
 * Ilustração dos cases: três variações de anúncio criadas com IA; as que
 * perderam ficam riscadas e a vencedora (no meio, em azul) tem a barra de
 * desempenho maior. Embaixo, os canais ligados ao CRM e o relatório.
 * Leve parallax ao rolar. Textos do SVG em Geist Mono 11px e acento.
 */
export function CaptionsVisual({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "0px 0px -20% 0px" })
  const artRef = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()
  const { files, pipeline, command } = extras.captionsVisual

  useEffect(() => {
    const art = artRef.current
    const frame = art?.parentElement
    if (reduced || !art || !frame) return
    return subscribeScroll(() => {
      const rect = frame.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = clamp((rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2), -1, 1)
      art.style.translate = `0 ${(progress * 5).toFixed(2)}%`
    })
  }, [reduced])

  return (
    <div
      ref={ref}
      data-inview={inView}
      aria-hidden="true"
      className={cn("plot relative aspect-[4/3] overflow-hidden rounded-md bg-raised", className)}
    >
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <defs>
          <pattern id="captions-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" className="stroke-grid" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#captions-grid)" />
      </svg>

      <svg ref={artRef} viewBox="0 0 400 300" className="absolute inset-0 size-full text-ink">
        {FRAMES.map((frame, i) => {
          const base = i * 160
          const { x } = frame
          return (
            <g key={x}>
              <rect
                x={x}
                y={36}
                width={100}
                height={74}
                pathLength={1}
                strokeWidth="1"
                className="plot-line plot-node fill-raised stroke-ink"
                style={cssVars({ "--d": `${base}ms` })}
              />
              <path
                d={`M${x + 10} 98L${x + 34} 70L${x + 52} 88L${x + 64} 78L${x + 90} 98`}
                pathLength={1}
                fill="none"
                strokeWidth="1"
                strokeLinejoin="round"
                className="plot-line stroke-ink"
                style={cssVars({ "--d": `${base + 300}ms` })}
              />
              <circle
                cx={x + 78}
                cy={54}
                r={6}
                className={cn("plot-pop", frame.accent ? "fill-accent-blue" : "fill-ink-muted")}
                style={cssVars({ "--d": `${base + 650}ms` })}
              />
              <text
                x={x}
                y={128}
                className={cn("plot-fade fill-accent-text font-mono text-[11px]", !frame.accent && "line-through")}
                style={cssVars({ "--d": `${base + 800}ms` })}
              >
                {files[i]}
              </text>
              <rect
                x={x}
                y={140}
                width={frame.bar}
                height={4}
                rx={2}
                className={cn("plot-grow", frame.accent ? "fill-accent-blue" : "fill-grid")}
                style={cssVars({ "--d": `${base + 950}ms` })}
              />
              <rect
                x={x}
                y={152}
                width={70}
                height={4}
                rx={2}
                className="plot-grow fill-grid"
                style={cssVars({ "--d": `${base + 1050}ms` })}
              />
            </g>
          )
        })}

        <path
          d="M30 188H370"
          pathLength={1}
          className="plot-line stroke-line-strong"
          style={cssVars({ "--d": "1300ms" })}
        />

        <g className="fill-accent-text font-mono text-[11px]">
          {[...pipeline, command].map((line, i) => (
            <text
              key={line}
              x={30}
              y={214 + i * 18 + (i === pipeline.length ? 12 : 0)}
              className="plot-fade"
              style={cssVars({ "--d": `${1450 + i * 150}ms` })}
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
