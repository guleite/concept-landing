export type Ease = (t: number) => number

/** power3.out do GSAP (curva "quart"): sai rápido e desacelera. */
export const easeOutQuart: Ease = (t) => 1 - (1 - t) ** 4

/** elastic.out(1, 0.4) do GSAP: passa do alvo e volta, como uma mola. */
export const easeOutElastic: Ease = (t) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const period = 0.4
  return 2 ** (-10 * t) * Math.sin(((t - period / 4) * 2 * Math.PI) / period) + 1
}

export type Tween = {
  value: number
  /** Anima de onde o valor está agora até `target` (como o gsap.quickTo). */
  to(target: number, now: number, duration?: number, ease?: Ease): void
  /** Pula direto para `target`, sem animar. */
  snap(target: number): void
  /** Atualiza `value` para o instante `now`; retorna true enquanto ainda está animando. */
  update(now: number): boolean
}

/** Valor numérico animado, atualizado a cada quadro por quem chama `update`. */
export function createTween(defaultDuration: number, defaultEase: Ease = easeOutQuart): Tween {
  let from = 0
  let target = 0
  let start = 0
  let duration = defaultDuration
  let ease = defaultEase
  let running = false

  const tween: Tween = {
    value: 0,
    to(next, now, nextDuration = defaultDuration, nextEase = defaultEase) {
      tween.update(now)
      from = tween.value
      target = next
      start = now
      duration = nextDuration
      ease = nextEase
      running = true
    },
    snap(next) {
      from = next
      target = next
      tween.value = next
      running = false
    },
    update(now) {
      if (!running) return false
      const progress = duration > 0 ? Math.min(1, (now - start) / duration) : 1
      tween.value = from + (target - from) * ease(progress)
      if (progress >= 1) running = false
      return running
    },
  }
  return tween
}
