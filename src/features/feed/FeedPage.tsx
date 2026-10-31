import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { api } from '../../api';
import type { ListPostsParams, Location } from '../../api/ports';
import {
  Button,
  Select,
  FormField,
  Input,
  SkeletonFeedItem,
  FullState,
  PageHeader,
  KindBadge,
  StatusBadge,
} from '../../shared/ui';

export default function FeedPage() {
  const [params, setParams] = useState<ListPostsParams>({ status: 'OPEN' });
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState<string>(params.status ?? '');
  const [locationId, setLocationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => api.posts.list(params),
    placeholderData: keepPreviousData,
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.posts.locations(),
  });
  const locations: Location[] = locationsData ?? [];

  const posts = data?.items ?? [];
  const nextCursor = data?.nextCursor ?? null;

  const applyFilters = (next: Partial<ListPostsParams>) => {
    setParams((current) => ({ ...current, ...next, cursor: undefined }));
  };

  const loadMore = () => {
    if (nextCursor) {
      setParams((current) => ({ ...current, cursor: nextCursor }));
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <PageHeader title="Acheos e perdidos" subtitle="Filtre e encontre publicações" />
        <div className="space-y-3" role="feed" aria-label="Feed de publicações">
          <SkeletonFeedItem />
          <SkeletonFeedItem />
          <SkeletonFeedItem />
        </div>
      </div>
    );
  }
  if (error) {
    return <FullState variant="error" onRetry={() => void refetch()} />;
  }
  if (!data) {
    return <FullState variant="empty" />;
  }
  if (posts.length === 0) {
    return (
      <FullState
        variant="empty"
        title="Nenhuma publicação"
        description="Nenhuma publicação encontrada com os filtros atuais."
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <PageHeader
        title="Acheos e perdidos"
        subtitle="Filtre e encontre publicações"
        action={
          <Link to="/posts/new">
            <Button size="sm">Nova publicação</Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-end gap-4" role="search" aria-label="Filtros do feed">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="feed-search" className="mb-1 block text-sm font-semibold text-slate-900">Buscar</label>
          <Input
            id="feed-search"
            type="search"
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              applyFilters({ q: query || undefined });
            }}
          />
        </div>

        <FormField id="feed-kind" label="Tipo">
          <Select
            id="feed-kind"
            value={kind}
            onChange={(e) => {
              const nextKind = e.target.value;
              setKind(nextKind);
              applyFilters({ kind: nextKind ? (nextKind as ListPostsParams['kind']) : undefined });
            }}
            placeholder="Todos os tipos"
            className="w-48"
            options={[
              { value: '', label: 'Todos os tipos' },
              { value: 'LOST', label: 'Perdidos' },
              { value: 'FOUND', label: 'Achados' },
            ]}
          />
        </FormField>

        <FormField id="feed-status" label="Estado">
          <Select
            id="feed-status"
            value={status}
            onChange={(e) => {
              const nextStatus = e.target.value;
              setStatus(nextStatus);
              applyFilters({
                status: nextStatus ? (nextStatus as ListPostsParams['status']) : undefined,
              });
            }}
            placeholder="Todos os estados"
            className="w-48"
            options={[
              { value: '', label: 'Todos os estados' },
              { value: 'OPEN', label: 'Aberto' },
              { value: 'IN_PROGRESS', label: 'Em andamento' },
              { value: 'RESOLVED', label: 'Resolvido' },
            ]}
          />
        </FormField>

        <FormField id="feed-location" label="Local">
          <Select
            id="feed-location"
            value={locationId}
            onChange={(e) => {
              const nextLocationId = e.target.value;
              setLocationId(nextLocationId);
              applyFilters({ locationId: nextLocationId || undefined });
            }}
            placeholder="Todos os locais"
            className="w-64"
            options={[
              { value: '', label: 'Todos os locais' },
              ...locations.map((location) => ({ value: location.id, label: location.name })),
            ]}
          />
        </FormField>
      </div>

      <ul className="space-y-3" role="feed" aria-label="Lista de publicações">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
            <Link to={`/posts/${post.id}`} className="block">
              <div className="flex items-center gap-2">
                <KindBadge kind={post.kind} />
                <StatusBadge status={post.status} />
              </div>
              <h3 className="mt-2 font-semibold text-slate-900 line-clamp-1">{post.title}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {nextCursor && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={loadMore} disabled={!nextCursor}>
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}