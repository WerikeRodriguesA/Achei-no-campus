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
