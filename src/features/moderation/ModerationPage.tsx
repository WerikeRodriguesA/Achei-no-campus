import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import {
  Button,
  Card,
  CardContent,
  Badge,
  ReportStatusBadge,
  FullState,
  PageHeader,
  EmptyState,
  formatRelativeDate,
} from '../../shared/ui';
import { ShieldIcon, EyeIcon, FlagIcon } from '../../shared/ui/icons';

interface EnrichedReport {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  status: 'OPEN' | 'DISMISSED' | 'CONTENT_HIDDEN';
  postTitle?: string;
  reporterName?: string;
  createdAt?: string;
}

export default function ModerationPage() {
  const queryClient = useQueryClient();

  // Fetch raw reports first
  const { data: rawReports, isLoading: reportsLoading, error: reportsError, refetch: refetchReports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.reports.listOpen(),
  });

  // Fetch all posts to enrich reports with post titles
  const { data: posts } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: () => api.posts.list({}), // fetch all posts (no status filter)
    enabled: true,
  });

  // Fetch all users to enrich reports with reporter names
  const { data: users } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const demo = (import.meta.env.VITE_DEMO_MODE ?? 'true') !== 'false' ? (await import('../../api')).demo : null;
      return demo?.listUsers() ?? [];
    },
    enabled: true,
  });

  // Enrich reports with post titles and reporter names
  const reports: EnrichedReport[] = (rawReports ?? []).map((report) => {
    const post = (posts?.items ?? []).find((p) => p.id === report.postId);
    const reporter = (users ?? []).find((u) => u.id === report.reporterId);
    return {
      ...report,
      postTitle: post?.title,
      reporterName: reporter?.displayName,
      // createdAt not available in Report type, use post createdAt as approximation
      createdAt: post?.createdAt,
    };
  });

  const handleDismiss = async (reportId: string) => {
    if (!window.confirm('Deseja dispensar esta denúncia?')) return;
    await api.reports.resolve(reportId, 'DISMISS');
    await queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  const handleHideContent = async (reportId: string) => {
    if (!window.confirm('Deseja ocultar o conteúdo denunciado?')) return;
    await api.reports.resolve(reportId, 'HIDE_CONTENT');
    await queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  if (reportsLoading) {
    return <FullState variant="loading" title="Carregando denúncias..." />;
  }
  if (reportsError) {
    return <FullState variant="error" title="Erro ao carregar" onRetry={() => void refetchReports()} />;
  }
  if (!reports || reports.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <PageHeader
          title="Moderação"
          subtitle="Gerencie denúncias e conteúdo"
          action={<ShieldIcon size={24} />}
        />
        <EmptyState
          title="Nenhuma denúncia"
          description="Não há denúncias pendentes no momento."
          icon="inbox"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title="Moderação"
        subtitle={`${reports.length} denúncia${reports.length !== 1 ? 's' : ''} recebida${reports.length !== 1 ? 's' : ''}`}
        action={<ShieldIcon size={24} />}
      />

      <div className="space-y-3" role="list" aria-label="Denúncias">
        {reports.map((report) => (
          <Card key={report.id} variant="default" padding="none" className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ReportStatusBadge status={report.status} />
                    <Badge variant="outline">{report.reason}</Badge>
                  </div>
                  <p className="mt-2 font-medium text-slate-900 truncate">
                    {report.postTitle || `Post #${report.postId}`}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">Motivo: {report.reason}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      Denunciante:{' '}
                      <span className="font-medium text-slate-700">{report.reporterName ?? report.reporterId}</span>
                    </span>
                    {report.createdAt && <span>{formatRelativeDate(report.createdAt)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {report.status === 'OPEN' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleHideContent(report.id)}
                      >
                        <EyeIcon size={16} className="mr-1" />
                        Ocultar conteúdo
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => void handleDismiss(report.id)}>
                        <FlagIcon size={16} className="mr-1" />
                        Dispensar
                      </Button>
                    </>
                  )}
                  {report.status === 'CONTENT_HIDDEN' && (
                    <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                      Conteúdo ocultado
                    </Badge>
                  )}
                  {report.status === 'DISMISSED' && (
                    <Badge variant="outline" className="text-slate-600">
                      Dispensada
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}