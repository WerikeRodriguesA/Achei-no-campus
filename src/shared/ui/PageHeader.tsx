/**
 * PageHeader - cabeçalho padrão de página
 * EDITE AQUI: ajuste layout, variantes
 */
import { type ReactNode } from 'react';
import { cx } from '../utils';
import { ArrowRightIcon } from './icons';
import { Button } from './Button';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  backLabel?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, backUrl, backLabel = 'Voltar', action, className }: PageHeaderProps) {
  return (
    <header className={cx('mb-6', className)}>
      {backUrl && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => window.location.href = backUrl}
          icon={<ArrowRightIcon size={16} />}
        >
          {backLabel}
        </Button>
      )}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </header>
  );
}

/**
 * SectionHeader - cabeçalho de seção dentro da página
 */
export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cx('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}