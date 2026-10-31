/**
 * Dialog component using native <dialog> element (U3)
 * EDITE AQUI: ajuste tamanhos, animações, comportamento
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../utils';
import { XIcon } from './icons';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Dialog({ open, onClose, title, description, children, size = 'md', showClose = true }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      dialog.showModal();
      // Focus first focusable element
      const focusable = dialog.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    } else {
      dialog.close();
      previousActiveElement.current?.focus();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dialog with showModal is interactive
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className={cx(
        'fixed inset-0 z-50 m-auto rounded-xl bg-white p-0 shadow-xl',
        'border-none',
        '::backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        sizeClasses[size],
      )}
    >
      <div className="flex flex-col min-h-0">
        <div className="flex items-start justify-between gap-4 p-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          {showClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Fechar diálogo"
              className="flex-shrink-0"
            >
              <XIcon size={20} />
            </Button>
          )}
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}

/**
 * DialogFooter - rodapé padrão com ações
 */
export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cx('flex items-center justify-end gap-2 p-4 border-t border-slate-200', className)}>
      {children}
    </div>
  );
}