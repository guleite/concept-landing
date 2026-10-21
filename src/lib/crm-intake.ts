import { crmIntake } from "@/content"
import { getAttribution } from "@/lib/attribution"

export type LeadAnswers = {
  name: string
  company: string
  phone: string
  segment: string
  goal: string
  budget: string
  crm: string
  bottleneck: string
}

type LeadExtras = {
  /** Rótulo da página de onde veio, ex.: "Case iD2Control". */
  page: string
  /** Campo invisível: só robôs preenchem. */
  honeypot: string
  /** Tempo entre abrir o formulário e enviar (robôs enviam em menos de 2,5 s). */
  elapsedMs: number
}

/**
 * Envia o lead para o CRM da Concept sem esperar resposta (o WhatsApp já abriu).
 * `keepalive` mantém o envio mesmo se a página fechar; `text/plain` evita a
 * checagem prévia de CORS. Falhas ficam só no console: o contato segue pelo WhatsApp.
 */
export function sendLeadToCrm(answers: LeadAnswers, extras: LeadExtras) {
  const attribution = getAttribution()
  const payload = {
    form_key: crmIntake.formKey,
    ...answers,
    page: extras.page,
    page_url: window.location.href,
    referrer: attribution.referrer,
    utm: attribution.utm,
    website: extras.honeypot,
    elapsed_ms: Math.round(extras.elapsedMs),
  }
  fetch(crmIntake.endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((response) => {
      if (!response.ok) console.warn("[crm] lead não registrado:", response.status)
    })
    .catch((error: unknown) => console.warn("[crm] falha ao enviar o lead:", error))
}
