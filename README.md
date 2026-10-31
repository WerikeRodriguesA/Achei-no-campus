# Achei no Campus

Plataforma de achados e perdidos universitários com dinâmica de feed, para facilitar a
devolução de objetos entre a comunidade acadêmica.

Protótipo front-end (SPA com React, TypeScript e Vite) com dados simulados, restrito ao
Campus Corrente do IFPI, foco no ensino superior.

## Como rodar

```bash
npm install
npm run dev
```

## Scripts

| Comando           | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento (Vite) |
| `npm run build`   | Build de produção                  |
| `npm run preview` | Preview do build                   |
| `npm run test`    | Testes (Vitest)                    |
| `npm run lint`    | Lint (ESLint)                      |

## Estrutura

```
src/
  app/        # roteador, providers, layout, guardas de rota
  domain/     # tipos, enums, regras puras
  api/        # ports, errors, adaptador (mock/http), contrato
  features/   # auth, feed, post-create, post-detail, claims, reports, moderation
  shared/     # UI, hooks, utilitários, strings
docs/         # architecture.md, assumptions.md
```

## Protótipo

Este protótipo ainda não possui backend. A API é substituída por um adaptador simulado
(mock) com latência e persistência em memória/localStorage.

Consulte `docs/architecture.md` e `docs/assumptions.md` para a arquitetura v0.1.

## Trocar o adaptador (mock ↔ HTTP)

O adaptador é selecionado em `src/api/index.ts`:

```ts
// Troque a importação conforme o ambiente
import { mockApi as api } from './mock';  // Desenvolvimento (padrão)
// import { httpApi as api } from './http'; // Produção (com backend real)
```

O mock persiste dados em `localStorage` (chave `achei-no-campus:v1`). Para resetar:
```ts
// No console do navegador
localStorage.removeItem('achei-no-campus:v1');
location.reload();
```

Também há `demo.reset()` disponível no console quando `import.meta.env.DEV`.

## Verificar regra de dependência

A regra é imposta pelo ESLint (`no-restricted-imports`) e testada em `src/test/dependency-rule-lint.test.ts`.

```bash
npm run lint
# Deve passar sem erros de 'no-restricted-imports'
```

Regras principais:
- `features/` importa de `api/index.ts`, `api/ports.ts`, `api/errors.ts`, `domain/`, `shared/`
- `features/` **não** importa de `api/mock/` nem `api/http/`
- `domain/` não importa de fora de `domain/`
- Só `api/index.ts` importa de `api/mock/`

## Dados de demonstração

| Perfil | E-mail / Matrícula | Senha | Role |
| ------ | ------------------ | ----- | ---- |
| Marina | marina@campus.edu.br / 2026001 | demo123 | USER |
| Rafael | rafael@campus.edu.br / 2026002 | demo123 | USER |
| Moderação | moderacao@campus.edu.br / 2026003 | demo123 | MODERATOR |

## Rotas

| Rota | Página | Acesso |
| ---- | ------ | ------ |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/` | Feed | Autenticado |
| `/posts/new` | Nova publicação | Autenticado |
| `/posts/:id` | Detalhe da publicação | Autenticado |
| `/posts/:id/edit` | Editar publicação | Autor |
| `/me` | Minhas publicações | Autenticado |
| `/moderation` | Moderação | Moderador |
| `/_styleguide` | Styleguide | Apenas DEV |
