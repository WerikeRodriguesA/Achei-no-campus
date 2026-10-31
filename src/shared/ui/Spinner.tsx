/**
 * Spinner component
 * EDITE AQUI: ajuste tamanhos, cores, velocidade
 */
import { cx } from '../utils';
import { LoaderIcon } from './icons';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export function Spinner({ size = 'md', className, 'aria-label': ariaLabel = 'Carregando' }: SpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className={cx('flex items-center justify-center', className)} role="status" aria-label={ariaLabel}>
      <LoaderIcon size={sizeMap[size]} className="animate-spin text-brand-600" aria-hidden="true" />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * InlineSpinner - spinner pequeno para dentro de botões/inputs
 */
export interface InlineSpinnerProps {
  size?: number;
  className?: string;
}

export function InlineSpinner({ size = 16, className }: InlineSpinnerProps) {
  return (
    <LoaderIcon size={size} className={cx('animate-spin text-current', className)} aria-hidden="true" />
  );
}