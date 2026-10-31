import { createMockApi } from './mock';
import type { Api, DemoControls } from './ports';

const apiMode = (import.meta.env.VITE_API_MODE as string | undefined) ?? 'mock';

if (apiMode === 'http') {
  // O adaptador HTTP ainda não existe; deve falhar cedo, com mensagem clara.
  throw new Error('Modo HTTP não implementado no protótipo v0.1. Use VITE_API_MODE=mock (padrão).');
}

const adapter = createMockApi();

export const api: Api = adapter;

// só no modo mock; exposto por api/index.ts como `demo` (null no modo http)
export const demo: DemoControls | null = apiMode === 'mock' ? adapter : null;
