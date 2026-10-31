import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MyPostsPage from './MyPostsPage';
import { api } from '../../api';

vi.mock('../../api', () => ({
  api: {
    posts: {
      list: vi.fn(),
      remove: vi.fn(),
    },
  },
}));

const listMock = vi.mocked(api.posts.list);
const removeMock = vi.mocked(api.posts.remove);

const post = {
  id: 'p-found-1',
  kind: 'FOUND' as const,
  status: 'OPEN' as const,
  title: 'Fone de ouvido preto',
  description: 'Encontrei um fone de ouvido preto na área do Bloco A.',
  photoUrls: [],
  locationId: 'loc-bloco-a',
  approxDate: '2026-10-28T12:00:00.000Z',
  authorId: 'u-marina',
  hidden: false,
  createdAt: '2026-10-28T14:30:00.000Z',
  updatedAt: '2026-10-28T14:30:00.000Z',
  author: { id: 'u-rafael', displayName: 'Rafael' },
};

describe('MyPostsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listMock.mockResolvedValue({ items: [post], nextCursor: null });
    removeMock.mockResolvedValue(undefined);
  });

  it('renderiza publicações do usuário', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyPostsPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText('Fone de ouvido preto')).toBeInTheDocument();
  });

  it('permite excluir a própria publicação', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MyPostsPage />
      </QueryClientProvider>,
    );
    const removeButton = await screen.findByRole('button', { name: 'Excluir' });
    await user.click(removeButton);
    await waitFor(() => expect(removeMock).toHaveBeenCalledWith('p-found-1'));
  });
});
