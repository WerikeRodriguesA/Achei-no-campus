/**
 * FullState - estado de página completa (loading, empty, error, no-permission, not-found)
 * EDITE AQUI: ajuste textos, ícones, layouts
 */
import { cx } from '../utils';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LockIcon, SearchIcon } from './icons';

export type FullStateVariant = 'loading' | 'empty' | 'error' | 'no-permission' | 'not-found';

interface FullStateProps {
  variant: FullStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function FullState({ variant, title, description, onRetry, action, className }: FullStateProps) {
  if (variant === 'loading') {
    return (
      <div className={cx('flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8', className)}>
        <Spinner size="lg" aria-label="Carregando conteúdo" />
        <p className="text-slate-600">{title ?? 'Carregando…'}</p>
      </div>
    );
  }

  if (variant === 'error') {
    return (
      <ErrorState
        title={title ?? 'Não foi possível carregar'}
        message={description ?? 'Ocorreu um erro inesperado. Tente novamente mais tarde.'}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (variant === 'no-permission') {
    return (
      <div className={cx('flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center', className)}>
        <div className="rounded-full bg-red-50 p-4" aria-hidden="true">
          <LockIcon size={48} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title ?? 'Acesso negado'}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {description ?? 'Você não tem permissão para ver esta página.'}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'not-found') {
    return (
      <div className={cx('flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center', className)}>
        <div className="rounded-full bg-slate-100 p-4" aria-hidden="true">
          <SearchIcon size={48} className="text-slate-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title ?? 'Não encontrado'}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {description ?? 'A página solicitada não existe.'}
          </p>
        </div>
      </div>
    );
  }

  // empty variant
  return (
    <EmptyState
      title={title ?? 'Nada por aqui'}
      description={description}
      action={action}
      icon="inbox"
      className={className}
    />
  );
}