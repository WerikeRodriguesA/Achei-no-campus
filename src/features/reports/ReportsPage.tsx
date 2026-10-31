import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { Report, ReportStatus } from '../../domain/types';
import {
  Card,
  CardContent,
  EmptyState,
  FullState,
  PageHeader,
  Badge,
  formatRelativeDate,
} from '../../shared/ui';
import { ShieldIcon, EyeOffIcon, ClockIcon, XCircleIcon } from '../../shared/ui/icons';

interface EnrichedReport extends Report {
  postTitle?: string;
  reporterName?: string;
  createdAt?: string;
}

export default function ReportsPage() {
  const { data: currentUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.auth.me(),
  });

  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ['reports', 'mine'],
    queryFn: async () => {
      // Get all posts to find reports by this user
      const allPosts = await api.posts.list({});
      const reports: EnrichedReport[] = [];
      for (const post of allPosts.items) {
        // In a real app, there would be a dedicated endpoint for user's reports
        // For now, we'll check if the post has a report by this user
        // This is a mock implementation - in reality, the API would have a reports.listByUser() endpoint
        const mockReports = await api.reports.listOpen(); // This gets all open reports for moderation
        // Filter by current user
        const userReports = mockReports.filter(r => r.reporterId === currentUser?.id);
        for (const report of userReports) {
          reports.push({
            ...report,
            postTitle: post.title,
            reporterName: currentUser?.displayName,
            createdAt: new Date().toISOString(), // Mock date since Report doesn't have createdAt
          });
        }
      }
      return reports;
    },
    enabled: Boolean(currentUser),
  });

  const reports: EnrichedReport[] = reportsData ?? [];

  if (isLoading) {
    return <FullState variant="loading" title="Carregando denúncias..." />;
  }
  if (error) {
    return <FullState variant="error" title="Erro ao carregar" />;
  }

  const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
      case 'OPEN':
        return { icon: <ClockIcon size={14} className="mr-1" />, label: 'Em análise', color: 'amber', variant: 'outline' as const };
      case 'DISMISSED':
        return { icon: <XCircleIcon size={14} className="mr-1" />, label: 'Dispensada', color: 'slate', variant: 'outline' as const };
      case 'CONTENT_HIDDEN':
        return { icon: <EyeOffIcon size={14} className="mr-1" />, label: 'Conteúdo ocultado', color: 'green', variant: 'outline' as const };
      default:
        return { icon: <ClockIcon size={14} className="mr-1" />, label: status, color: 'slate', variant: 'outline' as const };
    }
  };

  const renderReportCard = (report: EnrichedReport) => {
    const config = getStatusConfig(report.status);

    return (
      <Card key={report.id} variant="default" padding="none" className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant={config.variant} className={`text-${config.color}-700 bg-${config.color}-50 border-${config.color}-200`}>
                  {config.icon}
                  {config.label}
                </Badge>
                <Badge variant="outline" className="text-slate-700">
                  {report.reason}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 truncate mb-1">{report.postTitle || `Post #${report.postId}`}</h3>
              <p className="text-sm text-slate-600 mb-2">Sua denúncia foi enviada e está sendo processada pela moderação.</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ClockIcon size={12} />
                  {formatRelativeDate(report.createdAt || new Date().toISOString())}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <ShieldIcon size={20} className="text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title="Minhas denúncias"
        subtitle="Acompanhe o status das denúncias que você enviou"
        backUrl="/"
      />

      <div className="space-y-3">
        {reports.length === 0 ? (
          <EmptyState
            title="Nenhuma denúncia enviada"
            description="Você ainda não denunciou nenhuma publicação."
            icon="inbox"
            action={{ label: 'Voltar ao feed', onClick: () => window.location.href = '/' }}
          />
        ) : (
          reports.map((report) => renderReportCard(report))
        )}
      </div>
    </div>
  );
}