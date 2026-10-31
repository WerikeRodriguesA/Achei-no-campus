import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { ClaimView } from '../../api/ports';
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  FullState,
  PageHeader,
  Badge,
  formatRelativeDate,
  Tabs,
} from '../../shared/ui';
import { ClockIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '../../shared/ui/icons';

interface ClaimWithPost extends ClaimView {
  postTitle: string;
  postKind: 'LOST' | 'FOUND';
  postStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}

export default function ClaimsPage() {
  const { data: currentUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
  });

  // Fetch claims where user is claimant (made by user)
  const { data: myClaimsData, isLoading: myClaimsLoading, error: myClaimsError } = useQuery({
    queryKey: ['claims', 'mine'],
    queryFn: async () => {
      // Get all posts to find claims by this user
      const allPosts = await api.posts.list({});
      const claims: ClaimWithPost[] = [];
      for (const post of allPosts.items) {
        const postClaims = await api.claims.listForPost(post.id);
        for (const claim of postClaims) {
          if (claim.claimantId === currentUser?.id) {
            claims.push({
              ...claim,
              postTitle: post.title,
              postKind: post.kind,
              postStatus: post.status,
            });
          }
        }
      }
      return claims;
    },
    enabled: Boolean(currentUser),
  });

  // Fetch claims where user is author (received by user)
  const { data: receivedClaimsData, isLoading: receivedClaimsLoading, error: receivedClaimsError } = useQuery({
    queryKey: ['claims', 'received'],
    queryFn: async () => {
      const myPosts = await api.posts.list({ mine: true });
      const claims: ClaimWithPost[] = [];
      for (const post of myPosts.items) {
        const postClaims = await api.claims.listForPost(post.id);
        for (const claim of postClaims) {
          claims.push({
            ...claim,
            postTitle: post.title,
            postKind: post.kind,
            postStatus: post.status,
          });
        }
      }
      return claims;
    },
    enabled: Boolean(currentUser),
  });

  const myClaims: ClaimWithPost[] = myClaimsData ?? [];
  const receivedClaims: ClaimWithPost[] = receivedClaimsData ?? [];

  const isLoading = myClaimsLoading || receivedClaimsLoading;
  const error = myClaimsError || receivedClaimsError;

  if (isLoading) {
    return <FullState variant="loading" title="Carregando reivindicações..." />;
  }
  if (error) {
    return <FullState variant="error" title="Erro ao carregar" />;
  }

  const getStatusConfig = (status: ClaimView['status']) => {
    switch (status) {
      case 'PENDING':
        return { icon: <ClockIcon size={14} className="mr-1" />, label: 'Pendente', color: 'amber', variant: 'outline' as const };
      case 'ACCEPTED':
        return { icon: <CheckCircleIcon size={14} className="mr-1" />, label: 'Aceita', color: 'green', variant: 'outline' as const };
      case 'REJECTED':
        return { icon: <XCircleIcon size={14} className="mr-1" />, label: 'Recusada', color: 'red', variant: 'outline' as const };
      case 'WITHDRAWN':
        return { icon: <XCircleIcon size={14} className="mr-1" />, label: 'Retirada', color: 'slate', variant: 'outline' as const };
      default:
        return { icon: <ClockIcon size={14} className="mr-1" />, label: status, color: 'slate', variant: 'outline' as const };
    }
  };

  const getKindBadge = (kind: 'LOST' | 'FOUND') => (
    <Badge variant={kind === 'LOST' ? 'outline' : 'default'} className={kind === 'LOST' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-green-700 bg-green-50 border-green-200'}>
      {kind === 'LOST' ? 'Perdido' : 'Achado'}
    </Badge>
  );

  const renderClaimCard = (claim: ClaimWithPost, isReceived: boolean) => {
    const config = getStatusConfig(claim.status);
    const otherParty = isReceived ? claim.claimant.displayName : 'Autor do post';

    return (
      <Card key={claim.id} variant="default" padding="none" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {getKindBadge(claim.postKind)}
                <Badge variant={config.variant} className={`text-${config.color}-700 bg-${config.color}-50 border-${config.color}-200`}>
                  {config.icon}
                  {config.label}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 truncate mb-1">{claim.postTitle}</h3>
              <p className="text-sm text-slate-600 mb-2">{claim.message}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <UserIcon size={12} />
                  {otherParty}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon size={12} />
                  {formatRelativeDate(claim.createdAt)}
                </span>
              </div>
            </div>
            {isReceived && claim.postStatus === 'OPEN' && claim.status === 'PENDING' && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
                  Aceitar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
                  Recusar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title="Minhas reivindicações"
        subtitle="Acompanhe solicitações enviadas e recebidas"
        backUrl="/"
      />

      <Tabs
        activeTab="sent"
        onChange={() => {}}
        variant="line"
        tabs={[
          {
            id: 'sent',
            label: `Enviadas (${myClaims.length})`,
            children: (
              <div className="mt-4 space-y-3">
                {myClaims.length === 0 ? (
                  <EmptyState
                    title="Nenhuma reivindicação enviada"
                    description="Você ainda não reivindicou nenhum item."
                    icon="inbox"
                  />
                ) : (
                  myClaims.map((claim) => renderClaimCard(claim, false))
                )}
              </div>
            ),
          },
          {
            id: 'received',
            label: `Recebidas (${receivedClaims.length})`,
            children: (
              <div className="mt-4 space-y-3">
                {receivedClaims.length === 0 ? (
                  <EmptyState
                    title="Nenhuma reivindicação recebida"
                    description="Ninguém solicitou a devolução dos seus itens ainda."
                    icon="inbox"
                  />
                ) : (
                  receivedClaims.map((claim) => renderClaimCard(claim, true))
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}