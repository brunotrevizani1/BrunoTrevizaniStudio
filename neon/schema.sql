-- ============================================================================
-- BrunoTrevizaniStudio — Schema do Neon
-- Rode este arquivo inteiro no SQL Editor do seu projeto Neon
-- (console.neon.tech > seu projeto > SQL Editor).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabela: projects
-- Alimenta a seção "Projetos" do site.
-- ----------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  tech_stack text[] not null default '{}',
  live_url text,
  repo_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table projects is 'Projetos exibidos na seção Projetos do portfólio.';

-- ----------------------------------------------------------------------------
-- Tabela: contact_messages
-- Armazena as mensagens enviadas pelo formulário de contato.
-- ----------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table contact_messages is 'Mensagens recebidas pelo formulário de contato do site.';

-- ============================================================================
-- Controle de acesso
-- Não há client-side aqui: leitura de projects e escrita em contact_messages
-- acontecem só pelas funções serverless em /api (que usam a connection string
-- com privilégio total via DATABASE_URL). O browser nunca fala direto com o
-- banco, então não precisamos de Row Level Security como no Supabase.
-- ============================================================================

-- ============================================================================
-- Seed de exemplo (opcional)
-- Descomente e rode se quiser ver dados reais em vez dos placeholders do site.
-- ============================================================================

-- insert into projects (title, description, tech_stack, live_url, repo_url, featured) values
--   ('Plataforma de Gestão Financeira', 'Dashboard completo para controle de receitas e despesas.', array['React', 'Node.js', 'PostgreSQL'], 'https://example.com', 'https://github.com/seu-usuario/projeto', true),
--   ('App de Reservas Online', 'Sistema de agendamento com notificações automáticas.', array['Next.js', 'Neon', 'Stripe'], 'https://example.com', 'https://github.com/seu-usuario/projeto-2', false);
