# Concept Agência Digital — landing page

Landing page da Concept (marketing com IA, dados, CRM e gestão comercial), em React + Vite + Tailwind CSS v4 + shadcn/ui + React Router. O visual e as animações vêm da recriação de https://piergorelli.com/services/ai-for-agencies/ (pasta `piergorelli-ai-for-agencies`).

No ar: **https://lp.conceptagencia.com.br/** (GitHub Pages com domínio próprio, DNS no Cloudflare)

## Como rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:5173. Para a versão final: `npm run build` (gera `dist/`) e `npm run preview` para conferir.

## Páginas

| Endereço | Conteúdo |
| --- | --- |
| `/` | Página inicial |
| `/cases/id2control` | Case iD2Control |
| `/cases/ultra-academia` | Case Ultra Academia |
| `/cases/lux-tree` | Case Lux Tree |
| `/cases/gestor-performance` | Case Gestor Performance |

Para criar um case novo, adicione um item na lista `cases` em `src/content.ts`. A página, o link na lista e a cópia para o GitHub Pages aparecem sozinhos.

## Publicação (GitHub Pages)

Cada push na branch `main` publica o site (`.github/workflows/deploy.yml`). O andamento aparece na aba **Actions** do repositório e leva uns 2 minutos.

O workflow roda `npm run build:pages`, que:

- gera o site para a raiz do domínio (`/`);
- copia a página para `cases/<slug>/index.html`, para os links diretos dos cases abrirem normalmente;
- cria o `404.html`, que mostra a página "não encontrada" do site nos endereços que não existem.

O domínio fica em `public/CNAME` e em Settings → Pages do repositório. Se o domínio mudar, troque nos dois lugares e cadastre o novo endereço no CRM (veja "Ligação com o CRM").

## Formulário de contato

Todos os botões de contato (cabeçalho, chamada final, rodapé e páginas de case) abrem um formulário em popup com perguntas de qualificação. Ao enviar, o site:

1. **Registra o lead no CRM da Concept.** Cria ou atualiza o contato (pelo WhatsApp) e a empresa, abre um negócio na primeira etapa do funil (ou usa o que já estiver aberto), anota as respostas, soma pontos ao lead e dispara as automações do CRM. A origem da visita (UTMs, gclid, fbclid) vai junto.
2. **Abre o WhatsApp da Concept** (`whatsapp.number` em `src/content.ts`) com as respostas já escritas e a página de origem. A pessoa revisa e toca em enviar.

Se o CRM não responder, o WhatsApp abre do mesmo jeito. Perguntas, opções e o texto da mensagem ficam em `contactForm`, em `src/content.ts`.

### Ligação com o CRM

Quem recebe o lead é a função `site-lead` do CRM (repositório `sales-flow-buddy-10`). O endereço dela e a chave do formulário ficam em `crmIntake`, em `src/content.ts`.

A chave aparece no código do site, como em qualquer formulário público. A proteção fica no CRM: ele só aceita envios dos endereços cadastrados, descarta robôs (campo invisível preenchido ou envio rápido demais) e aceita até 5 envios a cada 10 minutos por visitante. A chave e os endereços aceitos ficam no cadastro `site_form` da tabela `integration_configs` do CRM; hoje são `https://lp.conceptagencia.com.br`, `https://conceptagencia.com.br` (com e sem www), `https://guleite.github.io` e o localhost. Cada subdomínio precisa ser cadastrado.

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Textos, números, cases, formulário e WhatsApp | `src/content.ts` |
| Logo | `src/assets/concept-logo.png` |
| Cores, fontes e escala de tipo | `src/styles/design-system.css` |
| Ligação Tailwind/shadcn ↔ tokens, animações | `src/index.css` |
| Páginas (inicial, case, não encontrada) | `src/pages/` |
| Formulário e popup de contato | `src/components/contact/` |
| Envio do lead ao CRM e origem da visita (UTMs) | `src/lib/crm-intake.ts`, `src/lib/attribution.ts` |
| Componentes shadcn/ui (button, badge, accordion, dialog, input, textarea) | `src/components/ui/` |
| Cabeçalho, rodapé, seção e links | `src/components/layout/` |
| Seções da página inicial e topo das páginas | `src/components/sections/` |
| Ilustrações SVG | `src/components/figures/` |
| Animações (entrada, texto "gerado", blueprint, curvas de nível, cursor em cruz) | `src/components/motion/` |
| Publicação no GitHub Pages | `.github/workflows/deploy.yml`, `scripts/spa-fallback.mjs` |

## Notas

- Os números dos cases vêm da apresentação comercial; os clientes autorizam a divulgação por contrato.
- Todas as animações respeitam a opção "reduzir movimento" do sistema. O cursor em cruz só aparece com mouse.
- O `npm audit` mostra alertas na CLI do shadcn (ferramenta de desenvolvimento). Nada disso entra no site gerado.
