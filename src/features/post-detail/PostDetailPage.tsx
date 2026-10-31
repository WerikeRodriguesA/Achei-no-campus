import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { CommentView, Location } from '../../api/ports';
import { FullState } from '../../shared/ui/FullState';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => api.posts.get(id as string),
    enabled: Boolean(id),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => api.comments.list(id as string),
    enabled: Boolean(id),
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.posts.locations(),
  });
  const locations: Location[] = locationsData ?? [];
  const location = locations.find((item) => item.id === post?.locationId);

  const { data: currentUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
  });

  if (isLoading) {
    return <FullState variant="loading" />;
  }
  if (error) {
    return <FullState variant="error" onRetry={() => void refetch()} />;
  }
  if (!post) {
    return <FullState variant="not-found" />;
  }

  const addComment = async () => {
    const text = commentText.trim();
    if (!text) {
      return;
    }
    await api.comments.add(post.id, text);
    setCommentText('');
    await queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
  };

  const removeComment = async (commentId: string) => {
    await api.comments.remove(commentId);
    await queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
  };

  const requestClaim = async () => {
    const message = window.prompt('Mensagem de reivindicação (10 a 500 caracteres):');
    if (!message) {
      return;
    }
    await api.claims.request(post.id, message);
  };

  const canComment =
    post.status !== 'RESOLVED' &&
    !post.hidden &&
    Boolean(currentUser) &&
    post.authorId !== currentUser?.id;

  const sortedComments: CommentView[] = [...(comments ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="mx-auto max-w-5xl p-4">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-4 rounded border border-slate-300 px-3 py-1 text-sm"
      >
        Voltar ao feed
      </button>
      <article className="rounded border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white uppercase">
            {post.kind === 'LOST' ? 'Perdido' : 'Achado'}
          </span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs uppercase text-slate-700">
            {post.status}
          </span>
        </div>
        <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{post.description}</p>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="font-semibold">Local:</dt>
            <dd>{location?.name ?? post.locationId}</dd>
          </div>
          {post.custody ? (
            <div>
              <dt className="font-semibold">Local de guarda:</dt>
              <dd>{post.custody === 'GUARITA' ? 'Garricha/GUARITA' : 'Disciplina/DISCIPLINA'}</dd>
            </div>
          ) : null}
          {post.resolution ? (
            <div>
              <dt className="font-semibold">Desfecho:</dt>
              <dd>{post.resolution}</dd>
            </div>
          ) : null}
          <div>
            <dt className="font-semibold">Autor:</dt>
            <dd>{post.author.displayName}</dd>
          </div>
        </dl>
      </article>

      <section className="mt-6 rounded border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-semibold">Comentários e pistas</h3>
        {commentsLoading ? (
          <FullState variant="loading" />
        ) : sortedComments.length === 0 ? (
          <FullState variant="empty" />
        ) : (
          <ul className="space-y-3">
            {sortedComments.map((comment) => (
              <li key={comment.id} className="rounded bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{comment.author.displayName}</span>
                  {currentUser && comment.authorId === currentUser.id ? (
                    <button
                      type="button"
                      onClick={() => void removeComment(comment.id)}
                      className="text-xs text-red-600 underline"
                    >
                      Remover comentário
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
        {canComment ? (
          <div className="mt-4 flex flex-col gap-2">
            <textarea
              aria-label="Comentário"
              className="w-full rounded border border-slate-300 p-2 text-sm"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Escreva uma pista…"
            />
            <button
              type="button"
              onClick={() => void addComment()}
              className="self-start rounded bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Comentar
            </button>
          </div>
        ) : null}
        {post.kind === 'FOUND' &&
        post.status === 'OPEN' &&
        currentUser &&
        post.authorId !== currentUser.id ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => void requestClaim()}
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Solicitar reivindicação
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
