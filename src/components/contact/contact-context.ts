import { createContext, useContext } from "react"

type ContactContextValue = {
  /** Abre o formulário de contato em popup. */
  openContact: () => void
}

export const ContactContext = createContext<ContactContextValue | null>(null)

export function useContact() {
  const context = useContext(ContactContext)
  if (!context) throw new Error("useContact precisa estar dentro de <ContactProvider>")
  return context
}
