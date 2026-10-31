# Guia de Edição — Achei no Campus v0.1

> Este guia ensina como fazer alterações comuns no protótipo sem recriar nada.
> Público-alvo: estudantes aprendendo TypeScript/React.

---

## 1. Trocar nome do app, cor da marca e textos

### Nome do app
**Arquivo:** `src/app/layout.tsx` (linha 9)
```tsx
<h1 className="text-lg font-bold text-slate-900">Achei no Campus</h1>
```

### Cor da marca (paleta principal)
**Arquivo:** `src/index.css` (bloco `@theme`, linhas 5-16)
```css
--color-brand-500: #3b82f6;  /* cor principal — mude este valor */
```
Toda a escala (`--color-brand-50` a `--color-brand-950`) deriva desta cor. Para gerar uma nova escala, use ferramentas como [Tailwind Color Generator](https://uicolors.app/create).

### Textos da interface
**Arquivo:** `src/shared/strings.ts` (ainda não existe — crie se quiser centralizar)
Atualmente os textos estão espalhados nos componentes. Para centralizar:
1. Crie `src/shared/strings.ts` com objetos agrupados por funcionalidade
2. Importe e use nos componentes

---

## 2. Trocar locais, usuários e publicações de demonstração

### Locais (seed)
**Arquivo:** `src/api/mock/seed.ts` (array `SEED_LOCATIONS`, linhas 11-20)
```ts
export const SEED_LOCATIONS: Location[] = [
  { id: 'loc-bloco-a', name: 'Bloco A' },
  { id: 'loc-biblioteca', name: 'Biblioteca' },
  // adicione/remova conforme necessário
];
```

### Usuários de demonstração
**Arquivo:** `src/api/mock/seed.ts` (array `SEED_USERS`, linhas 5-9)
```ts
export const SEED_USERS: User[] = [
  { id: 'u-marina', displayName: 'Marina', role: 'USER' },
  { id: 'u-rafael', displayName: 'Rafael', role: 'USER' },
  { id: 'u-moderacao', displayName: 'Equipe de Moderação', role: 'MODERATOR' },
];
```
**Credenciais de login** (mesmo arquivo, objeto `SEED_IDENTIFIERS`, linhas 233-240):
```ts
export const SEED_IDENTIFIERS: Record<string, string> = {
  'marina@campus.edu.br': 'u-marina',
  '2026001': 'u-marina',
  'rafael@campus.edu.br': 'u-rafael',
  '2026002': 'u-rafael',
  'moderacao@campus.edu.br': 'u-moderacao',
  '2026003': 'u-moderacao',
};
```
Senha padrão: `demo123` (constante `DEMO_PASSWORD`, linha 3).

### Publicações de demonstração
**Arquivo:** `src/api/mock/seed.ts` (array `SEED_POSTS`, linhas 27-177)
Cada publicação segue a interface `Post` (`src/domain/types.ts`). Campos obrigatórios:
- `kind`: `'LOST' | 'FOUND'`
- `status`: `'OPEN' | 'IN_PROGRESS' | 'RESOLVED'`
- `title`, `description`, `locationId`, `approxDate` (ISO string)
- `custody`: `'GUARITA' | 'DISCIPLINA'` (apenas FOUND)
- `photoUrls`: array de data URLs SVG (use a função `svgPhoto` do seed)

---

## 3. Mudar um limite de validação

Os limites vivem em **um só lugar** e são compartilhados entre Zod (cliente) e mock (servidor).

**Arquivo:** `src/domain/limits.ts` (ainda não existe — **crie este arquivo**)

```ts
// src/domain/limits.ts
export const limits = {
  title: { min: 3, max: 80 },
  description: { min: 10, max: 1000 },
  photos: { max: 3 },
  approxDate: { future: false },
  comment: { min: 1, max: 500 },
  claimMessage: { min: 10, max: 500 },
  reportReason: { min: 5, max: 300 },
  displayName: { min: 3 },
} as const;
```

Depois, importe e use em:
- `src/features/post-create/PostCreatePage.tsx` (schemas Zod)
- `src/api/mock/index.ts` (função `validateCreate`)

---

## 4. Adicionar um campo a uma publicação

**Ordem exata dos arquivos a alterar:**

1. **Tipo no domain** → `src/domain/types.ts`
   ```ts
   export interface Post {
     // ...campos existentes
     novoCampo?: string;  // adicione aqui
   }
   ```

2. **Schema Zod** → `src/features/post-create/PostCreatePage.tsx`
   ```ts
   const createPostSchema = z.object({
     // ...campos existentes
     novoCampo: z.string().optional(),
   });
   ```

3. **Mock (create/update)** → `src/api/mock/index.ts`
   - Na função `validateCreate` adicione validação
   - No `postsApi.create` adicione o campo ao objeto `post`
   - No `postsApi.update` permita atualizar

4. **Formulário** → `src/features/post-create/PostCreatePage.tsx` (JSX)
   Adicione o `<Input />` ou `<Select />` etc. no formulário.

5. **Card e Detalhe** → 
   - `src/features/feed/FeedPage.tsx` (PostCard)
   - `src/features/post-detail/PostDetailPage.tsx` (exibição)

6. **Teste** → `src/api/contract.test.ts` (adicione caso de teste)

---

## 5. Adicionar uma tela e uma rota; adicionar item de navegação

### Nova tela (página)
1. Crie `src/features/nova-funcionalidade/NovaPagina.tsx`
2. Exporte como `default`

### Nova rota
**Arquivo:** `src/app/router.tsx`
```tsx
import NovaPagina from '../features/nova-funcionalidade/NovaPagina';

// dentro do array routes[0].children:
{
  path: 'minha-nova-rota',
  element: (
    <RequireAuth>
      <NovaPagina />
    </RequireAuth>
  ),
},
```

### Item de navegação
**Arquivo:** `src/app/nav.ts` (ainda não existe — crie se quiser centralizar)
Atualmente a navegação está em `src/app/layout.tsx` (header) e no futuro na navegação inferior (mobile) / superior (desktop).

---

## 6. Criar um componente de `shared/ui/` e vê-lo no styleguide

### Passo a passo
1. Crie `src/shared/ui/MeuComponente.tsx`
2. Exporte no `src/shared/ui/index.ts`
3. Adicione uma seção em `src/app/StyleguidePage.tsx` no array `componentSections`
4. Rode `npm run dev` e acesse `/_styleguide`

### Exemplo mínimo
```tsx
// src/shared/ui/MeuComponente.tsx
import { forwardRef } from 'react';
import { cx } from '../utils';

export interface MeuComponenteProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MeuComponente = forwardRef<HTMLDivElement, MeuComponenteProps>(
  ({ variant = 'primary', children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        'rounded-lg p-4',
        variant === 'primary' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

MeuComponente.displayName = 'MeuComponente';
```

---

## 7. Rodar testes e entender uma falha

### Comandos
```bash
npm run test        # roda todos os testes (Vitest)
npm run test:coverage  # com relatório de cobertura
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run build       # build de produção
```

### Entendendo falhas comuns

| Erro | Causa provável | Solução |
|------|----------------|---------|
| `Cannot find module '@/api'` | Import path errado | Use caminhos relativos `../../api` ou configure `tsconfig` paths |
| `Property 'x' does not exist on type 'Y'` | Tipo incompleto | Atualize a interface em `domain/types.ts` |
| `ApiError: VALIDATION` | Dados inválidos no mock | Verifique `validateCreate` em `api/mock/index.ts` |
| `act(...)` warning no teste | Estado assíncrono não aguardado | Use `waitFor` ou `findBy` do Testing Library |
| `no-restricted-imports` no lint | Viola regra de dependência | Features não importam de `api/mock`; domain não importa de fora |

---

## 8. Tabela: Rota → Arquivo da Página → Hooks que usa

| Rota | Arquivo da Página | Hooks TanStack Query (queryKey) |
|------|-------------------|--------------------------------|
| `/` | `src/features/feed/FeedPage.tsx` | `['posts', params]`, `['locations']` |
| `/login` | `src/features/auth/LoginPage.tsx` | — (usa `api.auth.login` direto) |
| `/cadastro` | `src/features/auth/RegisterPage.tsx` | — |
| `/posts/new` | `src/features/post-create/PostCreatePage.tsx` | `['locations']` |
| `/posts/:id` | `src/features/post-detail/PostDetailPage.tsx` | `['posts', 'detail', id]`, `['comments', id]`, `['claims', id]`, `['auth', 'me']`, `['locations']` |
| `/me` | `src/features/post-create/MyPostsPage.tsx` | `['posts', 'mine']` |
| `/moderation` | `src/features/moderation/ModerationPage.tsx` | `['reports', 'open']` |
| `/_styleguide` | `src/app/StyleguidePage.tsx` | — (apenas DEV) |

**Mutations** invalidam as chaves afetadas automaticamente (ex: `create` invalida `['posts', ...]`).

---

## Referências rápidas

- **Arquitetura:** `docs/architecture.md`
- **Premissas:** `docs/assumptions.md`
- **Auditoria:** `docs/audit-v0.1.md`
- **Tokens de design:** `src/index.css` (bloco `@theme`)
- **Componentes UI:** `src/shared/ui/`
- **Contrato da API:** `src/api/ports.ts`
- **Regras de domínio:** `src/domain/post-status.ts`