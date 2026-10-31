/**
 * RadioGroup / Segmented control component
 * EDITE AQUI: ajuste variantes (radio vs segmented), estilos
 */
import { forwardRef } from 'react';
import { cx } from '../utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'radio' | 'segmented';
  required?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, hint, error, id, name, options, value, onChange, variant = 'segmented', required, className, ...props }, ref) => {
    const describedByParts: string[] = [];
    if (hint) describedByParts.push(`${id}-hint`);
    if (error) describedByParts.push(`${id}-error`);

    if (variant === 'radio') {
      return (
        <fieldset
          ref={ref as React.Ref<HTMLFieldSetElement>}
          id={id}
          className={cx('w-full', className)}
          aria-describedby={describedByParts.length > 0 ? describedByParts.join(' ') : undefined}
          {...props}
        >
          {label && (
            <legend className="mb-2 text-sm font-semibold text-slate-900">{label}</legend>
          )}
          <div className="space-y-2" role="radiogroup" aria-required={required}>
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  disabled={option.disabled}
                  required={required}
                  className={cx(
                    'h-4 w-4 text-brand-600 border-slate-300',
                    'focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                  aria-label={option.label}
                />
                <span className={cx('text-sm', option.disabled ? 'text-slate-400' : 'text-slate-700')}>
                  {option.label}
                </span>
              </label>
            ))}
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
        </fieldset>
      );
    }

    // Segmented variant
    return (
      <div
        ref={ref}
        id={id}
        className={cx('w-full', className)}
        aria-describedby={describedByParts.length > 0 ? describedByParts.join(' ') : undefined}
        {...props}
      >
        {label && (
          <label id={`${id}-label`} className="mb-1 block text-sm font-semibold text-slate-900">
            {label}
          </label>
        )}
        <div
          role="radiogroup"
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-required={required}
          className="flex rounded-lg border border-slate-300 bg-white p-1"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={value === option.value}
              aria-disabled={option.disabled}
              disabled={option.disabled}
              onClick={() => !option.disabled && onChange(option.value)}
              className={cx(
                'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset',
                value === option.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100',
                option.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {option.label}
            </button>
          ))}
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

RadioGroup.displayName = 'RadioGroup';