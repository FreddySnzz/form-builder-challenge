# 📝 Projeto de Formulários Dinâmicos

Este projeto é uma aplicação fullstack construída com **Next.js**, **TailwindCSS**, **Shadcn/UI**, **Supabase** e **SQLite**, permitindo a criação de formulários dinâmicos com perguntas condicionais, múltiplas opções de resposta e visualização das respostas dos usuários.

## 🚀 Funcionalidades

- Criação e edição de formulários
- Perguntas com tipos variados: texto, número, múltipla escolha, única escolha, sim/não
- Condicionalidade entre perguntas (exibição baseada em respostas anteriores)
- Interface responsiva e moderna com Shadcn/UI
- Integração com Supabase para persistência dos dados

---

## ✅ Pré-requisitos

Antes de começar, verifique se você tem os seguintes requisitos instalados:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) (ou [Yarn](https://yarnpkg.com/))

> **Importante:** Você também precisará de uma instância do [Supabase](https://supabase.com/) configurada com as tabelas esperadas.

---

## 📥 Clonando o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

## 📦 Instalando as dependências
Com npm:

```bash
npm install
```

Ou com Yarn:

```bash
yarn
```

## ⚙️ Configurando o ambiente
Crie um arquivo .env na pasta web do projeto com as seguintes variáveis (sendo ./apps/web):

```env
NEXT_PUBLIC_SUPABASE_URL=https://nchhcwqpbrgyqbckboro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jaGhjd3FwYnJneXFiY2tib3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDcyNjMsImV4cCI6MjA2OTk4MzI2M30.qWdyCvmHCZS-QRqLxbO_IwpLi4MwBpPy2hg11gTVmp0

```

## 🧪 Rodando o projeto localmente
```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## 🏁 Comando rápido
Se quiser pular tudo e rodar direto, após clonar:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
cp .env.example .env  # ou crie manualmente
npm install
npm run dev
```

## 🧑‍💻 Tecnologias Utilizadas
- Next.js

- TailwindCSS

- Shadcn/UI

- React Icons

- Supabase

- TypeScript

## 🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou pull request.

## 📄 Licença
Este projeto está sob a licença MIT.
