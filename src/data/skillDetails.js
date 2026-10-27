// Texto de cada livro da estante de Skills (página "Especificações").
// Edite livremente: a chave é o nome da skill em placeholders.js.
// facts: [rótulo, valor] — aparecem como linhas na página da direita.

export const skillDetails = {
  React: {
    tagline: 'Interfaces feitas de componentes',
    description:
      'Biblioteca JavaScript para construir interfaces de usuário a partir de componentes reutilizáveis, com estado e renderização declarativa.',
    facts: [
      ['Tipo', 'Biblioteca front-end'],
      ['Para quê', 'Telas interativas e aplicações de página única'],
      ['Combina com', 'Next.js, TypeScript, Tailwind CSS'],
    ],
  },
  JavaScript: {
    tagline: 'A linguagem da web',
    description:
      'Linguagem de programação presente nos navegadores e nos servidores, base de praticamente todo o desenvolvimento web moderno.',
    facts: [
      ['Tipo', 'Linguagem de programação'],
      ['Para quê', 'Lógica de interfaces, APIs e automações'],
      ['Combina com', 'React, Node.js, TypeScript'],
    ],
  },
  TypeScript: {
    tagline: 'JavaScript com tipos',
    description:
      'Superconjunto do JavaScript que adiciona tipagem estática, ajudando a achar erros cedo e a manter projetos grandes organizados.',
    facts: [
      ['Tipo', 'Linguagem tipada'],
      ['Para quê', 'Código mais seguro e fácil de manter'],
      ['Combina com', 'React, Node.js, Next.js'],
    ],
  },
  'Tailwind CSS': {
    tagline: 'Estilo direto no componente',
    description:
      'Framework CSS utilitário: o visual é montado com classes pequenas e consistentes, sem precisar sair do componente.',
    facts: [
      ['Tipo', 'Framework CSS'],
      ['Para quê', 'Interfaces responsivas e consistentes, rápido'],
      ['Combina com', 'React, Next.js, Vite'],
    ],
  },
  'Next.js': {
    tagline: 'React com superpoderes',
    description:
      'Framework React com roteamento, renderização no servidor e otimizações prontas para produção.',
    facts: [
      ['Tipo', 'Framework full stack'],
      ['Para quê', 'Sites rápidos e aplicações com bom SEO'],
      ['Combina com', 'React, TypeScript, Vercel'],
    ],
  },
  'Node.js': {
    tagline: 'JavaScript no servidor',
    description:
      'Ambiente que executa JavaScript fora do navegador, usado para criar APIs, serviços e ferramentas de linha de comando.',
    facts: [
      ['Tipo', 'Ambiente de execução'],
      ['Para quê', 'APIs, back-end e automações'],
      ['Combina com', 'Express, PostgreSQL, REST APIs'],
    ],
  },
  Express: {
    tagline: 'Servidor web minimalista',
    description:
      'Framework enxuto para Node.js que simplifica rotas, middlewares e a construção de APIs HTTP.',
    facts: [
      ['Tipo', 'Framework back-end'],
      ['Para quê', 'Rotas e APIs REST'],
      ['Combina com', 'Node.js, PostgreSQL, MySQL'],
    ],
  },
  PostgreSQL: {
    tagline: 'Banco relacional robusto',
    description:
      'Banco de dados relacional open source, conhecido pela confiabilidade, pela integridade dos dados e pelos recursos avançados de SQL.',
    facts: [
      ['Tipo', 'Banco de dados SQL'],
      ['Para quê', 'Dados estruturados e consultas complexas'],
      ['Combina com', 'Node.js, Express, Neon'],
    ],
  },
  MySQL: {
    tagline: 'O clássico dos bancos SQL',
    description:
      'Banco de dados relacional muito difundido, presente em grande parte das aplicações web.',
    facts: [
      ['Tipo', 'Banco de dados SQL'],
      ['Para quê', 'Armazenar e consultar dados relacionais'],
      ['Combina com', 'PHP, Node.js, Express'],
    ],
  },
  Neon: {
    tagline: 'Postgres serverless',
    description:
      'Plataforma de PostgreSQL serverless, com escala automática e ramificação de bancos para desenvolvimento.',
    facts: [
      ['Tipo', 'Banco como serviço'],
      ['Para quê', 'Postgres na nuvem sem gerenciar servidor'],
      ['Combina com', 'Vercel, Node.js, PostgreSQL'],
    ],
  },
  'REST APIs': {
    tagline: 'A conversa entre sistemas',
    description:
      'Estilo de arquitetura para expor dados e ações por HTTP, com recursos, verbos e códigos de status claros.',
    facts: [
      ['Tipo', 'Arquitetura de API'],
      ['Para quê', 'Integrar front-end, back-end e serviços'],
      ['Combina com', 'Node.js, Express, JSON'],
    ],
  },
  Git: {
    tagline: 'O histórico de cada mudança',
    description:
      'Sistema de controle de versão distribuído que registra a evolução do código e facilita o trabalho em equipe.',
    facts: [
      ['Tipo', 'Controle de versão'],
      ['Para quê', 'Versionar, ramificar e colaborar'],
      ['Combina com', 'GitHub, Vercel, Railway'],
    ],
  },
  Vercel: {
    tagline: 'Deploy a cada push',
    description:
      'Plataforma de hospedagem e deploy focada em front-end e funções serverless, com publicação automática a cada commit.',
    facts: [
      ['Tipo', 'Hospedagem e deploy'],
      ['Para quê', 'Publicar sites e APIs serverless'],
      ['Combina com', 'Next.js, Neon, Git'],
    ],
  },
  Railway: {
    tagline: 'Infra sem dor de cabeça',
    description:
      'Plataforma para publicar serviços, APIs e bancos de dados na nuvem com configuração mínima.',
    facts: [
      ['Tipo', 'Hospedagem de back-end'],
      ['Para quê', 'APIs e bancos em produção'],
      ['Combina com', 'Node.js, PostgreSQL, Git'],
    ],
  },
  'VPS Hostinger': {
    tagline: 'Meu próprio servidor',
    description:
      'Servidor virtual privado da Hostinger, onde publico aplicações com controle total do ambiente, do sistema operacional à configuração do servidor.',
    facts: [
      ['Tipo', 'Servidor virtual (VPS)'],
      ['Para quê', 'Hospedar aplicações com controle total'],
      ['Combina com', 'Linux, Node.js, Git'],
    ],
  },
  Cloudflare: {
    tagline: 'Rede, DNS e proteção',
    description:
      'Serviços de CDN, DNS e segurança que deixam sites mais rápidos e protegidos.',
    facts: [
      ['Tipo', 'CDN e segurança'],
      ['Para quê', 'DNS, cache e proteção de sites'],
      ['Combina com', 'Vercel, domínios próprios'],
    ],
  },
}
