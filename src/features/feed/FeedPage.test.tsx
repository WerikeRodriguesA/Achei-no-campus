import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FeedPage from './FeedPage';
import { api } from '../../api';

vi.mock('../../api', () => ({
  api: {
    posts: {
      list: vi.fn(),
      locations: vi.fn(),
    },
  },
}));

const listMock = vi.mocked(api.posts.list);
const locationsMock = vi.mocked(api.posts.locations);

const postView = {
  id: 'p-found-1',
  kind: 'FOUND' as const,
  status: 'OPEN' as const,
  title: 'Fone de ouvido preto',
  description: 'Encontrei um fone de ouvido preto na área do Bloco A.',
  photoUrls: [],
  locationId: 'loc-bloco-a',
  approxDate: '2026-10-28T12:00:00.000Z',
  authorId: 'u-rafael',
  hidden: false,
  createdAt: '2026-10-28T14:30:00.000Z',
  updatedAt: '2026-10-28T14:30:00.000Z',
  author: { id: 'u-rafael', displayName: 'Rafael' },
};

function renderFeed() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<FeedPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listMock.mockResolvedValue({ items: [postView], nextCursor: null });
    locationsMock.mockResolvedValue([]);
  });

  it('renderiza publicações do feed', async () => {
    renderFeed();
    // O título aparece dentro do Card/Link
    expect(await screen.findByText('Fone de ouvido preto')).toBeInTheDocument();
  });

  it('aplica filtro por tipo na busca ao adaptador', async () => {
    const user = userEvent.setup();
    renderFeed();
    await screen.findByText('Fone de ouvido preto');

    // O Select component usa label "Tipo"
    await user.selectOptions(screen.getByLabelText('Tipo'), 'FOUND');
    expect(listMock).toHaveBeenLastCalledWith(expect.objectContaining({ kind: 'FOUND' }));
  });
});