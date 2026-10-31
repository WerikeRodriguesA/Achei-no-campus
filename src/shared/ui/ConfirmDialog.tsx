/**
 * ConfirmDialog - specialized dialog for confirmations
 * EDITE AQUI: ajuste textos padrão, variantes
 */
import { Dialog, DialogFooter } from './Dialog';
import { Button } from './Button';
import { AlertCircleIcon, TrashIcon } from './icons';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading,
}: ConfirmDialogProps) {
  const iconMap = {
    danger: <TrashIcon size={24} className="text-red-600" />,
    warning: <AlertCircleIcon size={24} className="text-amber-600" />,
    info: <AlertCircleIcon size={24} className="text-blue-600" />,
  };

  const buttonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm" showClose={!loading}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
          {iconMap[variant]}
        </div>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={buttonVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}