import { whatsapp } from "@/content"

/** Link do WhatsApp da Concept com a mensagem já escrita. */
export function whatsappLink(text: string = whatsapp.defaultMessage) {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`
}
