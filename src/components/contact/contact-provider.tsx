import { useMemo, useState, type ReactNode } from "react"
import { ContactContext } from "@/components/contact/contact-context"
import { ContactDialog } from "@/components/contact/contact-dialog"

/** Guarda o estado do popup de contato e o deixa disponível para qualquer botão do site. */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ openContact: () => setOpen(true) }), [])

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactDialog open={open} onOpenChange={setOpen} />
    </ContactContext.Provider>
  )
}
