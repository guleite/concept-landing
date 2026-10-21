import { extras } from "@/content"
import { useInView } from "@/hooks/use-in-view"
import { cssVars } from "@/lib/css"
import { cn } from "@/lib/utils"

// Geometria do SVG original (viewBox 400×300): imagem → skill → revisão humana → publicação.
const NODES = [
  { x: 24, y: 126, w: 68, rx: 24 },
  { x: 146, y: 66, w: 80, rx: 6, accent: true },
  { x: 146, y: 186, w: 80, rx: 6 },
  { x: 278, y: 126, w: 98, rx: 6 },
]
const LINKS = ["M92 150 C 118 150, 118 90, 146 90", "M186 114 V186", "M226 210 C 252 210, 252 150, 278 150"]
const DOTS = [
  [92, 150],
  [146, 90],
  [186, 186],
  [226, 210],
  [278, 150],
]
const NODE_HEIGHT = 48

/** fig. 02 — o fluxo do skill de SEO de imagens, desenhado quando entra na tela. */
export function SeoSkillFigure({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: "0px 0px -20% 0px" })
  const { caption, nodes, top, bottom } = extras.seoFigure

  return (
    <figure ref={ref} data-inview={inView} className={cn("plot flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-md border border-grid bg-canvas">
        <svg viewBox="0 0 400 300" role="img" aria-label={caption} className="h-auto w-full text-ink">
          <defs>
            <pattern id="fig02-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" className="stroke-grid" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#fig02-grid)" />

          <g fill="none" strokeWidth="1.25">
            {NODES.map((node, i) => (
              <rect
                key={`${node.x}-${node.y}`}
                x={node.x}
                y={node.y}
                width={node.w}
                height={NODE_HEIGHT}
                rx={node.rx}
                pathLength={1}
                className={cn("plot-line plot-node fill-canvas", node.accent ? "stroke-accent-blue" : "stroke-ink")}
                style={cssVars({ "--d": `${i * 120}ms` })}
              />
            ))}
            {LINKS.map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="plot-line stroke-ink"
                style={cssVars({ "--d": `${560 + i * 160}ms` })}
              />
            ))}
          </g>

          {DOTS.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={4}
              className="plot-pop fill-accent-blue"
              style={cssVars({ "--d": `${900 + i * 90}ms` })}
            />
          ))}

          <g
            className="plot-fade fill-ink-muted font-mono text-[10.5px] tracking-[0.02em] uppercase"
            style={cssVars({ "--d": "1100ms" })}
          >
            {NODES.map((node, i) => (
              <text key={nodes[i]} x={node.x + node.w / 2} y={node.y + NODE_HEIGHT / 2 + 3.5} textAnchor="middle">
                {nodes[i]}
              </text>
            ))}
            <text x="146" y="48">
              {top}
            </text>
            <text x="146" y="262">
              {bottom}
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="type-note text-ink-muted">{caption}</figcaption>
    </figure>
  )
}
