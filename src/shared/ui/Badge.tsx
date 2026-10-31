/**
 * Badge components - base, KindBadge, StatusBadge
 * EDITE AQUI: ajuste cores, variantes, tamanhos
 */
import { cx } from '../utils';

/**
 * Base Badge
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'soft';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        variant === 'default' && 'bg-slate-100 text-slate-700',
        variant === 'outline' && 'border border-slate-300 text-slate-700 bg-transparent',
        variant === 'soft' && 'bg-slate-100 text-slate-700',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * KindBadge - para tipo de publicação (LOST/FOUND)
 * Sempre com rótulo textual, nunca só cor
 */
export interface KindBadgeProps {
  kind: 'LOST' | 'FOUND';
  size?: 'sm' | 'md';
}

export function KindBadge({ kind, size = 'md' }: KindBadgeProps) {
  const isLost = kind === 'LOST';
  const label = isLost ? 'Perdido' : 'Achado';

  return (
    <span
      className={cx(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        size === 'sm' && 'px-1.5 py-0 text-[10px]',
        isLost
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-green-50 text-green-700 border border-green-200',
      )}
    >
      {label}
    </span>
  );
}

/**
 * StatusBadge - para estado da publicação (OPEN/IN_PROGRESS/RESOLVED)
 * Sempre com rótulo textual, nunca só cor
 */
export interface StatusBadgeProps {
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const labels = {
    OPEN: 'Aberto',
    IN_PROGRESS: 'Em andamento',
    RESOLVED: 'Resolvido',
  } as const;

  const variants = {
    OPEN: 'bg-blue-50 text-blue-700 border border-blue-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200',
    RESOLVED: 'bg-green-50 text-green-700 border border-green-200',
  } as const;

  return (
    <span
      className={cx(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
        size === 'sm' && 'px-1.5 py-0 text-[10px]',
        variants[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

/**
 * ClaimStatusBadge - para estado de reivindicação
 */
export interface ClaimStatusBadgeProps {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  const labels = {
    PENDING: 'Pendente',
    ACCEPTED: 'Aceita',
    REJECTED: 'Recusada',
    WITHDRAWN: 'Retirada',
  } as const;

  const variants = {
    PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
    ACCEPTED: 'bg-blue-50 text-blue-700 border border-blue-200',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200',
    WITHDRAWN: 'bg-slate-50 text-slate-700 border border-slate-200',
  } as const;

  return (
    <span className={cx('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', variants[status])}>
      {labels[status]}
    </span>
  );
}

/**
 * ReportStatusBadge - para estado de denúncia
 */
export interface ReportStatusBadgeProps {
  status: 'OPEN' | 'DISMISSED' | 'CONTENT_HIDDEN';
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const labels = {
    OPEN: 'Aberta',
    DISMISSED: 'Arquivada',
    CONTENT_HIDDEN: 'Conteúdo oculto',
  } as const;

  const variants = {
    OPEN: 'bg-red-50 text-red-700 border border-red-200',
    DISMISSED: 'bg-slate-50 text-slate-700 border border-slate-200',
    CONTENT_HIDDEN: 'bg-amber-50 text-amber-700 border border-amber-200',
  } as const;

  return (
    <span className={cx('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', variants[status])}>
      {labels[status]}
    </span>
  );
}