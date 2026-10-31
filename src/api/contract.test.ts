import { describe, expect, it } from 'vitest';
import { createMockApi } from './mock';
import { ApiError } from './errors';
import type { Api, CreatePostInput } from './ports';

async function runContractSuite(api: Api): Promise<void> {
  // autenticação: sem sessão -> UNAUTHENTICATED
  await expect(api.posts.list({ status: 'OPEN' })).rejects.toMatchObject({
    code: 'UNAUTHENTICATED',
  });

  const user = await api.auth.login({
    method: 'INSTITUTIONAL_EMAIL',
    identifier: 'marina@campus.edu.br',
    password: 'demo123',
  });

  // criação com validação (custody obrigatória em FOUND)
  const invalidInput: CreatePostInput = {
    kind: 'FOUND',
    title: 'x',
    description: 'desc',
    locationId: 'loc-bloco-a',
    approxDate: '2026-10-30T00:00:00.000Z',
  };
  await expect(api.posts.create(invalidInput)).rejects.toBeInstanceOf(ApiError);

  const post = await api.posts.create({
    kind: 'FOUND',
    title: 'Fone de ouvido preto',
    description: 'Encontrei um fone de ouvido preto na área do Bloco A.',
    locationId: 'loc-bloco-a',
    approxDate: '2026-10-28T12:00:00.000Z',
    custody: 'GUARITA',
  });

  const fetched = await api.posts.get(post.id);
  expect(fetched.id).toBe(post.id);
  expect(user.id).toBe('u-marina');

  // fluxo de transição OPEN -> IN_PROGRESS -> RESOLVED
  const inProgress = await api.posts.transition(post.id, 'IN_PROGRESS');
  expect(inProgress.status).toBe('IN_PROGRESS');

  const resolved = await api.posts.transition(post.id, 'RESOLVED', 'RETURNED');
  expect(resolved.status).toBe('RESOLVED');
  expect(resolved.resolution).toBe('RETURNED');

  // transições inválidas: RESOLVED -> IN_PROGRESS não existe; RESOLVED exige desfecho
  await expect(api.posts.transition(post.id, 'IN_PROGRESS')).rejects.toMatchObject({
    code: 'INVALID_TRANSITION',
  });
  await expect(api.posts.transition(post.id, 'RESOLVED')).rejects.toMatchObject({
    code: 'VALIDATION',
  });

  // publicação inexistente
  await expect(api.posts.get('p-inexistente')).rejects.toMatchObject({ code: 'NOT_FOUND' });
}

describe('suíte de contrato do adaptador', () => {
  it('o adaptador mock atende ao contrato atual', async () => {
    await runContractSuite(createMockApi({ latencyMs: 0 }));
  });

  it('retorna usuário autenticado a partir da sessão', async () => {
    const api = createMockApi({ latencyMs: 0 });
    await api.auth.login({
      method: 'MATRICULA',
      identifier: '2026001',
      password: 'demo123',
    });
    const me = await api.auth.me();
    expect(me?.id).toBe('u-marina');
  });
});
