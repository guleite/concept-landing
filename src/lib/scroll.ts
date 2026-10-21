type Listener = () => void

const listeners = new Set<Listener>()
let queued = false

function flush() {
  queued = false
  for (const listener of listeners) listener()
}

function schedule() {
  if (queued) return
  queued = true
  requestAnimationFrame(flush)
}

/**
 * Chama `listener` uma vez por quadro enquanto a página rola ou muda de tamanho
 * (um único listener de scroll para todos os efeitos). Retorna a função de cancelamento.
 */
export function subscribeScroll(listener: Listener) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
  }
  listeners.add(listener)
  listener()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }
}
