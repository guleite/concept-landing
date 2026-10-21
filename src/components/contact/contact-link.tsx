import type { ComponentProps } from "react"
import { useContact } from "@/components/contact/contact-context"
import { extras } from "@/content"
import { whatsappLink } from "@/lib/whatsapp"

/**
 * Link de contato: o clique abre o formulário em popup. O href continua sendo
 * o WhatsApp, então Ctrl/⌘+clique (ou sem JavaScript) vai direto para a conversa.
 */
export function ContactLink({ onClick, ...props }: Omit<ComponentProps<"a">, "href">) {
  const { openContact } = useContact()

  return (
    <a
      {...props}
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      data-cursor={extras.cursor.link}
      onClick={(event) => {
        onClick?.(event)
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
        if (event.defaultPrevented || modified) return
        event.preventDefault()
        openContact()
      }}
    />
  )
}
