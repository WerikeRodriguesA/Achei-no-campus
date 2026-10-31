/**
 * Input component with label, hint, error support
 * EDITE AQUI: ajuste estilos, validação visual
 */
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  id: string; // required for aria-describedby
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const describedByParts: string[] = [];
    if (hint) describedByParts.push(`${id}-hint`);
    if (error) describedByParts.push(`${id}-error`);
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cx(
            'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'bg-white',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 focus:ring-brand-500 focus:border-brand-500',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedByParts.length > 0 ? describedByParts.join(' ') : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-slate-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';