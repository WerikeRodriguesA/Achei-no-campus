import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { ListPostsParams, Location } from '../../api/ports';
import { FullState } from '../../shared/ui/FullState';

export default function FeedPage() {
  const [params, setParams] = useState<ListPostsParams>({ status: 'OPEN' });
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState<string>(params.status ?? '');
  const [locationId, setLocationId] = useState('');

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
    return <FullState variant="loading" />;
  }
  if (error) {
    return <FullState variant="error" onRetry={() => void refetch()} />;
  }
  if (!data) {
    return <FullState variant="empty" />;
  }
  if (posts.length === 0) {
    return <FullState variant="empty" description="Nenhuma publicação encontrada." />;
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h2 className="mb-4 text-xl font-bold">Acheos e perdidos</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          aria-label="Filtrar por tipo"
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={kind}
          onChange={(event) => {
            const nextKind = event.target.value;
            setKind(nextKind);
            applyFilters({ kind: nextKind ? (nextKind as ListPostsParams['kind']) : undefined });
          }}
        >
          <option value="">Todos os tipos</option>
          <option value="LOST">Perdidos</option>
          <option value="FOUND">Achados</option>
        </select>
        <select
          aria-label="Filtrar por estado"
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatus(nextStatus);
            applyFilters({
              status: nextStatus ? (nextStatus as ListPostsParams['status']) : undefined,
            });
          }}
        >
          <option value="">Todos os estados</option>
          <option value="OPEN">Aberto</option>
          <option value="IN_PROGRESS">Em andamento</option>
          <option value="RESOLVED">Resolvido</option>
        </select>
        <select
          aria-label="Filtrar por local"
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={locationId}
          onChange={(event) => {
            const nextLocationId = event.target.value;
            setLocationId(nextLocationId);
            applyFilters({ locationId: nextLocationId || undefined });
          }}
        >
          <option value="">Todos os locais</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={loadMore}
        disabled={!nextCursor}
        className="mb-4 rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50"
      >
        Carregar mais
      </button>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="rounded border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white uppercase">
                {post.kind === 'LOST' ? 'Perdido' : 'Achado'}
              </span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs uppercase text-slate-700">
                {post.status}
              </span>
            </div>
            <h3 className="mt-2 font-semibold">{post.title}</h3>
            <p className="text-sm text-slate-600">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
