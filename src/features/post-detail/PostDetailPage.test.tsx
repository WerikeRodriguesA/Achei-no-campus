import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostDetailPage from './PostDetailPage';
import { api } from '../../api';
import type { CommentView, ClaimView } from '../../api/ports';

vi.mock('../../api', () => ({
  api: {
    posts: {
      get: vi.fn(),
      transition: vi.fn(),
    },
    comments: {
      list: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
    },
    claims: {
      request: vi.fn(),
      listForPost: vi.fn(),
      decide: vi.fn(),
      withdraw: vi.fn(),
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
const claimsListMock = vi.mocked(api.claims.listForPost);
const decideMock = vi.mocked(api.claims.decide);
const meMock = vi.mocked(api.auth.me);
const transitionMock = vi.mocked(api.posts.transition);

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

const claim: ClaimView = {
  id: 'cl-1',
  postId: 'p-found-1',
  claimantId: 'u-marina',
  message: 'Tenho o fone comigo agora.',
  status: 'PENDING',
  createdAt: '2026-10-29T10:00:00.000Z',
  claimant: { id: 'u-marina', displayName: 'Marina' },
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
    claimsListMock.mockResolvedValue([claim]);
    decideMock.mockResolvedValue(claim);
    transitionMock.mockResolvedValue(post);
    meMock.mockResolvedValue({ id: 'u-rafael', displayName: 'Rafael', role: 'USER' });
  });

  afterEach(() => {
    cleanup();
  });

  it('renderiza os dados da publicação', async () => {
    renderDetail();
    // O título aparece no PageHeader (h1) - usar o primeiro elemento encontrado
    const titleElements = await screen.findAllByText('Fone de ouvido preto');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[0]).toBeInTheDocument();
    expect(
      screen.getByText('Encontrei um fone de ouvido preto na área do Bloco A.'),
    ).toBeInTheDocument();
  });

  it('renderiza comentários e permite adicionar o próprio', async () => {
    meMock.mockResolvedValue({ id: 'u-marina', displayName: 'Marina', role: 'USER' });
    const user = userEvent.setup();
    renderDetail();
    expect(await screen.findByText('Vi um fone na garricha do Bloco A.')).toBeInTheDocument();

    // O textarea tem id "comment-text" e label "Novo comentário"
    const textarea = screen.getByLabelText('Novo comentário');
    await user.type(textarea, 'Encontrei também o estojo.');
    // Há dois botões "Comentar" - um no SectionHeader (ghost) e outro no form (primary).
    // O do form é o que submete o comentário - usar o último ou o que está próximo do textarea.
    const commentButtons = screen.getAllByRole('button', { name: 'Comentar' });
    const submitButton = commentButtons[commentButtons.length - 1];
    if (submitButton) await user.click(submitButton);

    await waitFor(() =>
      expect(addMock).toHaveBeenCalledWith('p-found-1', 'Encontrei também o estojo.'),
    );
  });

  it('autor vê reivindicações e aceita a reivindicação', async () => {
    const user = userEvent.setup();
    renderDetail();
    expect(await screen.findByText('Aceitar')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aceitar' }));
    await waitFor(() => expect(decideMock).toHaveBeenCalledWith('cl-1', 'ACCEPT'));
  });

  it('autor marca publicação como resolvida com desfecho', async () => {
    const user = userEvent.setup();
    renderDetail();
    // Usar getByRole para pegar apenas o botão, não o h4
    expect(await screen.findByRole('button', { name: 'Marcar como resolvido' })).toBeInTheDocument();

    // O Select tem label "Desfecho"
    await user.selectOptions(screen.getByLabelText('Desfecho'), 'RETURNED');
    await user.click(screen.getByRole('button', { name: 'Marcar como resolvido' }));

    await waitFor(() =>
      expect(transitionMock).toHaveBeenCalledWith('p-found-1', 'RESOLVED', 'RETURNED'),
    );
  });
});