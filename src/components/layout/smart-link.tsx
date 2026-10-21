import type { ComponentProps } from "react"
import { Link } from "react-router"
import { ContactLink } from "@/components/contact/contact-link"
import type { LinkSpec } from "@/content"

type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & { link: Pick<LinkSpec, "href" | "action"> }

/**
 * Escolhe o tipo de link pelo conteúdo: abre o formulário (`action: "contact"`),
 * sai do site em nova aba (http…) ou navega dentro do site sem recarregar (/…).
 */
export function SmartLink({ link, ...props }: SmartLinkProps) {
  if (link.action === "contact") return <ContactLink {...props} />
  const href = link.href ?? "/"
  if (/^https?:\/\//.test(href)) return <a {...props} href={href} target="_blank" rel="noreferrer" />
  return <Link {...props} to={href} />
}
