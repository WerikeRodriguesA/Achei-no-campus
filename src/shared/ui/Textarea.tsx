/**
 * Textarea component with character counter, label, hint, error
 * EDITE AQUI: ajuste limites, estilos
 */
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  maxLength?: number;
  showCounter?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, maxLength, showCounter = true, className, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const describedByParts: string[] = [];
    if (hint) describedByParts.push(`${id}-hint`);
    if (error) describedByParts.push(`${id}-error`);
    if (showCounter && maxLength) describedByParts.push(`${id}-counter`);
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);

    const value = (props.value ?? props.defaultValue ?? '') as string;
    const remaining = maxLength ? maxLength - value.length : null;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-900">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            maxLength={maxLength}
            className={cx(
              'w-full rounded-lg border px-3 py-2 text-sm transition-colors resize-y min-h-24',
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
          {showCounter && maxLength && (
            <div
              id={`${id}-counter`}
              className="absolute bottom-2 right-2 text-xs"
              aria-live="polite"
            >
              <span className={cx('font-mono', remaining !== null && remaining < 0 ? 'text-red-600' : 'text-slate-400')}>
                {value.length}/{maxLength}
              </span>
            </div>
          )}
        </div>
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

Textarea.displayName = 'Textarea';