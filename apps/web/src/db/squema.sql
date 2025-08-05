-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de formulários
create table if not exists formulario (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  ordem integer default 0
);

-- Tabela de perguntas
create table if not exists pergunta (
  id uuid primary key default gen_random_uuid(),
  id_formulario uuid references formulario(id) on delete cascade,
  titulo text not null,
  codigo text,
  orientacao_resposta text,
  ordem integer default 0,
  obrigatoria boolean default false,
  sub_pergunta boolean default false,
  tipo_pergunta text check (
    tipo_pergunta in (
      'sim_nao',
      'multipla_escolha',
      'unica_escolha',
      'texto_livre',
      'inteiro',
      'float'
    )
  ) not null
);

-- Tabela de opções de resposta
create table if not exists opcoes_respostas (
  id uuid primary key default gen_random_uuid(),
  id_pergunta uuid references pergunta(id) on delete cascade,
  resposta text not null,
  ordem integer default 0,
  resposta_aberta boolean default false
);

CREATE TABLE IF NOT EXISTS opcoes_resposta_pergunta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_opcoes_respostas UUID NOT NULL,
  id_pergunta UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Registro de usuários respondendo formulários
create table if not exists resposta_usuario (
  id uuid primary key default gen_random_uuid(),
  id_formulario uuid references formulario(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Resposta para cada pergunta
create table if not exists resposta_pergunta (
  id uuid primary key default gen_random_uuid(),
  id_resposta_usuario uuid references resposta_usuario(id) on delete cascade,
  id_pergunta uuid references pergunta(id) on delete cascade,

  -- para perguntas abertas
  resposta_texto text,
  resposta_numero float,

  -- para perguntas fechadas
  id_opcao_escolhida uuid references opcoes_respostas(id) on delete set null
);

-- Condicionalidade
create table if not exists condicionalidade (
  id uuid primary key default gen_random_uuid(),
  id_pergunta_condicional uuid references pergunta(id) on delete cascade,
  id_opcao_ativa uuid references opcoes_respostas(id) on delete cascade,
  id_pergunta_exibida uuid references pergunta(id) on delete cascade
);