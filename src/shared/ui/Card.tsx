/**
 * Card component
 * EDITE AQUI: ajuste variantes, padding, sombras
 */
import { type ReactNode } from 'react';
import { cx } from '../utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantClasses = {
  default: 'bg-white shadow-sm',
  outlined: 'bg-white border border-slate-200',
  elevated: 'bg-white shadow-lg',
};

export function Card({ children, className, variant = 'default', padding = 'md', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  const isInteractive = !!onClick;

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'rounded-xl transition-shadow',
        variantClasses[variant],
        paddingClasses[padding],
        isInteractive && 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        className,
      )}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </Component>
  );
}

/**
 * CardHeader - cabeçalho padrão do card
 */
export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cx('flex items-start justify-between gap-4 mb-3', className)}>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * CardContent - conteúdo do card
 */
export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cx(className)}>{children}</div>;
}

/**
 * CardFooter - rodapé do card
 */
export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cx('flex items-center gap-2 mt-4 pt-4 border-t border-slate-100', className)}>
      {children}
    </div>
  );
}