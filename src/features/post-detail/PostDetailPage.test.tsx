import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostDetailPage from './PostDetailPage';
import { api } from '../../api';
import type { CommentView } from '../../api/ports';

vi.mock('../../api', () => ({
  api: {
    posts: {
      get: vi.fn(),
    },
    comments: {
      list: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
    },
    claims: {
      request: vi.fn(),
    },
    auth: {
      me: vi.fn(),
    },
  },
}));

const getMock = vi.mocked(api.posts.get);
const listMock = vi.mocked(api.comments.list);
const addMock = vi.mocked(api.comments.add);
const removeMock = vi.mocked(api.comments.remove);
const meMock = vi.mocked(api.auth.me);

const post = {
  id: 'p-found-1',
  kind: 'FOUND' as const,
  status: 'OPEN' as const,
  title: 'Fone de ouvido preto',
  description: 'Encontrei um fone de ouvido preto na área do Bloco A.',
  photoUrls: [],
  locationId: 'loc-bloco-a',
  approxDate: '2026-10-28T12:00:00.000Z',
  custody: 'GUARITA' as const,
  authorId: 'u-rafael',
  hidden: false,
  createdAt: '2026-10-28T14:30:00.000Z',
  updatedAt: '2026-10-28T14:30:00.000Z',
  author: { id: 'u-rafael', displayName: 'Rafael' },
};

const comment: CommentView = {
  id: 'c-1',
  postId: 'p-found-1',
  authorId: 'u-marina',
  text: 'Vi um fone na garricha do Bloco A.',
  createdAt: '2026-10-28T15:00:00.000Z',
  author: { id: 'u-marina', displayName: 'Marina' },
};

function renderDetail() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/posts/p-found-1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PostDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockResolvedValue(post);
    listMock.mockResolvedValue([comment]);
    addMock.mockResolvedValue(comment);
    removeMock.mockResolvedValue(undefined);
    meMock.mockResolvedValue({ id: 'u-marina', displayName: 'Marina', role: 'USER' });
  });

  afterEach(() => {
    cleanup();
  });

  it('renderiza os dados da publicação', async () => {
    renderDetail();
    expect(await screen.findByText('Fone de ouvido preto')).toBeInTheDocument();
    expect(
      screen.getByText('Encontrei um fone de ouvido preto na área do Bloco A.'),
    ).toBeInTheDocument();
  });

  it('renderiza comentários e permite adicionar o próprio', async () => {
    const user = userEvent.setup();
    renderDetail();
    expect(await screen.findByText('Vi um fone na garricha do Bloco A.')).toBeInTheDocument();

    const textarea = screen.getByLabelText('Comentário');
    await user.type(textarea, 'Encontrei também o estojo.');
    await user.click(screen.getByRole('button', { name: 'Comentar' }));

    await waitFor(() =>
      expect(addMock).toHaveBeenCalledWith('p-found-1', 'Encontrei também o estojo.'),
    );
  });
});
