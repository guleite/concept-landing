/**
 * Conteúdo da landing page da Concept Agência Digital (pt-BR).
 * Os números e os cases vêm da apresentação comercial da Concept.
 * Para mudar qualquer texto, número ou link do site, mude aqui.
 */

export type BadgeSpec = { id: string; text: string; variant: "outline" | "secondary" }
export type CardSpec = { id: string; title: string; description: string }
export type SectionMeta = { id: string; index: string; label: string; aside?: string }
/** Link comum (`href`) ou botão que abre o formulário de contato (`action: "contact"`). */
export type LinkSpec = { text: string; href?: string; action?: "contact" }
export type ButtonSpec = LinkSpec & { id: string; variant: "default" | "outline" }

/** WhatsApp da Concept: só números, com 55 + DDD. */
export const whatsapp = {
  number: "5561983360915",
  // Mensagem usada se o link for aberto sem passar pelo formulário (ex.: nova aba).
  defaultMessage: "Olá, Concept! Vim pelo site e quero conversar.",
}

/**
 * Entrada de leads no CRM da Concept (função site-lead).
 * A chave é pública: ela só permite criar leads, nunca ler o CRM.
 */
export const crmIntake = {
  endpoint: "https://bfyjyxgaotdeqaeigwss.supabase.co/functions/v1/site-lead",
  formKey: "9paJthc2k2Gd7WrAoOxiTxYP",
}

export const metadata = {
  siteName: "Concept Agência Digital",
  title: "Concept Agência Digital | Marketing com IA, dados e CRM",
  description:
    "Marketing com IA, dados e CRM para quem quer vender mais, do primeiro clique ao contrato assinado. Há mais de 16 anos no marketing digital.",
}

export const hero: {
  title: string
  subtitle: string
  cta: LinkSpec
  badges: BadgeSpec[]
} = {
  title: "Hora de vender.",
  // A primeira frase é "escrita pela máquina"; o resto vira o parágrafo de abertura.
  subtitle:
    "Marketing com IA, dados e CRM para quem quer vender mais, do primeiro clique ao contrato assinado. Há mais de 16 anos a Concept planeja, cria e opera o marketing digital de empresas que precisam de resultado. Cada campanha nasce de dados, e cada real investido é acompanhado no CRM até a venda.",
  cta: { text: "Fale com a gente →", action: "contact" },
  badges: [
    { id: "badge-tag", text: "Marketing · IA · Dados · CRM", variant: "outline" },
    { id: "badge-experience", text: "Experiência: +16 anos", variant: "secondary" },
    { id: "badge-strategy", text: "Estratégia: Guiada por dados", variant: "secondary" },
    { id: "badge-crm", text: "CRM: Configurado e integrado", variant: "secondary" },
    { id: "badge-reports", text: "Relatórios: Semanais e mensais", variant: "secondary" },
  ],
}

export const pillars: { cards: CardSpec[] } = {
  cards: [
    {
      id: "card-ia",
      title: "01. Marketing com IA",
      description:
        "Conteúdos, criativos e anúncios produzidos e testados com IA, na voz da sua marca. Mais variações no ar em menos tempo, sempre com uma pessoa revisando.",
    },
    {
      id: "card-dados",
      title: "02. Dados e CRM",
      description:
        "Cada lead chega ao CRM com a origem marcada: canal, campanha e anúncio. O painel mostra o que vira venda e o que só consome verba.",
    },
    {
      id: "card-comercial",
      title: "03. Gestão comercial",
      description:
        "Funil, metas e rotina do time de vendas junto com o marketing. Automações no WhatsApp, no chat e no e-mail para nenhum lead ficar sem resposta.",
    },
  ],
}

export type CaseMetric = { label: string; value: string }
export type CaseSpec = {
  /** Endereço da página: /cases/<slug> */
  slug: string
  client: string
  segment: string
  /** Texto da lista de cases da página inicial. */
  summary: string
  /** Frase que aparece "sendo gerada" no topo da página do case. */
  headline: string
  /** Parágrafo de abertura da página do case. */
  whatWeDid: string
  /** Ficha técnica do topo (4 itens). */
  metrics: CaseMetric[]
  /** Frentes de trabalho, mostradas em pílulas. */
  services: string[]
  /** Destaque opcional, em letra grande. */
  highlight?: string
}

/** Cases da apresentação comercial (valores exatamente como no material). */
export const cases: CaseSpec[] = [
  {
    slug: "id2control",
    client: "iD2Control",
    segment: "Sistemas de segurança e tecnologia",
    summary:
      "R$ 574.995 em faturamento vindo direto das ações de marketing, com R$ 37.460 investidos: ROAS de 15,34. E-commerce, Google Shopping, Google e Meta Ads, CRM e conexões de sistema.",
    headline: "Cada R$ 1 investido em marketing virou R$ 15,34 em faturamento.",
    whatWeDid:
      "Montamos a operação de vendas online de ponta a ponta: e-commerce, SEO, Google Shopping, Google e Meta Ads, Loja Meta e landing pages, com o CRM configurado e os sistemas conectados para cada venda ter origem.",
    metrics: [
      { label: "Segmento", value: "Segurança e tecnologia" },
      { label: "Investimento", value: "R$ 37.460" },
      { label: "Faturamento", value: "R$ 574.995" },
      { label: "ROAS", value: "15,34" },
    ],
    services: [
      "E-commerce",
      "SEO",
      "Google Shopping",
      "Google Ads",
      "Meta Ads",
      "Loja Meta",
      "CRM",
      "Conexões de sistema",
      "Landing pages",
    ],
  },
  {
    slug: "ultra-academia",
    client: "Ultra Academia",
    segment: "Academia",
    summary:
      "650 contratos e R$ 251.550 de faturamento previsto, com R$ 25.000 investidos: ROAS de 10,06. Em março, a unidade Samambaia foi a que mais vendeu no Brasil.",
    headline: "650 contratos vendidos, e cada R$ 1 investido virou R$ 10,06.",
    whatWeDid:
      "Campanhas no Google Ads e no Meta Ads com landing pages próprias para vender planos, com o retorno acompanhado contrato a contrato.",
    metrics: [
      { label: "Segmento", value: "Academia" },
      { label: "Investimento", value: "R$ 25.000" },
      { label: "Contratos", value: "650" },
      { label: "ROAS", value: "10,06" },
    ],
    services: ["Google Ads", "Meta Ads", "Landing pages"],
    highlight: "Em março, a unidade Samambaia foi a que mais vendeu no Brasil.",
  },
  {
    slug: "lux-tree",
    client: "Lux Tree",
    segment: "Gestão de resíduos",
    summary:
      "3 contratos e R$ 180.000 de faturamento previsto, com R$ 8.000 investidos em Google Ads e landing pages: ROAS de 22,05.",
    headline: "3 contratos fechados, e cada R$ 1 investido vai virar R$ 22,05.",
    whatWeDid:
      "Campanhas no Google Ads com landing pages, para a empresa aparecer na hora em que alguém procura gestão de resíduos.",
    metrics: [
      { label: "Segmento", value: "Gestão de resíduos" },
      { label: "Investimento", value: "R$ 8.000" },
      { label: "Contratos", value: "3" },
      { label: "ROAS", value: "22,05" },
    ],
    services: ["Google Ads", "Landing pages"],
  },
  {
    slug: "gestor-performance",
    client: "Gestor Performance",
    segment: "Consultoria de RH",
    summary:
      "R$ 80.000 de faturamento orgânico em 12 meses, com R$ 5.000 investidos em site, Google Meu Negócio e redes sociais.",
    headline: "R$ 80 mil de faturamento orgânico em 12 meses, com R$ 5 mil investidos.",
    whatWeDid:
      "Otimização do site, do perfil no Google Meu Negócio e das redes sociais para a empresa ser encontrada por quem procura consultoria de RH.",
    metrics: [
      { label: "Segmento", value: "Consultoria de RH" },
      { label: "Investimento", value: "R$ 5.000" },
      { label: "Faturamento", value: "R$ 80.000" },
      { label: "Período", value: "12 meses" },
    ],
    services: ["Otimização de site", "Google Meu Negócio", "Redes sociais"],
  },
]

export const caseStudy = {
  title: "Investimento que vira venda",
  viewCase: "Ver case →",
}

/** Textos da página de cada case (/cases/<slug>). */
export const casePage = {
  tag: "Cases",
  services: { id: "o-que-fizemos", index: "01", label: "O que fizemos" },
  contact: { id: "contato", index: "02", label: "Próximo passo", aside: "Atendimento pelo WhatsApp" },
  others: { id: "outros-cases", index: "03", label: "Outros cases" },
  ctaHeading: "Quer um resultado assim?",
  ctaButton: "Falar no WhatsApp ↗",
  allCases: "Ver todos os cases",
  titleSuffix: "Cases | Concept Agência Digital",
}

export const notFound = {
  title: "Página não encontrada.",
  description: "O endereço pode ter mudado. Os cases e os serviços estão na página inicial.",
  back: "Voltar para o início →",
}

export const processSteps: { title: string; cards: CardSpec[] } = {
  title: "Comece pequeno, prove em vendas e escale o que dá retorno.",
  cards: [
    {
      id: "step-a",
      title: "A. Diagnóstico e setup",
      description:
        "Kickoff, acesso aos sistemas na primeira semana e painel de acompanhamento em duas. Tráfego e social media já começam na semana 1.",
    },
    {
      id: "step-b",
      title: "B. Funil com IA e CRM",
      description:
        "Um funil de vendas para cada público, do anônimo ao cliente recorrente, com automações e cada contato registrado no CRM.",
    },
    {
      id: "step-c",
      title: "C. Gestão e escala",
      description:
        "Checkpoint toda semana e reunião mensal de resultados, do orgânico e do tráfego até as vendas. O que dá retorno ganha mais verba.",
    },
  ],
}

export const tools: { items: string[] } = {
  items: [
    "IA generativa",
    "CRM",
    "WhatsApp",
    "Google Ads",
    "Meta Ads",
    "Google Shopping",
    "Search Console",
    "Google Meu Negócio",
    "E-mail marketing",
    "Landing pages",
    "Dashboards",
  ],
}

export const faq: { items: CardSpec[] } = {
  items: [
    {
      id: "faq-1",
      title: "Preciso ter um time de marketing?",
      description:
        "Não. A Concept cuida da estratégia, da criação, do tráfego e dos relatórios. Do seu lado, basta alguém que conheça o negócio e responda os leads.",
    },
    {
      id: "faq-2",
      title: "Onde a IA entra no meu marketing?",
      description:
        "Na produção e no teste de conteúdos, criativos e textos, e na leitura dos dados das campanhas. Uma pessoa da equipe revisa tudo antes de ir ao ar.",
    },
    {
      id: "faq-3",
      title: "Vocês implantam o CRM?",
      description:
        "Sim. Configuramos o CRM e conectamos aos seus canais, para cada lead chegar com a origem marcada e nada se perder entre o anúncio e o fechamento.",
    },
    {
      id: "faq-4",
      title: "Em quanto tempo começa?",
      description:
        "Acesso e ambientação dos sistemas em uma semana e painel de acompanhamento em duas. Tráfego e social media começam já na primeira semana.",
    },
    {
      id: "faq-5",
      title: "Como eu acompanho os resultados?",
      description:
        "Grupo no WhatsApp, checkpoint toda semana e uma reunião mensal com o relatório completo: orgânico, redes sociais e tráfego até as vendas.",
    },
  ],
}

export const cta: { heading: string; buttons: ButtonSpec[] } = {
  heading: "Onde suas vendas travam?",
  buttons: [
    { id: "button-whatsapp", text: "Falar no WhatsApp ↗", action: "contact", variant: "default" },
    { id: "button-cases", text: "Ver os cases", href: "/#cases", variant: "outline" },
  ],
}

export const footer: { text: string; links: LinkSpec[] } = {
  text: "Concept · agência digital",
  links: [
    { text: "Falar no WhatsApp", action: "contact" },
    { text: "Ver os cases", href: "/#cases" },
  ],
}

/**
 * Formulário qualificador (abre em popup em todos os botões de contato).
 * Ao enviar, abre o WhatsApp da Concept com as respostas já escritas.
 */
export const contactForm = {
  tag: "Contato",
  title: "Vamos conversar",
  description: "Responda em menos de um minuto e continue no WhatsApp com tudo já escrito.",
  fields: {
    name: { label: "Seu nome", placeholder: "Como podemos te chamar?" },
    company: { label: "Empresa", placeholder: "Nome da empresa" },
    phone: { label: "WhatsApp", placeholder: "(61) 99999-9999" },
    segment: {
      label: "Segmento",
      options: [
        "Advocacia",
        "Saúde e bem-estar",
        "Engenharia e indústria",
        "Seguros e finanças",
        "Varejo e e-commerce",
        "Serviços B2B",
        "Outro",
      ],
    },
    goal: {
      label: "Principal objetivo",
      options: [
        "Gerar mais leads",
        "Vender mais online",
        "Organizar o comercial com CRM",
        "Usar IA no marketing",
        "Fortalecer a marca",
      ],
    },
    budget: {
      label: "Investimento mensal em marketing",
      options: ["Ainda não invisto", "Até R$ 2 mil", "R$ 2 mil a R$ 5 mil", "R$ 5 mil a R$ 15 mil", "Mais de R$ 15 mil"],
    },
    crm: { label: "Usa CRM hoje?", options: ["Sim", "Não", "Uso planilha"] },
    bottleneck: {
      label: "Onde suas vendas travam? (opcional)",
      placeholder: "Ex.: chegam leads, mas poucos viram cliente",
    },
  },
  errors: { text: "Preencha este campo", choice: "Escolha uma opção", phone: "Informe um WhatsApp com DDD" },
  submit: "Continuar no WhatsApp ↗",
  privacy:
    "Ao continuar, suas respostas vão para a equipe da Concept e abrem uma conversa no WhatsApp. Usamos esses dados só para falar com você.",
  close: "Fechar",
  message: {
    greeting: "Olá, Concept! Vim pelo site e quero conversar.",
    labels: {
      name: "Nome",
      company: "Empresa",
      segment: "Segmento",
      goal: "Objetivo",
      budget: "Investimento mensal em marketing",
      crm: "Usa CRM",
      bottleneck: "Onde as vendas travam",
      origin: "Página",
    },
  },
  origins: { home: "Página inicial", case: "Case" },
}

/** Textos curtos das figuras, do cursor e do link de acessibilidade. */
export const extras = {
  skipLink: "Pular para o conteúdo",
  logoAlt: "Concept Agência Digital",
  seoFigure: {
    caption: "fig. 02 · do lead à venda, com IA e um time no controle",
    nodes: ["lead", "ia", "time ✓", "venda ↗"],
    top: "crm · dados",
    bottom: "origem · score · follow-up",
  },
  captionsVisual: {
    // Três variações de anúncio: a do meio (acento) é a que os dados escolheram.
    files: ["anuncio_v1.jpg", "anuncio_v2.jpg", "anuncio_v3.jpg"],
    pipeline: ["google ads · meta ads · crm", "→ lead · oportunidade · venda"],
    command: "$ concept /relatorio-mensal",
  },
  cursor: { link: "abrir →", external: "visitar ↗", email: "escrever", button: "clique" },
}

/** Rótulos dos cabeçalhos de seção ("[01] Serviços") e do menu. */
export const sectionMeta = {
  pillars: { id: "servicos", index: "01", label: "Serviços" },
  caseStudy: { id: "cases", index: "02", label: "Cases" },
  process: { id: "metodo", index: "03", label: "Método", aside: "3 etapas" },
  tools: { id: "ferramentas", index: "04", label: "Ferramentas", aside: "Do anúncio ao CRM" },
  faq: { id: "duvidas", index: "05", label: "Dúvidas", aside: "5 perguntas" },
  cta: { id: "contato", index: "06", label: "Contato", aside: "Atendimento pelo WhatsApp" },
} satisfies Record<string, SectionMeta>
