/**
 * Select component with label, hint, error support
 * EDITE AQUI: ajuste estilos, opções
 */
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cx } from '../utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, options, placeholder, className, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={cx(
            'w-full rounded-lg border px-3 py-2 text-sm transition-colors appearance-none',
            'bg-white bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")] bg-no-repeat bg-right-3 bg-center pr-10',
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';