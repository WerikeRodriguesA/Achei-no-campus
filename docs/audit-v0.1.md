# Auditoria v0.1 — Achei no Campus

**Data**: 31/10/2026
**Auditor**: Engenheiro sênior (TypeScript/React) com o Werike
**Escopo**: Fase 0 — Auditoria antes de qualquer interface nova.

## 1. Método

Comandos executados no repositório (todas as saídas registradas como reais):

| Comando | Resultado |
| --- | --- |
| `npm ci` | ✅ Concluído (apenas avisos de auditoria npm) |
| `npm run lint` | ✅ Limpo (0 erros) |
| `npm run typecheck` | ✅ Limpo |
| `npm run test` | ✅ 9 arquivos / 30 testes, todos passando |
| `npm run build` | ✅ Sucesso (vite build, 16 módulos) |
| `npx prettier --check .` | ✅ Limpo |

Fonte de evidência de código: leitura de `src/`, `docs/`, `.github/workflows/ci.yml`, `README.md`.

## 2. Achado crítico — a aplicação não monta a casca (causa raiz do problema relatado)

**Sintoma reportado pelo Werike**: "o repositório não tem telas".

**Diagnóstico (verificado por leitura e por teste)**:

- `src/main.tsx:3` — `import App from './App';`
- Existe `src/App.tsx` com o placeholder: `return <div>Achei no Campus</div>;`
- Existe o shell real em `src/app/App.tsx` (ErrorBoundary + QueryClientProvider + RouterProvider).
- `src/App.test.tsx` testa o placeholder (`import App from './App'`), não o shell real.
- Nenhum arquivo referencia `src/app/App.tsx`.

**Conclusão**: o entrypoint montava o placeholder; as telas de fato existem em
`src/features/**` e possuem testes, mas estavam inacessíveis na UI real. Este era o defeito
responsável pelo sintoma.

## 3. Tabela de auditoria por fatia (comparação com critérios de aceitação)

| Fatia / Issue | Critério | Evidência | Status |
| --- | --- | --- | --- |
| Slice 1 (#4) | CI verde (npm ci, lint, typecheck, test, build) em PR e push | `.github/workflows/ci.yml` (gatilhos `pull_request` + `push` na `main`; cache npm) | **Parcial**: CI verde verificado; faltava passo de formatação (`prettier --check`) |
| Slice 1 (#4) | TS strict com `noUncheckedIndexedAccess` | `tsconfig.app.json` | **Cumprido** |
| Slice 1 (#4) | README com o que é, como rodar, scripts, estrutura, como trocar adaptador, como verificar regra | `README.md` | **Parcial**: faltam "como trocar o adaptador" e "como verificar a regra de dependência" |
| Slice 2 (#5) | `checkTransition` table-driven | `src/domain/post-status.test.ts` (12 casos via `it.each`) | **Cumprido** |
| Slice 2 (#5) | Mock com autorização/validação; erros tipados | `src/api/mock/index.ts`, `src/api/errors.ts` | **Cumprido** (auditoria superficial) |
| Slice 2 (#5) | Contrato via fábrica de adaptador | `src/api/contract.test.ts` | **Cumprido** |
| Slice 2 (#5) | Regra de dependência via lint + teste | `eslint.config.js`, `src/test/dependency-rule-lint.test.ts` | **Parcial**: pattern `^@types/` no domain é ineficaz; **não existe regra** para `api/mock/` → `features/` |
| Slice 3 (#6) | DemoSwitcher troca perfil funciona | `src/shared/DemoSwitcher.tsx`, `src/shared/DemoSwitcher.test.tsx` | **Cumprido** (unidades) |
| Slice 3 (#6) | Rota `/moderation` nega USER | `src/app/guards.tsx`, `src/app/guards.test.tsx` | **Cumprido** (unidades) |
| Slice 3 (#6) | Casca integrada na aplicação | `src/main.tsx` + `src/App.tsx` (placeholder) | **Ausente na integração** — defeito crítico desta rodada |
| Slice 4 (#7) | Filtros combinados funcionam | `src/features/feed/FeedPage.tsx`, mock | **Parcial**: tipo/estado/local OK; **busca textual sem UI** ausente |
| Slice 4 (#7) | Busca por texto (case/acento-insensitive) em título e descrição | mock (`normalize`) | **Cumprido** (mock) / **parcial** (UI ausente) |
| Slice 4 (#7) | Paginação por cursor, 10 itens/página | mock + FeedPage | **Cumprido** |
| Slice 5 (#8) | Ver detalhe, comentar e remover comentário funcionam | `src/features/post-detail/PostDetailPage.tsx`, mock | **Inerte por causa do defeito crítico** (funcionalidade testada, inacessível) |
| Slice 6 (#9) | Só o autor edita/exclui a própria publicação | mock (`update`/`remove` com checagem authorId) | **Parcial**: exclusão OK; **edição de publicação sem UI** |
| Slice 6 (#9) | Validações (Zod no cliente e no mock) por campo | PostCreatePage (RHF+Zod), mock (`validateCreate`) | **Cumprido** |
| Slice 7 (#10) | Fluxo OPEN → IN_PROGRESS → RESOLVED com desfecho | mock (`transition`), `checkTransition`, PostDetailPage | **Cumprido** (código) |
| Slice 7 (#10) | Solicitação de reivindicação visível só ao autor | mock (`listForPost`), PostDetailPage (`isAuthor`) | **Parcial**: visibilidade por atores implementada; cartão "Sua solicitação" do solicitante ausente |

## 4. Correções desta rodada (Fase 0 — PR de auditoria)

Corrigidas no mesmo PR antes de qualquer tela nova:

1. **Defeito crítico — app não montava a casca**: `src/main.tsx` passou a importar o App real de
   `@/app`-equivalente (`./app/App`); placeholder `src/App.tsx` e seu teste removidos; novo
   teste para o shell real em `src/app/`.
2. **ESLint**: pattern do domain corrigido (`^@types/` → `^@` para pacotes externos) e adicionada
   regra `api/mock/**` → `features/`.
3. **Teste de lint**: novos casos — `api/mock/` → `features/` rejeitado; domain → pacote externo
   rejeitado.
4. **CI**: adicionado passo de `prettier --check`.
5. **README**: adicionados dados de demonstração, lista de rotas, troca de adaptador e verificação
   da regra de dependência.
6. **Cobertura**: issue aberta para adicionar provedor de cobertura do Vitest com justificativa.

## 5. Conclusão e próximo passo

- Não havia defeito em `domain/`, `api/ports.ts` ou `api/mock/` que impeça telas; o bloqueio estava
  na integração do shell. Contrato e mock permanecem íntegros para a fase de interface.
- **Próximo passo**: Fase 1 — Fundação visual (UI-1): tokens Tailwind 4 (`@theme`), `src/shared/ui/`
  completo, styleguide em `/_styleguide`, `docs/EDITING_GUIDE.md`.
