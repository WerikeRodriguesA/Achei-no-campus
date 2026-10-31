/**
 * ErrorState component com botão "Tentar novamente"
 * EDITE AQUI: ajuste textos, ícones, comportamento
 */
import { cx } from '../utils';
import { AlertCircleIcon, RefreshCwIcon } from './icons';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  onRetry,
  retryLabel = 'Tentar novamente',
  className,
}: ErrorStateProps) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      <div className="rounded-full bg-red-50 p-4" aria-hidden="true">
        <AlertCircleIcon size={48} className="text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} icon={<RefreshCwIcon size={16} />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * ErrorState inline - para erros dentro de cards/listas
 */
export interface InlineErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineErrorState({ message, onRetry, className }: InlineErrorStateProps) {
  return (
    <div className={cx('rounded-lg bg-red-50 border border-red-200 p-3', className)} role="alert">
      <div className="flex items-start gap-2">
        <AlertCircleIcon size={20} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-red-700 flex-1">{message}</p>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} icon={<RefreshCwIcon size={14} />}>
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * ErrorBoundary fallback - para uso com ErrorBoundary global
 */
export interface ErrorBoundaryFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) {
  return (
    <ErrorState
      title="Algo deu errado"
      message={error?.message ?? 'O erro foi capturado pelo ErrorBoundary global.'}
      onRetry={resetErrorBoundary}
      retryLabel="Recarregar página"
    />
  );
}