/**
 * FormField - wrapper that connects label, hint, error with aria-describedby
 * EDITE AQUI: se precisar de layout diferente (ex: inline)
 */
import { type ReactNode } from 'react';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function FormField({ label, hint, error, id, children, htmlFor, required }: FormFieldProps) {
  const describedByParts: string[] = [];
  if (hint) describedByParts.push(`${id}-hint`);
  if (error) describedByParts.push(`${id}-error`);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={htmlFor ?? id}
          className="mb-1 block text-sm font-semibold text-slate-900"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div>{children}</div>
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
}