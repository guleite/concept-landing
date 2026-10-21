/** "01. Training" → { index: "01", label: "Training" }. Sem prefixo, index fica vazio. */
export function splitIndexedTitle(title: string) {
  const match = /^([0-9A-Z]{1,3})\.\s+(.+)$/.exec(title)
  return match ? { index: match[1], label: match[2] } : { index: "", label: title }
}

/** "Sessions: Hands-on" → { label: "Sessions", value: "Hands-on" } */
export function splitLabelValue(text: string) {
  const at = text.indexOf(":")
  if (at === -1) return { label: "", value: text }
  return { label: text.slice(0, at).trim(), value: text.slice(at + 1).trim() }
}

/** Separa a primeira frase do restante do texto. */
export function splitFirstSentence(text: string): [string, string] {
  const match = /^(.+?[.!?])\s+(.+)$/s.exec(text)
  return match ? [match[1], match[2]] : [text, ""]
}

/** "Falar no WhatsApp ↗" → { label: "Falar no WhatsApp", arrow: "↗" } */
export function splitTrailingArrow(text: string) {
  const match = /^(.*?)\s*([↗→↘])$/u.exec(text)
  return match ? { label: match[1], arrow: match[2] } : { label: text, arrow: "" }
}
