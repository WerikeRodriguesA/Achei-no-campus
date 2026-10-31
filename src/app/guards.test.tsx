import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { RequireModerator } from './guards';
import { api } from '../api';

vi.mock('../api', () => ({
  api: {
    auth: {
      me: vi.fn(),
    },
  },
}));

const meMock = vi.mocked(api.auth.me);

function renderGuard(element: ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RequireModerator>{element}</RequireModerator>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('RequireModerator', () => {
  beforeEach(() => {
    meMock.mockReset();
  });

  it('nega acesso quando o usuário não é moderador', async () => {
    meMock.mockResolvedValue({ id: 'u-rafael', displayName: 'Rafael', role: 'USER' });
    renderGuard(<div>Conteúdo moderador</div>);
    expect(await screen.findByText('Acesso negado')).toBeInTheDocument();
  });

  it('permite acesso quando o usuário é moderador', async () => {
    meMock.mockResolvedValue({ id: 'u-mod', displayName: 'Moderação', role: 'MODERATOR' });
    renderGuard(<div>Conteúdo moderador</div>);
    expect(await screen.findByText('Conteúdo moderador')).toBeInTheDocument();
  });
});
