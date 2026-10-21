import { useEffect } from "react"

/** Atualiza o título da aba e a descrição da página quando a rota muda. */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description)
  }, [title, description])
}
