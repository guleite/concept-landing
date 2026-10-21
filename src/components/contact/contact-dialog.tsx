import { useId, useRef, useState, type ComponentProps, type FormEvent } from "react"
import { useLocation } from "react-router"
import { ArrowText } from "@/components/layout/arrow-text"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cases, contactForm, extras } from "@/content"
import { sendLeadToCrm } from "@/lib/crm-intake"
import { formatBrPhone, normalizeBrPhone } from "@/lib/phone"
import { cn } from "@/lib/utils"
import { whatsappLink } from "@/lib/whatsapp"

const FIELDS = ["name", "company", "phone", "segment", "goal", "budget", "crm", "bottleneck"] as const
type Field = (typeof FIELDS)[number]
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const REQUIRED_TEXT: Field[] = ["name", "company"]
const REQUIRED_CHOICE: Field[] = ["segment", "goal", "budget", "crm"]
// O telefone não entra na mensagem: ela já sai do WhatsApp da própria pessoa.
const MESSAGE_FIELDS = ["name", "company", "segment", "goal", "budget", "crm", "bottleneck"] as const

/** Página de onde a pessoa veio, para o time comercial saber o contexto. */
function originFor(pathname: string) {
  const slug = /^\/cases\/([^/]+)/.exec(pathname)?.[1]
  const item = slug ? cases.find((entry) => entry.slug === slug) : undefined
  if (item) return `${contactForm.origins.case} ${item.client}`
  return pathname === "/" ? contactForm.origins.home : pathname
}

/** Mensagem do WhatsApp: saudação e uma resposta por linha, com o rótulo em *negrito*. */
function buildMessage(values: Values, origin: string) {
  const { greeting, labels } = contactForm.message
  const lines = [greeting, ""]
  for (const field of MESSAGE_FIELDS) if (values[field]) lines.push(`*${labels[field]}:* ${values[field]}`)
  lines.push(`*${labels.origin}:* ${origin}`)
  return lines.join("\n")
}

function validate(values: Values) {
  const errors: Errors = {}
  for (const field of REQUIRED_TEXT) if (!values[field]) errors[field] = contactForm.errors.text
  if (!normalizeBrPhone(values.phone)) errors.phone = contactForm.errors.phone
  for (const field of REQUIRED_CHOICE) if (!values[field]) errors[field] = contactForm.errors.choice
  return errors
}

type ContactDialogProps = { open: boolean; onOpenChange: (open: boolean) => void }

/**
 * Formulário qualificador em popup. Ao enviar, abre o WhatsApp da Concept com
 * as respostas na mensagem; nada é gravado nem enviado pelo site.
 */
export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const openedAtRef = useRef(0)
  const [errors, setErrors] = useState<Errors>({})
  const { fields } = contactForm

  const clearError = (field: Field) =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))

  const handleOpenChange = (next: boolean) => {
    if (!next) setErrors({})
    onOpenChange(next)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values = Object.fromEntries(
      FIELDS.map((field) => [field, String(data.get(field) ?? "").trim()]),
    ) as Values
    const found = validate(values)
    setErrors(found)

    const firstInvalid = FIELDS.find((field) => found[field])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // O WhatsApp abre primeiro, ainda dentro do clique (senão o navegador bloqueia a janela).
    const origin = originFor(pathname)
    window.open(whatsappLink(buildMessage(values, origin)), "_blank", "noopener,noreferrer")
    const { name, company, phone, segment, goal, budget, crm, bottleneck } = values
    sendLeadToCrm(
      { name, company, phone, segment, goal, budget, crm, bottleneck },
      {
        page: origin,
        honeypot: String(data.get("contact_hp") ?? ""),
        elapsedMs: performance.now() - openedAtRef.current,
      },
    )
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={contentRef}
        closeLabel={contactForm.close}
        // Computador e tablet: painel largo em duas colunas, que cabe na tela sem rolar.
        // Celular: ocupa a tela inteira e rola como uma página.
        className={cn(
          "gap-0 md:max-w-[min(64rem,calc(100%-3rem))] md:p-9 [scrollbar-width:thin]",
          "max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:ring-0 max-sm:pt-8",
        )}
        // Abre com o foco no painel (título visível, sem abrir o teclado do celular).
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          openedAtRef.current = performance.now()
          contentRef.current?.focus({ preventScroll: true })
        }}
      >
        <form
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          className="grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        >
          {/* No celular as colunas se desfazem e o campo opcional vai para o fim, antes do botão. */}
          <div className="flex flex-col gap-6 max-md:contents">
          <DialogHeader className="gap-3 pr-10">
            <Badge variant="note" className="note-brackets">
              {contactForm.tag}
            </Badge>
            <DialogTitle className="type-h2 md:type-h3 md:[@media(min-height:880px)]:type-h2">
              {contactForm.title}
            </DialogTitle>
            <DialogDescription className="text-base text-ink-muted">{contactForm.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="name"
              label={fields.name.label}
              placeholder={fields.name.placeholder}
              autoComplete="name"
              error={errors.name}
              onInput={() => clearError("name")}
            />
            <TextField
              name="company"
              label={fields.company.label}
              placeholder={fields.company.placeholder}
              autoComplete="organization"
              error={errors.company}
              onInput={() => clearError("company")}
            />
            <TextField
              name="phone"
              type="tel"
              inputMode="tel"
              label={fields.phone.label}
              placeholder={fields.phone.placeholder}
              autoComplete="tel"
              error={errors.phone}
              onInput={() => clearError("phone")}
              onBlur={(event) => {
                event.currentTarget.value = formatBrPhone(event.currentTarget.value)
              }}
            />
          </div>
          {/* Campo-isca: invisível para pessoas, robôs preenchem e o CRM descarta o envio. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-hp">Não preencha</label>
            <input id="contact-hp" name="contact_hp" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <TextAreaField
            name="bottleneck"
            label={fields.bottleneck.label}
            placeholder={fields.bottleneck.placeholder}
            className="max-md:order-last"
          />
          </div>

          <div className="flex flex-col gap-5 md:pt-1">
          <ChoiceField
            name="segment"
            label={fields.segment.label}
            options={fields.segment.options}
            error={errors.segment}
            onChange={() => clearError("segment")}
          />
          <ChoiceField
            name="goal"
            label={fields.goal.label}
            options={fields.goal.options}
            error={errors.goal}
            onChange={() => clearError("goal")}
          />
          <ChoiceField
            name="budget"
            label={fields.budget.label}
            options={fields.budget.options}
            error={errors.budget}
            onChange={() => clearError("budget")}
          />
          <ChoiceField
            name="crm"
            label={fields.crm.label}
            options={fields.crm.options}
            error={errors.crm}
            onChange={() => clearError("crm")}
          />
          </div>

          <div className="flex flex-col gap-4 border-t border-grid pt-5 sm:flex-row sm:items-center sm:justify-between max-md:order-last md:col-span-2">
            <p className="max-w-[30em] text-sm text-ink-muted md:max-w-[44em]">{contactForm.privacy}</p>
            <Button type="submit" size="lg" className="shrink-0">
              <ArrowText text={contactForm.submit} />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  )
}

type TextFieldProps = Omit<ComponentProps<"input">, "name"> & { name: Field; label: string; error?: string }

function TextField({ name, label, error, className, ...input }: TextFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-note text-ink-muted">
        {label}
      </label>
      <Input
        {...input}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("h-11 bg-transparent px-3.5 text-base md:text-base", className)}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

type TextAreaFieldProps = Omit<ComponentProps<"textarea">, "name"> & { name: Field; label: string }

function TextAreaField({ name, label, className, ...textarea }: TextAreaFieldProps) {
  const id = useId()
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-note text-ink-muted">
        {label}
      </label>
      <Textarea
        {...textarea}
        id={id}
        name={name}
        maxLength={500}
        className="min-h-20 bg-transparent px-3.5 py-3 text-base md:text-base"
      />
    </div>
  )
}

type ChoiceFieldProps = { name: Field; label: string; options: string[]; error?: string; onChange: () => void }

/** Grupo de opções de um toque (radio nativo, com visual de pílula). */
function ChoiceField({ name, label, options, error, onChange }: ChoiceFieldProps) {
  const id = useId()
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      {/* O erro fica na mesma linha do título do grupo, para o painel não crescer. */}
      <legend className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <span className="type-note text-ink-muted">{label}</span>
        {error && (
          <span id={`${id}-error`} className="text-sm text-destructive">
            {error}
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option}
            data-cursor={extras.cursor.button}
            className="inline-flex cursor-pointer items-center rounded-lg border border-line-strong px-3 py-1.5 text-[0.875rem] leading-tight transition-colors duration-200 select-none hover:border-accent-blue hover:text-accent-text has-checked:border-accent-blue has-checked:bg-accent-blue has-checked:text-surface has-checked:hover:text-surface has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={option}
              onChange={onChange}
              aria-invalid={error ? true : undefined}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
