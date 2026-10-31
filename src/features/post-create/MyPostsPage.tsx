import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  KindBadge,
  StatusBadge,
  FullState,
  PageHeader,
  EmptyState,
  formatRelativeDate,
} from '../../shared/ui';
import { TrashIcon, ArrowRightIcon, EditIcon } from '../../shared/ui/icons';

export default function MyPostsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', 'mine'],
    queryFn: () => api.posts.list({ mine: true }),
  });

  const posts = data?.items ?? [];

  const remove = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;
    await api.posts.remove(id);
    await queryClient.invalidateQueries({ queryKey: ['posts', 'mine'] });
  };

  if (isLoading) {
    return <FullState variant="loading" title="Carregando suas publicações..." />;
  }
  if (error) {
    return <FullState variant="error" title="Erro ao carregar" onRetry={() => void refetch()} />;
  }
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <PageHeader title="Minhas publicações" subtitle="Gerencie suas publicações" action={
          <a href="/posts/new">
            <Button size="sm">Nova publicação</Button>
          </a>
        } />
        <EmptyState
          title="Nenhuma publicação"
          description="Você ainda não criou nenhuma publicação."
          action={{ label: 'Criar primeira publicação', onClick: () => window.location.href = '/posts/new' }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title="Minhas publicações"
        subtitle={`${posts.length} publicação${posts.length !== 1 ? 'ões' : ''} criada${posts.length !== 1 ? 's' : ''}`}
        action={
          <a href="/posts/new">
            <Button size="sm">Nova publicação</Button>
          </a>
        }
      />

      <div className="space-y-3" role="list" aria-label="Minhas publicações">
        {posts.map((post) => (
          <Card key={post.id} variant="default" padding="none" className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <KindBadge kind={post.kind} />
                    <StatusBadge status={post.status} />
                  </div>
                  <h3 className="mt-2 font-semibold text-slate-900 truncate">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{formatRelativeDate(post.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <IconButton
                    aria-label="Ver detalhes"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `/posts/${post.id}`}
                  >
                    <ArrowRightIcon size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="Editar publicação"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `/posts/${post.id}/edit`}
                  >
                    <EditIcon size={18} />
                  </IconButton>
                  <IconButton
                    aria-label="Excluir publicação"
                    variant="danger"
                    size="sm"
                    onClick={() => void remove(post.id)}
                  >
                    <TrashIcon size={18} />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}