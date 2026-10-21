/** Telefone brasileiro → 55 + DDD + número, ou null (mesma regra da função site-lead do CRM). */
export function normalizeBrPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("00")) digits = digits.slice(2)
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`
  if (!digits.startsWith("55") || (digits.length !== 12 && digits.length !== 13)) return null
  if (Number(digits.slice(2, 4)) < 11) return null
  return digits
}

/** "61983360915" → "(61) 98336-0915". Devolve o texto como veio se não reconhecer o número. */
export function formatBrPhone(raw: string): string {
  const normalized = normalizeBrPhone(raw)
  if (!normalized) return raw
  const ddd = normalized.slice(2, 4)
  const number = normalized.slice(4)
  const split = number.length - 4
  return `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`
}
