// Roda depois do build para o GitHub Pages, que não tem regras de redirecionamento:
// - dist/cases/<slug>/index.html: links diretos dos cases abrem com status 200;
// - dist/404.html: qualquer outro endereço carrega o site (que mostra "não encontrada");
// - dist/.nojekyll: publica os arquivos como estão, sem processar com Jekyll.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const dist = "dist"
const index = join(dist, "index.html")

const content = readFileSync(join("src", "content.ts"), "utf8")
const slugs = [...content.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((match) => match[1])
for (const slug of slugs) {
  const dir = join(dist, "cases", slug)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, "index.html"))
}

copyFileSync(index, join(dist, "404.html"))
writeFileSync(join(dist, ".nojekyll"), "")
console.log(`GitHub Pages: ${slugs.length} páginas de case + 404.html`)
