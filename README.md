# BrunoTrevizaniStudio

Portfólio pessoal construído com **React + Vite + Tailwind CSS**, dados dinâmicos via **Neon** (Postgres) através de funções serverless na **Vercel**.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/vite`, sem `tailwind.config.js`)
- [Neon](https://neon.tech) — banco de dados Postgres serverless (projetos, mensagens de contato)
- Funções serverless da Vercel (`/api`) — única camada com acesso ao banco
- [lucide-react](https://lucide.dev) — ícones
- Scroll reveal com hook próprio (`useScrollReveal`, baseado em `IntersectionObserver`, sem dependência extra)

## Rodando localmente

```bash
npm install
cp .env.example .env   # depois preencha com a connection string do seu projeto Neon
npm run dev
```

`npm run dev` sobe só o Vite — as rotas `/api` (funções serverless) não ficam disponíveis nesse modo. Para testar o fluxo completo (front + API + banco) localmente, use a [Vercel CLI](https://vercel.com/docs/cli):

```bash
npx vercel dev
```

O site funciona mesmo **sem** o Neon configurado ou sem `vercel dev`: a seção de Projetos cai automaticamente em dados de exemplo (`src/data/placeholders.js`) quando a chamada a `/api/projects` falha.

## Configurando o Neon

1. Crie um projeto em [neon.tech](https://neon.tech).
2. Vá em **SQL Editor** e rode todo o conteúdo de [`neon/schema.sql`](./neon/schema.sql). Isso cria:
   - `projects` — projetos exibidos na seção Projetos.
   - `contact_messages` — mensagens do formulário de contato.
3. Em **Connection Details**, copie a **connection string com pooling** (`...-pooler.<região>.aws.neon.tech`) e cole em `DATABASE_URL` no seu `.env` (veja `.env.example`).
4. (Opcional) No próprio `schema.sql` há um bloco de `insert` comentado com dados de exemplo — descomente e rode se quiser ver conteúdo real rapidamente.

O browser nunca acessa o Neon diretamente: toda leitura/escrita passa pelas funções em `api/projects.js` e `api/contact.js`, que usam `DATABASE_URL` só no servidor.

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string (pooled) do Neon, usada apenas pelas funções serverless em `/api` |

Sem prefixo `VITE_`: essa variável nunca deve ir para o bundle do client.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **New Project** e importe o repositório.
3. A Vercel detecta o framework Vite automaticamente (config já presente em `vercel.json`: build `npm run build`, output `dist`) e as funções em `/api` são publicadas como serverless functions.
4. Em **Settings > Environment Variables**, adicione `DATABASE_URL` com o mesmo valor do seu `.env`.
5. Deploy. Pronto.

## Estrutura

```
api/
├── projects.js        # GET  /api/projects — lista projetos
└── contact.js          # POST /api/contact  — grava mensagem de contato
src/
├── components/         # um componente por seção (Hero, About, Skills, Projects, ...)
│   └── ui/              # componentes de UI reutilizáveis (Section, SectionHeading, Tag)
├── data/placeholders.js  # conteúdo de exemplo + fallback de projetos
└── hooks/useScrollReveal.js
neon/schema.sql          # SQL das tabelas
```

## Scripts

- `npm run dev` — ambiente de desenvolvimento (só front)
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — preview local do build
- `npm run lint` — lint com oxlint
