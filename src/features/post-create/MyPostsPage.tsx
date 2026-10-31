import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { FullState } from '../../shared/ui/FullState';

export default function MyPostsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', 'mine'],
    queryFn: () => api.posts.list({ mine: true }),
  });

  const posts = data?.items ?? [];

  const remove = async (id: string) => {
    await api.posts.remove(id);
    await queryClient.invalidateQueries({ queryKey: ['posts', 'mine'] });
  };

  if (isLoading) {
    return <FullState variant="loading" />;
  }
  if (error) {
    return <FullState variant="error" onRetry={() => void refetch()} />;
  }
  if (posts.length === 0) {
    return <FullState variant="empty" description="Você ainda não criou publicações." />;
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h2 className="mb-4 text-xl font-bold">Minhas publicações</h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between gap-4 rounded border border-slate-200 bg-white p-4"
          >
            <div>
              <span className="text-xs uppercase text-slate-500">
                {post.kind === 'LOST' ? 'Perdido' : 'Achado'}
              </span>
              <h3 className="font-semibold">{post.title}</h3>
              <span className="text-xs text-slate-600">{post.status}</span>
            </div>
            <button
              type="button"
              onClick={() => void remove(post.id)}
              className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
