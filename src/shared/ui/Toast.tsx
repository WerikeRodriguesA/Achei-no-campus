/**
 * Toast notification system with provider and hook
 * EDITE AQUI: ajuste duração, posição, animações
 */
import { createContext, useContext, useState, type ReactNode, type ReactElement } from 'react';
import { cx } from '../utils';
import { XIcon, CheckIcon, AlertCircleIcon, LoaderIcon } from './icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration ?? 5000);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, ReactElement> = {
    success: <CheckIcon size={20} className="text-green-600" />,
    error: <AlertCircleIcon size={20} className="text-red-600" />,
    warning: <AlertCircleIcon size={20} className="text-amber-600" />,
    info: <AlertCircleIcon size={20} className="text-blue-600" />,
    loading: <LoaderIcon size={20} className="text-brand-600 animate-spin" />,
  };

  const bgMap: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
    loading: 'bg-brand-50 border-brand-200',
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx(
            'flex items-start gap-3 rounded-lg border p-3 shadow-lg animate-slide-in',
            bgMap[toast.type],
          )}
          role="alert"
        >
          <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
            {iconMap[toast.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900">{toast.title}</p>
            {toast.message && <p className="mt-0.5 text-sm text-slate-600">{toast.message}</p>}
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action!.onClick();
                  onRemove(toast.id);
                }}
                className="mt-2 text-sm font-medium text-brand-600 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600"
            aria-label="Dismiss"
          >
            <XIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Convenience functions for common toast types
 */
export function useToastHelpers() {
  const { addToast, removeToast } = useToast();

  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
    loading: (title: string, message?: string) => addToast({ type: 'loading', title, message, duration: 0 }),
    dismiss: removeToast,
  };
}