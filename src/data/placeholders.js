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
  // cada seção vira uma pasta na área de trabalho do setup (desktop) e um post-it (celular)
  sections: [
    {
      title: "Quem sou eu",
      text: "Meu nome é Bruno e sou apaixonado por tecnologia e desenvolvimento de sistemas, sempre buscando aprender novas ferramentas, aprimorar minhas habilidades e transformar ideias em soluções práticas! Meu objetivo é evoluir profissionalmente e criar projetos que gerem valor para as pessoas.",
    },
    {
      title: "O que faço",
      text: "Atualmente curso ADS no IENH, trabalho na Sinos Tecnologia e desenvolvo projetos pessoais voltados à criação de sistemas e soluções digitais. Busco unir os conhecimentos acadêmicos à experiência prática para evoluir como desenvolvedor e transformar ideias em projetos reais!",
    },
    {
      title: "O que utilizo",
      text: "Utilizo JavaScript, TypeScript, React, Node.js, Express e Next.js para desenvolver aplicações e sistemas. Também trabalho com MySQL e PostgreSQL para bancos de dados, Git e GitHub para versionamento e ferramentas como Vercel, VPS hostinger, Railway, etc... para publicação e hospedagem dos meus projetos.",
    },
    {
      title: "Minha evolução",
      text: "Minha evolução na tecnologia é construída diariamente, por meio dos estudos, da experiência profissional e dos projetos pessoais. Cada desafio representa uma oportunidade de aprender algo novo, aprimorar minhas habilidades e me aproximar dos meus objetivos.",
    },
    {
      title: "Meu objetivo",
      text: "Meu objetivo é crescer profissionalmente na área da tecnologia, aprimorar meus conhecimentos em desenvolvimento de sistemas e transformar minhas ideias em soluções inovadoras, construindo projetos próprios e evoluindo constantemente como profissional.",
    },
    {
      title: "Onde quero chegar",
      text: "Quero construir uma carreira sólida na área da tecnologia, evoluindo como desenvolvedor e tendo a oportunidade de trabalhar em grandes empresas. Ao mesmo tempo, sonho em transformar minhas ideias em negócios próprios, criando startups e soluções que gerem impacto real na vida das pessoas!",
    },
    {
      title: "Fora do código",
      text: "Fora do código, gosto de explorar novas tecnologias, acompanhar as novidades da área e buscar conhecimentos que contribuam para meu crescimento profissional. Também dedico tempo aos meus projetos pessoais, transformando ideias em soluções reais e aprendendo na prática.",
    },
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
  { name: "VPS Hostinger", category: "Ferramentas" },
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
