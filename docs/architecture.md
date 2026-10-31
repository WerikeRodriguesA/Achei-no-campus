# Arquitetura v0.1 — Achei no Campus

Este documento resume a arquitetura do protótipo front-end v0.1 do Achei no Campus e o
porquê de cada decisão tomada.

## Contexto

O produto é uma plataforma de achados e perdidos universitários com dinâmica de feed, para
facilitar a devolução de objetos. O protótipo é uma SPA com dados simulados, restrito ao
Campus Corrente do IFPI, foco no ensino superior. Não há backend nesta fase; a hipótese do
produto ainda não foi validada.

## Decisões

### Stack (§4)

- **App**: SPA com React, TypeScript strict (com `noUncheckedIndexedAccess`) e Vite.
- **Rotas**: React Router.
- **Estado de servidor**: TanStack Query.
- **Formulários**: React Hook Form + Zod.
- **Estilo**: Tailwind CSS.
- **Testes**: Vitest + Testing Library.
- **Qualidade**: ESLint (flat config, typescript-eslint, react-hooks, jsx-a11y) + Prettier.
- **CI**: GitHub Actions (npm ci, lint, typecheck, test, build, com cache).
- **Gerenciador**: npm.

### Estrutura (§5)

```
src/
  app/       # roteador, providers, layout, guardas de rota
  domain/    # tipos, enums, regras puras (sem React, sem I/O)
  api/       # ports, errors, index (escolha do adaptador), mock/, http/, contract.test.ts
  features/  # auth, feed, post-create, post-detail, claims, reports, moderation
  shared/    # UI, hooks, utilitários, strings pt-BR, DemoSwitcher
docs/        # architecture.md, assumptions.md
```

### Regra de dependência (§6)

- `features/` importa de `api/index.ts`, `api/ports.ts`, `api/errors.ts`, `domain/` e `shared/`.
  Nunca de `api/mock/` nem `api/http/`.
- `domain/` não importa nada fora de `domain/`.
- Somente `api/index.ts` importa de `api/mock/`.
- Imposta com `no-restricted-imports` no ESLint e comprovada por teste de lint.

### Modelo de domínio (§7)

Tipos, enums e interfaces definidos em `src/domain/types.ts`. Incluem visões com autor
embutido (`PostView`, `CommentView`, `ClaimView`), evitando N+1 no front-end; o backend real
fará o mesmo (P17).

### Regras e transições (§8)

Regras de domínio confirmadas e transições de estado propostas no v0.1, com
`checkTransition` como função pura (sem I/O), implementada com testes primeiro
(table-driven). No sistema real o servidor é quem decide; a UI apenas reflete.

### Contrato e adaptador (§9–§10)

- Contrato OpenAPI futuro representado por ports e erro tipado (`ApiError` com códigos:
  `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `INVALID_TRANSITION`).
- Paginação por cursor (`Page<T>`).
- Adaptador simulado: estado em memória, persistência em localStorage (chave versionada,
  com Restaurar dados de demonstração), latência artificial de 200–500 ms, autenticação e
  autorização aplicadas como um servidor, fotos via `URL.createObjectURL` em memória.
- Seed fictício (P14), login de demonstração (P15).

### Telas e requisitos de UI (§11)

- Rotas: `/login`, `/cadastro`, `/`, `/posts/new`, `/posts/:id`, `/me`, `/moderation`.
- Faixa fixa de protótipo: "PROTÓTIPO: dados simulados."
- Mobile-first; acessibilidade básica (HTML semântico, labels, foco visível, contraste, teclado).
- Cinco estados de tela de dados: carregando, vazio, erro com tentar de novo, sem permissão e
  não encontrado. ErrorBoundary global.

## Próximos passos

- Implementar as fatias conforme `docs/issues/` ou issues do GitHub, em ordem.
- Substituir o adaptador mock pelo HTTP real quando houver backend.
