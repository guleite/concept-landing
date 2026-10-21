import { PageHero } from "@/components/sections/page-hero"
import { hero } from "@/content"
import { splitFirstSentence, splitLabelValue } from "@/lib/text"

/** Topo da página inicial. */
export function Hero() {
  // O subtitle junta a frase da máquina e o parágrafo de abertura.
  const [machineLine, lead] = splitFirstSentence(hero.subtitle)
  const tag = hero.badges.find((badge) => badge.variant === "outline")?.text ?? ""
  const specs = hero.badges
    .filter((badge) => badge.variant === "secondary")
    .map((badge) => ({ id: badge.id, ...splitLabelValue(badge.text) }))

  return <PageHero tag={tag} title={hero.title} machineLine={machineLine} lead={lead} specs={specs} />
}
