/**
 * Styleguide - rota de desenvolvimento /_styleguide (apenas em DEV)
 * Mostra todos os componentes e variantes para conferência visual
 * EDITE AQUI: adicione/remova componentes conforme necessário
 */
import { useState, type ReactNode } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  RadioGroup,
  FormField,
  KindBadge,
  StatusBadge,
  ClaimStatusBadge,
  ReportStatusBadge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Avatar,
  AvatarGroup,
  Tabs,
  Dialog,
  DialogFooter,
  ConfirmDialog,
  ToastProvider,
  useToastHelpers,
  Skeleton,
  SkeletonCard,
  SkeletonFeedItem,
  SkeletonDetail,
  Spinner,
  InlineSpinner,
  EmptyState,
  ErrorState,
  PageHeader,
  SectionHeader,
  PrototypeBanner,
  FullState,
  cx,
  formatRelativeDate,
  formatDate,
  formatDateOnly,
  SearchIcon,
  PlusIcon,
  UserIcon,
  FlagIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
  EditIcon,
  ArrowRightIcon,
  ImageIcon,
  ShieldIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  XCircleIcon,
  EyeIcon,
  EyeOffIcon,
  BellIcon,
  AlertCircleIcon,
  MessageSquareIcon,
  FileTextIcon,
  LoaderIcon,
  HomeIcon,
  UserPlusIcon,
  SettingsIcon,
  LogOutIcon,
  FlaskConicalIcon,
  RefreshCwIcon,
  InboxIcon,
} from '../shared/ui';

const componentSections: Array<{
  title: string;
  description: string;
  render: () => ReactNode;
}> = [
  {
    title: 'Buttons',
    description: 'Variantes, tamanhos e estados de carregamento',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="Variantes" />
        <div className="flex flex-wrap gap-3">
          {(['primary', 'secondary', 'ghost', 'danger', 'link'] as const).map((variant) => (
            <Button key={variant} variant={variant}>{variant}</Button>
          ))}
        </div>
        <SectionHeader title="Tamanhos" />
        <div className="flex items-center gap-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button key={size} size={size}>Tamanho {size}</Button>
          ))}
        </div>
        <SectionHeader title="Estado de carregamento" />
        <Button loading>Carregando...</Button>
        <SectionHeader title="IconButton" />
        <div className="flex gap-3">
          {[
            { icon: <SearchIcon size={18} />, label: 'Buscar' },
            { icon: <PlusIcon size={18} />, label: 'Adicionar' },
            { icon: <EditIcon size={18} />, label: 'Editar' },
            { icon: <TrashIcon size={18} />, label: 'Excluir' },
          ].map(({ icon, label }) => (
            <IconButton key={label} aria-label={label}>{icon}</IconButton>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Form Fields',
    description: 'Input, Textarea, Select, RadioGroup, FormField',
    render: () => (
      <div className="space-y-6 max-w-md">
        <SectionHeader title="Input" />
        <Input
          id="demo-input"
          label="E-mail institucional"
          placeholder="usuario@campus.edu.br"
          hint="Use seu e-mail institucional"
        />
        <Input id="demo-input-error" label="Com erro" error="E-mail inválido" defaultValue="invalido" />
        <SectionHeader title="Textarea com contador" />
        <Textarea
          id="demo-textarea"
          label="Descrição"
          placeholder="Descreva o objeto..."
          maxLength={200}
          showCounter
        />
        <SectionHeader title="Select" />
        <Select
          id="demo-select"
          label="Local"
          placeholder="Selecione..."
          options={[
            { value: 'loc-1', label: 'Bloco A' },
            { value: 'loc-2', label: 'Biblioteca' },
            { value: 'loc-3', label: 'Cantina' },
          ]}
        />
        <SectionHeader title="RadioGroup (segmented)" />
        <RadioGroup
          id="demo-radio-segmented"
          name="kind"
          label="Tipo"
          value="FOUND"
          onChange={() => {}}
          variant="segmented"
          options={[
            { value: 'LOST', label: 'Perdido' },
            { value: 'FOUND', label: 'Achado' },
          ]}
        />
        <SectionHeader title="RadioGroup (radio)" />
        <RadioGroup
          id="demo-radio-radio"
          name="status"
          label="Estado"
          value="OPEN"
          onChange={() => {}}
          variant="radio"
          options={[
            { value: 'OPEN', label: 'Aberto' },
            { value: 'IN_PROGRESS', label: 'Em andamento' },
            { value: 'RESOLVED', label: 'Resolvido' },
          ]}
        />
        <SectionHeader title="FormField wrapper" />
        <FormField
          id="demo-formfield"
          label="Título"
          hint="Mínimo 3 caracteres"
          error="Título muito curto"
        >
          <Input id="demo-formfield-input" defaultValue="Ab" />
        </FormField>
      </div>
    ),
  },
  {
    title: 'Badges',
    description: 'KindBadge, StatusBadge, ClaimStatusBadge, ReportStatusBadge',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="KindBadge" />
        <div className="flex flex-wrap gap-3">
          <KindBadge kind="LOST" />
          <KindBadge kind="FOUND" />
          <KindBadge kind="LOST" size="sm" />
          <KindBadge kind="FOUND" size="sm" />
        </div>
        <SectionHeader title="StatusBadge" />
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="OPEN" />
          <StatusBadge status="IN_PROGRESS" />
          <StatusBadge status="RESOLVED" />
          <StatusBadge status="OPEN" size="sm" />
          <StatusBadge status="IN_PROGRESS" size="sm" />
          <StatusBadge status="RESOLVED" size="sm" />
        </div>
        <SectionHeader title="ClaimStatusBadge" />
        <div className="flex flex-wrap gap-3">
          <ClaimStatusBadge status="PENDING" />
          <ClaimStatusBadge status="ACCEPTED" />
          <ClaimStatusBadge status="REJECTED" />
          <ClaimStatusBadge status="WITHDRAWN" />
        </div>
        <SectionHeader title="ReportStatusBadge" />
        <div className="flex flex-wrap gap-3">
          <ReportStatusBadge status="OPEN" />
          <ReportStatusBadge status="DISMISSED" />
          <ReportStatusBadge status="CONTENT_HIDDEN" />
        </div>
      </div>
    ),
  },
  {
    title: 'Card & Avatar',
    description: 'Card variants, Avatar com iniciais, AvatarGroup',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="Card variants" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Card variant="default" padding="md">
            <CardHeader title="Default" subtitle="Sombra suave" />
            <CardContent>
              <p className="text-sm text-slate-600">Card padrão com sombra sutil.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">Ação</Button>
            </CardFooter>
          </Card>
          <Card variant="outlined" padding="md">
            <CardHeader title="Outlined" subtitle="Borda visível" />
            <CardContent>
              <p className="text-sm text-slate-600">Card com borda.</p>
            </CardContent>
          </Card>
          <Card variant="elevated" padding="md">
            <CardHeader title="Elevated" subtitle="Sombra forte" />
            <CardContent>
              <p className="text-sm text-slate-600">Card com sombra destacada.</p>
            </CardContent>
          </Card>
        </div>
        <SectionHeader title="Avatar" />
        <div className="flex items-center gap-4 flex-wrap">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Avatar key={size} name="Marina Silva" size={size} />
          ))}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Avatar key={size} name="Rafael Santos" size={size} />
          ))}
        </div>
        <SectionHeader title="AvatarGroup" />
        <div className="flex items-center gap-4">
          <AvatarGroup
            avatars={[
              { name: 'Marina Silva' },
              { name: 'Rafael Santos' },
              { name: 'João Oliveira' },
              { name: 'Ana Costa' },
              { name: 'Pedro Lima' },
            ]}
            max={3}
          />
          <AvatarGroup
            avatars={[{ name: 'Marina Silva' }, { name: 'Rafael Santos' }]}
            max={2}
            size="lg"
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Tabs',
    description: 'Abas acessíveis com variantes',
    render: () => (
      <div className="space-y-6 max-w-2xl">
        <SectionHeader title="Variant: line" />
        <Tabs
          activeTab="tab1"
          onChange={() => {}}
          variant="line"
          tabs={[
            { id: 'tab1', label: 'Aberto', children: <p className="text-sm text-slate-600">Conteúdo da aba Aberto</p> },
            { id: 'tab2', label: 'Em andamento', children: <p className="text-sm text-slate-600">Conteúdo da aba Em andamento</p> },
            { id: 'tab3', label: 'Resolvido', children: <p className="text-sm text-slate-600">Conteúdo da aba Resolvido</p> },
          ]}
        />
        <SectionHeader title="Variant: enclosed" />
        <Tabs
          activeTab="tab1"
          onChange={() => {}}
          variant="enclosed"
          tabs={[
            { id: 'tab1', label: 'Perdidos', children: <p className="text-sm text-slate-600">Conteúdo Perdidos</p> },
            { id: 'tab2', label: 'Achados', children: <p className="text-sm text-slate-600">Conteúdo Achados</p> },
          ]}
        />
      </div>
    ),
  },
  {
    title: 'Dialogs',
    description: 'Dialog nativo, ConfirmDialog',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="Dialog" />
        <DialogDemo />
        <SectionHeader title="ConfirmDialog" />
        <ConfirmDialogDemo />
      </div>
    ),
  },
  {
    title: 'Toast',
    description: 'Sistema de notificações',
    render: () => <ToastDemo />,
  },
  {
    title: 'Skeletons',
    description: 'Estados de carregamento',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="SkeletonCard" />
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SectionHeader title="SkeletonFeedItem" />
        <div className="space-y-3">
          <SkeletonFeedItem />
          <SkeletonFeedItem />
        </div>
        <SectionHeader title="SkeletonDetail" />
        <SkeletonDetail />
        <SectionHeader title="Skeleton básico" />
        <div className="space-y-3 max-w-md">
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width="100%" height={120} />
        </div>
      </div>
    ),
  },
  {
    title: 'Empty & Error States',
    description: 'EmptyState, ErrorState, FullState',
    render: () => (
      <div className="space-y-6 max-w-md">
        <SectionHeader title="EmptyState" />
        <EmptyState title="Nenhum item" description="Descrição opcional" action={{ label: 'Ação', onClick: () => {} }} />
        <SectionHeader title="ErrorState" />
        <ErrorState onRetry={() => {}} />
        <SectionHeader title="FullState variants" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FullState variant="loading" title="Carregando feed..." />
          <FullState variant="empty" title="Nenhum post" description="Seja o primeiro a publicar" action={{ label: 'Publicar', onClick: () => {} }} />
          <FullState variant="error" title="Erro ao carregar" onRetry={() => {}} />
          <FullState variant="no-permission" />
          <FullState variant="not-found" />
        </div>
      </div>
    ),
  },
  {
    title: 'Spinners',
    description: 'Spinner e InlineSpinner',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="Spinner sizes" />
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
        <SectionHeader title="InlineSpinner (para botões)" />
        <Button variant="ghost" disabled>
          <InlineSpinner size={16} /> Salvando...
        </Button>
      </div>
    ),
  },
  {
    title: 'PageHeader & SectionHeader',
    description: 'Cabeçalhos de página e seção',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="PageHeader com botão voltar" />
        <PageHeader title="Detalhe da publicação" subtitle="Informações completas" backUrl="/" />
        <SectionHeader title="SectionHeader com ação" />
        <SectionHeader title="Minhas publicações" description="Gerencie seus posts" action={<Button variant="primary" size="sm">Nova publicação</Button>} />
      </div>
    ),
  },
  {
    title: 'PrototypeBanner',
    description: 'Faixa fixa de protótipo',
    render: () => (
      <div className="relative h-24 border rounded-lg overflow-hidden">
        <PrototypeBanner />
        <div className="p-4 text-center text-sm text-slate-500">
          A faixa aparece fixa no topo da tela (fixed top-0 z-40)
        </div>
      </div>
    ),
  },
  {
    title: 'Icons',
    description: 'Todos os ícones SVG inline disponíveis',
    render: () => (
      <div className="space-y-6">
        <SectionHeader title="Ícones disponíveis" />
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'SearchIcon', icon: <SearchIcon /> },
            { name: 'PlusIcon', icon: <PlusIcon /> },
            { name: 'UserIcon', icon: <UserIcon /> },
            { name: 'FlagIcon', icon: <FlagIcon /> },
            { name: 'CheckIcon', icon: <CheckIcon /> },
            { name: 'XIcon', icon: <XIcon /> },
            { name: 'ClockIcon', icon: <ClockIcon /> },
            { name: 'MapPinIcon', icon: <MapPinIcon /> },
            { name: 'TrashIcon', icon: <TrashIcon /> },
            { name: 'EditIcon', icon: <EditIcon /> },
            { name: 'ArrowRightIcon', icon: <ArrowRightIcon /> },
            { name: 'ImageIcon', icon: <ImageIcon /> },
            { name: 'ShieldIcon', icon: <ShieldIcon /> },
            { name: 'ChevronDownIcon', icon: <ChevronDownIcon /> },
            { name: 'ChevronLeftIcon', icon: <ChevronLeftIcon /> },
            { name: 'ChevronRightIcon', icon: <ChevronRightIcon /> },
            { name: 'MenuIcon', icon: <MenuIcon /> },
            { name: 'XCircleIcon', icon: <XCircleIcon /> },
            { name: 'EyeIcon', icon: <EyeIcon /> },
            { name: 'EyeOffIcon', icon: <EyeOffIcon /> },
            { name: 'BellIcon', icon: <BellIcon /> },
            { name: 'AlertCircleIcon', icon: <AlertCircleIcon /> },
            { name: 'MessageSquareIcon', icon: <MessageSquareIcon /> },
            { name: 'FileTextIcon', icon: <FileTextIcon /> },
            { name: 'LoaderIcon', icon: <LoaderIcon /> },
            { name: 'HomeIcon', icon: <HomeIcon /> },
            { name: 'UserPlusIcon', icon: <UserPlusIcon /> },
            { name: 'SettingsIcon', icon: <SettingsIcon /> },
            { name: 'LogOutIcon', icon: <LogOutIcon /> },
            { name: 'FlaskConicalIcon', icon: <FlaskConicalIcon /> },
            { name: 'RefreshCwIcon', icon: <RefreshCwIcon /> },
            { name: 'InboxIcon', icon: <InboxIcon /> },
          ].map(({ name, icon }) => (
            <div key={name} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 min-w-[60px]">
              <div className="text-slate-600">{icon}</div>
              <span className="text-xs font-mono text-slate-500">{name}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Utils',
    description: 'Utilitários: cx, formatRelativeDate, formatDate, formatDateOnly',
    render: () => (
      <div className="space-y-4 max-w-md">
        <SectionHeader title="cx (class compose)" />
        <pre className="rounded-lg bg-slate-100 p-3 text-sm overflow-auto">
{`cx('base', true && 'conditional', { variant: true, disabled: false })
// → "base conditional variant"`}
        </pre>
        <SectionHeader title="formatRelativeDate" />
        <div className="space-y-1 text-sm">
          <code>{formatRelativeDate(new Date().toISOString())}</code> (agora)
          <br />
          <code>{formatRelativeDate(new Date(Date.now() - 5 * 60000).toISOString())}</code> (5 min)
          <br />
          <code>{formatRelativeDate(new Date(Date.now() - 2 * 3600000).toISOString())}</code> (2h)
          <br />
          <code>{formatRelativeDate(new Date(Date.now() - 3 * 86400000).toISOString())}</code> (3 dias)
        </div>
        <SectionHeader title="formatDate / formatDateOnly" />
        <div className="space-y-1 text-sm">
          <code>{formatDate(new Date().toISOString())}</code>
          <br />
          <code>{formatDateOnly(new Date().toISOString())}</code>
        </div>
      </div>
    ),
  },
];

// Demo components for Dialog/ConfirmDialog/Toast
function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Abrir Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Título do Dialog" description="Descrição opcional do dialog" size="md">
        <p className="text-sm text-slate-600">Conteúdo do dialog. Pode conter formulários, texto, etc.</p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => setOpen(false)}>Confirmar</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="danger" onClick={() => setOpen(true)}>Abrir ConfirmDialog</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Excluir publicação?"
        message="Esta ação não pode ser desfeita. A publicação e todos os seus comentários serão removidos permanentemente."
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  );
}

function ToastDemo() {
  const { success, error, warning, info, loading, dismiss } = useToastHelpers();

  return (
    <div className="space-y-3">
      <Button onClick={() => success('Sucesso!', 'Operação realizada com sucesso.')}>Success</Button>
      <Button onClick={() => error('Erro!', 'Algo deu errado.')}>Error</Button>
      <Button onClick={() => warning('Atenção!', 'Verifique os dados.')}>Warning</Button>
      <Button onClick={() => info('Info', 'Apenas uma informação.')}>Info</Button>
      <Button
        onClick={() => {
          const id = loading('Carregando...', 'Aguarde um momento');
          setTimeout(() => dismiss(id), 2000);
        }}
      >
        Loading (auto-dismiss 2s)
      </Button>
    </div>
  );
}

/**
 * StyleguidePage - apenas renderizado em desenvolvimento
 */
export default function StyleguidePage() {
  const [activeSection, setActiveSection] = useState(0);

  if (!import.meta.env.DEV) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center">
        <h1 className="text-2xl font-bold">Styleguide</h1>
        <p className="mt-4 text-slate-600">Disponível apenas em modo de desenvolvimento.</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <PrototypeBanner />
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-slate-900">Styleguide v0.1</h1>
            <span className="text-xs text-slate-500">Apenas DEV — para conferência visual</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 pb-16">
          <nav className="mb-6 sticky top-16 z-20" aria-label="Navegação do styleguide">
            <div className="overflow-x-auto pb-2">
              <ul className="flex gap-2 min-w-max" role="tablist">
                {componentSections.map((section, index) => (
                  <li key={section.title} role="presentation">
                    <button
                      role="tab"
                      aria-selected={activeSection === index}
                      onClick={() => setActiveSection(index)}
                      className={cx(
                        'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                        activeSection === index
                          ? 'bg-brand-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100',
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <article className="space-y-8">
            {componentSections.map((section, index) => (
              <section
                key={section.title}
                id={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                role="tabpanel"
                aria-labelledby={`tab-${section.title}`}
                hidden={activeSection !== index}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <header className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </header>
                <div>{section.render()}</div>
              </section>
            ))}
          </article>
        </main>
      </div>
    </ToastProvider>
  );
}