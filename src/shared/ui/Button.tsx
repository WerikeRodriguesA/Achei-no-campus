/**
 * Button component with variants, sizes, and loading state
 * EDITE AQUI: ajuste variantes, tamanhos, cores
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { LoaderIcon } from './icons';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-900',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
  ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  link: 'text-brand-600 hover:text-brand-700 underline-offset-2 hover:underline focus:ring-brand-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, icon, children, className, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cx(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoaderIcon size={16} className="animate-spin" aria-hidden="true" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

/**
 * IconButton - botão apenas com ícone, acessível via aria-label
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', 'aria-label': ariaLabel, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        className={cx(
          'inline-flex items-center justify-center rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          size === 'sm' && 'p-1.5',
          size === 'md' && 'p-2',
          size === 'lg' && 'p-3',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';