// Dados de exemplo (placeholders). Edite livremente com suas informações reais.
// fallbackProjects serve apenas de FALLBACK, usado quando o Neon ainda não
// está configurado ou a tabela está vazia — assim que você popular o banco
// (veja neon/schema.sql), os dados reais substituem estes automaticamente.

export const profile = {
  name: "Bruno Trevizani",
  photoUrl: "/bruno.jpg",
  title: "Desenvolvedor Full Stack",
  tagline:
    "Transformo ideias em projetos reais através do código, cuidando de cada etapa do desenvolvimento, do banco de dados à interface.",
  location: "Brasil",
  email: "bruno.trevizani13@gmail.com",
  github: "https://github.com/brunotrevizani1",
  linkedin: "https://www.linkedin.com/in/bruno-da-rosa-trevizani/",
  youtube: "https://www.youtube.com/@BrunoRtrevizani",
  resumeUrl: "#",
};

export const about = {
  paragraphs: [
    "Sou desenvolvedor full stack apaixonado por transformar ideias em soluções funcionais. Gosto de participar de todo o processo de desenvolvimento, desde o planejamento e modelagem do banco de dados até a criação da interface e da experiência do usuário.",
    "Tenho experiência com tecnologias como React, Node.js, PHP, JavaScript e MySQL, sempre buscando aprender novas ferramentas e boas práticas para desenvolver aplicações mais eficientes, organizadas e escaláveis.",
    "Fora dos projetos, gosto de explorar novas tecnologias, desenvolver ideias próprias, acompanhar as tendências da área e aprender constantemente. Para mim, a evolução como desenvolvedor acontece através da prática, da curiosidade e da vontade de construir algo cada vez melhor.",
  ],
  highlights: [
    { label: "Disponibilidade", value: "Full-time" },
    { label: "Localização", value: "Brasil - RS" },
    { label: "Stack principal", value: "React · Node · PostgreSQL" },
  ],
};

export const skills = [
  { name: "React", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "MySQL", category: "Backend" },
  { name: "Neon", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "Git", category: "Ferramentas" },
  { name: "Vercel", category: "Ferramentas" },
  { name: "Railway", category: "Ferramentas" },
  { name: "Cloudflare", category: "Ferramentas" },
];

// Rota exibida quando o projeto não tem código aberto no GitHub.
export const PRIVATE_REPO_ROUTE = "/codigo-privado";

// Rota exibida quando o projeto ainda não tem uma versão no ar (live_url vazio).
export const UNDER_CONSTRUCTION_ROUTE = "/em-construcao";

export const fallbackProjects = [
  {
    id: "fallback-1",
    title: "PrimeGarage",
    description:
      "Sistema de gestão para lava-jatos, que centraliza os atendimentos, serviços, equipe e fluxo de clientes em um só lugar.",
    image_url: "/primeGarage.jpg",
    tech_stack: ["React", "Node.js", "PostgreSQL", "Express 5"],
    live_url: "https://youtu.be/3iCAtry303U?si=acA8PlMHtZuiaizK",
    repo_url: "https://github.com/brunotrevizani1/primeGarage.git",
  },
  {
    id: "fallback-2",
    title: "PhotoLumi",
    description:
      "Sistema de gestão para fotógrafas, onde facilita sua rotina e permite uma experiência única para o cliente da fotógrafa.",
    image_url: "/photoLumi.jpg",
    tech_stack: ["Next.js", "React", "PostgreSQL", "Cloudflare", "Resend"],
    live_url: "https://photolumi.com.br",
    repo_url: PRIVATE_REPO_ROUTE,
  },
  {
    id: "fallback-3",
    title: "E-commerce Headless",
    description:
      "Loja virtual performática com CMS headless, carrinho persistente e checkout otimizado.",
    image_url: null,
    tech_stack: ["React", "TypeScript", "Node.js"],
    live_url: "",
    repo_url: "",
  },
  {
    id: "fallback-4",
    title: "Painel de Monitoramento",
    description:
      "Dashboard interno para acompanhar métricas de infraestrutura em tempo real, com alertas configuráveis.",
    image_url: null,
    tech_stack: ["React", "Node.js", "MySQL"],
    live_url: "#",
    repo_url: "",
  },
  {
    id: "fallback-5",
    title: "API de Gestão de Pedidos",
    description:
      "API REST para controle de pedidos, estoque e integração com sistemas de entrega, hospedada no Railway.",
    image_url: null,
    tech_stack: ["Node.js", "PostgreSQL", "Railway"],
    live_url: "#",
    repo_url: "",
  },
];
