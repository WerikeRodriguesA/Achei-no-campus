/**
 * EmptyState component
 * EDITE AQUI: ajuste ilustrações, textos padrão
 */
import { type ReactNode } from 'react';
import { cx } from '../utils';
import { ImageIcon, PlusIcon, SearchIcon, InboxIcon } from './icons';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: 'search' | 'inbox' | 'image';
  customIcon?: ReactNode;
  className?: string;
}

const icons = {
  search: <SearchIcon size={48} className="text-slate-300" />,
  inbox: <InboxIcon size={48} className="text-slate-300" />,
  image: <ImageIcon size={48} className="text-slate-300" />,
} as const;

export function EmptyState({ title, description, action, icon = 'inbox', customIcon, className }: EmptyStateProps) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      <div className="rounded-full bg-slate-100 p-4" aria-hidden="true">
        {customIcon ?? icons[icon]}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          <PlusIcon size={16} />
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyState variants para casos comuns
 */
export function EmptyFeed({ onClearFilters, hasFilters }: { onClearFilters?: () => void; hasFilters?: boolean }) {
  return (
    <EmptyState
      title={hasFilters ? 'Nenhuma publicação encontrada' : 'Nenhuma publicação ainda'}
      description={hasFilters ? 'Tente ajustar os filtros ou limpar a busca.' : 'Seja o primeiro a publicar algo perdido ou achado.'}
      action={hasFilters ? { label: 'Limpar filtros', onClick: onClearFilters! } : { label: 'Publicar', onClick: () => {} }}
      icon={hasFilters ? 'search' : 'inbox'}
    />
  );
}

export function EmptyComments() {
  return (
    <EmptyState
      title="Nenhum comentário ainda"
      description="Seja o primeiro a deixar uma pista ou comentário."
      icon="inbox"
    />
  );
}

export function EmptyClaims() {
  return (
    <EmptyState
      title="Nenhuma reivindicação"
      description="Quando alguém reivindicar este objeto, aparecerá aqui."
      icon="inbox"
    />
  );
}

export function EmptyMyPosts({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      title="Você ainda não criou publicações"
      description="Publique algo que perdeu ou encontrou para aparecer aqui."
      action={{ label: 'Criar publicação', onClick: onCreate }}
      icon="inbox"
    />
  );
}

export function EmptyReports() {
  return (
    <EmptyState
      title="Nenhuma denúncia aberta"
      description="Denúncias reportadas aparecerão aqui para moderação."
      icon="inbox"
    />
  );
}