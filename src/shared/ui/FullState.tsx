export type FullStateVariant = 'loading' | 'empty' | 'error' | 'no-permission' | 'not-found';

interface FullStateProps {
  variant: FullStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function FullState({ variant, title, description, onRetry }: FullStateProps) {
  if (variant === 'loading') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-slate-600">Carregando…</p>
      </div>
    );
  }
  if (variant === 'error') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-600">Não foi possível carregar os dados.</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    );
  }
  if (variant === 'no-permission') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-bold text-slate-900">Acesso negado</p>
        <p className="text-sm text-slate-600">Você não tem permissão para ver esta página.</p>
      </div>
    );
  }
  if (variant === 'not-found') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-bold text-slate-900">Não encontrado</p>
        <p className="text-sm text-slate-600">A página solicitada não existe.</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-slate-600">{title ?? 'Nada por aqui'}</p>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
