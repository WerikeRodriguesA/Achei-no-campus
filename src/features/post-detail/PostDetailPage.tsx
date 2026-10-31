import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { CommentView, Location } from '../../api/ports';
import type { Resolution } from '../../domain/types';
import {
  Button,
  IconButton,
  Textarea,
  Select,
  FormField,
  Card,
  CardHeader,
  CardContent,
  ClaimStatusBadge,
  FullState,
  PageHeader,
  Avatar,
  SectionHeader,
  EmptyState,
  formatRelativeDate,
  Badge,
} from '../../shared/ui';
import { TrashIcon, MessageSquareIcon, ShieldIcon, ClockIcon, CheckCircleIcon, XCircleIcon, FlagIcon, PlayIcon } from '../../shared/ui/icons';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [resolution, setResolution] = useState<Resolution | ''>('');

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

  const isAuthor = post != null && currentUser != null && post.authorId === currentUser.id;
  const { data: claims, isLoading: claimsLoading } = useQuery({
    queryKey: ['claims', post?.id],
    queryFn: () => (post ? api.claims.listForPost(post.id) : Promise.resolve([])),
    enabled: isAuthor,
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
    if (!text) return;
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
    if (!message) return;
    await api.claims.request(post.id, message);
  };

  const acceptClaim = async (claimId: string) => {
    await api.claims.decide(claimId, 'ACCEPT');
    await queryClient.invalidateQueries({ queryKey: ['posts', 'detail', post.id] });
  };

  const rejectClaim = async (claimId: string) => {
    await api.claims.decide(claimId, 'REJECT');
    await queryClient.invalidateQueries({ queryKey: ['posts', 'detail', post.id] });
  };

  const resolvePost = async (resolution: Resolution) => {
    await api.posts.transition(post.id, 'RESOLVED', resolution);
    await queryClient.invalidateQueries({ queryKey: ['posts', 'detail', post.id] });
  };

  const transitionToInProgress = async () => {
    await api.posts.transition(post.id, 'IN_PROGRESS');
    await queryClient.invalidateQueries({ queryKey: ['posts', 'detail', post.id] });
  };

  const reportPost = async () => {
    const reason = window.prompt('Motivo da denúncia (mínimo 5 caracteres):');
    if (!reason || reason.trim().length < 5) {
      alert('O motivo deve ter pelo menos 5 caracteres.');
      return;
    }
    await api.reports.create(post.id, reason.trim());
    alert('Denúncia enviada com sucesso.');
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
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title={post.title}
        subtitle={post.kind === 'LOST' ? 'Perdido' : 'Achado'}
        backUrl="/"
        action={
          currentUser && !isAuthor && post.status === 'OPEN' && !post.hidden ? (
            <Button variant="ghost" size="sm" onClick={() => void reportPost()}>
              <FlagIcon size={16} className="mr-1" />
              Denunciar
            </Button>
          ) : null
        }
      />

      <Card variant="default" padding="md" className="mb-6">
        <CardHeader
          title={post.title}
          subtitle={post.kind === 'LOST' ? 'Perdido' : 'Achado'}
        />
        <CardContent className="space-y-4">
          <p className="text-slate-700">{post.description}</p>
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Local</dt>
              <dd className="text-slate-700">{location?.name ?? post.locationId}</dd>
            </div>
            {post.custody ? (
              <div>
                <dt className="font-semibold text-slate-500">Local de guarda</dt>
                <dd className="text-slate-700">
                  {post.custody === 'GUARITA' ? 'Guarita' : 'Disciplina'}
                </dd>
              </div>
            ) : null}
            {post.resolution ? (
              <div>
                <dt className="font-semibold text-slate-500">Desfecho</dt>
                <dd className="text-slate-700">{post.resolution}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold text-slate-500">Autor</dt>
              <dd className="flex items-center gap-2 text-slate-700">
                <Avatar name={post.author.displayName} size="sm" />
                {post.author.displayName}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-slate-500">Publicado em</dt>
              <dd className="text-slate-700">{formatRelativeDate(post.createdAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Comments section */}
      <Card variant="default" padding="md" className="mb-6">
        <SectionHeader
          title="Comentários e pistas"
          action={
            canComment ? (
              <Button variant="ghost" size="sm" onClick={() => {}}>
                <MessageSquareIcon size={16} className="mr-1" />
                Comentar
              </Button>
            ) : null
          }
        />
        <CardContent>
          {commentsLoading ? (
            <div className="space-y-3" aria-label="Carregando comentários">
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-slate-100 rounded" />
                <div className="h-20 bg-slate-100 rounded" />
              </div>
            </div>
          ) : sortedComments.length === 0 ? (
            <EmptyState title="Nenhum comentário" description="Seja o primeiro a deixar uma pista ou comentário." />
          ) : (
            <ul className="space-y-3" aria-label="Comentários">
              {sortedComments.map((comment) => (
                <li key={comment.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={comment.author.displayName} size="xs" />
                      <span className="font-semibold text-sm">{comment.author.displayName}</span>
                      <span className="text-xs text-slate-500">{formatRelativeDate(comment.createdAt)}</span>
                    </div>
                    {currentUser && comment.authorId === currentUser.id ? (
                      <IconButton
                        aria-label="Remover comentário"
                        variant="ghost"
                        size="sm"
                        onClick={() => void removeComment(comment.id)}
                      >
                        <TrashIcon size={16} />
                      </IconButton>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
          {canComment && (
            <div className="mt-4 space-y-3">
              <FormField
                id="comment-text"
                label="Novo comentário"
                hint="Máximo 500 caracteres"
              >
                <Textarea
                  id="comment-text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva uma pista ou comentário..."
                  maxLength={500}
                  showCounter
                  rows={3}
                />
              </FormField>
              <Button onClick={() => void addComment()} disabled={!commentText.trim()}>
                Comentar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim request for found items */}
      {post.kind === 'FOUND' &&
      post.status === 'OPEN' &&
      currentUser &&
      post.authorId !== currentUser.id ? (
        <Card variant="outlined" padding="md" className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldIcon size={20} />
              <span className="font-medium">Este item foi achado. Você pode reivindicá-lo se for o dono.</span>
            </div>
            <Button variant="primary" onClick={() => void requestClaim()}>
              Solicitar reivindicação
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Claimant's own request card */}
      {currentUser && !isAuthor && post && claims && claims.length > 0 ? (
        (() => {
          const userClaim = claims.find((claim) => claim.claimantId === currentUser.id);
          if (!userClaim) return null;

          const getStatusConfig = () => {
            switch (userClaim.status) {
              case 'PENDING':
                return { icon: <ClockIcon size={16} className="mr-1" />, label: 'Pendente — aguardando resposta do autor', variant: 'outline' as const, color: 'amber' };
              case 'ACCEPTED':
                return { icon: <CheckCircleIcon size={16} className="mr-1" />, label: 'Aceita — combine a devolução com o autor', variant: 'outline' as const, color: 'green' };
              case 'REJECTED':
                return { icon: <XCircleIcon size={16} className="mr-1" />, label: 'Recusada', variant: 'outline' as const, color: 'red' };
              case 'WITHDRAWN':
                return { icon: <XCircleIcon size={16} className="mr-1" />, label: 'Retirada', variant: 'outline' as const, color: 'slate' };
              default:
                return { icon: <ClockIcon size={16} className="mr-1" />, label: userClaim.status, variant: 'outline' as const, color: 'slate' };
            }
          };

          const config = getStatusConfig();

          return (
            <Card key="user-claim" variant="outlined" padding="md" className="mb-6">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldIcon size={20} />
                  <span className="font-medium">Sua solicitação</span>
                </div>
                <p className="text-sm text-slate-600">{userClaim.message}</p>
                <Badge variant={config.variant} className={`text-${config.color}-700 bg-${config.color}-50 border-${config.color}-200`}>
                  {config.icon}
                  {config.label}
                </Badge>
                {userClaim.status === 'PENDING' && (
                  <Button variant="ghost" size="sm" onClick={() => void api.claims.withdraw(userClaim.id)}>
                    Retirar solicitação
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })()
      ) : null}

      {/* Claims section for author */}
      {isAuthor && post ? (
        <Card variant="default" padding="md">
          <SectionHeader title="Reivindicações" description="Gerencie as solicitações de devolução" />
          <CardContent>
            {claimsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-slate-100 rounded" />
                <div className="h-20 bg-slate-100 rounded" />
              </div>
            ) : (claims ?? []).length === 0 ? (
              <EmptyState title="Nenhuma reivindicação" description="Ninguém solicitou a devolução deste item ainda." />
            ) : (
              <ul className="space-y-3" aria-label="Reivindicações">
                {(claims ?? []).map((claim) => (
                  <li key={claim.id} className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={claim.claimant.displayName} size="sm" />
                        <div>
                          <span className="font-semibold text-sm">{claim.claimant.displayName}</span>
                          <ClaimStatusBadge status={claim.status} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{claim.message}</p>
                    {post.status === 'OPEN' && claim.status === 'PENDING' ? (
                      <div className="mt-3 flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => void acceptClaim(claim.id)}>
                          Aceitar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => void rejectClaim(claim.id)}>
                          Recusar
                        </Button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {post.status !== 'RESOLVED' && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                {post.status === 'OPEN' && (
                  <div className="mb-4">
                    <h4 className="mb-3 font-medium">Marcar como em andamento</h4>
                    <Button
                      variant="secondary"
                      onClick={() => void transitionToInProgress()}
                      disabled={post.status !== 'OPEN'}
                    >
                      <PlayIcon size={16} className="mr-1" />
                      Marcar como em andamento
                    </Button>
                  </div>
                )}
                <h4 className="mb-3 font-medium">Marcar como resolvido</h4>
                <div className="flex items-end gap-2 flex-wrap">
                  <FormField id="resolution" label="Desfecho">
                    <Select
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as Resolution | '')}
                      placeholder="Selecionar…"
                      className="w-full sm:w-64"
                      options={[
                        { value: '', label: 'Selecionar…' },
                        { value: 'RETURNED', label: 'Devolvido' },
                        { value: 'FOUND_BY_OWNER', label: 'Encontrado pelo dono' },
                        { value: 'GAVE_UP', label: 'Abandonou' },
                        { value: 'OTHER', label: 'Outro' },
                      ]}
                    />
                  </FormField>
                  <Button
                    onClick={() => {
                      if (resolution) void resolvePost(resolution);
                    }}
                    disabled={!resolution}
                  >
                    Marcar como resolvido
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}