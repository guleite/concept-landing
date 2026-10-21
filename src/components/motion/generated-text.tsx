import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { mulberry32 } from "@/lib/random"
import { cn } from "@/lib/utils"

export type GenerationStats = { tokens: number; ms: number }

type GeneratedTextProps = {
  text: string
  /** Espera antes da primeira palavra, em ms. */
  startDelay?: number
  className?: string
  onDone?: (stats: GenerationStats) => void
  "data-bp"?: string
}

/** Contagem aproximada de tokens: palavras + sinais de pontuação. */
function countTokens(text: string) {
  return text.match(/[\p{L}\p{N}'’-]+|[^\s\p{L}\p{N}]/gu)?.length ?? 0
}

/** Momento (ms) em que cada palavra aparece: ritmo irregular, com pausa na pontuação. */
function buildTimeline(words: string[]) {
  const random = mulberry32(words.length * 7919)
  const offsets: number[] = []
  let time = 0
  for (const word of words) {
    offsets.push(time)
    time += 55 + random() * 45
    if (/[,;:]$/.test(word)) time += 120
    if (/[.!?]$/.test(word)) time += 180
  }
  return { offsets, total: Math.round(time) }
}

/**
 * Texto que "é gerado" palavra por palavra, com cursor piscando no fim —
 * o lado "máquina" do título do herói.
 */
export function GeneratedText({ text, startDelay = 700, className, onDone, ...rest }: GeneratedTextProps) {
  const reduced = useReducedMotion()
  const words = useMemo(() => text.trim().split(/\s+/), [text])
  const timeline = useMemo(() => buildTimeline(words), [words])
  const [generated, setGenerated] = useState(0)
  // Com "reduzir movimento", o texto aparece inteiro de uma vez.
  const shown = reduced ? words.length : generated
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const tokens = countTokens(text)
    if (reduced) {
      onDoneRef.current?.({ tokens, ms: timeline.total })
      return
    }

    let frame = 0
    let start = 0
    let count = 0
    const tick = (now: number) => {
      if (!start) start = now + startDelay
      const elapsed = now - start
      let next = count
      while (next < words.length && elapsed >= timeline.offsets[next]) next++
      if (next !== count) {
        count = next
        setGenerated(next)
      }
      if (count < words.length) frame = requestAnimationFrame(tick)
      else onDoneRef.current?.({ tokens, ms: Math.round(elapsed) })
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced, startDelay, text, timeline, words])

  const done = shown >= words.length

  return (
    <span className={cn("gen", className)} {...rest}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i === shown ? <Caret /> : null}
          <span className="gen-word" data-shown={i < shown}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
      {done ? <Caret idle /> : null}
    </span>
  )
}

function Caret({ idle = false }: { idle?: boolean }) {
  return <span aria-hidden="true" className="gen-caret" data-idle={idle} />
}
