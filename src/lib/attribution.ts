// Origem da visita (UTMs do anúncio, gclid/fbclid e quem indicou), guardada na
// primeira página da sessão para seguir junto com o lead até o CRM.

const STORAGE_KEY = "concept:attribution"
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"]

export type Attribution = { utm: Record<string, string>; referrer: string; landing: string }

let memory: Attribution | null = null

function read(): Attribution | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Attribution) : null
  } catch {
    return null
  }
}

/** Chamar uma vez ao abrir o site: guarda a origem se a sessão ainda não tiver uma. */
export function captureAttribution() {
  const current = read()
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of PARAMS) {
    const value = params.get(key)
    if (value) utm[key] = value.slice(0, 120)
  }
  // Uma visita nova com UTM substitui a anterior; sem UTM, mantém a primeira da sessão.
  if (current && Object.keys(utm).length === 0) {
    memory = current
    return
  }
  memory = { utm, referrer: document.referrer.slice(0, 500), landing: window.location.href.slice(0, 500) }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    // sem sessionStorage (aba anônima, bloqueio): fica só na memória
  }
}

export function getAttribution(): Attribution {
  return memory ?? read() ?? { utm: {}, referrer: document.referrer, landing: window.location.href }
}
